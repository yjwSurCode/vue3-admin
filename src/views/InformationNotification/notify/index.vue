<template>
  <ContentWrap>
    <div class="flex w-100%">
	<el-form
	      class="-mb-15px"
	      :model="queryParams"
	      ref="queryFormRef"
	      :inline="true"
	      label-width="100px"
	    >
	      <el-form-item label="搜索内容" prop="appId">
	        <el-input
	          v-model="queryParams.content"
	          placeholder="请输入"
	          clearable
	          @keyup.enter="handleQuery"
	          class="!w-240px"
	        />
	        
	      </el-form-item>

        <el-form-item label="推送设备类型" prop="transformStatus">
		    <el-select v-model="queryParams.type" class="!w-240px">
		      <el-option :value="0" label="APP" />
		      <el-option :value="1" label="全息仓" />
		    </el-select>
		  </el-form-item>
     
      <el-form-item label="消息状态" prop="transformStatus">
		    <el-select v-model="queryParams.status" class="!w-240px">
		      <el-option :value="1" label="已发送" />
		      <el-option  :value="0" label="待发送" />
		    </el-select>
		  </el-form-item>
      
	    </el-form>
	<div class="ml-auto">
		<el-button  type="success" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 筛选</el-button>
		<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
		 <el-button  type="success"  @click="openEdit('添加')"> 添加</el-button>
     <el-button  type="danger" @click="handleDelect"> 删除</el-button>
	</div>
</div>
   </ContentWrap>


   <ContentWrap>
   
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="序号"  type="index" width="80"/>
      <el-table-column align="center" label="推送标题"  prop="title" />
      <el-table-column align="center" label="简介"  prop="brief" />
      <el-table-column align="center" label="内容"  prop="content" >
        <template #default="scope">
          <el-button link type="primary" @click="onViewContent(scope.row)"> 查看 </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="跳转连接"  prop="url" >
        <template #default="{ row }">
          <el-button link type="primary" @click="onLink(row)"> 查看 </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推送设备类型"  prop="type" >
        <template #default="scope">
          <span v-if="scope.row.type===0">APP</span>
          <span v-if="scope.row.type===1">全息仓</span>
		   </template>
      </el-table-column>
      <el-table-column align="center" label="推送时间"  prop="pushTime" >
        <template #default="scope">
          <span>{{scope.row.pushTime? formatToDateTime(scope.row.pushTime):scope.row.pushTime}}</span>
		   </template>
      </el-table-column>
      <el-table-column align="center" label="消息状态"  prop="status" >
        <template #default="scope">
          <span v-if="scope.row.status===0">待发送</span>
          <span v-if="scope.row.status===1">已发送</span>
		   </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{  row}">
          <el-button link type="primary" @click="openEdit('编辑',row)"> 编辑 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

    <contentForm ref="contentRef"  @success="successContent"/>
    <linkForm  ref="linkRef" @success="successContent"/> 
    <openForm ref="openRef"   @success="handleQuery"/>
 </template>
 <script lang="ts" setup>
 import * as NotifyApi from '@/api/notify/InformationNotificationNotify/index'
 import {formatToDateTime} from "@/utils/dateUtil"
 import contentForm from "./contentForm.vue"
 import linkForm from "./linkForm.vue"
 import openForm from "./openForm.vue"
import qs from 'qs'
const queryParams = ref({
  pageNo: 1,
  pageSize: 10  
})

const message = useMessage() // 消息弹窗
const loading = ref(false)

const contentRef = ref()

const queryFormRef = ref()

const linkRef = ref()

const openRef = ref()

const total = ref(0)

const multipleSelection = ref([])

const list = ref([])

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
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

const openEdit = (type,row?)=>{
  openRef.value.open(type,row)
}

const onViewContent = (content)=>{
  contentRef.value.open(content)
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
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
    let params =   qs.stringify({ids},{arrayFormat:'comma',allowDots:true})
    const data = await NotifyApi.noticeDelete(params)
    if(data){
      message.success('操作成功!')
      handleQuery()
    }

  }

}

const successContent = (row)=>{
  openRef.value.open('编辑',row)
}

const onLink = (row)=>{
  linkRef.value.open(row)
}

/** 查询列表 */
const getList =  async () => {
  loading.value = true
  try {
    const data = await NotifyApi.noticePage(queryParams.value)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
 </script>
 