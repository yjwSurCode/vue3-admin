<template>
  <el-row class="mt-8px xd-home" :gutter="8" justify="space-between">
    <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="mb-8px">
      <el-card shadow="never">
        
        <el-skeleton :loading="loading" animated>
          <el-row :gutter="50" style="margin-top: -10px;">
            <el-col
              v-for="(item, index) in totalLists"
              :key="`card-${index}`"
              :xl="6"
              :lg="6"
              :md="6"
              :sm="24"
              :xs="24"
            >
              <el-card shadow="hover" style="margin-top: 10px;">
                <div class="flex items-center">
                  <span class="text-14px text-gray-500">{{ item.name }}</span>
                </div>
                <div class="mt-16px text-36px text-gray-800">
                  <CountTo :end-val="Number(item.num)" :duration="1500" :decimals="item.name=='总收入'?2:0" />
                </div>
                <div class="mt-16px flex text-14px text-gray-400">
                  <span>{{ item.beforeType?'自昨日以来':'' }}</span>
                  <div v-if="item.beforeType" :class="['numarrow',item.beforeType=='down'?'text-green-400 numdown':'text-red-400 numup']">{{ item.beforeType=='up'? '↑' : '↓' }}</div>
                  <span v-if="item.beforeType" :class="[item.beforeType=='down'?'text-green-400':'text-red-400']">
                    <CountTo  :end-val="Number(item.beforeNum)" :duration="1500" :decimals="1" />%
                  </span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-skeleton>
      </el-card>

      <el-card shadow="never" class="mt-8px">
        <el-skeleton :loading="loading" animated>
          <el-row :gutter="20" justify="space-between">
            <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <el-card shadow="hover" class="mb-8px" v-loading="loading">
                  <template #header>
                    <div class="my--1.5 flex flex-row items-center justify-between">
                      <CardTitle title="收入统计数据" />
                      <!-- 查询条件 -->
                      <ShortcutDateRangePicker @change="incomeChg" />
                    </div>
                    <div class="my--1.5 flex flex-row items-center justify-between echart-box">
                      <el-radio-group v-model="incomeData.type" @change="handleIncomeChange">
                        <el-radio v-for="(el,idx) in incomeData.list" :key="idx" :label="el.value">{{el.name}}</el-radio>
                      </el-radio-group>
                    </div>
                  </template>
                  <Echart :options="incomeData.data" :height="300" />
              </el-card>
            </el-col>
            <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <el-card shadow="hover" class="mb-8px">
                  <template #header>
                    <div class="my--1.5 flex flex-row items-center justify-between">
                      <CardTitle title="商品销量排行" />
                      <!-- 查询条件 -->
                      <ShortcutDateRangePicker @change="goodsChg" />
                    </div>
                    <div class="flex text-12px text-gray-400 echarts-sub"><span>只记录TOP5数据</span></div>
                    <div class="my--1.5 flex flex-row items-center justify-between echart-box">
                      <el-radio-group v-model="goodsData.type" @change="handleGoodsChange">
                        <el-radio v-for="(el,idx) in goodsData.list" :key="idx" :label="el.value">{{el.name}}</el-radio>
                      </el-radio-group>
                    </div>
                  </template>
                <Echart :options="goodsData.type==''?goodsData.data:goodsData.dataByOne" :height="300" />
              </el-card>
            </el-col>
            <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <el-card shadow="hover" class="mb-8px">
                  <template #header>
                    <div class="my--1.5 flex flex-row items-center justify-between">
                      <CardTitle title="全息舱活跃用户" />
                      <!-- 查询条件 -->
                      <ShortcutDateRangePicker @change="activeUserChg" />
                    </div>
                  </template>
                <Echart :options="activeUserData.data" :height="300" />
              </el-card>
            </el-col>
            <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <el-card shadow="hover" class="mb-8px">
                  <template #header>
                    <div class="my--1.5 flex flex-row items-center justify-between">
                      <CardTitle title="激活概况(地区)" />
                      <!-- 查询条件 -->
                      <ShortcutDateRangePicker @change="areaChg" />
                    </div>
                  </template>
                <Echart :options="areaData.data" :height="300" />
              </el-card>
            </el-col>
            <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <el-card shadow="hover" class="mb-8px">
                  <template #header>
                    <div class="my--1.5 flex flex-row items-center justify-between">
                      <CardTitle title="高频触发关键字" />
                      <!-- 查询条件 -->
                      <ShortcutDateRangePicker @change="keyNameChg" />
                    </div>
                    <div class="flex text-12px text-gray-400 echarts-sub"><span>只记录TOP5数据</span></div>
                  </template>
                <Echart :options="keyNameData.data" :height="300" />
              </el-card>
            </el-col>
            <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <el-card shadow="hover" class="mb-8px">
                  <template #header>
                    <div class="my--1.5 flex flex-row items-center justify-between">
                      <CardTitle title="高频触发用户" />
                      <!-- 查询条件 -->
                      <ShortcutDateRangePicker @change="highUserChg" />
                    </div>
                    <div class="flex text-12px text-gray-400 echarts-sub"><span>只记录TOP5数据</span></div>
                  </template>
                <Echart :options="highUserData.data" :height="300" />
              </el-card>
            </el-col>
          </el-row>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { formatTime } from '@/utils'
