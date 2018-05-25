<template>
  <div>
    <div class="title-box">
      属性值管理
    </div>
    <div class="section-box">
      <v-search />
      <vResult />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/property/valResult'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      searchPage:{
        searchItem:[
          {
            type:'',
            key:'page',
            intKey:1
          },
          {
            type:'',
            key:'rows',
            intKey:20
          },
          {
            type:'',
            key:'withPropertyNames',
            intKey:true
          },
          {
            type:'input',
            label:'属性值ID',
            placeholder:'属性值ID',
            key:'id',
            intKey:'',
            regType:[
              {
                type:'Num',
                msg:'ID请输入数字'
              }
            ],
          },
          {
            type:'select-property-val',
            label:'属性值名称',
            placeholder:'属性值名称',
            key:'name',
            width:'180px',
            intKey:'',
            options:[]
          },
        ],
        searchMenu:[
          {
            label:'查询',
            type:'search',
            style:'primary',
          }
        ],
        searchResult:[
          {
            label: '属性值ID',
            key: 'id',
            width:''
          },
          {
            label: '属性值名称',
            key: 'name',
            width:''
          },
          {
            label: '配对属性项',
            key: 'propertyNamesStr',
            width:''
          }
        ],
      },
    }),
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams']),
      initView(){
        this.setSearchConfig(this.searchPage)
        let params = {}
        this.searchPage.searchItem.map((item)=>{
          item.key ? params[item.key] = item.intKey
            : item.items.map((subItem)=>{
              params[subItem.key] = subItem.intKey
            })
        })
        this.setSearchParams(params)
      },
    },
    components:{
      vSearch,
      vResult
    },
  }
</script>

