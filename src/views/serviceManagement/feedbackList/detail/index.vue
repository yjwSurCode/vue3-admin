<template>
  <div v-loading="loading">
    <!-- 意见详情 -->
    <el-row :gutter="10">
      <el-col :span="12" class="detail-info-item">
        <ContentWrap style="height: 600px">
          <div class="text-16px font-bold mb-10px">意见信息</div>
          <el-row>
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="编号">
                  <el-tag size="small">{{ pageInfo.id }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="意见来源">
                  <el-tag v-if="pageInfo.opinionSource == 0" size="small">后台</el-tag>
                  <el-tag v-if="pageInfo.opinionSource == 1" size="small">APP</el-tag>
                  <el-tag v-if="pageInfo.opinionSource == 2" size="small">全息舱</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="用户名称">{{
                  pageInfo.userName
                }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
            <!-- <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="用户手机号">{{
                  pageInfo.userName
                }}</el-descriptions-item>
              </el-descriptions>
            </el-col> -->
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="意见类型">{{
                  pageInfo.opinionTypeName
                }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="意见说明">{{
                  pageInfo.description
                }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="意见图片">
                  <el-image
                    class="h-100px w-100px"
                    lazy
                    preview-teleported
                    v-for="(item, index) in pageInfo.fileList"
                    :key="index"
                    :preview-src-list="[
                      item ||
                        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                    ]"
                    :src="
                      item ||
                      'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                    "
                    fit="cover"
                  />
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="12" class="detail-info-item">
              <el-descriptions :column="2" label-class-name="desc-label">
                <el-descriptions-item label="意见时间">{{
                  formatDate(pageInfo.createTime || new Date())
                }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </ContentWrap>
      </el-col>
      <el-col :span="12" class="detail-info-item">
        <ContentWrap style="height: 600px">
          <div class="text-16px font-bold mb-10px">回复信息</div>
          <el-descriptions :column="1" label-class-name="desc-label">
            <el-descriptions-item label="处理结果">
              <el-tag type="success" size="small">已解决</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="回复内容">{{
              pageInfo.reply || '-'
            }}</el-descriptions-item>
            <el-descriptions-item label="回复时间">{{
              formatDate(pageInfo.updateTime || new Date())
            }}</el-descriptions-item>
          </el-descriptions>
        </ContentWrap>
      </el-col>
    </el-row>
  </div>
  <div class="text-left z-10 ml-50px">
    <el-button @click="openReply" type="primary" v-if="pageInfo.disposal == 0">回 复</el-button>
    <el-button type="info" v-else>已回复</el-button>
  </div>

  <replyBox @success-fun="success" ref="replyRef" />
</template>

<script lang="ts" setup>
import replyBox from './replyBox.vue'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { ElNotification } from 'element-plus'

const loading = ref(true)
const memo = ref(`
意见描述意见描述意见描述意见描述意见描述意见描述意见描述意见描述意见描述意见描述意见描述意见描述
`)

import * as Api from '@/api/opinion/index'

const { currentRoute, push } = useRouter() // 路由跳转

const pageInfo = ref({ disposal: 0 })

const detailInfo = reactive({ reply: '' })

// 获取详情
const initOpinion = async (id: number) => {
  loading.value = true
  try {
    const data = await Api.feedbackDetailApi({
      id: currentRoute.value.params.id || '1784891663014694914'
    })
    console.log('获取详情', data)
    if (!data.data) {
      ElNotification({
        title: 'Title',
        message: h('i', { style: 'color: teal' }, '接口错误')
      })
      loading.value = false
      return
    }
    // 过滤数据
    pageInfo.value = data.data //  .filter((item) => item.id == currentRoute.value.params)
  } finally {
    loading.value = false
  }
}

const replyRef = ref()
const openReply = (id: String) => {
  replyRef.value.open('', id)
}
// 成功回调
const success = (value) => {
  console.log('123123', value)
  initOpinion()
}

onMounted(() => {
  initOpinion()
  console.log(currentRoute.value.params, 'currentRoute')
})
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions__cell {
  display: flex;
}

::v-deep .el-descriptions__label {
  color: #999;
  display: inline-block;
  min-width: 70px;
  text-align: right;
}
</style>
