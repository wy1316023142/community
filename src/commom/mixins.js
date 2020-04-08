
// 计算容器高度模块
export const domHeightMixin = {
  data() {
    return {
      tabHeight:'0',
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.tabHeight=this.$refs.content.offsetHeight-56
      window.onresize =()=> {
        this.tabHeight=this.$refs.content.offsetHeight-56
      };
    })
  }
}

export const pageMixin = {
  data() {
    return {
      filter: {
        page: 1,
        rows: 10,
      }
    }
  },
  methods:{
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
  }
}
