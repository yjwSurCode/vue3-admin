<template>

  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="设备ID" prop="appId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
        
      </el-form-item>
	  
	  <el-form-item label="设备型号" prop="appId">
	    <el-input
	      v-model="queryParams.deviceType"
	      placeholder="请输入"
	      clearable
	      @keyup.enter="handleQuery"
	      class="!w-200px"
	    />
	    
	  </el-form-item>
	  
	  <el-form-item label="设备状态" prop="transformStatus">
	    <el-select v-model="queryParams.deviceFlow" class="!w-200px" multiple >
	      <el-option :value="item.value" :label="item.label"  v-for="(item, index) in deviceFlowList" :key="index"/>
	      
	    </el-select>
	  </el-form-item>
      
      <el-form-item>
        <el-button  type="success" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
		 <el-button  type="success" @click="openForm('设备添加')"> 添加</el-button>
         <el-button  type="success" @click="openBatch">批量管理</el-button>
		  <el-button  type="danger" @click="handleDelect"> 删除</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
		 <el-table-column type="selection" width="55" />
      <el-table-column label="序号" align="center" prop="index" width="80" />
      <el-table-column label="设备ID" align="center" prop="deviceId" width="120"/>
      <el-table-column label="硬件码" align="center" prop="hardwareCode" width="180"/>
	   <el-table-column label="二维码" align="center" prop="qrCodeUrl" width="180">
		   <template #default="scope">
		     <el-image   class="h-80px w-80px" lazy preview-teleported v-if="scope.row.qrCodeUrl" :preview-src-list="[scope.row.qrCodeUrl]" :src="scope.row.qrCodeUrl" fit="cover" />
		   </template>
		   
	   </el-table-column>
	    <el-table-column label="设备状态" align="center" prop="deviceFlow" width="180">
        <template #default="scope">
          <span> {{ deviceFlowList.filter((num) => {
  return scope.row.deviceFlow === num.value;
})[0]?.label }}</span>
		   </template>
      </el-table-column>
	    <el-table-column label="硬件厂商名称" align="center" prop="hardwareVendor" width="180"/>
		<el-table-column label="设备型号名称" align="center" prop="deviceType" width="200"/>
		<el-table-column label="备注" align="center" prop="remark" width="240"/>
      <el-table-column label="流程记录" align="left" width="120">
        <template #default="scope">
          <el-tag size="small" type="success" class="cursor-pointer"  @click="openProcessRecords('流程记录',scope.row.deviceId)">查看</el-tag> 
        </template>
      </el-table-column>
     
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openForm('设备编辑',scope.row.deviceId)"
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
  <processRecords ref="processRecordsRef"/>
  <batchManagement ref="batchManagementRef"  @success="successPreviewContents"/>
   <previewContents ref="previewContentsRef"/>
</template>
<script lang="ts" setup>
import openFormItem from './openForm.vue'
import processRecords from "./processRecords.vue"
import batchManagement from "./batchManagement.vue"
import previewContents from "./previewContents.vue"
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import qs from "qs"
import {deviceFlowList as deviceFlowLists} from "./constant/index"
import { getTenantId } from '@/utils/auth'
defineOptions({ name: 'EquipmentManagement' })

const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

const deviceFlowList = ref(deviceFlowLists)

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})
const queryFormRef = ref() // 搜索的表单

const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
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
    const data = await equipmentManagementApi.deviceManageList(queryParams.value)
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

const processRecordsRef = ref()

const batchManagementRef = ref()

const previewContentsRef = ref()

const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const openProcessRecords = (type: string, id?: number) => {
  processRecordsRef.value.open(type, id)
}

const openBatch = ()=>{
	  batchManagementRef.value.open('批量管理',{...queryParams.value,total:total.value})
}

const successPreviewContents = ()=>{
	previewContentsRef.value.open('预览内容')
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
  let deviceIdList =   multipleSelection.value.map((v:any)=>{
      return v.deviceId
    })  
  let params =   qs.stringify({deviceIdList,tenantId:getTenantId()},{arrayFormat:'repeat',allowDots:true})
    const data = await equipmentManagementApi.deviceManageDelete(params)
    if(data){
      message.success('操作成功!')
      handleQuery()
    }

  }

}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
