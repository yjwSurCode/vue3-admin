<template>

 <ContentWrap>
<div class="flex w-100%">
	<el-form
	      class="-mb-15px"
	      :model="queryParams"
	      ref="queryFormRef"
	      :inline="true"
	      label-width="100px"
	    >
	      <el-form-item label="权益卡名称" prop="appId">
	        <el-input
	          v-model="queryParams.merchantOrderId"
	          placeholder="请输入"
	          clearable
	          @keyup.enter="handleQuery"
	          class="!w-240px"
	        />
	        
	      </el-form-item>
		  
		  <el-form-item label="权益卡等级" prop="transformStatus">
		    <el-select v-model="queryParams.merchantOrderId" class="!w-240px">
		      <el-option :value="false" label="未转化" />
		      <el-option :value="true" label="已转化" />
		    </el-select>
		  </el-form-item>
		<el-form-item label="排序" prop="transformStatus">
		  <el-select v-model="queryParams.merchantOrderId" class="!w-240px">
		    <el-option :value="false" label="倒序" />
		    <el-option :value="true" label="正序" />
		  </el-select>
		</el-form-item>
		
			
	        
	    </el-form>
	<div class="ml-auto">
		<el-button  type="success" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 筛选</el-button>
		<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
		 <el-button  type="success" @click="openForm('新增权益卡等级')"> 新增</el-button>
		 <el-button  type="success" > 导出</el-button>
		
	</div>
</div>
  </ContentWrap>

<ContentWrap>
    <el-tabs v-model="queryParams.tabType" @tab-click="handleTabClick"  type="border-card">
      <el-tab-pane
        v-for="item in tabsData"
        :key="item.type"
        :label="item.name + '(' + item.count + ')'"
        :name="item.type"
      />
    </el-tabs>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="权益卡名称"  prop="id" />
      <el-table-column align="center" label="权益卡等级"  prop="salesCount" />
      <el-table-column align="center" label="状态"  prop="stock" />
      <el-table-column align="center" label="创建时间"  prop="sort" />
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('编辑权益卡等级',row.id)"> 编辑 </el-button>
<el-button link type="danger" @click="openEdit(row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <openFormItem ref="formRef" @success="getList" />

</template>
<script lang="ts" setup>
import * as OrderApi from '@/api/mall/trade/order/index'
import openFormItem from './openForm.vue'
defineOptions({ name: 'EquityCard' })

const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  merchantOrderId: null,
   tabType: 0,
  
})


const total = ref(0)

const list = ref([])

const formRef = ref()


const tabsData = ref([
  {
    name: '全部',
    type: 0,
    count: 0
  },
  {
    name: '上架',
    type: 1,
    count: 0
  },
  {
    name: '下架',
    type: 2,
    count: 0
  }
])
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}


const handleTabClick = (tab) => {
  queryParams.sceneType = tab.paneName
  handleQuery()
}

const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderApi.getOrderPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 重置按钮操作 */
const resetQuery = () => {

  handleQuery()
}

const openEdit = (id)=>{
	
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
