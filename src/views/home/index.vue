<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
         slot="title"
         type="info"
         size="small"
         round
         icon="search"
         to="/search"
         >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画 -->
    <van-tabs class="channel-tabs" v-model="active" animated>
      <van-tab 
        :title="channel.name"
        v-for="channel in channels "
        :key="channel.id"
        >
        <!-- 文章列表 -->
        <article-list :channel="channel"/>
        <!-- /文章列表 -->
         </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div 
        slot="nav-right"
        class="hamburger-btn" 
        @click="isEditChannelShow=true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->


    <!-- 频道编辑弹出层 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isEditChannelShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <channel-edit 
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"/>
    </van-popup>
    <!-- /频道列表弹出层 -->
  </div>
</template>

<script>
import {getUserChannels} from '@/api/user'
import ArticleList from './conponents/article-list'
import ChannelEdit from './conponents/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
    ArticleList,
  data () {
    return {
      active: 0,
      channels:[],
      isEditChannelShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels(){
      try{
        // const {data} =await getUserChannels()
        // // console.log(data);
        // this.channels=data.data.channels
       
        let channels = []
        if (this.user) {
          // 已登录，请求获取线上的频道数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          //未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }

        // 将数据更新到组件中
        this.channels = channels
      }catch(err){
        this.$toast('获取用户频道失败')
      }
    },
    onUpdateActive(index, isEditChannelShow = true){
      // true 表示频道弹出层显示
      // 更新激活的频道项
      this.active=index
      // 关闭编辑频道弹层
      this.isEditChannelShow= isEditChannelShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container{
  padding-bottom: 100px;
  padding-top: 84px;
  .van-nav-bar--fixed{
    position: fixed;
    top: 3px;
    left: 0;
    width: 100%;
  }
  .van-nav-bar__title{
    max-width: unset ;
  }
  .search-btn{
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
 /deep/ .channel-tabs{
   .van-tabs__nav--line{
    padding: 0;
    height: 82px;
    position: fixed;
    top: 92px;
    bottom: 100px;
    right: 0;
    left: 0;
    z-index: 1;
      
   }
    .van-tab{
     min-width: 200px; 
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333 ;
    }
    .van-tabs__line{
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;//0 表示不参与空间的计算
      width: 66px;
      height: 82px;
    }
    .hamburger-btn{
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
       opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {//元素内容前插入一个伪元素 sass
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
