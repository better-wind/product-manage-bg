<template>
  <div>
    <!--<temp></temp>-->
    content
  </div>
</template>

<script>
  export default {
    created(){
      console.log('oh yeah')
      console.log(this.temp)
      this.temp.render()
    },
    props:['temp'],


  }
</script>
