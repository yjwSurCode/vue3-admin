<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1200px">
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" align="center" prop="id1" width="80" />
      <el-table-column label="设备ID" align="center" prop="p1rice" width="120"/>
      <el-table-column label="硬件码" align="center" prop="pri1ce" width="120"/>
        <el-table-column label="蓝牙名称" align="center" prop="p1rice" width="130"/>
        <el-table-column label="二维码" align="center" prop="pri1ce" width="120"/>
		<el-table-column label="设备状态" align="center" prop="pri1ce" width="120"/>
		<el-table-column label="硬件厂商名称" align="center" prop="pri1ce" width="150"/>
		<el-table-column label="设备型号名称" align="center" prop="pri1ce" width="150"/>
		<el-table-column label="备注" align="center" prop="pri1ce" width="180"/>
    </el-table>
    
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import * as ClueApi from '@/api/crm/clue'
import * as AreaApi from '@/api/system/area'
import { defaultProps } from '@/utils/tree'
import * as UserApi from '@/api/system/user'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const loading = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const list = ref([]) // 地区列表
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type
  formType.value = type
  // 修改时，设置数据
  if (id) {
    // formLoading.value = true
    // try {
    //   formData.value = await ClueApi.getClue(id)
    // } finally {
    //   formLoading.value = false
    // }
  }
  // 获得地区列表
  list.value = await AreaApi.getAreaTree()
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
  // 默认新建时选中自己
  if (formType.value === 'create') {
    formData.value.ownerUserId = useUserStore().getUser.id
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


</script>
