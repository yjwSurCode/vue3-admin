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
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          class="!w-270px"
          clearable
          placeholder="请输入商品名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格区间" prop="price">
        <div class="number-range">
          <el-input v-model="queryParams.minPrice" placeholder="最低价格" />
          <span>~</span>
          <el-input v-model="queryParams.maxPrice" placeholder="最高价格" />
        </div>
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
      <el-form-item label="商品状态" prop="productStatus">
        <el-select v-model="queryParams.productStatus" class="!w-270px" clearable placeholder="全部">
          <el-option
            v-for="info in statusList"
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
        <el-button type="success" @click="handleAdd">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
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
    <!-- Tab 选项：真正的内容在 Lab -->
    <el-tabs v-model="activeTab" type="card" @tab-change="onTabChange">
      <el-tab-pane
        v-for="tab in statusTabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      />
    </el-tabs>

    <!-- 添加 row-key="id" 解决列数据中的 table#header 数据不刷新的问题  -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="商品ID" align="center" prop="id" />
      <el-table-column label="商品名称" align="center" prop="name" />
      <el-table-column label="商品分类" align="center" prop="type">
        <template #default="scope">
          <span>{{ scope.row.user.nickname + '/' + scope.row.user.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态" align="center" prop="deliveryPrice" />
      <el-table-column label="商品推荐" align="center" prop="deliveryPrice" />
      <el-table-column label="创建时间" align="center" prop="payPrice" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)"
            v-hasPermi="['pay:notify:query']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="delList(scope.row.id)"
            v-hasPermi="['pay:notify:query']"
          >
            删除
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
  status: '',
  id: undefined, // id
  productName: undefined, // 商品名称
  monthVolume: undefined, // 月销量
  allVolume: undefined, // 总销量
  productType: undefined, // 商品属性
  orderTime: undefined, // 创建时间
})

const statusList = reactive([
  {label: '全部', value: ''},
  {label: '上架', value: '上架'},
  {label: '下架', value: '下架'},
])

const typeList = reactive([
  {label: '全部', value: ''},
  {label: '权益卡', value: '权益卡'},
  {label: '商品', value: '商品'},
  {label: '功能', value: '功能'},
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
    status: '',
    id: undefined, // id
    productName: undefined, // 商品名称
    monthVolume: undefined, // 月销量
    allVolume: undefined, // 总销量
    productType: undefined, // 商品属性
    orderTime: undefined, // 创建时间
  }
  handleQuery()
}

// 新增操作
const handleAdd = () => {

}

/** 导出按钮操作 */
const handleExport = () => {

}

/** 查看商品详情 */
const openDetail = (id: number) => {
  push({name: "GoodsDetail", params: {id} })
}

const delList = (id: number) => {
  
}

const activeTab = ref('all') // Tab 筛选
const statusTabs = reactive([
  {label: '全部',value: 'all'},
  {label: '已推荐',value: '1'},
  {label: '未推荐',value: '0'},
])

const onTabChange = (tabName) => {
  queryParams.value.status = tabName;
  // getList()
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
    padding-right: 715px;
  }

  .query-btn {
    padding-left: 100px;
  }

  .number-range {
    width: 270px;
    height: 32px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    border: 1px solid #dcdfe6;
    border-radius: 5px;

    ::v-deep .el-input .el-input__wrapper{
      background: none;
      box-shadow: none;
    }

    span {
      color: #ccc;
      padding: 0 20px;
    }
  }

  
</style>
