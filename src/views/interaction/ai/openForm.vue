<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <form ref="DataForm">  <input type="file"   ref="fileInput" :accept="accept"  @change="handleVideoChange"  class="opacity-0"/></form>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row>
    <el-col :span="24">
      <el-form-item label="角色昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入角色昵称" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="角色封面" prop="coverId">
        <el-input
     readonly
      v-model="formData.coverName"
      class="!w-500px cursor-pointer"
      placeholder="请上传"
    >
      <template #append>
        <div @click="onUploadFiles(4,1)">上传文件</div>
      </template>
    </el-input>
      </el-form-item>  
    </el-col>
	<el-col :span="24">
	  <el-form-item label="形象类型" prop="titleId">
     <el-select v-model="formData.titleId" >
	      <el-option :value="item.id" :label="item.titleName"  v-for="(item, index) in allHomeTitleList" :key="index"/>
	      
	    </el-select>
	  </el-form-item>
	</el-col>
	<el-col :span="24">
	  <el-form-item label="内容" prop="contentId">
      <el-input
    readonly
    v-model="formData.contentName"
      class="!w-500px cursor-pointer"
      placeholder="请上传"
    >
      <template #append>
        <div @click="onUploadFiles(5,3)">上传文件</div>
      </template>
    </el-input>
	  </el-form-item>
	</el-col>
  <el-col :span="24">
	  <el-form-item label="角色状态" prop="enable">
	    <el-radio-group v-model="formData.enable">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">停用</el-radio>
      </el-radio-group>
	  </el-form-item>
	</el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import * as beginnerTutorialApi from '@/api/notify/beginnerTutorial/index'
import * as aiApi from '@/api/notify/ai/index'
const { t } = useI18n() 
const message = useMessage() 
const dialogVisible = ref(false) 
const dialogTitle = ref('') 
const formLoading = ref(false)
const fileInput = ref()
const refType = ref()
const type = ref()
const formData = ref({
  id:'',
  nickname:'',
  contentName:'',
  coverName:'',
  enable:1,
  contentId:'',
  coverId:'',
  titleId:''
})
const formRules = reactive({
  nickname: [{ required: true, message: '角色昵称不能为空', trigger: 'blur' }],
  titleId: [{ required: true, message: '形象类型不能为空', trigger: 'blur' }],
  enable: [{ required: true, message: '角色状态不能为空', trigger: 'blur' }],
  contentId: [{ required: true, message: '内容不能为空', trigger: 'change' }],
  coverId: [{ required: true, message: '角色封面不能为空', trigger: 'change' }],
 
})
const formRef = ref() // 表单 Ref

const DataForm = ref()

const accept=  ref()

const allHomeTitleList = ref([])

/** 打开弹窗 */
const open = async (type: string, row?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type
  getAllHomeTitle()
  // 修改时，设置数据
  if (row) {
    formData.value = row
    formData.value.coverId = row.cover.id
    formData.value.contentId = row.content.id
    formData.value.coverName = row.cover.fileName
    formData.value.contentName = row.content.fileName
    
  }else{
    resetForm()
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
    if (formData.value.id) {
       await aiApi.aifigureUpdate({...formData.value})
      message.success(t('common.updateSuccess'))
    } else {
      await aiApi.aifigureCreate({...formData.value})
      message.success(t('common.createSuccess'))
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
    id:'',
    nickname:'',
  enable:1,
  contentId:'',
  contentName:'',
  coverName:'',
  coverId:'',
  titleId:''
  }
  formRef.value?.resetFields()
}

const handleVideoChange = async(event) => {
  let files = event.target.files[0];
  let formdata=new FormData();
formdata.append("file",files);
formdata.append("type",type.value);
formdata.append("refType",refType.value);
DataForm.value.reset();
let res =  await beginnerTutorialApi.upload(formdata)
  if(res.code ===0){
    if(refType.value ===4){
      formData.value.coverId = res.data.id
      formData.value.coverName = res.data.fileName

    }else if(refType.value ===5){
      formData.value.contentId = res.data.id
      formData.value.contentName = res.data.fileName
    }
   
    
  }
};


const getAllHomeTitle = async ()=>{
  try {
    const data = await equipmentManagementApi.getAllHomeTitle({})
    allHomeTitleList.value = data
  
  } catch (error) {
    
  }
}
const  onUploadFiles  =(w,k)=>{
  refType.value = w
  type.value = k
  if(w===4){
    accept.value = "image/*"
  }else{
    accept.value = "*/*"
  }
  setTimeout(() => {
    fileInput.value.click()
  }, 0);
  
}
</script>
