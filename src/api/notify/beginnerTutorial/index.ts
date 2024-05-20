import request from '@/config/axios'

//上传文件
export const upload = async (data) => {
  return await request.upload({ url: `/xd/common-file/upload`, data })
}

// 批量创建新手教程
export const batch = async (data) =>{
  return await request.post({ url: `/xd/novice-tutorial/create`, data })
}

//获取分页
export const page = async (params) =>{
   return await request.get({url:'/xd/novice-tutorial/page',params})
}