import * as homeApi from '@/api/xuandou/home/index'

import type { TotalList } from './types'
import {
  incomeOptions, goodsOptions, goodsOptionsByOne, 
  activeUserOptions, keyNameOptions, areaOptions, highUserOptions } from './echarts-data'

defineOptions({ name: 'Home' })

const loading = ref(true)
const message = useMessage() 
// 获取今日数量订单
let totalLists = reactive<TotalList[]>([])
const getTotal = async () => {
  const data = [
    {
      name: '总收入',
      num: '',
    },
    {
      name: '全息舱总用户(个)',
      num: '',
    },
    {
      name: '软件总付费订单(条)',
      num: '',
    },
    {
      name: '总预警信息(条)',
      num: '',
    },
    {
      name: '今日收入',
      num: '',
      beforeNum: '',
      beforeType: 'up',
    },
    {
      name: '全息舱今日活跃用户 (个)',
      num: '',
      beforeNum: '',
      beforeType: 'up',
    },
    {
      name: '软件今日付费订单 (条)',
      num: '',
      beforeNum: '',
      beforeType: 'up',
    },
    {
      name: '今日预警信息 (条)',
      num: '',
      beforeNum: '',
      beforeType: 'up',
    },
  ]
  try {
    let res = await homeApi.getData();
    data[0].num = res.totalIncome;
    data[1].num = res.totalUser;
    data[2].num = res.totalPayOrder;
    data[3].num = res.totalWarnMessage;
    
    data[4].num = res.todayIncome;
    data[4].beforeNum = res.yesterdayIncome;
    data[4].beforeType = res.incomeTodayRatio>0?'up':'down';
    
    data[5].num = res.todayActiveUser;
    data[5].beforeNum = res.yesterdayActiveUser;
    data[5].beforeType = res.activeUserTodayRatio>0?'up':'down';

    data[6].num = res.todayPayOrder;
    data[6].beforeNum = res.yesterdayPayOrder;
    data[6].beforeType = res.payOrderTodayRatio>0?'up':'down';

    data[7].num = res.todayWarnMessage;
    data[7].beforeNum = res.yesterdayWarnMessage;
    data[7].beforeType = res.warnMessageTodayRatio>0?'up':'down';
    totalLists = Object.assign(totalLists, data)
  }catch(error) {
    message.error('查询失败！')
  }
}

// =======  收入统计数据
let incomeData = reactive({
  type: 'total',
  list: [
    {name: '全部', value: 'total'},
    {name: '软件收入', value: '1'},
    {name: '硬件收入', value: '2'},
  ],
  params: {
    startTimeStr: '',
    endTimeStr: ''
  },
  data: incomeOptions
})
const handleIncomeChange = () => {
  getIncomeData();
}
const incomeChg = (e) => {
  incomeData.params.startTimeStr = !!e?e[0].split(' ')[0]:'';
  incomeData.params.endTimeStr = !!e?e[1].split(' ')[0]:'';
  getIncomeData();
}
const getIncomeData = async () => {
  if(incomeData.params.startTimeStr == '' || incomeData.params.endTimeStr == '') return;
  try {
    let data = await homeApi.getIncome(incomeData.params);
    data = data[incomeData.type];
    let tempData = [];
    for(let i in data) {
      tempData.push({xAxis: i, value: data[i]});
    }
    tempData = tempData.sort((a,b) => {
      let val1 = a.xAxis;
      let val2 = b.xAxis;
      let tempA = val1.split('-')[0] + val1.split('-')[1].length==1?'0' + val1.split('-')[1]: val1.split('-')[1];
      let tempB = val2.split('-')[0] + val2.split('-')[1].length==1?'0' + val2.split('-')[1]: val2.split('-')[1];
      return tempA - tempB;
    });
    set(incomeData.data,'xAxis.data',tempData.map(dt => dt.xAxis))
    set(incomeData.data,'series[0].data',tempData.map(dt => dt.value))
  }catch(err) {
    message.error('查询失败！')
  }
}

