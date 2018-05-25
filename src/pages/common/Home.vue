<template>
  <div v-if="readyMenu">
    <v-head />
    <el-row id="layoutContainer">
      <el-col :span="4">
        <v-menu></v-menu>
      </el-col>
      <el-col :span="20">
        <div class="content-box">
          <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
      </el-col>
    </el-row>
    <!--<div id="mainContainer">-->
      <!--<v-menu></v-menu>-->
      <!--<div class="content-box">-->
        <!--<transition name="move" mode="out-in"><router-view></router-view></transition>-->
      <!--</div>-->
    <!--</div>-->
    <v-load />
    <v-load-progress />
    <v-toast />
    <v-view-image />
  </div>
</template>

<script>
  import vMenu from '@/components/common/Menu'
  import vHead from '@/components/common/Header'
  import vLoad from '@/components/tools/Loading'
  import vLoadProgress from '@/components/tools/LoadProgress'
  import vToast from '@/components/tools/Toast'
  import vViewImage from '@/components/tools/ViewImage'
  import {mapActions,mapState} from 'vuex'
  export default {
    name: 'Home',
    data:()=> ({
      readyMenu:true
    }),
    created(){
      this.webEnvAction()
      this.roleAction()
        .then(()=>{
          this.readyMenu = true
        })
    },
    methods:{
      ...mapActions(['roleAction','webEnvAction'])
    },
    components:{
      vMenu,
      vHead,
      vLoad,
      vLoadProgress,
      vToast,
      vViewImage
    }

  };
</script>

