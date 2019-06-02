<template lang="html">
  <div class="box-file">
    <input class="input-file" @change="uploading($event)" type="file" :multiple="multiple"
           accept="image/jpeg,image/jpg,image/png">
    <!--<div class="input-file" @click="chooseImage"></div> -->
    <div class="uploadImg" :style="'backgroundImage: url('+src+')'">
      <!-- <span>+</span> -->
    </div>
    <i class="target top-left"></i>
    <i class="target top-right"></i>
    <i class="target bottom-left"></i>
    <i class="target bottom-right"></i>
    <div class="load-mack" v-show="loading">上传中....</div>
  </div>
</template>

<script>
  // import wx from 'weixin-js-sdk'
  export default {
    name: 'UploadImg',
    props: {
      propsSrc: {
        types: String,
        default: ''
      },
      loading: {
        types: Boolean,
        default: false,
      },
      multiple: {
        types: Boolean,
        default: false
      },
    },
    watch: {
      propsSrc(val) {
        this.src = val
      }
    },
    data() {
      return {
        file: '',
        src: this.propsSrc
      }
    },
    methods: {
      uploading(e) {
        //获取文件
        this.file = e.target.files[0]
        //创建图片文件的url
        const windowURL = window.URL || window.webkitURL
        this.src = windowURL.createObjectURL(this.file)
        if (!this.file) return
        if (this.multiple) {
          if (e.target.files.length > 10) {
            this.$toast('文件数不能超过10个')
            return
          }
          this.$emit('upload', e.target.files)
        } else {
          this.$emit('upload', this.file)
        }
      },
      // chooseImage() {
      // 	const self = this
      // 	wx.ready(function() {
      // 		wx.chooseImage({
      // 			count: 1, // 默认9
      // 			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // 			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      // 			success(res) {
      // 				// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      // 				const localIds = res.localIds[0]
      // 				wx.getLocalImgData({
      // 					localId: localIds,
      // 					success(res) {
      // 						const data = res.localData.replace('jgp', 'jpeg')
      // 						self.src = data
      // 						self.$emit('upload', data)
      // 					}
      // 				})
      // 			}
      // 		})
      // 	})
      // },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .box-file {
    position: relative;
    box-shadow: 0 0.5px 2px 0 @primary-active;
    border-radius: 4px;
    width: 8rem;
    height: 6rem;
    text-align: center;
    line-height: 6rem;
    margin: 1.5rem auto .5rem auto;
    .input-file {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .uploadImg {
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      height: 100%;
    }
    span {
      font-size: 3.5rem;
      font-weight: 400;
      color: @primary-active;
    }
    .target {
      position: absolute;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 2px;
    }
    .top-left {
      left: -8px;
      top: -8px;
      border-top: 3px solid @primary-active;
      border-left: 3px solid @primary-active;
    }
    .top-right {
      right: -8px;
      top: -8px;
      border-top: 3px solid @primary-active;
      border-right: 3px solid @primary-active;
    }
    .bottom-left {
      left: -8px;
      bottom: -8px;
      border-bottom: 3px solid @primary-active;
      border-left: 3px solid @primary-active;
    }
    .bottom-right {
      right: -8px;
      bottom: -8px;
      border-bottom: 3px solid @primary-active;
      border-right: 3px solid @primary-active;
    }
    .load-mack {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #fff;
      background: rgba(0, 0, 0, .7);
      font-size: @font-xl;
    }
  }
</style>
