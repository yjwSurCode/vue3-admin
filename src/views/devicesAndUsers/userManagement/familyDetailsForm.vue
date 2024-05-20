<template>
  <Dialog v-model="dialogVisible" title="账号变更" width="30%">
    <div class="mb-3">注意：在账号变更前，必须向用户告知。变更后的账户将取代原账户的所有属性和权限。</div>
	<el-form
	  ref="formRef"
	  v-loading="formLoading"
	  :model="formData"
	  :rules="formRules"
	>
	  
	  <el-row>
		  <!-- 手机号 -->
		        <el-col :span="24" >
		          <el-form-item prop="mobileNumber">
		            <el-input
					v-model="formData.mobileNumber"
		              placeholder="请输入新的手机号"
		              :prefix-icon="iconCellphone"
		            />
		          </el-form-item>
		        </el-col>
		       <!-- 验证码 -->
		        <el-col :span="24">
		          <el-form-item prop="code">
		            <el-row :gutter="5" justify="space-between" style="width: 100%">
		              <el-col :span="24">
		                <el-input
		                  v-model="formData.mobileCode"
		                  :prefix-icon="iconCircleCheck"
		                >
		                  <template #append>
		                    <span
		                      v-if="mobileCodeTimer <= 0"
		                      class="getMobileCode"
		                      style="cursor: pointer"
		                      @click="getSmsCode"
		                    >
		                      请向用户索取验证码
		                    </span>
		                    <span v-if="mobileCodeTimer > 0" class="getMobileCode" style="cursor: pointer">
		                      {{ mobileCodeTimer }}秒后可重新获取
		                    </span>
		                  </template>
		                </el-input>
		                <!-- </el-button> -->
		              </el-col>
		            </el-row>
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
import { useIcon } from '@/hooks/web/useIcon'
import {  sendSmsCode } from '@/api/login'
import * as UserApi from '@/api/system/user'
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const iconCircleCheck = useIcon({ icon: 'ep:circle-check' })
const iconCellphone = useIcon({ icon: 'ep:cellphone' })
const mobileCodeTimer = ref(0)
const formData = ref({
  mobileCode: null,
  mobileNumber: '',
	id:'',
	username:''
 
})
const formRules = reactive({
  mobileNumber: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  mobileCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id,username) => {
  dialogVisible.value = true
	formData.value.id = id 
	formData.value.username = username
}

const getSmsCode = async () => {
	 // 校验表单
	 if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  await sendSmsCode({mobile:formData.value.mobileNumber,scene:18}).then(async () => {
    message.success('验证码已发送')
    // 设置倒计时
    mobileCodeTimer.value = 60
    let msgTimer = setInterval(() => {
      mobileCodeTimer.value = mobileCodeTimer.value - 1
      if (mobileCodeTimer.value <= 0) {
        clearInterval(msgTimer)
      }
    }, 1000)
  })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
		let res =  await equipmentManagementApi.validateSmsCode({
		mobile: formData.value.mobileNumber,
  scene: 18,
  code: formData.value.mobileCode
	})
	if(res){
		await UserApi.updateUser({
		mobile:formData.value.mobileNumber,
		id:formData.value.id,
		username:formData.value.username
	})
	message.confirm('变更成功，告知用户使用新账号登录','成功')
    dialogVisible.value = false
	}
	
  } finally {
    formLoading.value = false
  }
}


</script>
