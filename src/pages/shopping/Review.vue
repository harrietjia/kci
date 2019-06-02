<template>
  <div class="Review">
    <KTop :title="'发表评价'"></KTop>

    <div class="wrap" v-for="(o,i) of orderSub">
      <div class="top">
        <div class="img-box">
          <img :src="o.goods_picture" alt="图片">
        </div>
        <p>{{o.goods_name}}</p>
      </div>

      <div class="center">
      <textarea ref="contents" v-model="content[i]" maxlength="200" name="txt" warp="virtual"
                placeholder="给收到的宝贝写上你的评论吧"></textarea>
        <div class="imgBox">
          <div class="showImg" @click.stop="show(s)" v-for="(s,index) of appraiseList[i]">
            <img :src="s" alt="评价图片">
            <i class="ico ico-delete" @click.stop="delSrc(index,i)"></i>
          </div>
          <div class="addImg" @click.stop="addImg(i)">
            <input class="input-file" v-show="false" :id="'input'+i" @change="uploading($event,i)" type="file"
                   multiple="multiple"
                   accept="image/jpeg,image/jpg,image/png">
            <img src="../../assets/images/camera.png" alt="">
            <p>添加图片</p>
          </div>
        </div>

      </div>
      <div class="score">
        <p>给宝贝评个分吧~</p>
        <Star :i="i" @selectStar="selectStar"></Star>
      </div>
    </div>

    <KButton :title="'发表评价'" @clickBtn="submit()"></KButton>

    <KPublish :props-show="showImg" @close="hide">
      <div class="uploadImg" :style="'backgroundImage: url('+imgURL+')'">
      </div>
    </KPublish>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import KPublish from '@/components/KPublish'
  import Star from '@/components/Star'
  import {mapGetters} from 'vuex'
  import * as api from '@/api/index'
  import axios from 'axios'

  export default {
    name: "Review",
    components: {
      KTop,
      KButton,
      KPublish,
      Star
    },
    data() {
      return {
        score: [],
        text: [],
        content: [],
        type: '',
        config: {
          timeout: 60000,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        file: '',
        src: [],
        showImg: false,
        imgURL: '',
        orderSub: [],
        appraiseList: []
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'signature', 'orders']),
    },
    created() {
      if (!this.signature.host) {
        this.$store.dispatch('getSignature')
      }
      this.orderSub = this.$route.params.sub
      if (!this.orderSub) {
        this.$router.push('/OrderList')
      }
      for (let i = 0, len = this.orderSub.length; i < len; i++) {
        this.src[i] = []
        this.appraiseList[i] = []
      }
    },
    methods: {
      selectStar(index, score) {
        // 点击当前星星索引值+1
        this.score[index] = score;
        if (this.score[index] === 1) {
          this.text[index] = '不满意';
        }
        if (this.score[index] === 2) {
          this.text[index] = '一般';
        }
        if (this.score[index] === 3) {
          this.text[index] = '还好';
        }
        if (this.score[index] === 4) {
          this.text[index] = '较满意';
        }
        if (this.score[index] === 5) {
          this.text[index] = '很满意';
        }

      },
      delSrc(index, i) {
        this.src[i].splice(index, 1);
      },
      hide() {
        this.showImg = false
        this.imgURL = ''
      },
      show(url) {
        this.imgURL = url
        this.showImg = true
      },
      addImg(i) {
        if (this.src[i].length >= 6) {
          this.$toast('最多上传6张')
          return
        }
        document.querySelector(`#input${i}`).click()
      },
      uploading(e, index) {
        //获取文件
        this.file = e.target.files[0]
        //创建图片文件的url
        // const windowURL = window.URL || window.webkitURL
        // this.file.src = windowURL.createObjectURL(this.file)
        if (!this.file) return
        if (e.target.files.length > 1) {
          if (e.target.files.length > 6) {
            this.$toast('文件数不能超过6个')
            return
          }
          for (let i = 0, len = e.target.files.length; i < len; i++) {
            this.syncSubmit(e.target.files[i], index)
          }
        } else {
          this.syncSubmit(this.file, index)
        }
      },
      syncSubmit(file, index) {
        const self = this
        self.$loading()
        const form = new FormData()
        const filename = this.signature.client_id + new Date().getTime() + file.name
        form.append('name', filename)
        form.append('key', this.signature.dir + filename)
        form.append('policy', this.signature.policy)
        form.append('OSSAccessKeyId', this.signature.accessid)
        form.append('success_action_status', 200)
        form.append('signature', this.signature.signature)
        form.append('file', file)
        axios.post(this.signature.host, form, this.config).then(res => {
          file.err = ''
          file.src = `${this.signature.host}/${this.signature.dir}${filename}`
          if (self.src[index].length >= 6) {
            this.$toast('最多上传6张')
            self.$loading(0)
            return
          }
          self.src[index].push(file.src)
          console.log(index)
          self.appraiseList.splice(index, 1, self.src[index])
          // self.appraiseList[index] = self.src[index]  错误示范
          self.$loading(0)
        }).catch(err => {
          file.err = '上传图片失败'
          self.$loading(0)
        })
      },
      submit() {
        // if (!this.content) {
        //   this.$toast('评论不能为空！')
        //   return
        // }

        let goods_appraise_list = []
        for (let i = 0, len = this.orderSub.length; i < len; i++) {
          if (!this.score[i]) {
            this.$toast('请给宝贝评分')
            return
          }

          goods_appraise_list.push({
            'sub_order_id': this.orderSub[i].sub_order_id,
            'content': this.content[i],
            'goods_score': this.score[i],
            'appraise_pic_url': this.appraiseList[i],
          })
        }
        api.Review({
          'goods_appraise_list': goods_appraise_list,
          'parent_order_id': this.orderSub[0].parent_order_id
        }).then(res => {
          this.content = ''
          this.score = 0
          this.$toast(res.errorMessage)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('star')
  }

  .ico-n2 {
    .bg-image('star2')
  }

  .half {
    .bg-image('half')
  }

  .ico-delete {
    .bg-image('del');
    width: .8rem;
    height: .8rem;
  }

  .wrap {
    margin-bottom: .3rem;
  }

  .Review {
    width: 100%;
    height: 100%;
    font-size: @font-s;
    .top {
      display: flex;
      background: @white-color;
      padding: .5rem;
      border-bottom: 1px solid @border-color;
      .img-box {
        flex: 0 0 2rem;
        .box-img(2rem, 2rem);
        margin: 0;
        img {
          width: 100%;
          height: 100%;
          left: 0;
        }
      }
      p {
        flex: 1;
        .no-wrap();
        line-height: 2rem;
        margin-left: .5rem;
      }
    }
    .center {
      min-height: 12rem;
      background: @white-color;
      border-bottom: 1px solid @border-color;
      display: flex;
      flex-direction: column;
      textarea {
        .center();
        font-size: @font-s;
        width: 85%;
        /*margin-top: .5rem;*/
        padding: .5rem;
        height: 6rem;
        flex: 0 0 6rem;
        border: none;
        // outline: 1px solid @border-color;
      }
      .imgBox {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
      .showImg {
        .box-img(4rem, 3.7rem);
        margin: 0 .5rem .5rem .5rem;
        img {
          width: 100%;
          height: 100%;
          left: 0;
        }
        i {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;
        }
      }
      .addImg {
        width: 3rem;
        height: 2.5rem;
        padding: .6rem .5rem;
        margin: 0 .5rem .5rem .5rem;
        border: 1px solid @border-color;
        text-align: center;
        font-size: @font-xs;
        img {
          width: 1.3rem;
          height: 1.3rem;
        }
        p {
          color: #bbbbbb;
        }
      }
    }
    .score {
      background: @white-color;
      margin-top: .5rem;
      padding: .5rem;
      border-top: 1px solid @border-color;
      border-bottom: 1px solid @border-color;
      color: @text-color;
      .star {
        padding: .5rem 0;
        i {
          display: inline-block;
          vertical-align: middle;
          width: 1rem;
          height: 1rem;
          margin-left: .5rem;
        }
        i:first-child {
          margin: 0;
        }
        span {
          margin-left: 6.5rem;
          vertical-align: middle;
          color: #bbbbbb;
        }
      }

    }

    .uploadImg {
      width: 80%;
      height: 80%;
      margin: 10% auto;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }

  }
</style>
