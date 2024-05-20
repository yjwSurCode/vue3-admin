<template>
  <ContentWrap>
    <div>
      <div class="text-20px font-bold">订单信息</div>
    </div>
    <div class="mt-12px">
      <el-table :data="orderTable" border style="width: 100%">
        <el-table-column prop="date" align="center" label="订单编号" width="180" />
        <el-table-column prop="name" align="center" label="下单时间" width="180" />
        <el-table-column prop="name" align="center" label="订单状态" width="180" />
        <el-table-column prop="name" align="center" label="购买人名称" width="180" />
        <el-table-column prop="name" align="center" label="购买人电话" width="180" />
        <el-table-column prop="name" align="center" label="优惠方式" />
        <el-table-column prop="name" align="center" label="付款时间" width="180" />
        <el-table-column prop="name" align="center" label="付款方式" width="180" />
        <el-table-column prop="address" align="center" label="实付金额(￥/币)" width="180" />
      </el-table>
    </div>
  </ContentWrap>

  <ContentWrap>
    <div>
      <div class="text-20px font-bold">商品信息</div>
    </div>
    <div class="mt-12px">
      <el-table :data="orderTable" border style="width: 100%">
        <el-table-column prop="date" align="center" label="商品ID" width="180" />
        <el-table-column prop="name" align="center" label="商品名称" />
        <el-table-column prop="name" align="center" label="商品价格(￥/币)" width="180" />
        <el-table-column prop="address" align="center" label="优惠金额(￥/币)" width="180" />
        <el-table-column prop="name" align="center" label="全息舱设备码" width="180" />
      </el-table>
    </div>
  </ContentWrap>

  <ContentWrap>
    <div>
      <div class="text-20px font-bold">售后信息</div>
    </div>
    <div class="mt-12px">
      <el-table :data="orderTable" border style="width: 100%">
        <el-table-column prop="date" align="center" label="售后订单号" width="180" />
        <el-table-column prop="name" align="center" label="商品名称" width="180" />
        <el-table-column prop="name" align="center" label="商品价格(￥/币)" width="180" />
        <el-table-column prop="name" align="center" label="实付金额(￥/币)" width="180" />
        <el-table-column prop="name" align="center" label="售后时间" width="180" />
        <el-table-column prop="name" align="center" label="退款金额(￥/币)" width="180" />
        <el-table-column prop="name" align="center" label="操作人员" width="180" />
        <el-table-column prop="address" align="center" label="备注" />
      </el-table>
    </div>
  </ContentWrap>

  <div class="text-right z-10" style="margin: 0 100px;">
    <!-- <el-affix position="bottom" :offset="20" > -->
      <el-button @click="cancel" style="margin-right: 40px;">取 消</el-button>
      <el-button type="warning" @click="service" style="margin-right: 40px;">售 后</el-button>
      <el-button type="primary" @click="submit">确 认</el-button>
    <!-- </el-affix> -->
  </div>
</template>
<script lang="ts" setup>

const orderTable = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
<style lang="scss" scoped>

</style>
