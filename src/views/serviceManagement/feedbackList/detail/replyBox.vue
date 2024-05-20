<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="处理结果:" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">已解决</el-radio>
          <el-radio label="0">未解决</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="回复内容:" prop="content">
        <el-input
          type="textarea"
          :rows="5"
          v-model="formData.content"
          placeholder="请输入回复内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 认</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as AppApi from '@/api/pay/app'
import * as Api from '@/api/opinion/index'

defineOptions({ name: 'PayAppForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  status: undefined,
  content: undefined
})

const formRules = reactive({
  status: [{ required: true, message: '处理结果不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '回复内容不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('投诉回复' + type)
  formType.value = type
  resetForm()
  return
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AppApi.getApp(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['successFun']) // 定义 success 事件，用于操作成功后的回调

const submitForm = async () => {
  console.log('校验表单')
  emit('successFun', { id: 1 })
  return
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  
  // 提交请求
  formLoading.value = true
  try {
    await Api.replyApi(formData).then((e) => {
      console.log('eeee', e)
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    })
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    status: undefined,
    content: undefined
  }
  formRef.value?.resetFields()
}
</script>
