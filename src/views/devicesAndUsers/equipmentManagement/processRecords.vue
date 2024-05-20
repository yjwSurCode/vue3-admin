<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-table v-loading="loading" :data="list">
      <el-table-column label="已入库" align="center" prop="id" width="180" >
        <template #default="scope">
          <span> {{ deviceFlowList.filter((num) => {
  return scope.row.deviceFlow === num.value;
})[0]?.label }}</span>
		   </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="follower" width="180"/>
      <el-table-column label="时间" align="center" prop="followTime" width="180">
        <template #default="scope">
         <span>{{ formatToDateTime(scope.row.followTime) }}</span>
        </template>
      </el-table-column>
        
    </el-table>
    
  </Dialog>
</template>
<script lang="ts" setup>
import * as equipmentManagementApi from '@/api/devicesAndUsers/equipmentManagement/index'
import {deviceFlowList } from "./constant/index"
import {formatToDateTime} from "@/utils/dateUtil"
const loading = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const list = ref([]) 

/** 打开弹窗 */
const open = async (type: string, deviceId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type
  // 修改时，设置数据
  if (deviceId) {
    loading.value = true
    try {
      let res = await equipmentManagementApi.getByDeviceId({deviceId})
      list.value = res
    } finally {
      loading.value = false
    }
  }
 
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


</script>
