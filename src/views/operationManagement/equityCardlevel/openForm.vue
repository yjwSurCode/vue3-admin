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
        <el-col :span="24">
          <el-form-item label="分类ID" >
            <el-input v-model="formData.id" placeholder="请输入设备ID" />
          </el-form-item>
        </el-col>
    <el-col :span="24">
      <el-form-item label="权益卡等级" prop="name">
        <el-input v-model="formData.name" placeholder="请输入权益卡等级" />
      </el-form-item>
    </el-col>
    
	<el-col :span="24">
	  <el-form-item label="等级排序" prop="name">
	    <el-input-number v-model="formData.num" :min="1" :max="10" />
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
	 
      </el-row>
    </el-form>
	
	
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import * as ClueApi from '@/api/crm/clue'
import * as AreaApi from '@/api/system/area'
import { defaultProps } from '@/utils/tree'
import * as UserApi from '@/api/system/user'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const areaList = ref([]) // 地区列表
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表
const formData = ref({
  id: undefined,
  name: undefined,
  contactNextTime: undefined,
  ownerUserId: 0,
  mobile: undefined,
  telephone: undefined,
  qq: undefined,
  wechat: undefined,
  email: undefined,
  areaId: undefined,
  detailAddress: undefined,
  industryId: undefined,
  level: undefined,
  source: undefined,
  remark: undefined,
  status:'1'
})

const radio1 = ref('1')
const formRules = reactive({
  name: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  ownerUserId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type
  formType.value = type
  // resetForm()
  // // 修改时，设置数据
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
  // try {
  //   const data = formData.value as unknown as ClueApi.ClueVO
  //   if (formType.value === 'create') {
  //     await ClueApi.createClue(data)
  //     message.success(t('common.createSuccess'))
  //   } else {
  //     await ClueApi.updateClue(data)
  //     message.success(t('common.updateSuccess'))
  //   }
  //   dialogVisible.value = false
  //   // 发送操作成功的事件
  //   emit('success')
  // } finally {
  //   formLoading.value = false
  // }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    contactNextTime: undefined,
    ownerUserId: 0,
    mobile: undefined,
    telephone: undefined,
    qq: undefined,
    wechat: undefined,
    email: undefined,
    areaId: undefined,
    detailAddress: undefined,
    industryId: undefined,
    level: undefined,
    source: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
