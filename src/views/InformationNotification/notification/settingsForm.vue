<!-- 商品发布 - 库存价格 - 添加属性 -->
<template>
  <Dialog v-model="dialogVisible" :title="title" width="420px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
    <el-form-item label="通知类型：" prop="noticeType">
        <el-radio-group v-model="formData.noticeType" >
      <el-radio  :label="0" size="large">临期推送</el-radio>
      <el-radio  :label="1" size="large">过期推送</el-radio>
    </el-radio-group>
      </el-form-item>
      <el-form-item label="商品失效前" prop="day">
        <el-input v-model.number="formData.day" class="!w-50px ml-2 mr-2"/>
        <span>天推送</span>
      </el-form-item>
      <el-form-item label="推送端：" prop="type">
        <el-radio-group v-model="formData.type" >
      <el-radio  :label="0" size="large">APP端</el-radio>
      <el-radio  :label="1" size="large">设备端</el-radio>
    </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
 import * as NoticeSettingApi from '@/api/notify/noticeSetting/index'

defineOptions({ name: 'ProductPropertyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const title = ref('')
const emit = defineEmits(['success']) 
const formLoading = ref(false) // 表单的加载中
const formData = ref({
  id:'',
  type:'',
  day:null,
  noticeType:null
})
const formRules = reactive({
  noticeType: [{ required: true, message: '通知类型不能为空', trigger: 'blur' }],
  day: [{ required: true, message: '失效日期不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '推送端不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (w,row) => {
  formData.value = row
  title.value = w
  dialogVisible.value = true
  if(!row){
    resetForm()
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    if(formData.value.id){
      await NoticeSettingApi.noticeSettingUpdate({
        ...formData.value
      })
      message.success('修改成功')
    }else{
      await NoticeSettingApi.noticeSettingCreate({
        ...formData.value
      })
      message.success(t('common.createSuccess'))
    }
    emit('success')
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id:'',
  type:'',
  day:null,
  noticeType:null
  }
  formRef.value?.resetFields()
}
</script>
