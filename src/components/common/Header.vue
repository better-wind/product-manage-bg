<template>
  <div id="Header">
    <div class="header-box">
      <div class="header-item logo-item">
        <img src="../../assets/images/icon/icon_logo.png" />
      </div>
      <div class="header-item">
        <span class="header-name">商品库</span>
      </div>
      <div class="header-item dropdown-box">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{userMsg.realname || userMsg.username || 'Who are you?'}} <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu class="el-dropdown-menu-ul" slot="dropdown">
            <template v-for="(item,key) in navList">
              <el-dropdown-item>
                <a :href="item.url" target="_blank" >
                  <el-button type="primary" size="small">{{item.name}}</el-button>
                </a>
              </el-dropdown-item>
            </template>
            <el-dropdown-item>
              <el-button @click="loginOut" size="small">登出</el-button>
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="header-item nav-menu">
        <div class="nav-menu-wrap">
          <a v-for="(item,key) in navList" :href="item.url" target="_blank" >
            <el-button size="small" type="primary">{{item.name}}</el-button>
          </a>
        </div>

      </div>
      <div class="header-item out">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{userMsg.realname || userMsg.username || 'Who are you?'}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu class="el-dropdown-menu-ul" slot="dropdown">
            <el-dropdown-item>
              <div  @click="loginOut" size="small">登出</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

  </div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
         this.initView()
    },
    computed:{
      ...mapState(['userMsg','headerNav'])
    },
    data:()=>({
      navList:[]
    }),
    methods:{
      ...mapActions(['goodsNav','setLoginOut']),
      initView(){
        this.goodsNav()
          .then((rs)=>{
            this.navList = this.headerNav
          })
      },
      loginOut(){
        location.href ='/goodsAdmin/login/logout'
//        this.setLoginOut()
//          .then((rs)=>{
//
//          })
      }
    }

  }
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
  .el-dropdown-menu-ul{
    z-index: 90001!important;
  }
  .el-dropdown-link{
    cursor: pointer;
  }
  .header-item{
    display: inline-block;
    line-height: 100px;
    >span{
      cursor: pointer;
    }
    &.logo-item{
      padding-left: 40px;
    }
    &.fl-r{
      margin-right: 24px;
    }
    &.dropdown-box{
      display: none;
    }
    &.nav-menu{
      position: absolute;
      width: 75%;
      top:0px;
      line-height: 100px;
      left: 370px;
      transition: all ease 300ms;
      .nav-menu-wrap{
        display: inline-block;
        line-height: 20px;
        vertical-align: middle;
        >a{
          margin-right: 10px;
          display: inline-block;
          padding-bottom: 10px;
        }
      }

    }
    &.out{

      position: absolute;
      line-height: 20px;
      bottom:20px;
      right:20px;
      transition: bottom ease 300ms;
    }
    >img{
      width: 80px;
      height: 60px;
      vertical-align: middle;
    }
    .header-name{
      display: inline-block;
      height: 44px;
      line-height: 44px;
      margin-left: 30px;
      padding-left: 20px;
      border-left:1px solid rgb(224,224,224);
      font-size: 30px;
      color: rgb(102,102,102);
    }
  }



  @media screen and (max-width: 1600px) {
    .nav-menu{
      left: 300px!important;
      width: 70% !important;
    }
    .out{
      bottom:38px!important;
    }
  }
  @media screen and (max-width: 1250px) {
    .nav-menu{
      left: 240px!important;
      transform: scale(0.85);
    }
  }
  @media screen and (max-width: 950px) {
    .nav-menu ,.out{
      display: none;
    }
    .dropdown-box{
      position: absolute;
      top:38px;
      right:20px;
      margin-left: 20px;
      display: inline-block!important;
      line-height: 20px;
    }
  }
  @media screen and (max-width: 400px) {
    #Header{
      width: 400px;
    }
  }
</style>
