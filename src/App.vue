<template>
  <div id="app" ref="app">
    <router-view/>
  </div>
</template>

<script>
import Api from './commom/api.js'
  export default {
    data(){
      return {
        clientHeight:'',
      }
    },
    mounted(){
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`          //document.body.clientWidth;
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };

    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      }
    },
    methods:{
      changeFixed(clientHeight){                        //动态修改样式
        this.$refs.app.style.height = clientHeight+'px';

      },
    }
  }
</script>
<style lang="less">
  @import './assets/style/base.less';
  @import './assets/style/animation.less';
  @import './assets/style/global.less';
  @import './assets/style/commom.less';
  @import './assets/fonts/TT0246M_/TT0246M_.css';
  @import './assets/fonts/dsDigital/DS-DIGIB.css';
</style>
