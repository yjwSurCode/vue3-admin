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
      <el-form-item label="购买人电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          class="!w-270px"
          clearable
          placeholder="请输入购买人电话"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全息舱设备码" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          class="!w-270px"
          clearable
          placeholder="请输入全息舱设备码"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="第三方信息" prop="htirdParty">
        <el-select v-model="queryParams.thirdParty" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="info in thirdPartyList"
            :key="info.value"
            :label="info.label"
            :value="info.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="orderTime">
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
      <el-form-item label="订单状态" prop="orderStatus" class="last-item">
        <el-select v-model="queryParams.orderStatus" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="status in statusList"
            :key="status.value"
            :label="status.label"
            :value="status.value"
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
      <el-table-column label="第三方订单编号" align="center" prop="no" />
      <el-table-column label="购买人信息" align="center" prop="type">
        <template #default="scope">
          <span>{{ scope.row.user.nickname + '/' + scope.row.user.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全息舱设备码" align="center" prop="no" />
      <el-table-column label="商品价格(￥)" align="center" prop="deliveryPrice" />
      <!-- <el-table-column label="订单状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_NOTIFY_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column> -->

      <el-table-column prop="status" label="订单状态" align="center" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.status === 0 ? 'success' : 'danger'"
          >{{ scope.row.status === 0 ? '已付款' : '未付款' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="付款金额(￥)" align="center" prop="payPrice" />
      <el-table-column
        label="下单时间"
        align="center"
        prop="payTime"
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
import { erpPriceInputFormatter, getSumValue } from '@/utils'

import * as TradeOrderApi from '@/api/mall/trade/order'

defineOptions({ name: 'TradeOrder' })

const { currentRoute, push } = useRouter() // 路由跳转
const loading = ref(true) // 列表的加载中
const total = ref(2) // 列表的总页数
const list = ref<TradeOrderApi.OrderVO[]>([]) // 列表的数据
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
  orderStatus: undefined, // 订单状态
})

const thirdPartyList = reactive([
  {label: '全部', value: ''},
  {label: '京东', value: '京东'},
  {label: '支付宝', value: '支付宝'},
  {label: '微信', value: '微信'},
])

const statusList = reactive([
  {label: '全部', value: ''},
  {label: '已完成', value: '已完成'},
  {label: '售后订单', value: '售后订单'},
  {label: '已取消', value: '已取消'},
  {label: '已付款', value: '已付款'},
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
    console.log(list.value, total.value)
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
    orderStatus: undefined, // 订单状态
  }
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = () => {

}

/** 查看订单详情 */
const openDetail = (id: number) => {
  push({ name: 'ThirdPartyPayDetail', params: { id } })
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
    padding-right: 405px;
  }

  .query-btn {
    padding-left: 100px;
  }
</style>
