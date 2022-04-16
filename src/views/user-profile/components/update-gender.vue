<template>
  <div class="update-gender">
     <van-picker
        title="性别"
        show-toolbar
        :columns="columns"
        :default-index="this.value" 
        @confirm="onConfirm"
        @cancel="$emit('close')"
        @change="onChange"
    />
  </div>
</template>

<script>
import {updateUserProfile} from '@/api/user'
export default {
  name:'UpdateGender',
  components: {},
  props: {
    value:{
      type:Number,
      required:true
    }
  },
  data () {
      return {
          columns: ['男','女'],
          localGender: this.value
      }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm(){
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,//禁止背景点击
        duration:0 //持续展示
      })
      try{
        // 得到这个localName
        const localGender = this.localGender
        
         await updateUserProfile({
          gender: localGender
        })
        // 更新视图
        this.$emit('input',localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
        // console.log(data)
      }catch(err){
        this.$toast.fail('更新失败')
      }
    },
    onChange(picker, value, index){
        this.localGender = index
    }
  }
}
</script>

<style lang="less" scoped>
.update-gender{
    /deep/.van-picker__toolbar {
        .van-picker__cancel{
            color: #3296fa;
        }
        .van-picker__confirm {
            color: #3296fa;
        }
    }
}
</style>>

