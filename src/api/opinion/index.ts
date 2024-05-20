import request from '@/config/axios'

export interface DeliveryExpressVO {
  id: number
  code: string
  name: string
  logo: string
  sort: number
  status: number
}

interface addParam {
  id: number
  code: string
  name: string
  logo: string
  sort: number
  status: number
}

interface feedbackApiParam {
  id: string
  userName: string
  opinionSource: string //意见来源  0:后台 1:app 2:全息舱:
  logo: string
  opinionTypeId: number
  opinionTypeName: string //意见类型名称
  description: string //	意见说明
  sort: number
  status: number
  fileList: Array<String> // 意见图片
  // disposal: number // 处理结果 0 未处理 1 已处理   // -----判断意见是否回复
  outcome: number //列表处理结果   处理结果 0 未处理 1 已处理  null 未回复

  reply: string // 回复内容

  createTime: any //创建时间 意见时间

  updateTime: any // 更新时间 回复时间
}

interface typeParam {
  opinionType: string //	类型名称
  description: string //说明	string
  sort: number //排序	number
  enable: number //是否启用 0 停用 1 启用	integer
  createTime: any //	创建时间
}

// 意见反馈列表   /admin-api/xd/opinion-feedback/page
export const feedbackApi = async (params: feedbackApiParam) => {
  return await request.d_get({ url: '/xd/opinion-feedback/page', params })
}

// 意见详情
export const feedbackDetailApi = async (params: feedbackApiParam) => {
  return await request.d_get({ url: '/xd/opinion-feedback/get', params })
}

// 回复意见
export const replyApi = async (params: { id: number }) => {
  return await request.d_post({ url: '/xd/opinion-reply/create', params })
}

// 意见类型列表
export const typeListApi = async (params: typeParam) => {
  return await request.d_get({ url: '/xd/opinion-type/page', data: params })
}

// 意见类型添加
export const addTypeApi = async (params: typeParam) => {
  return await request.d_post({ url: '/xd/opinion-type/create', data: params })
}

// 意见类型更新
export const updateTypeApi = async (params: typeParam) => {
  return await request.put({ url: '/xd/opinion-type/update', data: params })
}

// 意见类型删除
export const deleteTypeApi = async (params: addParam) => {
  return await request.d_delete({ url: '/xd/opinion-type/delete', params })
}
