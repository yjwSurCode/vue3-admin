<template>
	  <ContentWrap>
		  <h1>基本信息</h1>
		  <el-form
		    ref="formRef"
		    v-loading="formLoading"
		    :model="formData2"
		    :rules="formRules"
		    label-width="120px"
		  >
		    <el-row>
		      <el-col :span="24">
		        <el-form-item label="权益卡名称" prop="name">
		          <el-input v-model="formData2.id" placeholder="请输入权益卡名称" class="!w-420px" />
		        </el-form-item>
		      </el-col>
		  <el-col :span="24">
		    <el-form-item label="权益卡等级" prop="name">
		<el-select v-model="formData2.transformStatus"  class="!w-420px">
	     <el-option :value="false" label="未转化" />
	     <el-option :value="true" label="已转化" />
	   </el-select>
		    </el-form-item>
		  </el-col>	
		  <el-col :span="24">
		    <el-form-item label="权益卡状态" prop="status">
		  	  <el-radio-group v-model="formData2.status" class="ml-4">
		  	        <el-radio label="1" size="large">上架</el-radio>
		  	        <el-radio label="2" size="large">下架</el-radio>
		  	      </el-radio-group>
		    </el-form-item>
		  </el-col>	
		   <el-col :span="24">
		     <el-form-item label="banner上传" prop="name">
		       <UploadImg v-model="formData2.picUrl" :limit="1" :is-show-tip="false" />
		     </el-form-item>
		   </el-col>
		   <el-col :span="24">
		     <el-form-item label="权益卡详情" prop="name">
		     <Editor v-model:modelValue="formData2.description" class="!w-800px" />
		     </el-form-item>
		   </el-col>
		   
		   


		    </el-row>
		  </el-form>

		  </ContentWrap>
		  <ContentWrap>
			  <h1>包含内容</h1>
			  
			  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isDetail">		      
			      <el-form-item  label="规格设置">
			        <el-button class="mb-10px mr-15px" type="primary"  @click="onAttributesAddForm">添加规格项</el-button>
			        <ProductAttributes
			          :property-list="propertyList"
			          @success="generateSkus"
			          :is-detail="isDetail"
			        />
			      </el-form-item>
			      <template v-if="propertyList.length > 0">
			        
			        <el-form-item label="规格列表">
			          <div class="w-100% overflow-auto">
									<SkuList
			            ref="skuListRef"
			            :prop-form-data="formData"
			            :property-list="propertyList"
			            :rule-config="ruleConfig"
			            :is-detail="isDetail"
			          />
								</div>
			        </el-form-item>
			      </template>
			    </el-form>
		
      <div
class="w-100% flex justify-center">

				<el-button type="primary">保 存</el-button>
      <el-button @click="onCancellation">取 消</el-button>
			</div>
   
		  </ContentWrap>
	 <!-- 商品属性添加 Form 表单 -->
	  <ProductPropertyAddForm ref="attributesAddFormRef" :propertyList="propertyList" />
</template>

<script lang="ts" setup>
import { Editor } from '@/components/Editor'
import {
  getPropertyList,
  SkuList
} from './components/index'
import { copyValueToTarget } from '@/utils'
import ProductAttributes from './ProductAttributes.vue'
import ProductPropertyAddForm from './ProductPropertyAddForm.vue'
const formData2 = ref({})
const attributesAddFormRef = ref() // 添加商品属性表单
const skuListRef = ref() // 商品属性列表 Ref
const propertyList = ref([]) 
const formData = reactive({
  specType: false, // 商品规格
  subCommissionType: false, // 分销类型
  skus: []
})
const propFormData = ref({
  name: '', // 商品名称
  categoryId: undefined, // 商品分类
  keyword: '', // 关键字
  picUrl: '', // 商品封面图
  sliderPicUrls: [], // 商品轮播图
  introduction: '', // 商品简介
  deliveryTypes: [], // 配送方式数组
  deliveryTemplateId: undefined, // 运费模版
  brandId: undefined, // 商品品牌
  specType: false, // 商品规格
  subCommissionType: false, // 分销类型
  skus: [
    {
      price: 0, // 商品价格
      marketPrice: 0, // 市场价
      costPrice: 0, // 成本价
      barCode: '', // 商品条码
      picUrl: '', // 图片地址
      stock: 0, // 库存
      weight: 0, // 商品重量
      volume: 0, // 商品体积
      firstBrokeragePrice: 0, // 一级分销的佣金
      secondBrokeragePrice: 0 // 二级分销的佣金
    }
  ],
  description: '', // 商品详情
  sort: 0, // 商品排序
  giveIntegral: 0, // 赠送积分
  virtualSalesCount: 0 // 虚拟销量
})
const formRef = ref()
const formLoading = ref(false)
let  router  =  useRouter()

const onCancellation = ()=>{
	router.back()
}

const formRules = reactive({
  name: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  remarks: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  fee:[{ required: true, message: '负责人不能为空', trigger: 'blur' }]
})


// sku 相关属性校验规则
const ruleConfig: RuleConfig[] = [
  {
    name: 'stock',
    rule: (arg) => arg >= 0,
    message: '商品库存必须大于等于 1 ！！！'
  },
  {
    name: 'price',
    rule: (arg) => arg >= 0.01,
    message: '商品销售价格必须大于等于 0.01 元！！！'
  },
  {
    name: 'marketPrice',
    rule: (arg) => arg >= 0.01,
    message: '商品市场价格必须大于等于 0.01 元！！！'
  },
  {
    name: 'costPrice',
    rule: (arg) => arg >= 0.01,
    message: '商品成本价格必须大于等于 0.00 元！！！'
  }
]

const rules = reactive({
  specType: [required],
  subCommissionType: [required]
})

const isDetail = ref(false)


/** 将传进来的值赋值给 formData */
watch(
  () => propFormData.value,
  (data) => {
	  console.log(data)
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
    // 将 SKU 的属性，整理成 PropertyAndValues 数组
    propertyList.value = getPropertyList(data)
  },
  {
    immediate: true
  }
)

const onAccountChange = ()=>{
	formRef.value.open()
}

const onAttributesAddForm = ()=>{
	attributesAddFormRef.value.open()
}

const generateSkus = (propertyList) => {
	console.log(propertyList)
  skuListRef.value.generateTableData(propertyList)
}
</script>

<style>
</style>