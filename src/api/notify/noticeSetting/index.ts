import request from '@/config/axios'
// 获得消息设置
export const noticeSettingPage = async (params)=>{
  return request.get({url:'/system/notice-setting/page',params})
}

// 创建消息设置
export const noticeSettingCreate = async (data) => {
  return await request.post({ url: `/system/notice-setting/create`, data })
}
// 更新消息设置
export const noticeSettingUpdate = async (data) => {
  return await request.put({ url: `/system/notice-setting/update`, data })
}

// 删除消息设置
export const noticeSettingDelete = async (params) => {
  return await request.delete({ url: `/system/notice-setting/delete`, params })
}