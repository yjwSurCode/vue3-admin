<!-- 商品发布 - 库存价格 - 添加属性 -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <form ref="DataForm">
      <input
        type="file"
        ref="fileInput"
        :accept="accept"
        @change="handleVideoChange"
        class="opacity-0"
    /></form>
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
      <el-form-item label="玩法名称：" prop="name">
        <el-input v-model="formData.name" placeholder="请输入" />
      </el-form-item>
      <el-col :span="24">
        <el-form-item label="玩法图标" prop="coverId">
          <el-input
            readonly
            v-model="formData.fileName"
            class="!w-500px cursor-pointer"
            placeholder="请上传"
          >
            <template #append>
              <div @click="onUploadFiles(6, 1)">上传文件</div>
            </template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-form-item label="内容：" prop="ruler">
        <Editor v-model="formData.ruler" height="150px" />
      </el-form-item>

      <el-col :span="24">
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="true">上架</el-radio>
            <el-radio :label="false">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as Api from './index'
import dayjs from 'dayjs'

defineOptions({ name: 'ProductPropertyForm' })

const props = defineProps({
  dialogValue: Object
})

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const emit = defineEmits(['success'])
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const formData = ref({
  id: '',
  name: '',
  icon: '',
  content: '',
  status: true,
  fileName: ''
})

const formRef = ref() // 表单 Ref
const dialogTitle = ref('')

/** 打开弹窗 */
const open = async (type, row) => {
  console.log('123123123123', props.dialogValue)
  dialogVisible.value = true
  dialogTitle.value = type

  formData.value = props.dialogValue

  // resetForm()
  // if (row) {
  //   formData.value.id = row.id
  //   getNoticeGet()
  // }
  // getNoticeList()
  // getNoticeListcategory()
}

const formRules = reactive({
  name: [{ required: true, message: '玩法名称不能为空', trigger: 'blur' }]
  // brief: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  // content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  // type: [{ required: true, message: '推送设备类型不能为空', trigger: ['blur', 'change'] }],
  // pushTime: [{ required: true, message: '推送时间不能为空', trigger: 'blur' }]
})

const noticeOptions = ref([])

const categoryOptions = ref([])

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  console.log('11111', formData.value)

  const param = {
    id: formData.value.id,
    name: formData.value.name,
    ruler: formData.value.ruler,
    status: formData.value.status,
    fileName: formData.value.fileName,
    icon: formData.value.fileUrl
  }

  try {
    await Api.uploadInterestApi(param).then((e) => {
      if (e) {
        message.success('修改成功')
        emit('success')
        dialogVisible.value = false
      }
    })
  } finally {
    formLoading.value = false
  }
}

//! 文件上传
const refType = ref()
const type = ref()
const accept = ref()
const fileInput = ref()
const DataForm = ref()
const onUploadFiles = (w, k) => {
  refType.value = w
  type.value = k
  if (w === 4) {
    accept.value = 'image/*'
  } else {
    accept.value = '*/*'
  }
  setTimeout(() => {
    fileInput.value.click()
  }, 0)
}
const handleVideoChange = async (event) => {
  let files = event.target.files[0]
  let _fd = new FormData()
  _fd.append('file', files)
  _fd.append('type', type.value)
  _fd.append('refType', refType.value)
  DataForm.value.reset()
  let res = await Api.upload(_fd)
  if (res.code === 0) {
    if (refType.value === 6) {
      // formData.value.coverId = res.data.id
      formData.value.fileName = res.data.fileName
      formData.value.fileUrl = res.data.fileUrl
    }
  }
}

const getNoticeGet = async () => {
  let res = await NotifyApi.noticeGet({ id: formData.value.id })
  formData.value = res
  formData.value.url = res.url.split(',')
  formData.value.pushTime = dayjs(res.pushTime).format('YYYY-MM-DD HH:mm:ss')
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
}

const getNoticeList = async () => {
  let res = await NotifyApi.noticeList({})
  noticeOptions.value = res
}

const getNoticeListcategory = async () => {
  let res = await NotifyApi.noticeListcategory({})
  categoryOptions.value = res
}
</script>
