<template>
	  <ContentWrap :loading="loading">
		  <div class="w-200">
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
			 		        {{ homeUserByHome.homeId }}
			 		      </el-descriptions-item>
			 		      
			 		      <el-descriptions-item>
			 		        <template #label>
			 		          <div class="cell-item">
			 		            
			 		            所属家庭组昵称
			 		          </div>
			 		        </template>
			 		        {{ homeUserByHome.homeName }}
			 		      </el-descriptions-item>
			 			  <el-descriptions-item>
			 			    <template #label>
			 			      <div class="cell-item">
			 			        
			 			       
			 			      </div>
			 			    </template>
			 			    
			 			  </el-descriptions-item>
			 			  <el-descriptions-item>
			 			    <template #label>
			 			      <div class="cell-item">
			 			        
			 			        当月消费
			 			      </div>
			 			    </template>
			 			    ￥  {{ homeUserByHome.monthConsumption }} 
			 			  </el-descriptions-item>
			 		      <el-descriptions-item>
			 		        <template #label>
			 		          <div class="cell-item">
			 		            
			 		            总计消费
			 		          </div>
			 		        </template>
			 		        ￥ {{ homeUserByHome.totalConsumption }} 
			 		      </el-descriptions-item>
			 
			 <el-descriptions-item>
			 		        <template #label>
			 		          <div class="cell-item">
			 		            
			 		            消费等级
			 		          </div>
			 		        </template>
			 		        {{ homeUserByHome.homeLevel }}
			 		      </el-descriptions-item>
			 
			 
			 
			 
			 		      
			 		    </el-descriptions> 
			  
		  </div>
		  
		  <div class="el-descriptions--small el-descriptions__header el-descriptions__title mt-6">账号信息:</div>
		  <div class="flex">
			 <el-descriptions
					class="mr-30"
			 		      :column="1" 
						  v-for="val in homeUserByHome.homeTiesUserDOList"
						  :key="val"
			 		      size="small">
						    
			 		      <el-descriptions-item label="家庭身份:">{{val.titleName}}</el-descriptions-item>
			 			<el-descriptions-item label="家庭权限:">
							<el-tag type="primary"  v-if="val.isParents ===0"> 家庭成员</el-tag>
        <el-tag type="success" v-if="val.isParents ===1">家长账号</el-tag>
					</el-descriptions-item>
			 		    <el-descriptions-item label="手机号:">{{val.mobile}}</el-descriptions-item>
						<el-descriptions-item label="微信号:">{{val.wechatNickName}}</el-descriptions-item>
						<el-descriptions-item label="性别:">

							<span v-if="val.sex ==='2'"> 男</span>
        <span v-if="val.sex ==='1'">女</span>
						</el-descriptions-item>
						<el-descriptions-item label="年龄:">{{ val.age }}</el-descriptions-item>
						<el-descriptions-item label="职业:">{{val.profession}}</el-descriptions-item>
						<el-descriptions-item label="区域:">{{val.area}}</el-descriptions-item>
						<el-descriptions-item label="注册时间:">{{dayjs(val.createTime).format('YYYY-MM-DD HH:mm:ss')}}</el-descriptions-item>
						<el-descriptions-item label="最后登录时间:">{{dayjs(val.birthday).format('YYYY-MM-DD HH:mm:ss')}}</el-descriptions-item>
						<el-descriptions-item >
							 <el-button type="primary" @click="onAccountChange(val.userId,val.username)">账号变更</el-button>
						</el-descriptions-item>
			 		    </el-descriptions>	

		  </div>

		  </ContentWrap>
	
	 <familyDetailsForm ref="formRef" />
</template>

<script lang="ts" setup>
import dayjs from "dayjs"
import familyDetailsForm from './familyDetailsForm.vue'
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'

const formRef = ref()

const route = useRoute()

const loading = ref(false) 

const homeUserByHome = ref<any>({
	homeTiesUserDOList:[]
})

const onAccountChange = (id,username)=>{
	formRef.value.open(id,username)
}



const   getHomeUserByHomeId  =async ()=>{
		try {
    let data = 	await equipmentManagementApi.getHomeUserByHomeId({
			homeId:route.query.homeId
		})
		homeUserByHome.value = data
  
  } finally {
    loading.value = false
  }
	}
	onMounted( async () => {
	 await	getHomeUserByHomeId()
})
</script>
