<template>
  <div class="video">
    <video id="video" class="video-js vjs-default-skin" data-setup="{}" controls>
      <source src="" type="rtmp/flv">
    </video>
  </div>
</template>
<script>
  import 'video.js/dist/video-js.css'
  import videojs from "video.js/es5/video.js";
  import SWF_URL from "videojs-swf/dist/video-js.swf";

  videojs.options.flash.swf = SWF_URL;
  export default {
    props: {
      naming: '',

    },
    mounted() {
      videojs('video').options().notSupportedMessage = '请打开浏览器flash'
      this.player = videojs('video')
      if (this.naming) {
        Api.getVideoRtmp.get({
          naming: this.naming
        }).then(res => {
          let rtmp = res.data.msg + '\\';
          setTimeout(() => {
            this.player.src('')
            this.player.src(rtmp)
            this.player.play()
          }, 1500)
        }).catch(() => {

        })
      }
    },
    methods: {
      destroyVideo() {
        if (this.player) {
          this.player.dispose();
          this.player = null;
        }
      },
    },
    data() {
      return {
        player: null,//
      }
    }
  }
</script>
<style lang="less">
  .video {
    width: 100%;
    height: 100%;
  }
</style>
