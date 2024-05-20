import request from '@/config/axios'

// 版本列表
export const getVersionList = async (params: any) => {
  return await request.get({ url: `/xd/version/page`, params })
}

// 版本详情
export const getVersionDetail = async (params: any) => {
  return await request.get({ url: `/xd/version/get`, params })
}

// 版本添加
export const addVersion = async (data: any) => {
  return await request.post({ url: `/xd/version/create`, data })
}

// 版本修改
export const updateVersion = async (data: any) => {
  return await request.put({ url: `/xd/version/update`, data })
}

// 版本删除
export const delVersion = async (params: any) => {
  return await request.delete({ url: `/xd/version/deleteBatch?` + params })
}
