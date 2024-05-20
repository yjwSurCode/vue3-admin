<template>
  <Dialog v-model="dialogVisible" title="设备列表" width="30%">
    <el-table v-loading="formLoading" :data="list" >
      <el-table-column label="序号" align="center" type="index" width="90" />
      <el-table-column label="家庭组名称" align="center" prop="homeGroupName" width="150"/>
      <el-table-column label="设备名称" align="center" prop="deviceTypeName" width="150"/>
      
    <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openView(scope.row.deviceId,scope.row.homeGroupName,scope.row.homeGroupId)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const list = ref([])
const { push } = useRouter()
const   getHomeUserByHomeId  =async (homeId)=>{
		try {
    let data = 	await equipmentManagementApi.getDeviceByHomeId({
			homeId
		})
    list.value = data
  
  } finally {
    formLoading.value = false
  }
	}



/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  await getHomeUserByHomeId(id)

 
}

const openView = (id,homeGroupName,homeGroupId)=>{
  if(!id)return
push({ name:'hardwareDevices',query: {
  deviceId:id,
  homeGroupName,
  homeGroupId
			} })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>
