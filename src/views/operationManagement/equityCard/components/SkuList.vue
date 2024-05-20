<template>
  <el-table
    v-if="!isDetail && !isActivityComponent"
    :data="isBatch ? skuList : formData!.skus!"
    border
    class="tabNumWidth w-99% overflow-x-scroll"
    max-height="500"
    size="small"
  >
    <el-table-column align="center" label="图片" min-width="65">
      <template #default="{ row }">
        <UploadImg v-model="row.picUrl" height="50px" width="50px" />
      </template>
    </el-table-column>
	<el-table-column
	        v-for="(item, index) in tableHeaders"
	        :key="index"
	        :label="item.label"
	        align="center"
	        width="120"
	      >
	       <template #default="{ row }">
	          <span v-if="row.properties"> 
              <!-- {{ row }} -->
	            {{ row.properties[index]?.valueName }}
	          </span>
	        </template>
	      </el-table-column>
	
    <el-table-column align="center" label="添加算力"   width="120">
      <template #default="{ row }">
        <el-radio-group v-model="row.radio">
 <el-radio label   @click.prevent="radioChange(null,row)"  size="large"/>
 </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column align="center" label="添加报告"   width="180">
      <template #default="{ row }">
        <el-checkbox-group v-model="row.checkList">
    <el-checkbox label="综合素质报告" value="综合素质报告" />
    <el-checkbox label="兴趣优势培养报告" value="兴趣优势培养报告" />
  </el-checkbox-group>
      </template>
    </el-table-column>
    <el-table-column align="center" label="添加解决方案"   width="180">
      <template #default="{ row }">
        <el-checkbox-group v-model="row.checkList2">
    <el-checkbox label="综合素质解决方案" value="综合素质解决方案" />
    <el-checkbox label="兴趣优势培养解决方案" value="兴趣优势培养解决方案" />
  </el-checkbox-group>
      </template>
    </el-table-column>
    <el-table-column align="center" label="添加功能" width="150">
      <template #default="{ row }">
        <el-button :icon="UploadFilled"  v-if="row"  @click="onAddFeatures">添加功能</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="添加商品" width="150">
      <template #default="{ row }">
        <el-button :icon="UploadFilled"  v-if="row"  @click="onAddFeatures">添加商品</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="成本价(币)" >
      <template #default="{ row }">
       <span>{{ row.costprice}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="商品折扣力度" width="150">
      <template #default="{ row }">
        <div class="flex">
          <el-input v-model="row.a" size="small" class="w-120px"/> <span class="ml-1">折</span>
        </div>
      </template>
    </el-table-column>
	
	<el-table-column align="center" label="有效期" width="150">
        <template #default="{ row }">
          <div class="flex">
          <el-input v-model="row.b"  class="w-120px"  size="small" /> <span class="ml-1">天</span>
        </div>
        </template>
      </el-table-column>  
	  <el-table-column align="center" label="炫兜币价格(币)" width="150">
      
	    <template #default="{ row }">
        <div class="flex">
        <el-input v-model="row.c"  class="w-120px"  size="small"  /> <span class="ml-1">币</span>
      </div>
	    </template>
	  </el-table-column>
	  <el-table-column align="center" label="人民币价格(￥)" width="150">
	    <template #default="{ row }">
	      <span>{{ row.costprice}}</span>
	    </template>
	  </el-table-column>

  </el-table>
  

   <!-- 商品属性添加 Form 表单 -->
   <addFeatures ref="addFeaturesRef"  />
</template>
<script lang="ts" setup>
import { PropType, Ref } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { UploadImg } from '@/components/UploadFile'
import type { Property, Sku, Spu } from '@/api/mall/product/spu'
import addFeatures from "./addFeatures.vue"
import { RuleConfig } from '@/views/mall/product/spu/components/index'
import { PropertyAndValues } from './index'
import { ElTable } from 'element-plus'
import {
  UploadFilled
} from '@element-plus/icons-vue'
defineOptions({ name: 'SkuList' })
const message = useMessage() // 消息弹窗
const props = defineProps({
  propFormData: {
    type: Object as PropType<Spu>,
    default: () => {}
  },
  propertyList: {
    type: Array as PropType<PropertyAndValues[]>,
    default: () => []
  },
  ruleConfig: {
    type: Array as PropType<RuleConfig[]>,
    default: () => []
  },
  isBatch: propTypes.bool.def(false), // 是否作为批量操作组件
  isDetail: propTypes.bool.def(false), // 是否作为 sku 详情组件
  isComponent: propTypes.bool.def(false), // 是否作为 sku 选择组件
  isActivityComponent: propTypes.bool.def(false) // 是否作为 sku 活动配置组件
})
const formData: Ref<Spu | undefined> = ref<Spu>() // 表单数据
const addFeaturesRef = ref()
const skuList = ref<Sku[]>([]) // 批量添加时的临时数据

const tableHeaders = ref<{ prop: string; label: string }[]>([]) // 多属性表头
/**
 * 保存时，每个商品规格的表单要校验下。例如说，销售金额最低是 0.01 这种。
 */
const validateSku = () => {
  let warningInfo = '请检查商品各行相关属性配置，'
  let validate = true // 默认通过
  for (const sku of formData.value!.skus!) {
    // 作为活动组件的校验
    for (const rule of props?.ruleConfig) {
      const arg = getValue(sku, rule.name)
      if (!rule.rule(arg)) {
        validate = false // 只要有一个不通过则直接不通过
        warningInfo += rule.message
        break
      }
    }
    // 只要有一个不通过则结束后续的校验
    if (!validate) {
      message.warning(warningInfo)
      throw new Error(warningInfo)
    }
  }
}
const getValue = (obj, arg) => {
  const keys = arg.split('.')
  let value = obj
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      value = undefined
      break
    }
  }
  return value
}

