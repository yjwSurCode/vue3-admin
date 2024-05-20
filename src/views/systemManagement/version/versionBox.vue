<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    > 
      <el-form-item label="版本号:" prop="version">
        <el-input
        v-model="formData.version" />
      </el-form-item>
      <el-form-item label="变更说明:" prop="explainText">
        <el-input
        type="textarea" :rows="5"
        v-model="formData.explainText" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="推送设备类型:" prop="pushDeviceType">
        <el-radio-group v-model="formData.pushDeviceType">
          <el-radio label="App端">App端</el-radio>
          <el-radio label="设备端">设备端(宝贝端)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传APK文件:" prop="apkFile">
        <el-input
            v-model="formData.apkFile"
            clearable :disabled="formData.pushDeviceType!='设备端'"
        >
            <template #append>
                <div class="upload-img-btn">
                    <input
                      id="upload"
                      type="file"
                      class="upload-input"
                      :disabled="formData.pushDeviceType!='设备端'"
                      @change="uploadChange"
                  />
                  上传文件
                </div>
            </template>
        </el-input>

      </el-form-item>
      <el-form-item label="指定设备:" prop="deviceIds">
        <el-input :disabled="formData.pushDeviceType!='设备端'" v-model="formData.deviceIds" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item label="更新力度:" prop="renewIntensity">
        <el-radio-group :disabled="formData.pushDeviceType!='设备端'" v-model="formData.renewIntensity">
          <el-radio :label="0">强制更新</el-radio>
          <el-radio :label="1">弱更新</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="指定版本:" prop="designate">
        <el-select multiple :disabled="formData.pushDeviceType!='设备端'" v-model="formData.designate" placeholder="请选择">
          <el-option
            v-for="item in verList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本状态:" prop="versionStatus">
        <el-radio-group v-model="formData.versionStatus">
          <el-radio :label="0">当前版本</el-radio>
          <el-radio :label="1">已发布</el-radio>
          <el-radio :label="2">测试版本</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 认</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as versionApi from '@/api/xuandou/version/index'

defineOptions({ name: 'PayAppForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  version: undefined,
  explainText: undefined,
  pushDeviceType: undefined,
  versionStatus: undefined,
  createTime: undefined,
  remark: undefined,
  apkFile: undefined,
  deviceIds: undefined,
  renewIntensity: undefined,
  designate: undefined
})

const verList = ref([
  {value: '1', label: '版本号一'},
  {value: '2', label: '版本号二'},
])

const formRules = reactive({
  version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
  versionStatus: [{ required: true, message: '版本状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('版本' + type)
  formType.value = type
  resetForm()
  
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await versionApi.getVersionDetail({id})
      formData.value.designate = formData.value.designate!=''?formData.value.designate.split(','): [];
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const uploadChange = async (e) => {
  formData.value.apkFile = e.target.value;
}

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
    formData.value.designate = formData.value.designate.join(',');
    const data = formData.value;
    if (formType.value === '添加') {
      await versionApi.addVersion(data)
      message.success(t('common.createSuccess'))
    } else {
      await versionApi.updateVersion(data)
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
    version: undefined,
    explainText: undefined,
    pushDeviceType: undefined,
    versionStatus: undefined,
    createTime: undefined,
    remark: undefined,
    apkFile: undefined,
    deviceIds: undefined,
    renewIntensity: undefined,
    designate: undefined
  }
  formRef.value?.resetFields()
}
</script>

<style scoped>
.upload-img-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.img-scan {
  display: block;
  width: 32px;
  height: 32px;
}
.upload-input {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  outline: medium none;
  cursor: pointer;
  -moz-opacity: 0;
  opacity: 0;
  filter: alpha(opacity=0);
}
::v-deep .el-input-group__append {
  background-color: #fff;
  padding: 0 10px;
  border: none;
}
::v-deep .el-input__inner {
  border: none;
}
::v-deep .el-form-item__content .el-input-group {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}

</style>
