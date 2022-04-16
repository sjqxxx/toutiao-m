<template>
  <van-icon
        :name="value ? 'star': 'star-o'"
        :color="value ? '#ffa500' : '#777'"
        @click="onCollect"
      />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value:{
        type:Boolean,
        required:true
    },
    articleId:{
        type:[Number,String, Object],
        required: true
    }
  },
  data () {
    return {
        loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
      async onCollect () {
        this.loading = true
        try {   
            if (this.value) {
                // 已收藏，取消收藏
                await deleteCollect(this.articleId)
                // this.article.is_collected = false
                // this.$toast.success('取消收藏')
            } else {
                //  没有收藏，添加收藏
                await addCollect(this.articleId)
                // this.article.is_collected = true
                // this.$toast.success('收藏成功')
            }
            // this.article.is_collected = !this.article.is_collected
            // 更新视图
            this.$emit('input',!this.value)
            // 自定义事件修改数据并不是立即的 
            this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
        } catch (err) {
            console.log(err)
            this.$toast.fail('操作失败')
            }
            this.loading = false
        }
  }
}
</script>

<style scoped lang="less">

</style>
