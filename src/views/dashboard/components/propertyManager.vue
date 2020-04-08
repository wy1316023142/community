<template>
    <div class="propertyManagerBox">
        <div v-for="item in data">
            <img :src="item.picPath" alt="">
            <p>{{item.organName}}</p>
            <p>{{item.name}}</p>
            <p>{{item.phone}}</p>
        </div>
        <div class="propertyManagerNoMes" v-show="propertyManagerNoMes">
            暂无数据
        </div>
    </div>
</template>

<script>
  import Api from '@/common/api.js'
  import { getUrlParame } from '@/common/util.js'
  import { getParentParame } from '../zhsq/mixins.js'
    export default {
        mixins: [ getParentParame ],
        name: "propertyManager",
        data(){
            return{
                data:[],
                propertyManagerNoMes:false
            }
        },
        mounted(){
            if(getUrlParame('organId')){
                  let organId= getUrlParame('organId')
                  this._fetchData(organId)
              }
        },
        methods:{
            _fetchData :  function(organId) {
                Api.hlPropertyOrgan.get({}, {
                    pathParams: {
                        id: organId
                    }
                }).then(res => {
                     this.data=[]
                    if (res.data.rows.length>0){
                        this.propertyManagerNoMes=false
                        if(res.data.rows.length>2){
                            for (let i = 0; i < 2; i++) {
                                this.data.push(res.data.rows[i])  
                                console.log(this.data);                        
                            }
                        }else{
                            this.data=res.data.rows
                        }
                    }else{
                        this.propertyManagerNoMes=true
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
.propertyManagerBox{
    color: #91cbee;
    font-size: 12px;
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
img{
    width: 130px;
    height: 156px;
}
p{
    margin-top: 8px;
}
.propertyManagerNoMes{
    color: #ccc;
}
}
</style>