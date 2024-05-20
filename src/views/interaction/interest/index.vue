<template>
  <ContentWrap>
    <div class="flex w-100%">
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="搜索内容" prop="content">
          <el-input
            v-model="queryParams.content"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="玩法状态" prop="status">
          <el-select placeholder="请选择" v-model="queryParams.status" class="!w-240px">
            <el-option :value="true" label="上架" />
            <el-option :value="false" label="下架" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="ml-auto">
        <el-button @click="handleQuery"><Icon icon="ep:plus" class="mr-5px" /> 查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </div>
    </div>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="序号" prop="id" width="80" />
      <el-table-column align="center" label="玩法名称" prop="name" />
      <el-table-column align="center" label="玩法图标" prop="icon">
        <template #default="{ row }">
          <el-image class="h-full w-full" :src="row.icon" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="规则" prop="ruler" />
      <el-table-column align="center" label="API名称" prop="api">
        <!-- <template #default="scope">
          <el-button link type="primary" @click="onViewContent(scope.row)"> 查看 </el-button>
        </template> -->
      </el-table-column>

      <el-table-column align="center" label="上架账号" prop="account">
        <!-- <template #default="{ row }">
          <el-button link type="primary" @click="onLink(row)"> 查看 </el-button>
        </template> -->
      </el-table-column>

      <el-table-column align="center" label="上架时间" prop="uptime" :formatter="dateFormatter">
        <!-- <template #default="scope">
          <span v-if="scope.row.type === 0">APP</span>
          <span v-if="scope.row.type === 1">全息仓</span>
        </template> -->
      </el-table-column>
      <el-table-column align="center" label="上传时间" prop="createTime" :formatter="dateFormatter">
        <!-- <template #default="scope">
          <span>{{
            scope.row.pushTime ? formatToDateTime(scope.row.createTime) : scope.row.createTime
          }}</span>
        </template> -->
      </el-table-column>
      <el-table-column align="center" label="玩法状态" prop="status">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status === true">上架</el-tag>
          <el-tag type="error" v-if="scope.row.status === false">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="openEdit('编辑', scope.row)"> 编辑 </el-button>
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

  <!-- <contentForm ref="contentRef" @success="successContent" /> -->
  <!-- <linkForm ref="linkRef" @success="successContent" /> -->
  <openForm ref="openRef" :dialogValue="dialogValue" @success="handleQuery" />
</template>
<script lang="ts" setup>
import * as Api from './index'
import { formatToDateTime } from '@/utils/dateUtil'
import { dateFormatter } from '@/utils/formatTime'
import contentForm from './contentForm.vue'
import linkForm from './linkForm.vue'
import openForm from './openForm.vue'
import qs from 'qs'

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  content: ''
})

const message = useMessage() // 消息弹窗
const loading = ref(false)

const contentRef = ref()

const queryFormRef = ref()

const linkRef = ref()

const openRef = ref()

const total = ref(0)

const multipleSelection = ref([])

const list = ref([])

const dialogValue = reactive({})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  console.log('handleQuery', handleQuery)
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = {
    pageNo: 1,
    pageSize: 10
  }
  handleQuery()
}

const openEdit = (type, row?) => {
  Object.assign(dialogValue, row)
  console.log('1231231231666666666', row, dialogValue)
  openRef.value.open(type, row)
}

const onViewContent = (content) => {
  contentRef.value.open(content)
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const handleDelect = async () => {
  if (!multipleSelection.value.length) {
    message.error('请选择需要删除的数据!')
    return
  }
  let res = await message.confirm('是否确认删除?')
  if (res) {
    let ids = multipleSelection.value.map((v: any) => {
      return v.id
    })
    let params = qs.stringify({ ids }, { arrayFormat: 'comma', allowDots: true })
    const data = await NotifyApi.noticeDelete(params)
    if (data) {
      message.success('操作成功!')
      handleQuery()
    }
  }
}

const successContent = (row) => {
  // openRef.value.open('编辑', row)
}

const onLink = (row) => {
  linkRef.value.open(row)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await Api.interestApi(queryParams.value)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
