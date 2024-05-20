<!-- 商品发布 - 库存价格 - 添加属性 -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <el-form
ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules">
     
      <el-form-item label="推送标题：" prop="title">
        <el-input
        v-model="formData.title"
      placeholder="请输入"
    />
      </el-form-item>
      <el-form-item label="简介：" prop="brief">
        <el-input
        v-model="formData.brief"
type="textarea"
      placeholder="请输入内容"
    />
      </el-form-item>


      <el-form-item label="内容：" prop="content">
        <Editor  v-model="formData.content" height="150px" />
      </el-form-item>
      


    <el-form-item label="跳转连接：" >
      <el-radio-group  v-model="formData.urlType">
          <el-radio label="1">站内商品跳转</el-radio>
          <el-radio label="2">站内功能跳转</el-radio>
          <el-radio label="3">站外资源跳转</el-radio>
  </el-radio-group>
  <el-cascader :options="categoryOptions" v-model="formData.url" :props="{label:'name',value:'id'}"   class="!w-350px" v-if="formData.urlType ==='1'"/>
          <el-cascader :options="noticeOptions"  v-model="formData.url"  :props="{label:'name',value:'url'}" class="!w-350px"  v-if="formData.urlType ==='2'"/>
          <el-input
          v-model="formData.url" 
          v-if="formData.urlType ==='3'"
          class="mt-1 !w-350px"
      placeholder="请输入"
    >
    <template #prepend>
      Http://
      </template>
      <template #append>.com</template>
    </el-input>
      </el-form-item>
      
      <el-form-item label="推送设备类型" prop="type">
        <el-radio-group v-model="formData.type" >
      <el-radio  :label="0" size="large">APP端</el-radio>
      <el-radio  :label="1" size="large">设备端</el-radio>
    </el-radio-group>

      </el-form-item>

      <el-form-item label="推送时间" prop="pushTime">
        <el-date-picker
        v-model="formData.pushTime"
        type="datetime"
        placeholder="请选择"
        format="YYYY-MM-DD HH:mm:ss"
        valueFormat="YYYY-MM-DD HH:mm:ss"
      />
      </el-form-item>

      
    
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
 import * as NotifyApi from '@/api/notify/InformationNotificationNotify/index'
import dayjs from 'dayjs';

defineOptions({ name: 'ProductPropertyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const emit = defineEmits(['success']) 
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const formData = ref({
  id:'',
  title:'',
  brief:'',
  content:'',
  type:null,
  status:0,
  urlType:'',
  url:'',
  pushTime:''
})

const formRef = ref() // 表单 Ref

const dialogTitle = ref('')

/** 打开弹窗 */
const open = async (type,row) => {
  dialogVisible.value = true
  dialogTitle.value = type
  resetForm()
  if(row){
    formData.value.id = row.id
    getNoticeGet()
  }
  getNoticeList()
  getNoticeListcategory()
 
}

const formRules = reactive({
  title: [{ required: true, message: '推送标题不能为空', trigger: 'blur' }],
  brief: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  type:[{ required: true, message: '推送设备类型不能为空',   trigger: ['blur', 'change']}],
  pushTime:[{ required: true, message: '推送时间不能为空', trigger: 'blur' }]
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
  try {
    if(formData.value.id){
      await NotifyApi.noticeUpdate({
        ...formData.value,
        url:formData.value?.url.join(',')
      })
      message.success('修改成功')
    }else{
      await NotifyApi.noticeCreate({
      ...formData.value,
      url:formData.value?.url.join(',')
    })
    message.success(t('common.createSuccess'))
    }
    emit('success')
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}


const getNoticeGet = async ()=>{
    let res =    await NotifyApi.noticeGet({id:formData.value.id})
    formData.value = res
   formData.value.url = res.url.split(',')
    formData.value.pushTime = dayjs(res.pushTime).format('YYYY-MM-DD HH:mm:ss')
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id:'',
  title:'',
  brief:'',
  content:'',
  type:null,
  status:0,
  urlType:'',
  url:'',
  pushTime:''
  }
  formRef.value?.resetFields()
}

const getNoticeList = async ()=>{
  let res =  await NotifyApi.noticeList({})
  noticeOptions.value  = res
}


const getNoticeListcategory = async ()=>{
  let res = await NotifyApi.noticeListcategory({})
  categoryOptions.value = res
}

</script>
