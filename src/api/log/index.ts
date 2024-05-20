import request from '@/config/axios'

export interface DeliveryExpressVO {
  id: number
  code: string
  name: string
  logo: string
  sort: number
  status: number
}

interface LogParam {
  pageNo: number //	页码，从 1 开始,示例值(1)		true
  pageSize: number //每页条数，最大值为 100,示例值(10)		true
  type: string //操作模块，模拟匹配,示例值(订单)		false
  userId: number //用户编号		false
  isResult: number //是否成功,可用值:1,0,示例值(1)		false

  bizId: number //操作模块业务编号,示例值(1)		false
  subType: string // 	操作名，模拟匹配,示例值(创建订单)		false
  action: string //操作明细，模拟匹配,示例值(修改编号为 1 的用户信息)		false
  createTime: string //	开始时间,示例值([2022-07-01 00:00:00,2022-07-01 23:59:59])		false
}

// 模块查询
export const getDeliveryExpressPage = async (params: PageParam) => {
  return await request.d_get({ url: '/trade/delivery/express/page', params })
}

// 日志查询 /admin-api/system/operate-log/page
export const getLogApi = async (params: LogParam) => {
  return await request.d_get({ url: '/system/operate-log/page', params })
}

// 系统模块列表 {}
export const modulesApi = async (params: PageParam) => {
  return await request.d_get({ url: '/system/operate-log/modules', params })
}

// 操作类型列表 {}
export const operateApi = async (params: PageParam) => {
  return await request.d_get({ url: '/system/operate-log/operate-types', params })
}
