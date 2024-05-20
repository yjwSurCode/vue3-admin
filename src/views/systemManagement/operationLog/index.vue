<template>
  <ContentWrap>
    <!-- /system/log/operate-log -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="搜索内容" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入操作账号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>

      <el-form-item label="系统模块" prop="type">
        <el-select placeholder="请选择" v-model="queryParams.type" class="!w-200px">
          <el-option
            :value="item.value"
            v-for="(item, index) in sysTemList"
            :key="index"
            :label="item.value"
          />

          <!-- <el-option :value="true" label="已转化" /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型" prop="subType">
        <el-select placeholder="请选择" v-model="queryParams.subType" class="!w-200px">
          <el-option
            :value="item.value"
            v-for="(item, index) in operateList"
            :key="index"
            :label="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="操作结果" prop="isResult">
        <el-select placeholder="请选择" v-model="queryParams.isResult" class="!w-200px">
          <el-option :value="1" label="成功" />
          <el-option :value="0" label="失败" />
        </el-select>
      </el-form-item>
      <!-- 操作时间 -->
      <el-form-item label="操作时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="handleQuery"
          ><Icon icon="ep:search" class="mr-5px" /> 查询</el-button
        >
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="tableList">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" align="center" prop="id" width="80" />
      <el-table-column label="操作账号" align="center" prop="userName" width="120" />
      <el-table-column label="系统模块" align="center" prop="type" width="180" />
      <el-table-column label="操作类型" align="center" prop="subType" width="180">
        <template #default="scope">
          <!-- <el-image
            class="h-80px w-80px"
            lazy
            preview-teleported
            v-if="scope.row.id"
            :preview-src-list="[
              'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            ]"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="cover"
          /> -->
          <el-tag type="success">{{ scope.row.subType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作结果" align="center" prop="isResult" width="180">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.isResult == 1">{{ '成功' }}</el-tag>
          <el-tag type="error" v-if="scope.row.isResult == 0">{{ '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createTime || new Date()) }}
          <!-- {{
            new Date(parseInt(scope.row.createTime) * 1000)
              .toLocaleString()
              .replace(/年|月/g, '-')
              .replace(/日/g, ' ')
          }} -->
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="240">
        <template #default="scope">
          {{ scope.row.remark ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center" width="auto">
        <template #default="scope">
          <el-tag
            type="success"
            class="cursor-pointer"
            @click="openProcessRecords('查看详情', scope.row)"
            >查看详情</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <el-drawer v-model="drawer2" size="60%" @close="handleDrawerClose">
    <!-- <template #header>
      <h4>set title by slot</h4>
    </template> -->
    <template #default>
      <el-table v-loading="loading" :data="tableDetailList">
        <el-table-column label="序号" align="center" prop="id" width="80" />
        <el-table-column label="操作账号" align="center" prop="userName" width="120" />
        <el-table-column label="系统模块" align="center" prop="type" width="180" />
        <el-table-column label="操作类型" align="center" prop="subType" width="180">
          <template #default="scope">
            <el-image
              class="h-80px w-80px"
              lazy
              preview-teleported
              v-if="scope.row.id"
              :preview-src-list="[
                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
              ]"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作结果" align="center" prop="isResult" width="180">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.isResult == 1">{{ '成功' }}</el-tag>
            <el-tag type="error" v-if="scope.row.isResult == 0">{{ '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            {{
              new Date(parseInt(scope.row.createTime) * 1000)
                .toLocaleString()
                .replace(/年|月/g, '-')
                .replace(/日/g, ' ')
            }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="240">
          <template #default="scope">
            {{ scope.row.remark ?? '-' }}
          </template>
        </el-table-column>
      </el-table>
      <el-divider />
      <div class="changeText">
        <div class="changeText-title">变更前内容</div>
        <div class="changeText-title">变更后内容</div>
      </div>
      <el-divider />
      <div class="detailContent-box">
        <div class="detailContent-title"> {{ tableDetailList[0].actionBefore }}</div>
        <div class="detailContent-title"> {{ tableDetailList[0].actionAfter }}</div>
      </div>
      <!-- <div class="detailContent-box" v-for="(item, index) in tableList.action" :key="index">
        <div class="detailContent-title"> {{ item || '-' }} </div>
      </div> -->
    </template>
    <!-- <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template> -->
  </el-drawer>
</template>
<script lang="ts" setup>
// import openFormItem from './openForm.vue'
// import processRecords from './processRecords.vue'
// import batchManagement from './batchManagement.vue'
// import previewContents from './previewContents.vue'
import * as Api from '@/api/log/index'

import { ElNotification } from 'element-plus'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { tr } from 'element-plus/es/locale'
defineOptions({ name: 'EquipmentManagement' })

const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const tableList = ref([]) // 列表的数据

// 系统模块列表
const sysTemList = ref([])
// 操作类型
const operateList = ref([])

// 搜索条件
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: '', //  操作模块 string
  subType: '', // 操作类型 string
  isResult: '', // 操作结果 number //是否成功,可用值:1,0,示例值(1)		false
  userName: '', // 操作账号 //用户编号		false
  createTime: '' //操作时间 createTime[0]: 2024-05-18 00:00:00 createTime[1]: 2024-06-12 23:59:59
})

const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出等待
const appList = ref([]) // 支付应用列表集合

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  console.log('操作日志搜索', queryParams)
  let filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([key, value]) => value !== '')
  )
  getList(filteredQueryParams)
}

/** 查询日志列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await Api.getLogApi(Object.assign(queryParams, { pageNo: 1, pageSize: 10 }))
    console.log('查询日志列表', data)
    if (!data.data.list) {
      ElNotification({
        title: 'Title',
        message: h('i', { style: 'color: teal' }, '接口错误')
      })
      loading.value = false
      return
    }

    tableList.value = data.data.list
    total.value = data.data.total
  } finally {
    loading.value = false
  }
}

// 系统模块
const initModulesApi = async () => {
  loading.value = true
  try {
    const data = await Api.modulesApi()
    console.log('data111', data.data)
    // let arr = []
    // Object.keys(data.data).forEach((v) => {
    //   let o = {}
    //   o[v] = data.data[v]
    //   arr.push(o)
    // })
    const result = Object.entries(data.data).map(([id, value]) => ({ id, value }))
    console.log(result, 'arrarrarr', result.length)
    sysTemList.value = result
  } finally {
    loading.value = false
  }
}

// 操作类型
const initOperateApi = async () => {
  loading.value = true
  try {
    const data = await Api.operateApi()
    const result = Object.entries(data.data).map(([id, value]) => ({ id, value }))
    operateList.value = result
    console.log('操作类型operateList', operateList)
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const formRef = ref()

const processRecordsRef = ref()

const batchManagementRef = ref()

const previewContentsRef = ref()

const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

// 抽屉
const drawer2 = ref(false)
const tableDetailList = ref([])
// 变更文案
const detailContent = ref([
  { title1: '11', title2: '22' },
  { title1: '11', title2: '22' }
])
// 打开抽屉
const openProcessRecords = (type: string, values?: number) => {
  // processRecordsRef.value.open(type, id)
  console.log(values, 'values----')
  //! 处理action
  tableDetailList.value.push(values)
  drawer2.value = true
}

const handleDrawerClose = () => {
  tableDetailList.value = []
}

const openBatch = () => {
  batchManagementRef.value.open('批量管理')
}

const successPreviewContents = () => {
  previewContentsRef.value.open('预览内容')
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  // queryParams = {
  //   pageNo: 1,
  //   pageSize: 10,
  //   type: '', // string //操作模块，模拟匹配,示例值(订单)		false
  //   userId: '', // number //用户编号		false
  //   isResult: '' //number //是否成功,可用值:1,0,示例值(1)		false
  // }

  //! 重置reactive
  const keys = Object.keys(queryParams)
  let obj = {}
  keys.forEach((item) => {
    obj[item] = ''
  })
  Object.assign(queryParams, obj)

  console.log(queryFormRef, 'queryFormRef')
  // handleQuery()
}

const handleDelect = async () => {
  await message.confirm('是否确认删除?')
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  await initModulesApi()
  await initOperateApi()
})
</script>

<style lang="scss">
.changeText {
  display: flex;

  .changeText-title {
    width: 50%;
    text-align: center;
  }
}

.detailContent-box {
  display: flex;

  .detailContent-title {
    width: 50%;
    text-align: center;
  }
}
</style>
