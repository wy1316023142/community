<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">视频巡查</p>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35">
        <el-col :span="6" :style="{height: tabHeight + 'px',maxHeight:tabHeight + 'px'}">
          <div class="zhsq-tree-box">
            <h3>视频点位</h3>
               <div class="zhsqBackLine left9 top42"></div>
            <div class="zhsqTopLine left9 top42 w72"></div>
            <el-tree
              class="zhsq-tree"
              :data="data"
              :props="props"
              :load="loadNode"
              node-key="id"
              @node-click="nodeClick"
              highlight-current
              :expand-on-click-node="false"
              lazy>
              <span class="zhsq-tree-slot" slot-scope="{ node, data }">
                 <span v-if="data.naming" class="shexiangtou-icon"><img src="">{{ data.name }}</span>
                 <span v-if="!data.naming" class="organType-icon">{{ data.name }}</span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox" :style="{height: tabHeight + 'px',maxHeight:tabHeight + 'px'}">
              <el-row style="height: 100%;padding: 10px;" :gutter="10">
                <el-col :span="12" style="height:50%"  >
                  <div :class="[index==1 ? 'active'  : '', 'videoBox']"  v-loading="loading1">
                    <video id="video1" class="video-js vjs-default-skin"  data-setup="{}" >
                      <source   ref="video1" type="rtmp/flv">
                    </video>
                    <div class="video-control">
                      <el-button icon="el-icon-check" circle size="mini" @click="select(1)"></el-button>
                      <el-button icon="el-icon-close" circle size="mini" @click="stop(1)"></el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" style="height:50%" >
                  <div :class="[index==2 ? 'active' : '', 'videoBox']" v-loading="loading2">
                    <video id="video2" class="video-js vjs-default-skin"  data-setup="{}">
                      <source  src=""  type="rtmp/flv">
                    </video>
                    <div class="video-control">
                      <el-button icon="el-icon-check" circle size="mini" @click="select(2)"></el-button>
                      <el-button icon="el-icon-close" circle size="mini" @click="stop(2)"></el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" style="height:50%" >
                  <div :class="[index==3 ? 'active'  : '', 'videoBox']" v-loading="loading3">
                    <video id="video3" class="video-js vjs-default-skin"  data-setup="{}" >
                      <source src=""   type="rtmp/flv">
                    </video>
                    <div class="video-control">
                      <el-button icon="el-icon-check" circle size="mini" @click="select(3)"></el-button>
                      <el-button icon="el-icon-close" circle size="mini" @click="stop(3)"></el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" style="height:50%"  >
                  <div :class="[index==4 ? 'active'  : '', 'videoBox']" v-loading="loading4">
                    <video id="video4" class="video-js vjs-default-skin"  data-setup="{}">
                      <source src=""  type="rtmp/flv">
                    </video>
                    <div class="video-control">
                      <el-button icon="el-icon-check" circle size="mini" @click="select(4)"></el-button>
                      <el-button icon="el-icon-close" circle size="mini" @click="stop(4)"></el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import OrganTree from '../../components/OrganTree.vue'
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import 'video.js/dist/video-js.css'
  import videojs from "video.js/es5/video.js";
  import SWF_URL from "videojs-swf/dist/video-js.swf";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  videojs.options.flash.swf = SWF_URL;
  export default {
    name: 'videojs',
    components: {
      ElButton,
      ElCol,
      ElRow,
      OrganTree},
    data() {
      return {
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false,
        index:1,
        id:'',
        tabHeight:'0',
        videoList:[],
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        data:[],
      }
    },
    mounted(){
      videojs('video1').options().notSupportedMessage = '请打开浏览器flash'
      videojs('video2').options().notSupportedMessage = '请打开浏览器flash'
      videojs('video3').options().notSupportedMessage = '请打开浏览器flash'
      videojs('video4').options().notSupportedMessage = '请打开浏览器flash'
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.innerBody.offsetHeight-138
        window.onresize =()=> {
          this.tabHeight=this.$refs.innerBody.offsetHeight-138
        };
      })

    },
    methods: {
      _fetchData:(async function(isRoot,parentId) {
        let filter={}
        filter.parentId=parentId;
        if(isRoot) filter.isRoot=1;
        const data = await Api.getEquipmentList.get(filter).then(res => res.data.rows)
        this.data=data;
      }),
      loadNode(node, resolve) {
        if(node.data.naming){
          return resolve([]);
        }
        if(node.level==0){
          let organId=JSON.parse(sessionStorage.getItem('user')).organId;
          this._fetchData(true,organId);
        }else {
          Api.getEquipmentList.get({parentId:node.key}).then(res =>{
            res.data.rows.forEach(item=>{
              if(item.hasOwnProperty("naming"))   item.leaf=true
            })
            resolve(res.data.rows);
          })
        }
      },
      nodeClick(item){
        if(!item.naming) return false
        if(this.index===1) this.loading1=true
        if(this.index===2) this.loading2=true
        if(this.index===3) this.loading3=true
        if(this.index===4) this.loading4=true
        /*if(item.id==this.id) return  false
        else this.id=item.id*/

        Api.getVideoRtmp.get({
          naming:item.naming
        }).then(res=>{
          let rtmp=res.data.msg+'\\';
          setTimeout(()=>{
            this.$message({message: '请求成功', type: 'success'});
            if(this.index===1) {
              this.loading1=false
              videojs('video1').src('')
              videojs('video1').src(rtmp)
              videojs('video1').play()
            }
            if(this.index===2) {
              this.loading2=false
              videojs('video2').src('')
              videojs('video2').src(rtmp)
              videojs('video2').play()
            }
            if(this.index===3) {
              this.loading3=false
              videojs('video3').src('')
              videojs('video3').src(rtmp)
              videojs('video3').play()
            }
            if(this.index===4) {
              this.loading4=false
              videojs('video4').src('')
              videojs('video4').src(rtmp)
              videojs('video4').play()
            }
          },1500)
        }).catch(()=>{
          this.loading=false
        })
        //this.videoList.push('rtmp://202.69.69.180:443/webcast/bshdlive-pc');
      },
      select(index){
        this.index=index
      },
      stop(index){
        if(index===1) {
          videojs('video1').src('')
          videojs('video1').play()
        }
        if(index===2) {
          videojs('video2').src('')
          videojs('video2').play()
        }
        if(index===3) {
          videojs('video3').src('')
          videojs('video3').play()
        }
        if(index===4) {
          videojs('video4').src('')
          videojs('video4').play()
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      videojs('video1').dispose()
      videojs('video2').dispose()
      videojs('video3').dispose()
      videojs('video4').dispose()
      next()
    },
  };
</script>
<style lang="less" scoped >
  .video-js{
    width: 100%;
    height: 100%;
  }
  .video-control{
    position: absolute;
    left: 15px;
    bottom: 15px;
  }

  .zhsq-tree-slot{
    font-size: 14px;
    .shexiangtou-icon{
      background: url("../../assets/images/commom/shexiangtou.png") no-repeat left top;
      padding-left:22px; ;
    }
    .community-icon{
      background: url("../../assets/images/commom/organ.png") no-repeat left center;
      padding-left:22px; ;
    }
    .organType-icon{
      background: url("../../assets/images/commom/xiaoqu.png") no-repeat left center;
      padding-left:22px; ;
    }
  }
</style>
