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
      <el-form-item label="家庭组ID" prop="familyId">
        <el-input
          v-model="queryParams.familyId"
          class="!w-270px"
          clearable
          placeholder="请输入家庭组ID"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家庭组名称" prop="familyName">
        <el-input
          v-model="queryParams.familyName"
          class="!w-270px"
          clearable
          placeholder="请输入家庭组名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家长账号身份" prop="memberName">
        <el-input
          v-model="queryParams.memberName"
          class="!w-270px"
          clearable
          placeholder="请输入家长账号身份"
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
      <el-form-item label="消费等级" prop="consumeLevel">
        <el-select v-model="queryParams.consumeLevel" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="info in levelList"
            :key="info.value"
            :label="info.label"
            :value="info.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="orderTime" class="last-item">
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
    <el-table v-loading="loading" :data="list" :summary-method="getSummaries" show-summary>
      <el-table-column label="家庭组ID" align="center" prop="no" />
      <el-table-column label="家庭组名称" align="center" prop="type" />
      <el-table-column label="消费等级" align="center" prop="no" />

      <el-table-column label="本月消费人民币(￥)" align="center" prop="deliveryPrice" />
      <el-table-column label="本月消费炫兜币(币)" align="center" prop="deliveryPrice" />
      <el-table-column label="总消费人民币(￥)" align="center" prop="deliveryPrice" />
      <el-table-column label="总消费炫兜币(币)" align="center" prop="deliveryPrice" />


      <el-table-column label="全息舱活跃地区" align="center" prop="payPrice" />
      <el-table-column label="家长账号身份" align="center" prop="payPrice" />
      <el-table-column label="家长手机号" align="center" prop="phone" />
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="warning"
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
  familyId: undefined, // 家庭组编号
  familyName: undefined,  // 家庭组名称
  memberName: undefined,  // 家长账号身份
  phone: undefined, // 家长手机号
  consumeLevel: undefined,  // 消费等级
  orderTime: undefined, // 下单时间
})

const levelList = reactive([
  {label: '全部', value: ''},
  {label: 'LV.1', value: 'LV.1'},
  {label: 'LV.2', value: 'LV.2'},
  {label: 'LV.3', value: 'LV.3'},
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
    familyId: undefined, // 家庭组编号
    familyName: undefined,  // 家庭组名称
    memberName: undefined,  // 家长账号身份
    phone: undefined, // 家长手机号
    consumeLevel: undefined,  // 消费等级
    orderTime: undefined, // 下单时间
  }
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = () => {

}

/** 查看订单详情 */
const openDetail = (id: number) => {
  push({ name: 'FamilyPayDetail', params: { id } })
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
