<template>
  <!--  
     只有List 在可视范围内才会检查滚动位置触发 onLoad
   -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
    >
    <comment-item
        v-for="(item,index) in list" 
        :key="index" 
        :comment="item"
        @reply-click="$emit('reply-click',$event)"
     />
    </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import  CommentItem  from './comment-item'
  export default {
    name: "CommonentList",
    components:{
      CommentItem
    },
    props: {
        source:{
            type:[Number,String,Object],
            required: true
        },
        list:{
          type:Array,
          default: () => []
        },
        type:{ //是获取数据中的参数type
            type:String,
            // 自定义prop数据验证
            validator (value){
              return ['a','c'].includes(value)
            },
            default:'a'
        }
    },
    data() {
      return {
        // list: [], // 评论列表
        loading: false, // 上拉加载更多的 loading
        finished: false ,// 是否加载结束
        offset:null, //获取下一页数据的标记
        limit:10,
        error:false,
      };
    },
    created () {
      // 当你手动初始 onLoad的话，它不会自动开始初始的
      // 所以我们要手动的开启初始 loading
      this.loading = true
        this.onLoad()
    },
    methods: {
     async onLoad() {
          try{
            // 获取文章的评论和获取评论的回复是同一个接口
            // 唯一的区别是接口参数不一样
            //       type
            //          a  文章的评论
            //          c  评论的回复
            //        source
            //           文章的评论，则传递文章的ID
            //           文章的回复，则传递评论的ID
            // 1.请求获取数据
                const { data } = await getComments({
                type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                source: this.source.toString(), // 源id，文章id或评论id
                offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                limit: this.limit// 每页大小
           })
                // 2.将数据添加到列表中
                // console.log(data);
                const { results } = data.data
                this.list.push(...results)

                //  把文章评论的总数量传递到外部
                this.$emit('onload-success', data.data)
                // 3.将loading设置为false
                this.loading = false
                // 4.判断是否还有数据
                if(results.length) {
                    //有就更新获取下一页数据页码
                    this.offset = data.data.last_id
                }else{
                     //没有就将 finished 设为true
                     this.finished = true 
                }  
          }catch(err){
              this.error= true
              this.loading = false
          }
        
      },
    }
  };
</script>

<style scoped lang="less">
  
</style>