// =======  商品销量排行
let goodsData = reactive({
  type: '',
  list: [
    {name: '全部', value: ''},
    {name: '权益卡', value: '1'},
    {name: '虚拟商品', value: '2'},
    {name: '功能', value: '3'},
  ],
  params: {
    startTimeStr: '',
    endTimeStr: ''
  },
  data: goodsOptions,
  dataByOne: goodsOptionsByOne
})
const handleGoodsChange = () => {
  getEGoodsData();
}
const goodsChg = (e) => {
  goodsData.params.startTimeStr = !!e?e[0].split(' ')[0]:'';
  goodsData.params.endTimeStr = !!e?e[1].split(' ')[0]:'';
  getEGoodsData();
}
const getEGoodsData = async () => {
  if(goodsData.params.startTimeStr == '' || goodsData.params.endTimeStr == '') return;
  try {
    let data = await homeApi.getGoodsSales(goodsData.params);
    if(goodsData.type!='') {
      let temp = new Map();
      temp.set(goodsData.type,data[goodsData.type])
      data = [...temp.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {})
    }
    
    let xAxisData = [];
    let seriesData = [];
    for(let attr in data) {
      let valueData = [];
      for(let time in data[attr]) {
        xAxisData.push(time);
        valueData.push(data[attr][time])
      }

      seriesData.push({
        name: goodsData.list.filter(dt => dt.value == attr)[0].name,
        data: valueData,
        type: 'bar'
      })
    }
    xAxisData = [...new Set(xAxisData)];
    xAxisData = xAxisData.sort((val1, val2) => {
      let tempA = val1.split('-')[0] + val1.split('-')[1].length==1?'0' + val1.split('-')[1]: val1.split('-')[1];
      let tempB = val2.split('-')[0] + val2.split('-')[1].length==1?'0' + val2.split('-')[1]: val2.split('-')[1];
      return tempA - tempB;
    });

    if(goodsData.type =='') {
      set(goodsData.data,'xAxis.data',xAxisData)
      set(goodsData.data,'series',seriesData)
    }else {
      set(goodsData.dataByOne,'xAxis.data',xAxisData)
      set(goodsData.dataByOne,'series',seriesData)
    }
    
    
  }catch(err) {
    message.error('查询失败！')
  }
}

// =======  全息舱活跃用户
let activeUserData = reactive({
  params: {
    startTimeStr: '',
    endTimeStr: ''
  },
  data: activeUserOptions
})
const activeUserChg = (e) => {
  activeUserData.params.startTimeStr = !!e?e[0].split(' ')[0]:'';
  activeUserData.params.endTimeStr = !!e?e[1].split(' ')[0]:'';
  getActiveUserData();
}
const getActiveUserData = async () => {
  if(activeUserData.params.startTimeStr == '' || activeUserData.params.endTimeStr == '') return;
  try {
    let data = await homeApi.getActiveUser(activeUserData.params);
    data = data["1"];
    let tempData = [];
    for(let i in data) {
      tempData.push({xAxis: i, value: data[i]});
    }
    tempData = tempData.sort((a,b) => {
      let val1 = a.xAxis;
      let val2 = b.xAxis;
      let tempA = val1.split('-')[0] + val1.split('-')[1].length==1?'0' + val1.split('-')[1]: val1.split('-')[1];
      let tempB = val2.split('-')[0] + val2.split('-')[1].length==1?'0' + val2.split('-')[1]: val2.split('-')[1];
      return tempA - tempB;
    });

    set(activeUserData.data,'xAxis.data',tempData.map(dt => dt.xAxis))
    set(activeUserData.data,'series[0].data',tempData.map(dt => dt.value))
  }catch(err) {
    message.error('查询失败！')
  }
}

