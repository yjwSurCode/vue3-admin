<!-- 商品发布 - 库存价格 - 添加属性 -->
<template>
  <Dialog v-model="dialogVisible" title="内容" width="520px">
    <el-form>
      <el-input
        v-model="formData.content"
        disabled
        :autosize="{ minRows: 8, maxRows: 12 }"
        type="textarea"
        placeholder="内容"
      />
    </el-form>
    <template #footer>
      <el-button @click="submitForm">编 辑</el-button>
      <el-button :disabled="formLoading" type="primary" @click="dialogVisible = false"
        >确 定</el-button
      >
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ProductPropertyForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const formData = ref({})

const emit = defineEmits(['success'])

/** 打开弹窗 */
const open = (row) => {
  dialogVisible.value = true
  formData.value = row
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  dialogVisible.value = false
  emit('success', formData.value)
}
</script>
