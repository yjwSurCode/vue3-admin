<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button type="danger" @click="handleAdd('ADD', {})"> 添加</el-button>
    <!-- 添加 row-key="id" 解决列数据中的 table#header 数据不刷新的问题  -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" align="center" width="100" prop="id" />
      <el-table-column label="类型名称" align="center" width="120" prop="opinionType" />
      <el-table-column label="类型描述" align="center" width="120" prop="description" />
      <el-table-column label="排序" align="center" width="100" prop="sort">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="状态" align="center" width="100" prop="enable">
        <template #default="scope">
          <el-tag :type="scope.row.enable === 1 ? 'success' : 'danger'">{{
            scope.row.status === 1 ? '启用' : '停用'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleAdd('EDIT', scope.row)"> 编辑 </el-button>
          <el-button link type="primary" @click="deleteType(scope.row)"> 删除 </el-button>
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

    <el-drawer v-model="drawer2" size="60%" @close="handleDrawerClose">
      <!-- <template #header>
      <h4>set title by slot</h4>
    </template> -->
      <template #default>
        <el-form :model="form" ref="listenerFormRef" label-width="auto" style="max-width: 600px">
          <el-form-item
            label="类型名称"
            required
            :rules="{ required: true, trigger: ['blur', 'change'] }"
            prop="opinionType"
          >
            <el-input v-model="form.opinionType" />
          </el-form-item>
          <el-form-item
            required
            :rules="{ required: true, trigger: ['blur', 'change'] }"
            prop="description"
            label="类型描述"
          >
            <el-input
              v-model="form.description"
              style="width: 240px"
              :rows="2"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
          <el-form-item prop="enable" required label="状态">
            <el-radio-group v-model="form.enable">
              <el-radio :value="0" label="0">启用</el-radio>
              <el-radio :value="1" label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="() => (drawer2 = false)">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </ContentWrap>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as Api from '@/api/opinion/index'
import * as TradeOrderApi from '@/api/mall/trade/order'

import { ElMessage } from 'element-plus'

defineOptions({ name: 'TradeOrder' })

const { currentRoute, push } = useRouter() // 路由跳转
const loading = ref(true) // 列表的加载中
const total = ref(2) // 列表的总页数
const list = ref<TradeOrderApi.OrderVO[]>([]) // 列表的数据
const listenerFormRef = ref()
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

const allType = ref()

//新增
const drawer2 = ref(false)

const form = reactive({
  opinionType: '', //类型名称
  description: '', //类型描述
  enable: 1, //状态
  sort: '' //排序
})
const radioModel = ref('3')

const handleAdd = (type = '', value = {}) => {
  console.log('123123添加', type, value)

  if (type == 'EDIT') {
    Object.assign(form, value)
    drawer2.value = true

    allType.value = 'EDIT'
  } else {
    let obj = {}
    const keys = Object.keys(form)
    keys.forEach((item) => {
      obj[item] = ''
    })
    Object.assign(form, obj)
    drawer2.value = true
    allType.value = 'ADD'
  }
}

// 意见类型添加
const onSubmit = async () => {
  const queryParams = { ...form, enable: Number(form.enable), sort: Number(form.sort) }

  let validateStatus = await listenerFormRef.value.validate()
  console.log(validateStatus, 'validateStatus')
  if (!validateStatus) return // 验证不通过直接返回
  console.log('保存111', queryParams, allType.value)
  if (allType.value == 'EDIT') {
    try {
      const data = await Api.updateTypeApi(queryParams)
      console.log('data', data)
      if (data) {
        ElMessage({
          message: '编辑成功'
        })
        drawer2.value = false
        getList()
      }
      // tableList.value = data.list
      // total.value = data.total
    } finally {
      // loading.value = false
    }
  } else {
    try {
      const data = await Api.addTypeApi(queryParams)
      console.log('data', data)

      if (data.code == '0') {
        ElMessage({
          message: '添加成功'
        })
        drawer2.value = false
        getList()
      }
      // tableList.value = data.list
      // total.value = data.total
    } finally {
      // loading.value = false
    }
  }
}

const handleDrawerClose = () => {
  console.log('handleDrawerClose')
}

// 删除意见类型
const deleteType = async (e) => {
  console.log('123213', e)
  try {
    const data = await Api.deleteTypeApi({ id: e.id })
    console.log('data', data)

    if (data.code == '0') {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getList()
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败'
      })
    }
    // tableList.value = data.list
    // total.value = data.total
  } finally {
    // loading.value = false
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await Api.typeListApi() //  await TradeOrderApi.getOrderPage(unref(queryParams))
    console.log('111111', data)

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