// =======  激活概况(地区)
let areaData = reactive({
  params: {
    startTimeStr: '',
    endTimeStr: ''
  },
  data: areaOptions
})
const areaChg = (e) => {
  areaData.params.startTimeStr = !!e?e[0].split(' ')[0]:'';
  areaData.params.endTimeStr = !!e?e[1].split(' ')[0]:'';
  getAreaData();
}
const getAreaData = async () => {
  if(areaData.params.startTimeStr == '' || areaData.params.endTimeStr == '') return;
  try {
    let data = await homeApi.getActiveOverview(areaData.params);
    let tempData = [];
    for(let i in data) {
      tempData.push({xAxis: i, value: data[i]});
    }
    
    let seriesData = tempData.map(dt => {
      return {value: dt.value.value, name: dt.value.typeName}
    })
    set(areaData.data,'legend.data',tempData.map(dt => dt.xAxis))
    set(areaData.data,'series[0].data',seriesData)
  }catch(err) {
    message.error('查询失败！')
  }
}

// =======  高频触发关键字
let keyNameData = reactive({
  params: {
    startTimeStr: '',
    endTimeStr: ''
  },
  data: highUserOptions
})
const keyNameChg = (e) => {
  keyNameData.params.startTimeStr = !!e?e[0].split(' ')[0]:'';
  keyNameData.params.endTimeStr = !!e?e[1].split(' ')[0]:'';
  getKeyNameData();
}
const getKeyNameData = async () => {
  if(keyNameData.params.startTimeStr == '' || keyNameData.params.endTimeStr == '') return;
  try {
    let data = await homeApi.getHighFrequency(keyNameData.params);
    let tempData = [];
    for(let i in data) {
      tempData.push({xAxis: data[i].typeName, value: data[i]});
    }

    set(keyNameData.data,'xAxis.data',tempData.map(dt => dt.xAxis))
    set(keyNameData.data,'series[0].data',tempData.map(dt => dt.value))
  }catch(err) {
    message.error('查询失败！')
  }
}

// =======  高频触发用户
let highUserData = reactive({
  params: {
    startTimeStr: '',
    endTimeStr: ''
  },
  data: keyNameOptions
})
const highUserChg = (e) => {
  highUserData.params.startTimeStr = !!e?e[0].split(' ')[0]:'';
  highUserData.params.endTimeStr = !!e?e[1].split(' ')[0]:'';
  getHighUserData();
}
const getHighUserData = async () => {
  if(highUserData.params.startTimeStr == '' || highUserData.params.endTimeStr == '') return;
  try {
    let data = await homeApi.getHighFrequencyUser(highUserData.params);
    let tempData = [];
    for(let i in data) {
      tempData.push({xAxis: data[i].typeName, value: data[i]});
    }

    set(highUserData.data,'xAxis.data',tempData.map(dt => dt.xAxis))
    set(highUserData.data,'series[0].data',tempData.map(dt => dt.value))
  }catch(err) {
    message.error('查询失败！')
  }
}

const getAllApi = async () => {
  await Promise.all([
    getTotal(),
  ])
  loading.value = false
}

getAllApi()
</script>
<style scoped lang="scss">
  .xd-home {
    .numarrow {
      width: 19px;
      height: 19px;
      text-align: center;
      border-radius: 50%;
      margin: 0 5px;
    }

    .numdown {
      background: #bae8d9;
      color: #00a870;
    }

    .numup {
      background: #edd5dc;
      color: red;
    }
    
    .echart-box {
      margin-top: 20px;
      height: 30px;
    }

    .echarts-sub {
      position: absolute;
      margin-top:3px;
      margin-left: 5px;
    }

    // element-plus
    ::v-deep .card-title {
      font-size: 18px;
      font-weight: normal;
    }

    ::v-deep .card-title:before {
      display: none;
    }

    ::v-deep .el-radio-group {
      .el-radio-button {
        display: none;
      }
    }

    ::v-deep .el-card__header {
      border-bottom: none;
    }
  } 
</style>
