<template>

  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="140px"
    >
      <el-form-item label="全息舱ID">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-220px"
        />
        
      </el-form-item>
	  <el-form-item label="全息舱设备码" >
	    <el-input
	      v-model="queryParams.hardwareCode"
	      placeholder="请输入"
	      clearable
	      @keyup.enter="handleQuery"
	      class="!w-220px"
	    />
	    
	  </el-form-item>
	  <el-form-item label="家长电话">
	    <el-input
	      v-model="queryParams.number"
	      placeholder="请输入"
	      clearable
	      @keyup.enter="handleQuery"
	      class="!w-220px"
	    />
	    
	  </el-form-item>

	  <el-form-item label="高频触发用户排序">
	    <el-select  class="!w-200px">
	      <!-- <el-option :value="false" label="未转化" /> -->
	      <!-- <el-option :value="true" label="已转化" /> -->
	    </el-select>
	  </el-form-item>
	  <el-form-item label="触发日期" >
	    <el-date-picker
	          v-model="queryParams.triggerDate"
	          value-format="YYYY-MM-DD HH:mm:ss"
	          type="daterange"
	          start-placeholder="开始日期"
	          end-placeholder="结束日期"
	          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
	          class="!w-200px"
	          
	        />
	  </el-form-item>
	 
	  <el-form-item label="关键字触发频次排序" >
	    <el-select v-model="queryParams.keywords" class="!w-220px">
	      <el-option value="asc" label="升序" />
	      <el-option value="desc" label="降序" />
	    </el-select>
	  </el-form-item>
	
    </el-form>
	<div class="flex justify-end">
		<el-button  type="success" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
		<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
	</div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="全息舱ID" align="center" prop="deviceId" width="120"/>
      <el-table-column label="全息舱设备码" align="center" prop="hardwareCode" width="200"/>
	    <el-table-column label="家长账号信息" align="center" prop="parentName" width="200"/>
	    <el-table-column label="活跃地区" align="center" prop="ipArea" width="200"/>
		<el-table-column label="预警触发时间" align="center" prop="pr1ice" width="240">
      <template #default="scope">
		
        <span>{{scope.row.createTime? formatToDateTime(scope.row.createTime):scope.row.createTime}}</span>
  </template>
    </el-table-column>
		<el-table-column label="预警关键字" align="center" prop="keywords" width="240"/>
		<el-table-column label="预警信息原文" align="center" prop="content" width="240"/>
      <el-table-column label="家庭组" align="left" width="180">
        <template #default="scope">
		
          <el-tag size="small" type="success" class="cursor-pointer"  @click="openProcessRecords('familyDetails',scope.row.homeId)">查看</el-tag> 
        </template>
      </el-table-column>
     
      
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import { omit } from 'lodash-es';
defineOptions({ name: 'WarningInformation' })
import {formatToDateTime} from "@/utils/dateUtil"

const { push } = useRouter()

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  keywords:'',

})
const queryFormRef = ref() // 搜索的表单

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await equipmentManagementApi.warningInfoPage(omit({startTime:queryParams.value.triggerDate?queryParams.value.triggerDate[0]:null,endTime:queryParams.value.triggerDate?queryParams.value.triggerDate[1]:null,...queryParams.value}, ['triggerDate']))
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}



const openProcessRecords = (type: string,homeId:string) => {
  push({ name:type,query: {
    homeId
			} })
  
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = {
  pageNo: 1,
  pageSize: 10,
  keywords:'',
}
  handleQuery()
}


/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
