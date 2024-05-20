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
      <el-form-item label="订单编号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          class="!w-270px"
          clearable
          placeholder="请输入订单编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值人名称" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-270px"
          clearable
          placeholder="请输入充值人名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值人手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          class="!w-270px"
          clearable
          placeholder="请输入充值人手机号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值时间" prop="orderTime">
        <el-date-picker
          v-model="queryParams.orderTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-250px"
          end-placeholder="自定义时间"
          start-placeholder="自定义时间"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="付款方式" prop="payWay" class="last-item">
        <el-select v-model="queryParams.payWay" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="pay in payList"
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
        <el-button type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- 添加 row-key="id" 解决列数据中的 table#header 数据不刷新的问题  -->
    <el-table v-loading="loading" :data="list" :summary-method="getSummaries" show-summary>
      <el-table-column label="订单编号" align="center" prop="no" width="100" />
      <el-table-column label="充值人名称" align="center" prop="name" width="100" />
      <el-table-column label="充值人手机号" align="center" prop="phone" width="120" />
      <el-table-column label="付款方式" align="center" prop="payWay" width="120" />
      <el-table-column label="付款金额" align="center" prop="payPrice" width="100">
        <template #default="scope">
          <span>{{ '￥' + scope.row.payPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="获得炫兜币" align="center" prop="virtualCoin" width="120">
        <template #default="scope">
          <span>{{ scope.row.payPrice + '币' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="充值时间"
        align="center"
        prop="payTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="备注" align="center" prop="remark" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="openService(scope.row.no)">
            售后
          </el-button>
          <!-- v-hasPermi="['softwarePay:order:query']" 权限验证 -->
          <el-button 
            link type="danger" @click="openDetail(scope.row.id)">
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

  <!-- 表单弹窗：添加/修改 -->
  <serviceBox ref="serviceRef" @success="getList" />
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import { erpPriceInputFormatter, getSumValue } from '@/utils'
import download from '@/utils/download'
import request from '@/config/axios'

import serviceBox from './serviceBox.vue'

import * as TradeOrderApi from '@/api/mall/trade/order'

defineOptions({ name: 'TradeOrder' })

const { currentRoute, push, replace } = useRouter() // 路由跳转
const loading = ref(true) // 列表的加载中
const total = ref(2) // 列表的总页数
const list = ref<TradeOrderApi.OrderVO[]>([]) // 列表的数据
const queryFormRef = ref<FormInstance>() // 搜索的表单

const message = useMessage() // 消息弹窗
const exportLoading = ref(false) // 导出的加载中

// 表单搜索
const queryParams = ref({
  pageNo: 1, // 页数
  pageSize: 10, // 每页显示数量
  orderId: undefined, // 订单编号
  name: undefined, // 购买人名称
  phone: undefined, // 购买人电话
  orderTime: undefined, // 充值时间
  payWay: undefined  // 付款方式
})

const payList = reactive([
  {label: '全部', value: ''},
  {label: '微信', value: '微信'},
  {label: '支付宝', value: '支付宝'},
])

// 表格合计金额
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index: number) => {
    if (index === 0) {
      sums[index] = '￥合计'
      return
    }
    if (['payPrice'].includes(column.property)) {
      const sum = getSumValue(data.map((item) => Number(item[column.property])))
      sums[index] = erpPriceInputFormatter(sum)
    } else {
      sums[index] = ''
    }
  })
  return sums
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TradeOrderApi.getOrderPage(unref(queryParams))
    list.value = data.list
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
    orderId: undefined, // 订单编号
    name: undefined, // 购买人名称
    phone: undefined, // 购买人电话
    orderTime: undefined, // 充值时间
    payWay: undefined // 付款方式
  }
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    // const data = await TradeOrderApi.exportContract(queryParams)
    console.log(queryParams,'======')
    // 地址需要和后端对接
    const data = await request.download({ url: `/orderManagement/softwarePay/export-excel`, queryParams })
    return;
    download.excel(data, '软件付费订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 查看订单详情 */
const openDetail = (id: String) => {
  push({ name: 'RechargePayDetail', params: { id } })

  // 这种方式可以显示面包屑，但是左侧该菜单栏设置隐藏，也会使面包屑消失
  // replace('/orderManagement/softwarePay/detail?id=' + id)
}

/** 查看售后详情 */
const serviceRef = ref()
const openService = (id: String) => {
  serviceRef.value.open("", id)
  // serviceDrawerRef.value.onOff()
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
  .last-item {
    padding-right: 805px;
  }

  .query-btn {
    box-sizing: border-box;
    padding-left: 100px;
  }
</style>
