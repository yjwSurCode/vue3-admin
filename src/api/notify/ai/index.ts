import request from '@/config/axios'
// 获得AI形象管理分页
export const aifigurePage = async (params)=>{
  return request.get({url:'/xd/ai-figure/page',params})
}

// 创建AI形象管理
export const aifigureCreate = async (data) => {
  return await request.post({ url: `/xd/ai-figure/create`, data })
}
// 更新AI形象管理
export const aifigureUpdate = async (data) => {
  return await request.put({ url: `/xd/ai-figure/update`, data })
}

// 删除AI形象管理
export const aifigureDelete = async (params) => {
  return await request.delete({ url: `/xd/ai-figure/deleteBatch?`+params  })
}