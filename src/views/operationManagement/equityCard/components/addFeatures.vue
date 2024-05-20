<!-- 商品发布 - 库存价格 - 添加属性 -->
<template>
  <Dialog v-model="dialogVisible" title="选择添加的功能">
    <el-table v-loading="loading" :data="list">
      <el-table-column type="selection" width="55" />
      <el-table-column label="功能ID" align="center" prop="id" />
      <el-table-column label="功能名称" align="center" prop="p1rice"/>
      <el-table-column label="价格(￥)" align="center" prop="pri1ce"/>
        
    </el-table>
    <template #footer>
      <el-button :disabled="loading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as PropertyApi from '@/api/mall/product/property'

defineOptions({ name: 'ProductPropertyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 表单的加载中
const formData = ref({
  name: ''
})

const formRef = ref() // 表单 Ref
const attributeList = ref([]) // 商品属性列表

const list = ref([])
const props = defineProps({
  propertyList: {
    type: Array,
    default: () => {}
  }
})

watch(
  () => props.propertyList, // 解决 props 无法直接修改父组件的问题
  (data) => {
    if (!data) return
    attributeList.value = data
  },
  {
    deep: true,
    immediate: true
  }
)

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm =  () => {
  loading.value = false
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    name: ''
  }
  formRef.value?.resetFields()
}
</script>
