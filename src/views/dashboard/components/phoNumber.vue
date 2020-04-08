<template>
  <div class="onethreeBigBox flex">
    <div class="flexItem">
      <p class="text1">{{data.personNum}}</p>
      <img src="@/assets/images/templete/helong/11aa.png" alt="">
      <p class="text2">实有人口</p>
    </div>
    <div class="flexItem">
      <p class="text1">{{data.totalHouseNum}}</p>
      <img src="@/assets/images/templete/helong/22aa.png" alt="">
      <p class="text2">实有房屋</p>
    </div>
    <div class="flexItem">
      <p class="text1">{{data.totalOrganNum}}</p>
      <img src="@/assets/images/templete/helong/33aa.png" alt="">
      <p class="text2">实有单位</p>
    </div>
  </div>
</template>

<script>
  /*一标三实*/
  import Api from '@/commom/api.js'
  export default {
    name: "phoNumber",
    data() {
      return {
        data: {
          totalOrganNum:0,
          totalHouseNum:0,
          personNum:0
        }
      }
    },
    mounted() {
      if (this.$route.query.organId) {
        this._fetchData(this.$route.query.organId)
      }
    },
    methods: {
      _fetchData: function (organId) {
        Api.hlPHONumber.get({}, {
          pathParams: {
            orgId: organId
          }
        }).then(res => {
          this.data = res.data.result
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .onethreeBigBox {
    width: 100%;
    height: 260px;
    .flexItem{
      text-align: center;
      img{
        padding: 20px 0;
      }
      .text1 {
        font-size: 18px;
        color: #fbb22a;
        text-align: center;
        font-weight: bold;
        font-family: "TT0246M_";
      }
      .text2 {
        width: 34px;
        margin: 0 auto;
        color: #93d2f9;
        text-align: center;
        font-size: 12px;
        font-family: "PingFang SC",sans-serif;
      }
    }

  }
</style>
