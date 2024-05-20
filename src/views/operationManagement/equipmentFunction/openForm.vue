<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="90px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品ID" >
            <el-input  v-model="formData.id" placeholder="请输入商品ID" />
          </el-form-item>
        </el-col>
    <el-col :span="24">
      <el-form-item label="功能名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入功能名称" />
      </el-form-item>
    </el-col>	
	<el-col :span="24">
	  <el-form-item label="状态" prop="status">
		  <el-radio-group v-model="formData.status" class="ml-4">
		        <el-radio label="1" size="large">上架</el-radio>
		        <el-radio label="2" size="large">下架</el-radio>
		      </el-radio-group>
	  </el-form-item>
	</el-col>
		<el-col :span="24">
		  <el-form-item label="是否收费" prop="fee">
			  <el-radio-group v-model="formData.fee" class="ml-4">
			   <div class="flex"> 
			   
				   <el-radio label="1" size="large">是</el-radio>
				      <el-input :disabled="!(formData.fee==='1')" size="small" placeholder="请输入炫兜币金额" class="ml-4">
						  <template #append>币</template>
					  </el-input>
					  <el-input :disabled="!(formData.fee==='1')" size="small"  class="mr-4">
					  						  <template #append>元</template>
					  </el-input>
					  	 <el-radio label="2" size="large">否</el-radio>
			   </div>

			      </el-radio-group>
		  </el-form-item>
		</el-col>
	
	 <el-col :span="24">
	   <el-form-item label="备注" prop="remarks">
		   	    <el-input type="textarea" v-model="formData.remarks" placeholder="请输入备注" />
	   </el-form-item>
	 </el-col>
	 <el-col :span="24">
	   <el-form-item label="操作记录">
		<el-table v-loading="loading" :data="[]">
      <el-table-column label="操作时间" align="center" prop="id" width="150" />
      <el-table-column label="操作人员" align="center" prop="p1rice" width="150"/>
      <el-table-column label="操作内容" align="center" prop="pri1ce" width="150"/>
	   <el-table-column label="备注" align="center" prop="pri1ce" width="180"/>
    </el-table>
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
import * as UserApi from '@/api/system/user'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const areaList = ref([]) // 地区列表
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表

const formData = ref({
	id:'',
	name:'',
	status:'1',
	fee:'1',
	remarks:''
})
const formRules = reactive({
  name: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  remarks: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  fee:[{ required: true, message: '负责人不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type
  formType.value = type
  // resetForm()
  // 修改时，设置数据
  // if (id) {
  //   formLoading.value = true
  //   try {
  //     formData.value = await ClueApi.getClue(id)
  //   } finally {
  //     formLoading.value = false
  //   }
  // }
  // // 获得地区列表
  // areaList.value = await AreaApi.getAreaTree()
  // // 获得用户列表
  // userOptions.value = await UserApi.getSimpleUserList()
  // // 默认新建时选中自己
  // if (formType.value === 'create') {
  //   formData.value.ownerUserId = useUserStore().getUser.id
  // }
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
    const data = formData.value as unknown as ClueApi.ClueVO
    if (formType.value === 'create') {
      await ClueApi.createClue(data)
      message.success(t('common.createSuccess'))
    } else {
      await ClueApi.updateClue(data)
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
  formRef.value?.resetFields()
}
</script>
