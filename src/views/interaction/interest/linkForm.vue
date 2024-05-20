<!-- 商品发布 - 库存价格 - 添加属性 -->
<template>
  <Dialog v-model="dialogVisible" title="跳转连接" width="520px">
    <el-form>
   
    <el-form-item label="站内商品跳转："  v-if="formData.urlType==='1'">
      <el-cascader :options="categoryOptions"   v-model="formData.url"  disabled :props="{label:'name',value:'id'}" class="w-100%" />
        
      </el-form-item>
      <el-form-item label="站内功能跳转："  v-if="formData.urlType==='2'">
      <el-cascader :options="noticeOptions"   v-model="formData.url" disabled :props="{label:'name',value:'url'}"  class="w-100%" />
        
      </el-form-item>
      <el-form-item label="站外资源跳转："  v-if="formData.urlType==='3'">
        <el-input
        disabled
          v-model="formData.url"
      placeholder="请输入"
    >
    <template #prepend>
      Http://
      </template>
      <template #append>.com</template>
    </el-input>
        
      </el-form-item>
    
    </el-form>
    <template #footer>
      <el-button @click="submitForm">编 辑</el-button>
      <el-button :disabled="formLoading" type="primary"   @click="dialogVisible = false">确 定</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
 import * as NotifyApi from '@/api/notify/InformationNotificationNotify/index'
 import { isString } from 'lodash-es';
defineOptions({ name: 'ProductPropertyForm' })

const emit = defineEmits(['success']) 
const noticeOptions = ref([])

const categoryOptions = ref([])
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const formData = ref({

})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row) => {
  formData.value = row
  if(isString(row.url)){
    formData.value.url = row.url.split(',')
  }
  dialogVisible.value = true
  getNoticeList()
  getNoticeListcategory()
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  dialogVisible.value = false
  emit('success',formData.value)
}

/** 重置表单 */
const resetForm = () => {
  
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
