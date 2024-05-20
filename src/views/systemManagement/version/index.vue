<template>

  <!-- 搜索 -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="100px"
    >
      <el-form-item label="版本号" prop="content">
        <el-input
          v-model="queryParams.content"
          class="!w-270px"
          clearable
          placeholder="请输入搜索内容"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推送设备类型" prop="pushDeviceType">
        <el-select v-model="queryParams.pushDeviceType" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="status in typeList"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本状态" prop="versionStatus">
        <el-select v-model="queryParams.versionStatus" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="pay in statusList"
            :key="pay.value"
            :label="pay.label"
            :value="pay.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="query-btn">
        <el-button type="primary" @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          筛选
        </el-button>
        <el-button type="primary" @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button type="success" @click="openDetail('添加', '')">
          <Icon class="mr-5px" icon="ep:plus" />
          添加
        </el-button>
        <el-button type="danger" @click="delList">
          <Icon class="mr-5px" icon="ep:delete" />
          删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- 添加 row-key="id" 解决列数据中的 table#header 数据不刷新的问题  -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" align="center" prop="index" width="80" />
      <el-table-column label="版本号" align="center" prop="version" />
      <el-table-column label="变更说明" align="center" prop="explain">
        <template #default="scope">
          <el-button 
            link type="primary" @click="openChg(scope.row.id)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="推送设备类型" align="center" prop="pushDeviceType" />
      <el-table-column prop="status" label="版本状态" align="center">
        <template #default="scope">
          <el-tag 
            :type="scope.row.versionStatus === 0 ? 'success' : (scope.row.versionStatus === 1 ?'danger':'warning')"
          >{{ scope.row.versionStatus === 0 ? '当前版本' : (scope.row.versionStatus === 1 ?'已发布':'测试版本') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button 
            link type="primary" @click="openDetail('编辑', scope.row.id)">
            编辑
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <versionBox ref="versionRef" @success="getList" />

  <chgBox ref="chgRef" @success="getList" />
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import qs from "qs"

import chgBox from './chgBox.vue'
import versionBox from './versionBox.vue'

import * as versionApi from '@/api/xuandou/version/index'

defineOptions({ name: 'TradeOrder' })

const { currentRoute, push, replace } = useRouter() // 路由跳转
const loading = ref(true) // 列表的加载中
const total = ref(2) // 列表的总页数
const list = ref([]) // 列表的数据
const queryFormRef = ref<FormInstance>() // 搜索的表单

const message = useMessage() // 消息弹窗
const exportLoading = ref(false) // 导出的加载中

// 表单搜索
const queryParams = ref({
  pageNo: 1, // 页数
  pageSize: 10, // 每页显示数量
  content: undefined,
  pushDeviceType: undefined,
  versionStatus: undefined
})

const statusList = reactive([
  {label: '全部', value: ''},
  {label: '已发布', value: '1'},
  {label: '未发布', value: '0'},
])

const typeList = reactive([
  {label: '全部', value: ''},
  {label: 'App端', value: 'App端'},
  {label: '设备端', value: '设备端'}
])

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await versionApi.getVersionList(unref(queryParams))
    list.value = data.list
    list.value.forEach((obj,idx) => {
      obj.index = idx + 1;
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = async () => {
  queryParams.value.pageNo = 1
  await getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.value = {
    pageNo: 1, // 页数
    pageSize: 10, // 每页显示数量
    content: undefined,
    pushDeviceType: undefined,
    versionStatus: undefined
  }
  handleQuery()
}

/** 查看变更说明详情 */
const chgRef = ref()
const openChg = (id: String) => {
  chgRef.value.open("", id)
}

/** 查看版本详情 */
const versionRef = ref()
const openDetail = (type: String, id: String) => {
  versionRef.value.open(type, id)
}


const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const delList = async () => {
  if(!multipleSelection.value.length){
    message.error('请选择需要删除的数据!')
    return
  }
	let res =  await message.confirm('是否确认删除?')
  if(res){
    let idList =  multipleSelection.value.map((v:any)=>{
        return v.id
      })  
      
      let params = qs.stringify({ids: idList},{arrayFormat:'repeat',allowDots:true})
      console.log(idList,'====',params)
      // return;
      const data = await versionApi.delVersion(params)
      if(data){
        message.success('操作成功!')
        handleQuery()
      }
    }
}

// 监听路由变化更新列表，解决订单保存/更新后，列表不刷新的问题。
watch(
  () => currentRoute.value,
  () => {
    getList()
  }
)

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
<style lang="scss" scoped>
  .query-btn {
    box-sizing: border-box;
  }
</style>
