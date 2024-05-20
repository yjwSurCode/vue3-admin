<template>
  <el-row>
    <el-col :span="24" :xs="24">
      <!-- 搜索 -->
      <ContentWrap>
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="用户账号" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户账号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="账号权限" prop="role">
            <el-select
              v-model="queryParams.role"
              placeholder="全部"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in roleList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-240px">
              <el-option
                v-for="dict in statusList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
            <el-button type="primary" plain @click="openForm('create')">
              <Icon icon="ep:plus" /> 新增
            </el-button>
            <!-- <el-button type="danger" plain @click="delList">
              <Icon icon="ep:delete" /> 删除
            </el-button> -->
          </el-form-item>
        </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-table v-loading="loading" :data="list">
          <el-table-column label="编号" align="center" key="id" prop="id" width="120" />
          <el-table-column label="姓名" align="center" prop="nickname" :show-overflow-tooltip="true" width="120"/>
          <el-table-column label="账号" align="center" prop="username" :show-overflow-tooltip="true" width="120"/>
          <el-table-column label="手机号码" align="center" prop="mobile" width="120" />
          <el-table-column label="账号权限" align="center" prop="role" />
          <el-table-column label="账号状态" align="center" key="status" width="120">
            <template #default="scope">
              <el-tag 
                :type="scope.row.status === 0 ? 'success' : 'danger'"
              >{{ scope.row.status === 0 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180"/>
          <el-table-column label="最后登录时间" align="center" prop="lastLoginTime" :formatter="dateFormatter" width="180"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button type="primary" link @click="openForm('update', scope.row.id)">编辑</el-button>
                <el-button type="danger" link @click="delList(scope.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </ContentWrap>
    </el-col>
  </el-row>

  <!-- 添加或修改用户对话框 -->
  <UserForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import { dateFormatter } from '@/utils/formatTime'
import * as UserApi from '@/api/system/user'
import UserForm from './UserForm.vue'

defineOptions({ name: 'SystemUser' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数

const roleList = reactive([
  {label: '全部', value: ''},
])

const statusList = reactive([
  {label: '全部', value: ''},
  {label: '启用', value: '1'},
  {label: '禁用', value: '0'},
])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  role: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const delList = async (id?: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    // await UserApi.deleteUser(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 重置密码 */
const handleResetPwd = async (row: UserApi.UserVO) => {
  try {
    // 重置的二次确认
    const result = await message.prompt(
      '请输入"' + row.username + '"的新密码',
      t('common.reminder')
    )
    const password = result.value
    // 发起重置
    await UserApi.resetUserPwd(row.id, password)
    message.success('修改成功，新密码是：' + password)
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getIntDictOptions(DICT_TYPE.ROLE_TYPE).forEach(obj => {
    roleList.push({label: obj.label, value: obj.value})
  });

  getList()
})
</script>
