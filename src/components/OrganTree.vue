<template>
  <div class="zhsq-tree-box" ref="tree-box">
    <el-input placeholder="搜索"   suffix-icon="el-icon-search" v-model="filterText"></el-input>
    <el-tree class="zhsq-tree"
             ref="tree"
             :data="treeList"
             :props="defaultProps"
             highlight-current
             current-node-key
             @node-click="nodeClick"
             :default-expanded-keys="defaultExpandKeys"
             :expand-on-click-node="false"
             :filter-node-method="filterNode"
             @node-expand="nodeExpand"
             node-key="id">
         <span class="zhsq-tree-slot" slot-scope="{ node, data }">
           <span v-if="data.organType==1" class="community-icon"><img src="">{{ data.name }}</span>
           <span v-if="data.organType==2" class="organType-icon">{{ data.name }}</span>
         </span>
    </el-tree>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import Api from '../commom/api.js'
import bus from '../commom/bus.js';
export default {
  props: {
    defaultExpandKey:Array,
    activeKey: [Number, String]
  },
  mounted() {
    this._fetchData()
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.organTree.get({}).then(data => data.data.result)
      this.treeList=[data] || []
      sessionStorage.setItem('treeListName', JSON.stringify(this.treeList[0].name))
      bus.$emit('treeList',  this.treeList)
      if(this.activeKey==''|| this.activeKey==undefined )  this.currentKey=JSON.parse(sessionStorage.getItem('user')).organId;
      else this.currentKey=this.activeKey
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentKey)
      })
    }, 100),
    nodeClick(...args) {
      this.$emit('node-click', args)
    },
    nodeExpand(){

    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
  computed: {
    defaultExpandKeys() {
      if(this.defaultExpandKey&& this.defaultExpandKey.length!=0 )return this.defaultExpandKey
      else return [this.treeList.length ? this.treeList[0].id : '']
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      currentKey: this.activeKey,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText:''
    }
  }
}
</script>
<style lang="less">
  .zhsq-tree-slot{
    font-size: 14px;
    .community-icon{
      background: url("../assets/images/commom/organ.png") no-repeat left center;
      padding-left:22px; ;
    }
    .organType-icon{
      background: url("../assets/images/commom/xiaoqu.png") no-repeat left center;
      padding-left:22px; ;
    }
  }
</style>
