<template>
  <div class="LanguageSetting">
    <KTop :title="'语言设置'"></KTop>

    <div class="content">
      <div class="text" @click="goNext('Setting')">

        <p class="title">{{$t('m.changelanguages')}}</p>
        <i class="ico ico-n0 enter"></i>
      </div>

      <div class="text" @click="goNext('Setting')>

        <p class="title">{{$t('m.about')}}</p>
        <i class="ico ico-n0 enter"></i>
      </div>

      <div class="text" @click="goNext('Setting')>
        <p class="title">{{$t('m.updata')}}</p>
        <p class="v">当前为最新版本</p>
        <i class="ico ico-n0 enter"></i>
      </div>

    </div>
</template>

<script>
  import KTop from '@/components/KTop'
    export default {
        name: "LanguageSetting",
      mounted() {
        this.setup()
      },
      methods:{
        goNext(where) {
          this.$router.push(`/${where}`)
        },
      }
    }
</script>

<style scoped>

</style>
