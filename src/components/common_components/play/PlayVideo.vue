<template>
  <div class="prism-player" id="J_prismPlayer" style="position: relative; margin: 15px">
  </div>
</template>

<script>
import $ from 'jquery'
var player = null;
var duration = '';

var playVideo = function (VideoId, auth) {
  var params = {
    id: 'J_prismPlayer',
    width: '90%',
    autoplay: false,
    vid: VideoId,
    playauth: auth,
    useFlashPrism: true
  }
  player = new prismplayer(params);

}

import Vue from 'vue';
import qs from 'qs'
import Interface from '@/util/interface'

export default {
  props: ['videoId'],
  data() {
    return {
      play: {},
      duration: '',
      player: player,
      playVideo: playVideo,
    }
  },
  methods: {
    fetch(param) {
      if (this.$route.params.videoId) {
        param = this.$route.params.videoId
      } else {
        params = this.VideoId
      }
      var params = {
        videoId: param
      }
      this.axios({
        url: `${Interface.video.play}/${param}/play`,
        method: 'get',
        params: params
      }).then((res) => {
        if (res.status == 200 && res.data.code == 200) {
          playVideo(res.data.data.VideoId, res.data.data.auth)
          let duration = parseInt(res.data.data.Duration)
          if (duration < 10) {
            duration = '00:0' + Math.floor(duration)
          } else if (duration > 10 && duration < 60) {
            duration = '00:' + Math.floor(duration)
          } else {
            duration = '0' + Math.floor(duration / 60) + ':' + Math.ceil(duration / 60 - Math.floor(duration % 60))
          }
          this.duration = duration;
          this.getDuration()
        }
      }).catch((res) => { })
    },
    getDuration() {
      this.$emit('durationTime', this.duration)
    }
  },
  created() {
    if (this.$route.params.videoId) {
      this.fetch(this.$route.params.videoId);
    }
  }

}

</script>
<style>
@import '//g.alicdn.com/de/prismplayer/1.9.4/skins/default/index.css';

.container {
  padding: 40px;
}
</style>
