<template>
  <div class="news">
    <KTop :title="'文章详情'"></KTop>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="title">
        <p>{{news.title}}</p>
      </div>

      <div class="container">
        <div class="content" v-html="news.body">
        </div>

        <div class="comments">
          <h3 class="bt-line" v-show="commentList && commentList.length > 0">评论列表</h3>
          <ul class="comment" v-for="c in commentList">
            <li class="comment-list">
              <div class="head">
                <div class="left">
                  <img :src="c.head_img_url" alt="头像"/>
                  <p class="name"><span>{{c.client_name}}</span> <i class="ico img-bg" v-if="c.is_super_node==='1'"></i>
                  </p>
                </div>
                <p class="likep"><i @click="clickLike(c)" :class="c.is_like ===1 ?'ico like2':'ico like'"></i>{{c.like_count}}
                </p>
              </div>
              <p class="comment-text">
                {{c.body}}
              </p>
              <div class="foot">
                <p class="time">{{c.create_time}}</p>
                <!--<p class="talk">{{c.reply_count}}回复</p>-->
              </div>

            </li>
          </ul>
        </div>

      </div>

      <div class="space"></div>
    </scroller>

    <div class="footer">
      <div class="left">
        <div class="talk" @click="toTalk()">
          <i class="ico ico-n1"></i>
          <input disabled="disabled" placeholder="发表评论..." maxlength="360" type="text"/>
        </div>
      </div>
      <div class="right">
        <p class="collect" @click="collect"><i :class="is_attention === 0 ? 'ico':'ico on'"></i></p>
        <p><i class="ico talk"></i>{{news.reply_count}}</p>
        <p><i @click="clickLike2" :class="like2 ?'ico like2':'ico like'"></i>{{news.like_count}}</p>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '@/api/index'
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'
  import wx from 'weixin-js-sdk'

  export default {
    name: "News",
    components: {
      KTop
    },
    data() {
      return {
        news: {},
        comment: [],
        like2: false,
        is_attention: 0
      }
    },
    computed: {
      ...mapGetters(['commentList', 'commentCount', 'clientInfo',])
    },
    created() {
      this.getIndex()
      this.getDatas(0, true)
    },
    methods: {
      collect() {
        api.changeCollect({
          'type': 3,
          'topic_id': this.$route.query.topic_id
        }).then((res) => {
          this.is_attention = res.data.is_attention
        })

      },
      toTalk() {
        this.$router.push({path: '/Talk', query: {id: this.news.topic_id}})
      },
      clickLike(c) {
        api.like({
          id: c.comment_id,
          type: 2
        }).then(() => {
          if (c.is_like === 1) {
            c.like = 0
          } else {
            c.like = 1
          }
          this.$store.commit('CHANGE_COMMENT', {comment: c})
        })
      },
      clickLike2() {
        api.like({
          id: this.news.topic_id,
          type: 1
        }).then(() => {
          this.getIndex()
          this.like2 = !this.like2
        })
      },
      getIndex() {
        api.showIndex({
          topic_id: this.$route.query.topic_id
        }).then((res) => {
          this.news = res.data
          this.is_attention = this.news.is_attention
          this.share()
          if (this.news.is_like === 1) {
            this.like2 = true
          }
        })
      },
      refresh(done) {
        setTimeout(() => {
          done()
          this.getDatas(0, true)
        }, 300)
      },
      loading(done) {
        if (this.isRequest) {
          done()
          return
        }
        setTimeout(() => {
          this.getDatas(this.commentCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      async getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return await  this.$store.dispatch('getCommentsList', {
          'page': page + 1,
          'id': this.$route.query.topic_id,
          'type': 1,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        })
      },
      share() {
        const opt = {
          title: this.news.title,
          link: window.location.href,
          imgUrl: this.news.pic_url,
          desc: this.news.preview_content,
        }
        wx.onMenuShareTimeline(opt)
        wx.onMenuShareAppMessage(opt)
        wx.onMenuShareQQ(opt)
        wx.onMenuShareWeibo(opt)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .scroller {
    margin-top: 2.5rem;
  }

  .news {
    width: 100%;
    min-height: 100%;
    background: white;
    .title {
      margin: .5rem;
      border-bottom: 1px solid @border-color;
    }
    .container {
      min-height: 25rem;
      .content {
        width: 94%;
        margin: 0 auto;
        padding: .5rem 0;
        font-size: @font-s;
      }
      .comments {
        .bt-line {
          font-size: .8rem;
          line-height: 1rem;
          color: @primary-active;
          padding: .3rem .5rem;
          border-bottom: 1px solid #f5f5f5;
        }
        .comment {
          .comment-list {
            display: block;
            padding: .5rem;
            border-bottom: 1px solid #f5f5f5;
            font-size: @font-s;
            .head {
              display: flex;
              .left {
                flex: 1;
                display: flex;
                img {
                  display: inline-block;
                  width: 2rem;
                  height: 2rem;
                  // background: @primary-active;
                }
                .name {
                  margin-left: .5rem;
                  line-height: 2rem;
                }
                .img-bg {
                  .bg-image('head');
                  width: 1rem;
                  height: 1rem;
                  vertical-align: middle;
                }
              }
              .likep {
                flex: 0 0 3rem;
                color: @gray-color;
                .like {
                  .bg-image('home_fabulous1@2x');
                  width: 1rem;
                  height: 1rem;
                  margin: .5rem;
                }
                .like2 {
                  .bg-image('home_fabulous@2x');
                  width: 1rem;
                  height: 1rem;
                  margin: .5rem;
                }
              }
            }
            .comment-text {
              margin-top: .5rem;
              font-size: .7rem;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .foot {
              display: flex;
              font-size: @font-xs;
              line-height: 1.5rem;
              .time {
                color: #999999;
              }
              .talk {
                margin-left: .5rem;
              }
            }
          }
        }

      }
    }
    .space {
      height: 1.5rem;
    }
    .footer {
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      height: 2rem;
      z-index: 10;
      border-top: 1px solid @border-color;
      background: white;
      display: flex;
      .left {
        flex: 1;
        display: flex;
        align-self: center;
        .talk {
          height: 1.6rem;
          width: 92%;
          margin: .2rem 5%;
          background: #f3f3f3;
          border-radius: 30px;
          display: flex;
          i {
            align-self: center;
            .bg-image('home_comment@2x');
            margin: 0 .6rem;
            width: 1rem;
            height: 1rem;
            line-height: 1.2rem;
          }
          input {
            align-self: center;
            width: 8rem;
            height: 1rem;
            border: none;
            background: #f3f3f3;
            font-size: .7rem;
          }
        }
      }
      .right {
        flex: 0 0 5rem;
        display: flex;
        p {
          width: 2rem;
          font-size: @font-s;
          line-height: 2rem;
          color: @gray-color;
          padding: 0 .1rem;
        }
        .collect {
          width: 1.3rem;
          line-height: 1.9rem;
          padding: 0;
          i {
            .bg-image('home_Collection1@2x');
            width: 1rem;
            height: 1rem;
          }
          .on {
            .bg-image('home_Collection@2x');
          }
        }
        .talk {
          .bg-image('talk');
          width: 1rem;
          height: 1rem;
          margin-right: .2rem;
          /*margin: .5rem;*/
        }
        .like {
          .bg-image('home_fabulous1@2x');
          width: 1rem;
          height: 1rem;
          margin-right: .2rem;
        }
        .like2 {
          .bg-image('home_fabulous@2x');
          width: 1rem;
          height: 1rem;
          margin-right: .2rem;
        }
      }
    }
  }
</style>
