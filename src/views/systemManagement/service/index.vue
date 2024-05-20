<template>
  <ContentWrap>
    <qrcode-vue :value="value" :size="size" level="H" />
    <div>扫码联系客服</div>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as RoleApi from '@/api/system/role'

import QrcodeVue from 'qrcode.vue'

defineOptions({ name: 'SystemRole' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const value = ref('https://work.weixin.qq.com/kfid/kfc1d7f55136702b160')
const size = ref(300)

/** 初始化 **/
onMounted(async () => {
  getList()
})
</script>
