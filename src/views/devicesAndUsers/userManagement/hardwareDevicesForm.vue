<template>
  <Dialog v-model="dialogVisible" title="数据迁移" width="30%">
    <div class="mb-3">注意：在迁移前，必须向用户告知。迁移后的设备将取代原设备的所有属性和权限。</div>
	<el-form
	  ref="formRef"
	  v-loading="formLoading"
	  :model="formData"
	  :rules="formRules"
	>
	  
	  <el-row>
		  <!-- 请输入新的设备号 -->
		        <el-col :span="24" >
		          <el-form-item prop="newDeviceId">
		            <el-input
					v-model="formData.newDeviceId"
		              placeholder="请输入新的设备号"
		              :prefix-icon="iconCellphone"
		            />
		          </el-form-item>
		        </el-col>
	  </el-row>
	</el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import { useIcon } from '@/hooks/web/useIcon'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const iconCellphone = useIcon({ icon: 'ep:upload' })
const formData = ref({
  newDeviceId:'',
  deviceId:''
 
})
const formRules = reactive({
  newDeviceId: [{ required: true, message: '设备号不能为空', trigger: 'blur' }],
  
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (deviceId) => {
  dialogVisible.value = true
formData.value.deviceId = deviceId
 
}


defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
	 let res =  await equipmentManagementApi.migrate(formData.value)
   if(res){
    message.confirm('迁移成功，告知用户重新启用新设备','成功').then(()=>{
	 message.confirm('此操作将影响用户正常使用，是否执行','注意').then(()=>{
	 })
  })
   }
  
  } finally {
    formLoading.value = false
  }

  // 提交请求
  formLoading.value = true
  try {
 
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}


</script>
