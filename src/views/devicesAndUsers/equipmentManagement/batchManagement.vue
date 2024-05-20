<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="720px">
	  <!-- <div class="flex justify-between">
		  <el-button type="primary" @click="onPreviewContents">导入</el-button>
		  <el-button type="primary">导出当前筛选内容</el-button>
	  </div> -->
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="导出页面" prop="name">
            <el-radio-group v-model="status" class="ml-4">
		        <el-radio label="1" size="large">全部导出</el-radio>
		        <el-radio label="2" size="large" >
              <div v-if="status ==='2'">
                从  <el-input-number v-model="pageNo"  /> 到
              <el-input-number  v-model="pageSize" /></div>
                <div v-else> </div>
            </el-radio>
		      </el-radio-group>
          </el-form-item>
        </el-col>
    <el-col :span="24">
      <el-form-item label="已选字段" prop="name">
<div>

  <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    全选
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedCities"
    @change="handleCheckedCitiesChange"
  >
    <el-checkbox v-for="city in cities" :key="city.value" :label="city.value" :value="city.value">
      {{ city.text }}
    </el-checkbox>
  </el-checkbox-group>
</div>

      </el-form-item>
    </el-col>
    
      </el-row>
    </el-form>
	<el-button class="mt-2" type="primary" link @click="onDownload">导入模板下载</el-button>
  <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">导出</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import download from '@/utils/download';
import qs from 'qs';
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用



const formRef = ref() // 表单 Ref

const pageNo = ref(1)

const pageSize = ref(10)

const formData = ref({})

const status = ref('2')

const deviceId = ref('')

const deviceType = ref('')

const deviceFlow = ref('')

const total = ref(0)
const formRules = reactive({
  // name: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  // ownerUserId: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string,queryParams:any) => {
  dialogVisible.value = true
  dialogTitle.value = type
  deviceId.value =  queryParams.deviceId
  deviceType.value =  queryParams.deviceType
  deviceFlow.value =  queryParams.deviceFlow
  pageNo.value = queryParams.pageNo
  pageSize.value = queryParams.pageSize
  total.value = queryParams.total
}

const submitForm = async ()=>{
  let pageSizes =  status.value ==='1'? total.value : pageSize.value // *20
  let params =   qs.stringify({fieldList:checkedCities.value,
    pageNo: pageNo.value,
  pageSize:pageSizes,
  deviceId: deviceId.value,
  deviceType: deviceType.value,
  deviceFlow: deviceFlow.value
  },{arrayFormat:'repeat',allowDots:true})
  let res =  await equipmentManagementApi.dynamicExport(params)
   download.excel(res, '设备管理列表.xlsx')
}

const onDownload = async ()=>{
   let res =  await equipmentManagementApi.getImportTemplate({})
   download.excel(res, '设备管理.xlsx')
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const emit = defineEmits(['success']) 


const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref(['deviceId', 'hardwareCode', 'qrCodeUrl', 'deviceFlow','hardwareVendor', 'deviceType', 'remark'])
const cities = [{text:'设备ID',value:'deviceId'}, {text:'硬件码',value:'hardwareCode'},{text:'二维码',value:'qrCodeUrl'},{text:'设备状态',value:'deviceFlow'},{text:'硬件厂商名称',value:'hardwareVendor'} ,{text:'设备型号名称',value:'deviceType'} ,{text:'备注',value:'remark'}]

const handleCheckAllChange = (val: boolean) => {
  checkedCities.value = val ? checkedCities.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}
</script>
