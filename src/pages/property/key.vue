<template>
  <div>
    <div class="title-box">
      属性项管理
    </div>
    <div class="section-box">
      <v-search />
      <vResult />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/property/keyResult'
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
            type:'input',
            label:'属性项ID',
            placeholder:'属性项ID',
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
            type:'select-property',
            label:'属性项名称',
            placeholder:'属性项名称',
            key:'name',
            width:'180px',
            intKey:'',

            options:[
              {
                label:'A',
                value:'BB'
              },
            ]
          },
          {
            type:'check-group',
            label:'属性项类型',
            placeholder:'',
            items:[
              {
                label:'关键属性',
                placeholder:'关键属性',
                key:'isKeyProperty',
                intKey:'',
              },
              {
                label:'销售属性',
                placeholder:'销售属性',
                key:'isSellProperty',
                intKey:'',
              },
              {
                label:'商品属性',
                placeholder:'商品属性',
                key:'isGoodsProperty',
                intKey:'',
              }
            ],
          }
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
            label: '属性项ID',
            key: 'id',
//            width:'100'
          },
          {
            label: '属性项名称',
            key: 'name',
//            width:'120'
          },
          {
            label: '属性项类型',
            key: 'isKeyProperty',
//            width:'200'
          },
//          {
//            label: '是否必填',
//            key: 'isRequired',
////            width:'100'
//          },
          {
            label: '属性值输入方式',
            key: 'inputType',
//            width:'160'
          },
          {
            label: '输入方式是否可修改',
            key: 'modifyType',
//            width:'140'
          },
          {
            label: '属性值数量',
            key: 'valueCount',
//            width:'120'
          },
          {
            label: '操作',
            key: 'opera',
//            width:'140',
            fixed:'right',
            items:[
              {
                type:'edit',
                label:'编辑'
              },
              {
                type:'manage',
                label:'管理'
              }
            ]
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
