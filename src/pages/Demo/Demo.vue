<template>
  <div>
    <div class="title-box">
      Demo管理
    </div>
    <div class="section-box">
      <v-demo-content :temp="temp" />
    </div>
  </div>
</template>
<script>
  import vDemoHeader from '@/components/Demo/header.vue'
  import vDemoContent from '@/components/Demo/content.vue'
  export default {
    created(){

    },
    data:()=>({
        temp:vDemoHeader
    }),
    methods:{
        initView(){

        },
    },
    components:{
      vDemoContent
    },
  }
</script>
