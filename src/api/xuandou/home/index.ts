import request from '@/config/axios'

// 收入统计
export const getIncome = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getIncome`, params })
}

// 高频触发关键字
export const getHighFrequency = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getHighFrequency`, params })
}

// 高频触发用户
export const getHighFrequencyUser = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getHighFrequencyUser`, params })
}

// 商品销量排行
export const getGoodsSales = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getGoodsSales`, params })
}

// 当日数据信息
export const getData = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getData`, params })
}

// 全息舱活跃用户
export const getActiveUser = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getActiveUser`, params })
}

// 激活概况（地区）
export const getActiveOverview = async (params: any) => {
  return await request.get({ url: `/xd/homePage/getActiveOverview`, params })
}
