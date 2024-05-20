<template>
   <ContentWrap>
    <!-- <el-button  type="success" class="float-right"   @click="openEdit('添加')"> 添加</el-button> -->
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="序号"  type="index" width="80"/>
      <el-table-column align="center" label="通知类型"  prop="noticeType">
        <template #default="scope">
          <span v-if="scope.row.noticeType===0">临期推送</span>
          <span v-if="scope.row.noticeType===1">过期推送</span>
		   </template>
      </el-table-column>
      <el-table-column align="center" label="触发条件"  prop="day">
        <template #default="scope">
          <span>商品失效前 {{ scope.row.day }} 天推送</span>
		   </template>
      </el-table-column>
      <el-table-column align="center" label="推送端"  prop="type" >
        <template #default="scope">
          <span v-if="scope.row.type===0">APP</span>
          <span v-if="scope.row.type===1">全息仓</span>
		   </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit('编辑',row)"> 编辑 </el-button>
          <!-- <el-button link type="danger" @click="openDanger(row.id)"> 删除 </el-button> -->
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

<settingsForm ref="settingsRef"  @success="success"/>
 </template>
 <script lang="ts" setup>
 import * as NoticeSettingApi from '@/api/notify/noticeSetting/index'
 import settingsForm from "./settingsForm.vue"
const queryParams = ref({
  pageNo: 1,
  pageSize: 10
})
const message = useMessage() 
const loading = ref(false)

const settingsRef = ref()

const total = ref(0)

const list = ref([])

const openEdit = (type,row?)=>{
  settingsRef.value.open(type,row)
}

const openDanger = async (id)=>{
  let res =  await message.confirm('是否确认删除?')
  if(res){
    let data =   await NoticeSettingApi.noticeSettingDelete({id})
    if(data){
      message.success('操作成功!')
      getList()
    }
  }
}

/** 查询列表 */
const getList =  async () => {
  loading.value = true
  try {
    const data = await NoticeSettingApi.noticeSettingPage(queryParams.value)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const success = ()=>{
  getList()
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
 </script>
