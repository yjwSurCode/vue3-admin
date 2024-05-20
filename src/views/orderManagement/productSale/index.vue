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
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="queryParams.id"
          class="!w-270px"
          clearable
          placeholder="请输入ID"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          class="!w-270px"
          clearable
          placeholder="请输入购买人电话"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="orderTime">
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
      <el-form-item label="本月购买量" prop="monthVolume">
        <el-select v-model="queryParams.monthVolume" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="info in volumeList"
            :key="info.value"
            :label="info.label"
            :value="info.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="累计购买量" prop="allVolume">
        <el-select v-model="queryParams.allVolume" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="info in volumeList"
            :key="info.value"
            :label="info.label"
            :value="info.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品属性" prop="productType" class="last-item">
        <el-select v-model="queryParams.productType" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="info in typeList"
            :key="info.value"
            :label="info.label"
            :value="info.value"
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
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="商品名称" align="center" prop="name" />
      <el-table-column label="商品属性" align="center" prop="type">
        <template #default="scope">
          <span>{{ scope.row.user.nickname + '/' + scope.row.user.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本月购买量(次)" align="center" prop="deliveryPrice" />
      <el-table-column label="累计购买量(次)" align="center" prop="deliveryPrice" />
      <el-table-column label="炫兜币价格" align="center" prop="payPrice" />
      <el-table-column label="人民币价格" align="center" prop="payPrice" />

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
  id: undefined, // id
  productName: undefined, // 商品名称
  monthVolume: undefined, // 月销量
  allVolume: undefined, // 总销量
  productType: undefined, // 商品属性
  orderTime: undefined, // 创建时间
})

const typeList = reactive([
  {label: '全部', value: ''},
  {label: '权益卡', value: '权益卡'},
  {label: '商品', value: '商品'},
  {label: '功能', value: '功能'},
])

const volumeList = reactive([
  {label: '全部', value: ''},
  {label: '由高到低', value: '由高到低'},
  {label: '由低到高', value: '由低到高'},
])

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
    id: undefined, // id
    productName: undefined, // 商品名称
    monthVolume: undefined, // 月销量
    allVolume: undefined, // 总销量
    productType: undefined, // 商品属性
    orderTime: undefined, // 创建时间
  }
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = () => {

}

/** 查看商品详情 */
const openDetail = (id: number) => {
  // 跳转至商品详情页
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
