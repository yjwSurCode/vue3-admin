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
      <el-form-item label="家长手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          class="!w-270px"
          clearable
          placeholder="请输入家长手机号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消费时间" prop="orderTime">
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
    <el-table v-loading="loading" :data="list">
      <el-table-column label="订单编号" align="center" prop="no" width="200" />
      <el-table-column label="消费内容" align="center" prop="content" width="200" />
      <el-table-column label="消费炫兜币金额" align="center" prop="virtualCoin" width="150" />
      <el-table-column label="全息舱设备码" align="center" prop="deviceId" width="150" />
      <el-table-column label="家长组名称" align="center" prop="groupName" width="150" />
      <el-table-column label="家长账号名称" align="center" prop="memberName" width="150" />
      <el-table-column label="家长手机号" align="center" prop="phone" width="150" />
      <el-table-column label="消费时间" align="center" prop="payTime" :formatter="dateFormatter" class-name="small-padding fixed-width" />
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
import download from '@/utils/download'
import request from '@/config/axios'

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
  phone: undefined, // 家长手机号
  orderTime: undefined, // 充值时间
})

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
    phone: undefined, // 家长手机号
    orderTime: undefined, // 充值时间
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
