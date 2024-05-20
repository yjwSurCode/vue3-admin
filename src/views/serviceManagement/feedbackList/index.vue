<template>
  <!-- 意见反馈 -->
  <!-- 列表 -->
  <ContentWrap>
    <!-- 添加 row-key="id" 解决列数据中的 table#header 数据不刷新的问题  -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" align="center" width="100" prop="id" />
      <el-table-column label="用户" align="center" width="120" prop="userName" />
      <el-table-column label="意见来源" align="center" width="120" prop="opinionSource">
        <template #default="scope">
          <el-tag v-if="scope.row.opinionSource === 0">后台</el-tag>
          <el-tag v-if="scope.row.opinionSource === 1">APP</el-tag
          ><el-tag v-if="scope.row.opinionSource === 2">全息舱</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="意见类型" align="center" width="100" prop="opinionTypeName" />
      <el-table-column label="意见说明" align="center" prop="description" />
      <el-table-column label="处理结果" align="center" width="100" prop="result">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">{{
            scope.row.status === 0 ? '已处理' : '待处理'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" align="center" prop="reply">
        <template #default="scope">
          {{ scope.row.reply ?? '-' }}
        </template>
      </el-table-column>

      <el-table-column
        label="意见时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)"
            v-hasPermi="['pay:notify:query']"
          >
            详情
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
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as Api from '@/api/opinion/index'

import { ElNotification } from 'element-plus'

defineOptions({ name: 'TradeOrder' })

const { currentRoute, push } = useRouter() // 路由跳转
const loading = ref(true) // 列表的加载中
const total = ref(2) // 列表的总页数
const list = ref([]) // 列表的数据
const queryFormRef = ref<FormInstance>() // 搜索的表单

// 表单搜索
const queryParams = ref({
  pageNo: 1, // 页数
  pageSize: 10, // 每页显示数量
  orderId: undefined, // 订单编号
  phone: undefined, // 购买人电话
  deviceId: undefined, // 设备码
  thirdParty: undefined, // 第三方信息
  orderTime: undefined, // 下单时间
  orderStatus: undefined // 订单状态
})

const fromList = reactive([
  { label: '全部', value: '' },
  { label: '全息舱', value: '全息舱' },
  { label: 'App', value: 'App' }
])

const statusList = reactive([
  { label: '全部', value: '' },
  { label: '已处理', value: '已处理' },
  { label: '待处理', value: '待处理' }
])

const typeList = reactive([{ label: '全部', value: '' }])

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await Api.feedbackApi(unref(queryParams))
    console.log('意见反馈数据', data)
    if (!data.data.list || !data.data.total) {
      ElNotification({
        title: 'Title',
        message: h('i', { style: 'color: teal' }, '接口错误')
      })
      loading.value = false
      return
    }
    list.value = data.data.list
    total.value = data.data.total
    loading.value = false
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
    orderId: undefined, // 订单编号
    phone: undefined, // 购买人电话
    deviceId: undefined, // 设备码
    thirdParty: undefined, // 第三方信息
    orderTime: undefined, // 下单时间
    orderStatus: undefined // 订单状态
  }
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = () => {}

/** 查看意见详情 */
const openDetail = (id: number) => {
  push({ name: 'FeedbackDetail', params: { id } })
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
  getIntDictOptions(DICT_TYPE.OPINION_TYPE).forEach((obj) => {
    typeList.push({ label: obj.label, value: obj.value })
  })

  await getList()
})
</script>
<style lang="scss" scoped>
.last-item {
  padding-right: 405px;
}

.query-btn {
  padding-left: 100px;
}
</style>
