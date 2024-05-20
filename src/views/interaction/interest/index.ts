import request from '@/config/axios'

// 更新趣味互动
export const uploadInterestApi = async (data) => {
  return await request.put({ url: `/xd/fun-interaction/update`, data })
}

// 获得趣味互动分页
export const interestApi = async (data) => {
  return await request.post({ url: `/xd/fun-interaction/page`, data })
}

//上传文件
export const upload = async (data) => {
  return await request.upload({ url: `/xd/common-file/upload`, data })
}
