<template>
    <div class="zhsq-main">
        <div class="zhsq-boxWrapper">
            <div class="zhsq-right-con indexWelBox" ref="content">
                   <p class="indexWelT">
                        <span class="indexWelTC"></span>
                        <span class="indexWelTT">首页</span>
                    </p>
                <div class="indexWel">
                    <div class="indexWelText">
                        欢迎使用<span class="col6c96db">智慧社区</span>管理平台
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less">
.zhsq-boxWrapper{
    height: 99%;
    width: 100%;
    .zhsq-right-con{
        height: 100%;
        width: 100%;
    }
    .tableBox{
         height: 100%;
        width: 100%;
    }
}
.indexWelT{
    position: absolute;
    top :32px;
    left: 25px;
}
.indexWelTC{
    width: 4px;
    height: 18px;
    background: #184DA8;
    display: inline-block;
}
.indexWelTT{
    font-size: 20px;
    color: #3B3D58;
    margin-left: 10px;
}
.indexWel{
    background: url('../../assets/images/indexWel.png') no-repeat;
    height: 100%;
    background-size:250px;
    background-position: center 70%;
}
.indexWelBox{
    position: relative

}
.indexWelText{
    font-size: 28px;
    color: #a9aab5;
    text-align: center;
    padding-top: 13%;
}
.col6c96db{
    color: #6c96db
}
</style>