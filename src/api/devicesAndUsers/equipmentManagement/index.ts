import request from '@/config/axios'
import axios from 'axios';
import {  getTenantId } from '@/utils/auth'
// 分页查询家庭组信息
export const getEquipmentManagementPage = async (params: any) => {
  return await request.get({ url: `/xd/home/getHomeGroupPageList`, params })
}

//查询身份列表
export const getAllHomeTitle = async (params: any)=>{
  return request.get({ url: `/xd/home/getAllHomeTitle`, params })
}

// 根据家庭组id获取设备信息
export const getDeviceByHomeId = async(params: any)=>{
  return request.get({url:'/xd/home/getDeviceByHomeId',params})
}

// 根据家庭组id获取家庭用户信息
export const getHomeUserByHomeId = async(params: any)=>{
  return request.get({url:'/xd/home/getHomeUserByHomeId',params})
}

// 查询等级列表
export const getAllHomeLevels = async (params: any)=>{
  return request.get({url:'/xd/home/getAllHomeLevels',params})
}

//校验手机号
export const validateSmsCode = async (data: any)=>{
  return request.post({url:'/system/auth/validateSmsCode',data})
}

// 获得当前设备的设备信息和商品权益
export const getProductEquity =  async (params)=>{
  return request.get({url:'/xd/product-equity/get-product-equity',params})
}

//数据迁移
export const migrate = (params)=>{
  return request.get({url:'/xd/product-equity/migrate',params})
}

//下载图谱

export function downloadGraph(fileId,filename) {
  axios({
    url:'/xd/product-equity/download-graph?fileId='+fileId,
    method: 'GET',
    responseType: 'blob'
  }).then(response => {
    // console.log(response)
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// 获得设备管理导入模板
export function getImportTemplate(params){
  return request.download({url:'/system/deviceManage/get-import-template',params})
}

// 查询设备管理信息列表
export function deviceManageList(params){
  return request.get({url:'/system/deviceManage/list',params})
}
// 根据deviceId获取设备流程记录
export function getByDeviceId(params){
  return request.get({url:'/system/deviceFlow/getByDeviceId',params})
}

// 新增设备信息
export function deviceManageAdd(data){
  return request.post({url:'/system/deviceManage/add?tenantId='+getTenantId(),data})
}

// 编辑设备信息
export function deviceManageUpdate(data){
  return request.put({url:'/system/deviceManage/update?tenantId='+getTenantId(),data})
}
// 获取一条设备信息
export function deviceManageGet(params){
  return request.get({url:'/system/deviceManage/get',params})
}

// 删除设备信息
export function deviceManageDelete(params){
  return request.delete({url:'/system/deviceManage/delete?'+params})
}

// 批量导出设备管理列表信息
export function  dynamicExport(fieldList){
  return request.download({url:'/system/deviceManage/dynamicExport?'+fieldList})
}

// 获得预警信息分页
export function warningInfoPage(data){
  return request.post({url:'/xd/warning-info/page',data})
}