const emit = defineEmits<{
  (e: 'selectionChange', value: Sku[]): void
}>()
/**
 * 选择时触发
 * @param Sku 传递过来的选中的 sku 是一个数组
 */
/**
 * 将传进来的值赋值给 skuList
 */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) return
    formData.value = data
  },
  {
    deep: true,
    immediate: true
  }
)

/** 生成表数据 */
const generateTableData = (propertyList: any[]) => {
  console.log(propertyList)
  console.log(formData.value!.skus)
  // 构建数据结构
  const propertyValues = propertyList.map((item) =>
    item.values.map((v) => ({
      propertyId: item.id,
      propertyName: item.name,
      valueId: v.id,
      valueName: v.name
    }))
  )
  console.log(propertyValues)
  // let propertyValues:any = []
  // propertyList.forEach((item,index)=>{
  //   // let arr:any = []
  //   item.values.forEach(val=>{
  //     propertyValues.push({
  //       propertyId: val.id,
  //     propertyName: val.name,
  //     valueId: val.id,
  //     valueName: val.name,
  //     index
  //     })
  //   })
  //   // propertyValues.push(arr)
  // })
  // console.log(propertyValues)
  const buildSkuList = build(propertyValues)
  // // 如果回显的 sku 属性和添加的属性不一致则重置 skus 列表
  if (!validateData(propertyList)) {
    // 如果不一致则重置表数据，默认添加新的属性重新生成 sku 列表
    formData.value!.skus = []
  }
  if(!propertyValues.length){
    formData.value!.skus = []
  }
  console.log(buildSkuList)
  formData.value!.skus = []
  buildSkuList.forEach(item=>{
    const row = {
      properties: Array.isArray(item) ? item : [item]
    }
    //  const index = formData.value!.skus!.findIndex(
    //   (sku) => JSON.stringify(sku.properties) === JSON.stringify(row.properties)
    // )
    // console.log(index)
    // if (index !== -1) {
    //   continue
    // }
    formData.value!.skus!.push(row)
  })
  console.log(formData.value!.skus)
  // for (const item of buildSkuList) {
  //   const row = {
  //     properties: Array.isArray(item) ? item : [item], // 如果只有一个属性的话返回的是一个 property 对象
  //   }
  //   // console.log(item)
  //   // 如果存在属性相同的 sku 则不做处理
  //   // const index = formData.value!.skus!.findIndex(
  //   //   (sku) => JSON.stringify(sku.properties) === JSON.stringify(row.properties)
  //   // )
  //   // if (index !== -1) {
  //   //   continue
  //   // }
  //   formData.value!.skus!.push(row)
  // }
  // console.log(row)
  // formData.value!.skus = propertyValues
   
  // console.log(formData.value!.skus)
}

/**
 * 生成 skus 前置校验
 */
const validateData = (propertyList: any[]) => {
  const skuPropertyIds: number[] = []
  formData.value!.skus!.forEach(
    (sku) =>
      sku.properties
        ?.map((property) => property.propertyId)
        ?.forEach((propertyId) => {
          if (skuPropertyIds.indexOf(propertyId!) === -1) {
            skuPropertyIds.push(propertyId!)
          }
        })
  )
  const propertyIds = propertyList.map((item) => item.id)
  return skuPropertyIds.length === propertyIds.length
}

const radioChange =(e,row)=> {
      e === row.radio ? (row.radio = "") : (row.radio = e);
    }

   const onAddFeatures = ()=>{
    addFeaturesRef.value.open()
   } 

/** 构建所有排列组合 */
const build = (propertyValuesList: Property[][]) => {
  if (propertyValuesList.length === 0) {
    return []
  }
  //  else if (propertyValuesList.length === 1) {
  //   return propertyValuesList[0]
  // }
   else {
    const result: Property[][] = []
    const rest = build(propertyValuesList.slice(1))
    for (let i = 0; i < propertyValuesList[0].length; i++) {
      for (let j = 0; j < rest.length; j++) {
        // 第一次不是数组结构，后面的都是数组结构
        if (Array.isArray(rest[j])) {
          result.push([propertyValuesList[0][i], ...rest[j]])
        } else {
          result.push([propertyValuesList[0][i], rest[j]])
        }
      }
    }
    return result
  }
}

/** 监听属性列表，生成相关参数和表头 */
watch(
  () => props.propertyList,
  (propertyList: PropertyAndValues[]) => {
	console.log(propertyList,111)
    // 判断代理对象是否为空
    if (JSON.stringify(propertyList) === '[]') {
      return
    }
    // 重置表头
    tableHeaders.value = []
    // 生成表头
    propertyList.forEach((item, index) => {
      // name加属性项index区分属性值
      tableHeaders.value.push({ prop: `name${index}`, label: item.name })
    })
   
    // 如果回显的 sku 属性和添加的属性一致则不处理
    // if (validateData(propertyList)) {
    //   return
    // }
      // 添加新属性没有属性值也不做处理
    //   if (propertyList.some((item) => item.values!.length === 0)) {
    //   return
    // }
    // 生成 table 数据，即 sku 列表
    console.log(propertyList)
    generateTableData(propertyList)
  },
  {
    deep: true,
    immediate: true
  }
)
const activitySkuListRef = ref<InstanceType<typeof ElTable>>()

const getSkuTableRef = () => {
  return activitySkuListRef.value
}
// 暴露出生成 sku 方法，给添加属性成功时调用
defineExpose({ generateTableData, validateSku, getSkuTableRef })
</script>
