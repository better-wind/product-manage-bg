<template>
  <div class="menu-box over-height">
    <!--:theme="'dark'"-->
    <div class="el-menu-vertical menu-scroll">

      <el-menu :default-active="onRoutes" :unique-opened="true"  router>
        <template v-for="(item,idx) in roleParList">
          <template v-if="roleMenuList[item.id]">
            <el-submenu :index="idx+''">
              <template slot="title"><i class="goods-icon-message" v-html="item.icon"></i>{{item.name}}</template>
              <el-menu-item-group>
                <template v-for="subItem in roleMenuList[item.id]">
                  <el-menu-item @click="clickClear" :index="subItem.url"><i class="goods-icon-sub-message" v-html="item.icon"></i>{{subItem.name}}</el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <el-menu-item v-else :index="item.url"><i class="goods-icon-message" v-html="item.icon"></i>{{item.name}}</el-menu-item>
        </template>


      </el-menu>

    </div>

  </div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      onRoutes(){
        return this.$route.path;
      },
      ...mapState(['roleMenuList','roleParList','searchParams'])
    },

    methods:{
      ...mapActions(['setSearchParams']),

      clickClear(){
//          var selectList = document.querySelectorAll('.el-select-dropdown')
//          var _selectList = Array.from(selectList)
//          _selectList.map((item)=>{
//            item.parentNode.removeChild(item)
//          })
//        this.setSearchParams({})
//        console.log(this.searchParams)
      }
    }

  }
</script>
