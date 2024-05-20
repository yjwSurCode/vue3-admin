<template>

  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="搜索内容">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-220px"
        />
        
      </el-form-item>
	  <el-form-item label="消费等级">
	    <el-select v-model="queryParams.level" class="!w-200px">
	      <el-option :value="item.id" :label="item.levelName"  v-for="(item, index) in levelList" :key="index" />
	    </el-select>
	  </el-form-item>
	  <el-form-item label="身份">
	    <el-select v-model="queryParams.titleName" class="!w-200px">
	      <el-option :value="item.id" :label="item.titleName"  v-for="(item, index) in titleNameList" :key="index" />
	    
	    </el-select>
	  </el-form-item>
	  
	  <el-form-item label="区域" >
      <el-input
          v-model="queryParams.area"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-220px"
        />
	  </el-form-item>
	  
	  
      
      <el-form-item>
        <el-button  type="success" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- :span-method="objectSpanMethod" -->
    <el-table v-loading="loading" :data="list"  >
      <el-table-column label="序号" align="center" prop="index" width="90" />
      <el-table-column label="家庭组ID" align="center" prop="id" width="200"/>
      <el-table-column label="家庭组昵称" align="center" prop="homeName" width="180"/>
	    <el-table-column label="消费等级" align="center" prop="levelName" width="180"/>
	    <el-table-column label="家庭身份" align="center" prop="titleName" width="180"/>
		<el-table-column label="手机号" align="center" prop="mobile" width="200"/>
		<el-table-column label="家庭权限" align="center" prop="isParents" width="200">
      <template #default="scope">
        <el-tag type="primary"  v-if="scope.row.isParents ==='0'"> 家庭成员</el-tag>
        <el-tag type="success" v-if="scope.row.isParents ==='1'">家长账号</el-tag>
  </template>

    </el-table-column>
		<el-table-column label="区域" align="center" prop="area" width="200"/>
      <el-table-column label="硬件设备" align="left" width="130">
        <template #default="scope">
		
          <el-tag size="small" type="success" class="cursor-pointer"  @click="openProcessRecords('hardwareDevices',scope.row.id)">查看</el-tag> 
        </template>
      </el-table-column>
     
      <el-table-column label="家庭详情" align="left" width="130">
        <template #default="scope">
      		
          <el-tag size="small" type="success" class="cursor-pointer"  @click="openProcessRecords('familyDetails',scope.row.id)">查看</el-tag> 
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <hardwareDevicesPopForm ref="hardwareDevicesPopRef"/>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import hardwareDevicesPopForm from "./hardwareDevicesPopForm.vue"
defineOptions({ name: 'UserManagement' })

// const message = useMessage() // 消息弹窗
const { push } = useRouter()
const hardwareDevicesPopRef = ref()
const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any>([]) // 列表的数据

const levelList = ref<any>([])
const titleNameList = ref<any>([])
let queryParams = ref({
  pageNo: 1,
  pageSize: 10,

})
const queryFormRef = ref() // 搜索的表单


const objectSpanMethod = ({

  rowIndex,
  columnIndex,
}) => {
  if ([0,1,2,3,8,9].includes(columnIndex)) {
    if (rowIndex %2  === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {

  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  list.value = []
  try {
    const data = await equipmentManagementApi.getEquipmentManagementPage(queryParams.value)
    data.list.forEach((item,index)=>{
     item.homeDOList.forEach(val=>{
      val.index = index+1
      list.value.push(val)
     })
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const getAllHomeTitle = async ()=>{
  try {
    const data = await equipmentManagementApi.getAllHomeTitle({})
    titleNameList.value = data
  
  } finally {
    loading.value = false
  }
}

const getAllHomeLevels = async ()=>{
  try {
    const data = await equipmentManagementApi.getAllHomeLevels({})
     levelList.value = data
   
  } finally {
    loading.value = false
  }
}


const openProcessRecords = async (type: string, homeId?: number) => {
  if(type ==='familyDetails'){
    push({ name:type,query: {
    homeId
			} })
  }else{
    hardwareDevicesPopRef.value.open(homeId)
  }
  
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = {
  pageNo: 1,
  pageSize: 10
}
  handleQuery()
}


/** 初始化 **/
onMounted(async () => {
  await getList()
  await getAllHomeTitle()
  await getAllHomeLevels()
})


</script>
