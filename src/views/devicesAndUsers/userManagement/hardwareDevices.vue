<template>
	<ContentWrap>
			  <div class="w-150">
				 <el-descriptions
				 		      title="家庭组信息:"
				 		      :column="3"
				 		      size="small"
				 		      border
				 		    >
				 		      
				 		      <el-descriptions-item>
				 		        <template #label>
				 		          <div class="cell-item">
				 		            
				 		            所属家庭组ID
				 		          </div>
				 		        </template>
				 		        {{ route.query.homeGroupId }}
				 		      </el-descriptions-item>
				 		      
				 		      <el-descriptions-item>
				 		        <template #label>
				 		          <div class="cell-item">
				 		            
				 		            所属家庭组昵称
				 		          </div>
				 		        </template>
				 		        {{ route.query.homeGroupName }}
				 		      </el-descriptions-item>
				 			
				 		    </el-descriptions> 
				  
			  </div>
			  
			  <div class="el-descriptions--small el-descriptions__header el-descriptions__title mt-6">设备信息:</div>
			  <div class="flex justify-between">
				 <el-descriptions
				 		      :column="1" 
				 		      size="small">
				 		      <el-descriptions-item label="设备ID:">{{ hardwareDevicesObj.userDeviceManageVO.deviceId }}</el-descriptions-item>
				 			<el-descriptions-item label="昵称:">{{ hardwareDevicesObj.nickname }}</el-descriptions-item>
				 		    <el-descriptions-item label="设备购买平台:">{{ hardwareDevicesObj.userDeviceManageVO.platformType }}</el-descriptions-item>
							<el-descriptions-item label="设备购买订单:">{{hardwareDevicesObj.userDeviceManageVO.orderNumber}}</el-descriptions-item>
							<el-descriptions-item label="生日:">{{ hardwareDevicesObj.birthday? dayjs(hardwareDevicesObj.birthday).format('YYYY-MM-DD HH:mm:ss'):hardwareDevicesObj.birthday }}</el-descriptions-item>
							<el-descriptions-item label="性别:">{{hardwareDevicesObj.sex}}</el-descriptions-item>
							<el-descriptions-item label="年级:">{{hardwareDevicesObj.grade}}</el-descriptions-item>
							<el-descriptions-item label="当前软件版本:">{{ hardwareDevicesObj.userDeviceManageVO.softwareVersion }}</el-descriptions-item>
							<el-descriptions-item label="激活时间:">{{dayjs(hardwareDevicesObj.userDeviceManageVO.activationTime).format('YYYY-MM-DD HH:mm:ss')}}</el-descriptions-item>
							<el-descriptions-item label="最后使用时间:">{{ dayjs(hardwareDevicesObj.userDeviceManageVO.exitTime).format('YYYY-MM-DD HH:mm:ss')}} </el-descriptions-item>
							<el-descriptions-item >
								 <el-button type="primary" @click="onAccountChange">数据迁移</el-button>
								 <el-button type="primary">声纹移除</el-button>
							</el-descriptions-item>
				 		    </el-descriptions>	
	
			  </div>
			<div class="w-300 flex justify-around mt-6">
				<span class="w-30 el-descriptions--small el-descriptions__header el-descriptions__title">商品权益：</span>
				<el-table v-loading="loading" :data="hardwareDevicesObj.productEquityVOList">
				  <el-table-column label="内容名称" align="center" prop="content" width="180" />
				  <el-table-column label="时间规格" align="center" prop="timeSpecifications" width="150"/>
				  <el-table-column label="应用时间" align="center" prop="applicationTime" width="240">

						<template #default="scope">
							{{dayjs(scope.row.applicationTime).format('YYYY-MM-DD HH:mm:ss')}}
				</template>
					</el-table-column>
				    <el-table-column label="订单号（内部）" align="center" prop="orderNoInternal" width="180"/>
				    <el-table-column label="商品状态" align="center" prop="productStatus" width="120">
							<template #default="scope">
							<span v-if="scope.row.productStatus ===0"> 使用中</span>
							<span v-if="scope.row.productStatus ===1">已过期</span>
				</template>

						</el-table-column>

					<el-table-column label="来源" align="center" prop="sourceName" width="120"/>
					<el-table-column label="备注" align="center" prop="notes" width="180"/>
				</el-table>
			</div>
			
			<div class="w-200 flex justify-around mt-6">
				<span class="w-30 el-descriptions--small el-descriptions__header el-descriptions__title">图谱统计：</span>
				<el-table v-loading="loading" :data="hardwareDevicesObj.graphStatisticsDOList">
				  <el-table-column label="图谱名称" align="center" prop="graphName" width="240" />
				  <el-table-column label="生成时间" align="center" prop="createTime" width="320">
						<template #default="scope">
							{{dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
				</template>
					</el-table-column>
				 <el-table-column align="right" width="120">
				       <template #header>
							 <el-image :src="xiazai" alt="" width="300" />
				       </template>
				       <template #default="{row}">
								<el-image :src="xiazai" alt="下载" width="350"  @click="onDownloadGraph(row.fileId)"  class="cursor-pointer"   v-if="row.fileId"/>
				        
				       </template>
				     </el-table-column>

				</el-table>
			</div>
			  </ContentWrap>
			  <hardwareDevicesForm  ref="formRef"/>
</template>

<script lang="ts" setup>
	import xiazai from '@/assets/svgs/xiazai.svg'
	import hardwareDevicesForm from './hardwareDevicesForm.vue'
	import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
	const loading = ref(false) // 列表的加载中
	import dayjs from "dayjs"
import download from '@/utils/download';
	const formRef  = ref()
	const route = useRoute()
	const hardwareDevicesObj = ref<any>({
		graphStatisticsDOList:[],
		userDeviceManageVO:{},
		productEquityVOList:[]
	})
	const onAccountChange = ()=>{
		formRef.value.open(hardwareDevicesObj.value.userDeviceManageVO.deviceId)
	}

	const getProductEquity = async ()=>{
		loading.value = true
		try {
		let res =  await	equipmentManagementApi.getProductEquity({deviceId:route.query.deviceId})
		hardwareDevicesObj.value = res
  } finally {
    loading.value = false
  }

	}

	const onDownloadGraph  = async (fileId)=>{
		let data = 	await equipmentManagementApi.downloadGraph(fileId,'图谱.png')
		console.log(data)
	}
	
	onMounted( async () => {
		await getProductEquity()
})

</script>
