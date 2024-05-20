<template>

  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="搜索内容">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
        
      </el-form-item>
	  
	  <el-form-item label="形象类型">
	    <el-select v-model="queryParams.titleId" class="!w-200px" multiple >
	      <el-option :value="item.id" :label="item.titleName"  v-for="(item, index) in allHomeTitleList" :key="index"/>
	      
	    </el-select>
	    
	  </el-form-item>
	  
	  <el-form-item label="形象状态" >
	    <el-select v-model="queryParams.enable" class="!w-200px">
	      <el-option :value="item.value" :label="item.label"  v-for="(item, index) in enableList" :key="index"/>
	      
	    </el-select>
	  </el-form-item>
      
      <el-form-item>
        <el-button  type="success" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
		 <el-button  type="success" @click="openForm('添加')"> 添加</el-button>
      
		  <el-button  type="danger" @click="handleDelect"> 删除</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
		 <el-table-column type="selection" width="55"  :selectable="handleDisable"/>
      <el-table-column label="序号" align="center" prop="index" width="80" />
      <el-table-column label="角色昵称" align="center" prop="nickname" width="120"/>
      <el-table-column label="角色封面" align="center" prop="cover" width="180">

        <template #default="scope">
		     <el-image   class="h-80px w-80px" lazy preview-teleported v-if="scope.row.cover.fileUrl" :preview-src-list="[scope.row.cover.fileUrl]" :src="scope.row.cover.fileUrl" fit="cover" />
		   </template>
      </el-table-column>

	   <el-table-column label="形象类型" align="center" prop="titleId" width="180">
		  <template #default="scope">
          <span> {{ allHomeTitleList.filter((num) => {
  return scope.row.titleId === num.id;
})[0]?.titleName }}</span>
		   </template>
		   
	   </el-table-column>
	    <el-table-column label="内容" align="center" prop="contentId" width="180">
        <template #default="scope">
          <span @click="onContent(scope.row.content)" class="cursor-pointer!"  v-if="scope.row.content"> 
            <svg t="1715667160256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2710" width="30" height="30"><path d="M804.571429 749.714286v54.857143a18.285714 18.285714 0 0 1-18.285715 18.285714H237.714286a18.285714 18.285714 0 0 1-18.285715-18.285714v-54.857143a73.142857 73.142857 0 0 0-73.142857-73.142857H73.142857a73.142857 73.142857 0 0 0-73.142857 73.142857v164.571428a109.714286 109.714286 0 0 0 109.714286 109.714286h804.571428a109.714286 109.714286 0 0 0 109.714286-109.714286v-164.571428a73.142857 73.142857 0 0 0-73.142857-73.142857h-73.142857a73.142857 73.142857 0 0 0-73.142857 73.142857z" fill="#333333" p-id="2711"/><path d="M640 353.462857V73.142857a73.142857 73.142857 0 0 0-73.142857-73.142857h-109.714286a73.142857 73.142857 0 0 0-73.142857 73.142857v280.32a18.285714 18.285714 0 0 1-18.285714 18.285714h-85.577143a36.571429 36.571429 0 0 0-27.794286 60.16l231.862857 272.822858a36.571429 36.571429 0 0 0 54.857143 0L771.657143 431.908571a36.571429 36.571429 0 0 0-27.794286-60.16H658.285714a18.285714 18.285714 0 0 1-18.285714-18.285714z" fill="#333333" p-id="2712"/></svg>
            
            <!-- {{ scope.row.content.fileUrl }} -->
          </span>
		   </template>

      </el-table-column>
    
	    <el-table-column label="上传账号" align="center" prop="creator" width="180"/>
		<el-table-column label="上传时间" align="center" prop="createTime" width="200">
      <template #default="scope">
          <span>{{scope.row.createTime? formatToDateTime(scope.row.createTime):scope.row.createTime}}</span>
		   </template>
    </el-table-column> 
		<el-table-column label="形象状态" align="center" prop="enable" width="120">
            <template #default="scope">
                <span> {{ enableList.filter((num) => {
        return scope.row.enable === num.value;
      })[0]?.label }}</span>
            </template>
    </el-table-column>

      
     
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openForm('编辑',scope.row)"
          >
            编辑
          </el-button>
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

 <!-- 表单弹窗：添加/修改 -->
  <openFormItem ref="formRef" @success="getList" />
  
</template>
<script lang="ts" setup>
import openFormItem from './openForm.vue'
import {formatToDateTime} from "@/utils/dateUtil"
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import * as aiApi from '@/api/notify/ai/index'
import qs from "qs"
defineOptions({ name: 'InteractionAi' })

const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})
const queryFormRef = ref() // 搜索的表单

const multipleSelection = ref([])

const allHomeTitleList = ref([])

const enableList = ref([{
  label:'启用',
  value:1
},{
  label:'停用',
  value:0
}])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const handleDisable = (row)=>{
      return !row.enable 
}


const onContent = (row)=>{
  const el = document.createElement('a');
      el.style.display = 'none';
      el.setAttribute('target', '_blank');
      el.setAttribute('download',row.fileName );
      el.href = row.fileUrl;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
}

const getAllHomeTitle = async ()=>{
  try {
    const data = await equipmentManagementApi.getAllHomeTitle({})
    allHomeTitleList.value = data
  
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await aiApi.aifigurePage(queryParams.value)
    data.list.forEach((item,index)=>{
      item.index = index +1
    })
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const formRef = ref()

const openForm = (type: string, row?) => {
  formRef.value.open(type, row)
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

const handleDelect =  async ()=>{
  if(!multipleSelection.value.length){
    message.error('请选择需要删除的数据!')
    return
  }
	let res =  await message.confirm('是否确认删除?')
  if(res){
  let ids =   multipleSelection.value.map((v:any)=>{
      return v.id
    })  
  let params =   qs.stringify({ids},{arrayFormat:'repeat',allowDots:true})
    const data = await aiApi.aifigureDelete(params)
    if(data){
      message.success('操作成功!')
      handleQuery()
    }

  }

}

/** 初始化 **/
onMounted(async () => {
  await getList()
  await getAllHomeTitle()
})
</script>
