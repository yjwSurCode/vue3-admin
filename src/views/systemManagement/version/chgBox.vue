<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    > 
      <el-input disabled type="textarea" v-model="formData.explainText" :rows="7" placeholder="请输入变更说明" />
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 认</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as versionApi from '@/api/xuandou/version/index'

defineOptions({ name: 'PayAppForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  explainText: undefined,
})

const formRules = reactive({
  memo: [{ required: true, message: '变更说明不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('变更说明' + type)
  formType.value = type
  resetForm()
  
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await versionApi.getVersionDetail({id})
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  dialogVisible.value = false
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    explainText: undefined,
  }
  formRef.value?.resetFields()
}
</script>
