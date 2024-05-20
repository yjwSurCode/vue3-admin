<!-- 商品发布 - 基础设置 -->
<template>
  <el-form ref="formRef" :disabled="isDetail" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="商品ID" prop="id">
      <el-input v-model="formData.id" class="w-80!" placeholder="系统生成" />
    </el-form-item>
    <el-form-item label="商品属性" prop="type">
      <el-radio-group v-model="formData.type">
        <el-radio label="0">虚拟商品</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="商品主图" prop="mainPic">
      <UploadImg v-model="formData.mainPic" :disabled="isDetail" />
    </el-form-item>
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="formData.name" class="w-80!" placeholder="请输入商品名称" />
    </el-form-item>
    <el-form-item label="详情页主图" prop="detailPic">
      <UploadImgs v-model="formData.detailPic" :disabled="isDetail" :limit="6">
        <template #empty>
              <Icon icon="ep:plus" />
              <div class="h-20px">点击上传图片</div>
              <div class="h-20px">最多上传6张</div>
        </template>
      </UploadImgs>
    </el-form-item>
    <el-form-item label="商品状态" prop="status">
      <el-radio-group v-model="formData.status">
        <el-radio label="1">上架</el-radio>
        <el-radio label="0">下架</el-radio>
      </el-radio-group>
    </el-form-item>
    <!--富文本编辑器组件-->
    <el-form-item label="商品介绍" prop="introduce">
      <Editor v-model="formData.introduce" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import type { Spu } from '@/api/mall/product/spu'

defineOptions({ name: 'ProductSpuInfoForm' })
const props = defineProps({
  propFormData: {
    type: Object as PropType<Spu>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})

const message = useMessage() // 消息弹窗

const formRef = ref() // 表单 Ref
const formData = reactive({
  id: "", // id
  name: "", // 名称
  type: "", //  属性
  mainPic: "",  // 主图
  detailPic: "",  // 详情图
  status: '1',  // 状态
  introduce: "",  // 介绍
  courseInfo: {
    isRecommend: true,  // 是否推荐
    class: [], //  分类
    specInfo: [], // 规格信息
  }
})
const rules = reactive({
  name: [required],
  type: [required],
  mainPic: [required],
  detailPic: [required],
  status: [required],
  introduce: [required]
})

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  if (!formRef) return
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【基本设置】不完善，请填写相关信息')
    emit('update:activeName', 'info')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 初始化 */
onMounted(async () => {
  
})
</script>
