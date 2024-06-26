<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    > 
      <el-form-item label="实付金额:" prop="payAmount">
        <el-input
        v-model="formData.payAmount" disabled 
        :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" />
      </el-form-item>
      <el-form-item label="退&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;款:" prop="refund">
        <el-input v-model="formData.refund" placeholder="请输入退款金额" />
      </el-form-item>
      <el-form-item label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:" prop="remark">
        <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
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

defineOptions({ name: 'PayAppForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  goodsPrice: undefined,
  payAmount: undefined,
  refund: undefined,
  remark: undefined,
})

const validateRefund = (rule: any, value: any, callback: any) => {
  if(value == '') {
    callback(new Error('退款金额不能为空'))
  }else {
    if(value > formData.payAmount) {
      callback(new Error('退款金额不能大于商品价格'))
    }
  }
}

const formRules = reactive({
  refund: [{ required: true, validator: validateRefund, trigger: 'blur' }],
  remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('售后' + type)
  formType.value = type
  resetForm()
  return;
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
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AppApi.AppVO
    if (formType.value === 'create') {
      await AppApi.createApp(data)
      message.success(t('common.createSuccess'))
    } else {
      await AppApi.updateApp(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    goodsPrice: undefined,
    payAmount: undefined,
    refund: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
