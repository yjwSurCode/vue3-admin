<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row>
        <!-- <el-col :span="24">
          <el-form-item label="设备ID" prop="deviceId">
            <el-input v-model="formData.deviceId" placeholder="请输入设备ID" />
          </el-form-item>
        </el-col> -->
    <el-col :span="24">
      <el-form-item label="硬件码" prop="hardwareCode">
        <el-input v-model="formData.hardwareCode" placeholder="请输入硬件码" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="二维码" prop="qrCodeUrl">
        <UploadImg v-model="formData.qrCodeUrl" :limit="1" :is-show-tip="false" />
      </el-form-item>  
    </el-col>
	<el-col :span="24">
	  <el-form-item label="设备状态" >
     <el-select v-model="formData.deviceFlow" disabled>
	      <el-option :value="item.value" :label="item.label"  v-for="(item, index) in deviceFlowList" :key="index"/>
	      
	    </el-select>
	  </el-form-item>
	</el-col>
	<el-col :span="24">
      <el-form-item label="设备厂商" prop="hardwareVendor">
        <el-input v-model="formData.hardwareVendor" placeholder="请输入设备厂商" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="设备型号" prop="deviceType">
        <el-input v-model="formData.deviceType" placeholder="请输入设备型号" />
      </el-form-item>
    </el-col>
	<el-col :span="24">
	  <el-form-item label="备注" >
	    <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
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
import {deviceFlowList } from "./constant/index"
import {  getTenantId } from '@/utils/auth'
const { t } = useI18n() 
const message = useMessage() 
const dialogVisible = ref(false) 
const dialogTitle = ref('') 
const formLoading = ref(false)
const formData = ref({
  deviceId:'',
  hardwareCode:'',
  qrCodeUrl:'',
  deviceFlow:0,
  hardwareVendor:'',
  deviceType:'',
  remark:''
})
const formRules = reactive({
  hardwareCode: [{ required: true, message: '硬件码不能为空', trigger: 'blur' }],
  qrCodeUrl: [{ required: true, message: '二维码不能为空', trigger: 'blur' }],
  deviceFlow: [{ required: true, message: '设备状态不能为空', trigger: 'blur' }],
  hardwareVendor: [{ required: true, message: '设备厂商不能为空', trigger: 'blur' }],
  deviceType: [{ required: true, message: '设备型号不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, deviceId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type
  // 修改时，设置数据
  if (deviceId) {
    formLoading.value = true
    formData.value.deviceId = deviceId
    try {
      formData.value = await equipmentManagementApi.deviceManageGet({deviceId,tenantId:getTenantId()})
    } finally {
      formLoading.value = false
    }
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
    if (formData.value.deviceId) {
      await equipmentManagementApi.deviceManageUpdate({...formData.value})
      message.success(t('common.updateSuccess'))
    } else {
      await equipmentManagementApi.deviceManageAdd({...formData.value})
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
    deviceId:'',
  hardwareCode:'',
  qrCodeUrl:'',
  deviceFlow:0,
  hardwareVendor:'',
  deviceType:'',
  remark:''
  }
  formRef.value?.resetFields()
}
</script>
