<template>
  <ContentWrap>
   
    <p>全息舱</p>
    <p>互动使用视频教程</p>
    <el-input
    readonly
    v-model="interactiveUse"
      class="!w-500px cursor-pointer"
      placeholder="请上传"
    >
      <template #append>
        <div @click="onUploadFiles(2,1)">上传文件</div>
      </template>
    </el-input>
    <p>课后互动新手教程</p>
    <el-input
    readonly
    v-model="afterClassInteraction"
      class="!w-500px cursor-pointer"
      placeholder="请上传"
    >
      <template #append>
        <div @click="onUploadFiles(3,2)">上传文件</div>
      </template>
    </el-input>
   </ContentWrap>
   <form ref="DataForm">
    <input type="file"   ref="fileInput" @change="handleVideoChange" accept="video/*"  class="opacity-0"/>
   </form>
 
 </template>
 <script lang="ts" setup>
  import * as beginnerTutorialApi from '@/api/notify/beginnerTutorial/index'

  const fileInput = ref()
  const message = useMessage() // 消息弹窗
  const refType = ref()
  const DataForm = ref()


  const interactiveUse = ref('')

  const afterClassInteraction = ref('')


  const type = ref()

onMounted( () => {
   getList()
})

const getList =  async ()=>{

  try {
    const data = await beginnerTutorialApi.page({})
        data.list.forEach(item=>{
          if(item.type ===1){
            interactiveUse.value = item.fileDOList? item.fileDOList[0].fileName:''
          }else if(item.type ===2){
            afterClassInteraction.value = item.fileDOList? item.fileDOList[0].fileName:''
          }
        })
  } finally {
  
  }
}

const handleVideoChange = async(event) => {
  let files = event.target.files[0];
  let formdata=new FormData();
formdata.append("file",files);
formdata.append("type",type.value);
formdata.append("refType",refType.value);
  let res =  await beginnerTutorialApi.upload(formdata)
  if(res.code ===0){
    await beginnerTutorialApi.batch({
          fileId:res.data.id,
          type:type.value 
        })
        message.success('操作成功!')
        DataForm.value.reset();
        getList()
  }

};
 

const  onUploadFiles  =(w,k)=>{
  refType.value = w
  type.value = k
  fileInput.value.click()
}
 </script>
 