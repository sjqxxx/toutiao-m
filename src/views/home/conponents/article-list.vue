<template>
  <div class="article-list">
      <van-pull-refresh 
        v-model="isReFreshLoading" 
        :success-text="refreshSuccessText"
        :success-duration= '1500'
        @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
            >
            <article-item
                v-for="(article, index) in list" 
                :key="index" 
                :article="article"
            />
            <!-- <van-cell 
                v-for="(article, index) in list" 
                :key="index" 
                :title="article.title" /> -->
        </van-list>
      </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
      ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
        list: [],//存储列表数据的数组
        loading: false,//控制加载中 loading 状态   true就会一直加载 
        finished: false,// 控制数据加载结束的状态
        timestamp: null ,// 请求下一页数据的时间戳
        error: false,//控制失败的提示状态
        isReFreshLoading: false,// 控制下拉刷新的loading状态
        refreshSuccessText: '刷新成功' //下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
      async onLoad() {
          try{
            // 1. 请求获取数据
            const { data } = await getArticles({
                channel_id: this.channel.id,//频道id 
                // timestamp简单理解就是请求数据的页码
                // 请求第1页数据：当前最新时间戳
                // 用于请求之后数据的时间戳会在当前请求结果中返回给你
                timestamp: this.timestamp || Date.now(),
            })

            // 模拟随机失败的情况 
            // if(Math.random() > 0.5){
            //     JSON.parse('dgdhjksak')
            // }

            // console.log(data);
            //   2. 把请求结果数据放到list数组中
            const { results }=data.data
            // 数组的展开操作符，它会把数组元素一个一个拿出来
            this.list.push(...results)
            // 3. 本次数据加载结束之后要把加载状态设置为结束
            this.loading = false
            // 4. 判断数据是否全部加载完成
            if (results.length) {
            // 更新获取下一页数据的时间戳
            this.timestamp = data.data.pre_timestamp
            } else {
            // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
            this.finished = true
            }
            // setTimeout 仅做示例，真实场景中一般为 ajax 请求
          } catch (err){
            //   展示错误提示状态
              this.error = true
            //  请求失败了.loading 也需要关闭
              this.loading = false
          }
    },
    // 当触发下拉刷新的时候调用该函数
    async onRefresh () {
        try {
            // 1. 请求获取数据
            const { data } = await getArticles({
            channel_id: this.channel.id, // 频道 id
            timestamp: Date.now(), // 下拉刷新每次都应该获取最新数据
            })
            // 模拟随机失败的情况 
            // if(Math.random() > 0.3){
            //     JSON.parse('dgdhjksak')
            // }

            // 2. 将数据追加到列表的顶部
            const { results } = data.data
            this.list.unshift(...results)

            // 3. 关闭下拉刷新的 loading 状态
            this.isReFreshLoading = false

            // 提示成功
            this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
        } catch (err) {
            // console.log(err)
            this.isReFreshLoading = false // 关闭下拉刷新的 loading 状态
            // this.$toast('刷新失败')
            this.refreshSuccessText='刷新失败'
        }
    }
    // 初始化或滚动到底部的时候会触发调用 onload
    //   onLoad() {
    //   // 1. 请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     //   2. 把请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //         // 0+1=1
    //         // 1+1=2
    //         // 2+1=3
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 3. 本次数据加载结束之后要把加载状态设置为结束
    //     //     loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false;

    //     // 4. 判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //         // 如果没有数据了，把finished设置为
    //         // true，之后不再触发加载更多
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },
  }
}
</script>

<style scoped lang="less">
.article-list{
    // 百分比单位是相对于父元素的
    // height: 100%;
    height: 79vh;
    overflow-y: auto;
}
</style>
