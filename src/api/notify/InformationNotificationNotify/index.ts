import request from '@/config/axios'
// 获取消息通知列表
export const noticePage = async (data) => {
  return await request.post({ url: `/system/notice/page`, data })
}

// 新增消息通知
export const noticeCreate = async (data) => {
  return await request.post({ url: `/system/notice/create`, data })
}

// 修改通知公告
export const noticeUpdate = async (data) => {
  return await request.put({ url: `/system/notice/update`, data })
}

// 批量删除通知公告
export const noticeDelete = async (params)=>{
  return await request.delete({url:`/system/notice/delete/batch?`+params})
}

// 获得站内跳转菜单列表
export const noticeList = async (params)=>{
  return request.get({url:'/system/notice/list',params})
}


// 获得站内跳转商品列表
export const noticeListcategory = async (params)=>{
  return request.get({url:'/system/notice/list-category',params})
}

// 获得通知公告
export const noticeGet = async (params)=>{
  return request.get({url:'/system/notice/get',params})
}