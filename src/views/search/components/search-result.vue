<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载" 
      @load="onLoad"
    >
      <van-cell 
        v-for="(article, index) in list" 
        :key="index" 
        :title="article.title" 
      />
    </van-list>
  </div>
</template>

<script>
import {getSearchResult} from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText:{
      type:String,
      required: true,
    }
  },
  data () {
    return {
      list: [],
      error:false,
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
   async onLoad () {
      try{
        // 1. 请求获取数据
        const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.searchText// 搜索关键字
      })
      // console.log(data)

      // 模拟随机失败的情况 
            // if (Math.random() > 0.5){
            //     JSON.parse('dgdhjksak')
            // }
      // 2. 将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)

      // 3. 设置加载状态结束
      this.loading = false

      // 4. 判断数据是否加载完毕
      if (results.length) {
        this.page++ // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，将加载状态设置结束，不再 onLoad
      }
      }catch(err){
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败了 loading 也要关闭
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
