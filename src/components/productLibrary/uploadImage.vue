<template>
  <div class="item-box">
    <template v-if="uploadConfig.imageConfig.isShow">
      <div class="sub-title-box mg-b">
        <span>商品主图</span>
        <!--<i v-if="batchUploading && batchUploadType == 1" class="el-icon-loading c-red mg-l" style="font-size: 20px"></i>-->
        <slot name="sync-edit"></slot>
        <slot name="check-edit"></slot>
      </div>
      <div class="block-box">
        <span class="c-dis c-tip">
          商品主图：必填，1-5张商品主图，分辨率640x640，文件小于400KB！
        </span>
        <!--<el-upload v-if="uploadConfig.imageConfig.editType == 2 " style="display: inline-block;margin-left: 20px" action="/goodsAdmin/goods/file/upZip"-->
                   <!--:data="batchUpload"-->
                   <!--:show-file-list="false"-->
                   <!--:on-success="batchUploadSuccess"-->
                   <!--:on-error="batchUploadError"-->
                   <!--:before-upload="beforeBatchUpload">-->
          <!--<el-button @click="batchMainPic(1)" size="small" type="primary">批量上传</el-button>-->
        <!--</el-upload>-->
      </div>
      <div class="item-box">
        <template v-if="uploadConfig.imageConfig.editType == 1">
          <div class="avatar-wrap" v-for="(item,idx) in productUpload.images">
            <img :src="item.url" class="avatar">
            <div class="avatar-menu">
              <i class="el-icon-search" @click="showProductImage(item.url)"></i>
            </div>
          </div>
        </template>
        <v-drag v-if="uploadConfig.imageConfig.editType == 2" :list="productUpload.images" class="inline-box">
          <div class="avatar-wrap" v-for="(item,idx) in productUpload.images">
            <img :src="item.url" class="avatar">
            <div class="avatar-menu">
              <i class="el-icon-search" @click="showProductImage(item.url)"></i>
              <i class="el-icon-delete" @click="delProductImage(idx)"></i>
            </div>
          </div>
        </v-drag>
        <template v-if="uploadConfig.imageConfig.editType == 2 && productUpload.images.length < 5">
          <el-upload class="avatar-wrap avatar-uploader"  action="/goodsAdmin/goods/file/imageUpload" :multiple="true" :data="picUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
      </div>

      <!--主图视频-->
      <template v-if="uploadConfig.imageConfig.editType == 2 || productUpload.imagesVideo.length">
        <div class="sub-title-box mg-b">
          <span>主图视频</span>
        </div>
        <div class="block-box">
        <span class="c-dis c-tip">
          主图视频：非必传，视频长度小于10S，视频格式mp4！
        </span>
          <el-upload :disabled="isVideoUpload" v-if="uploadConfig.imageConfig.editType == 2 " style="display: inline-block;margin-left: 20px" action="/goodsAdmin/goods/file/videoUpload"
                     :data="videoUpload"
                     :show-file-list="false"
                     :on-error="videoUploadError"
                     :on-success="videoUploadSuccess"
                     :before-upload="beforeVideoUpload">
            <el-button size="small" :disabled="isVideoUpload" @click="mapVideoUpload(1)" type="primary">上传</el-button>
            <i  v-if="isVideoUpload && videoUploadType == 1" class="el-icon-loading c-red mg-l" style="font-size: 20px"></i>
          </el-upload>
        </div>
        <div class="item-box">
          <template v-for="(item,idx) in productUpload.imagesVideo">
            <div v-if="uploadConfig.imageConfig.editType == 2 " class="item-box-upload-list" >
              <p> <i class="el-icon-document"></i> {{item.name ? item.name : item.url}}</p>
              <div class="item-box-upload-list-menu">
                <i class="el-icon-upload-success el-icon-circle-check"></i>
                <i class="el-icon-close" @click="delVideo(1)"></i>
              </div>
            </div>
            <video class="video-view" :src="item.url" controls="controls">
              your browser does not support the video tag
            </video>
          </template>

        </div>
      </template>
    </template>
    <template v-if="uploadConfig.detailConfig.isShow">
      <!--详情视频-->
      <template v-if="uploadConfig.detailConfig.editType == 2 || productUpload.detailVideos.length">
        <div class="sub-title-box mg-b">
          <span>详情视频</span>
        </div>
        <div class="block-box">
          <span class="c-dis c-tip">
            视频封面：非必传，分辨率750*420，文件小于400KB！
          </span>
        </div>
        <div class="item-box">
          <template v-if="uploadConfig.detailConfig.editType == 1">
            <template v-for="(item,idx) in productUpload.detailVideos">
              <div class="avatar-wrap" v-if="item.type == 1">
                <img :src="item.url" class="avatar">
                <div class="avatar-menu">
                  <i class="el-icon-search" @click="showProductImage(item.url)"></i>
                </div>
              </div>
            </template>
          </template>
          <template v-if="uploadConfig.detailConfig.editType == 2">
            <template v-for="(item,idx) in productUpload.detailVideos">
              <div class="avatar-wrap" v-if="item.type == 1">
                <img :src="item.url" class="avatar">
                <div class="avatar-menu">
                  <i class="el-icon-search" @click="showProductImage(item.url)"></i>
                  <i class="el-icon-delete" @click="delDetailVideos(idx)"></i>
                </div>
              </div>
            </template>

          </template>
          <template v-if="uploadConfig.detailConfig.editType == 2 && productUpload.detailVideos.filter(item => item.type == 1).length < 1">
            <el-upload class="avatar-wrap avatar-uploader"  action="/goodsAdmin/goods/file/imageUpload"
                       :data="picUpload"
                       :show-file-list="false"
                       :on-success="handleDetailVideosSuccess"
                       :before-upload="beforeDetailVideosUpload">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
        </div>
        <div class="block-box" >
        <span class="c-dis c-tip">
          详情视频：非必传，视频格式mp4！
        </span>
          <el-upload :disabled="isVideoUpload"  v-if="uploadConfig.detailConfig.editType == 2 " style="display: inline-block;margin-left: 20px" action="/goodsAdmin/goods/file/videoUpload"
                     :data="videoUpload"
                     :show-file-list="false"
                     :on-error="videoUploadError"
                     :on-success="videoUploadSuccess"
                     :before-upload="beforeVideoUpload">
            <el-button size="small" :disabled="isVideoUpload"  @click="mapVideoUpload(2)" type="primary">上传</el-button>
          </el-upload>
          <i  v-if="isVideoUpload && videoUploadType == 2" class="el-icon-loading c-red mg-l" style="font-size: 20px"></i>
        </div>

        <div class="item-box">
          <template v-for="(item,idx) in productUpload.detailVideos">
            <div v-if="item.type == 2 && uploadConfig.imageConfig.editType == 2" class="item-box-upload-list" >
              <p> <i class="el-icon-document"></i> {{item.name ? item.name : item.url}}</p>
              <div class="item-box-upload-list-menu">
                <i class="el-icon-upload-success el-icon-circle-check"></i>
                <i class="el-icon-close" @click="delVideo(2)"></i>
              </div>
            </div>
            <video class="video-view" v-if="item.type == 2" :src="item.url" controls="controls">
              your browser does not support the video tag
            </video>
          </template>

        </div>
      </template>

      <!--商品详情-->
      <div class="sub-title-box mg-b">
        <span>商品详情</span>
        <i v-if="batchUploading && batchUploadType == 2" class="el-icon-loading c-red mg-l" style="font-size: 20px"></i>
        <slot name="sync-edit-detail"></slot>
        <slot name="check-edit-detail"></slot>
      </div>
      <div class="block-box c-dis c-tip">商品详情：必填，图片宽度最小限制尺寸620！</div>
      <div class="detail-wrap" style="max-width: 800px" v-html="productUpload.detail" v-if="uploadConfig.detailConfig.editType == 1"></div>
      <quillEditor v-else  style="max-width: 1200px" v-model="productUpload.detail" ref="myQuillEditor" :options="editorOption">
        <div id="toolbar" slot="toolbar">
          <!--<span class="ql-formats"><button type="button" class="ql-bold"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-italic"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-underline"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-strike"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-code-block"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>-->
          <!--<span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>-->
          <!--<span class="ql-formats">-->
          <!--<select class="ql-size">-->
          <!--<option value="small"></option>-->
          <!--<option selected=""></option>-->
          <!--<option value="large"></option>-->
          <!--<option value="huge"></option>-->
          <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
          <!--<select class="ql-header">-->
          <!--<option value="1"></option>-->
          <!--<option value="2"></option>-->
          <!--<option value="3"></option>-->
          <!--<option value="4"></option>-->
          <!--<option value="5"></option>-->
          <!--<option value="6"></option>-->
          <!--<option selected="selected"></option>-->
          <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
          <!--<select class="ql-color">-->
          <!--<option selected="selected"></option>-->
          <!--<option value="#e60000"></option>-->
          <!--<option value="#ff9900"></option>-->
          <!--<option value="#ffff00"></option>-->
          <!--<option value="#008a00"></option>-->
          <!--<option value="#0066cc"></option>-->
          <!--<option value="#9933ff"></option>-->
          <!--<option value="#ffffff"></option>-->
          <!--<option value="#facccc"></option>-->
          <!--<option value="#ffebcc"></option>-->
          <!--<option value="#ffffcc"></option>-->
          <!--<option value="#cce8cc"></option>-->
          <!--<option value="#cce0f5"></option>-->
          <!--<option value="#ebd6ff"></option>-->
          <!--<option value="#bbbbbb"></option>-->
          <!--<option value="#f06666"></option>-->
          <!--<option value="#ffc266"></option>-->
          <!--<option value="#ffff66"></option>-->
          <!--<option value="#66b966"></option>-->
          <!--<option value="#66a3e0"></option>-->
          <!--<option value="#c285ff"></option>-->
          <!--<option value="#888888"></option>-->
          <!--<option value="#a10000"></option>-->
          <!--<option value="#b26b00"></option>-->
          <!--<option value="#b2b200"></option>-->
          <!--<option value="#006100"></option>-->
          <!--<option value="#0047b2"></option>-->
          <!--<option value="#6b24b2"></option>-->
          <!--<option value="#444444"></option>-->
          <!--<option value="#5c0000"></option>-->
          <!--<option value="#663d00"></option>-->
          <!--<option value="#666600"></option>-->
          <!--<option value="#003700"></option>-->
          <!--<option value="#002966"></option>-->
          <!--<option value="#3d1466"></option>-->
          <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
          <!--<select class="ql-background">-->
          <!--<option value="#000000"></option>-->
          <!--<option value="#e60000"></option>-->
          <!--<option value="#ff9900"></option>-->
          <!--<option value="#ffff00"></option>-->
          <!--<option value="#008a00"></option>-->
          <!--<option value="#0066cc"></option>-->
          <!--<option value="#9933ff"></option>-->
          <!--<option selected="selected"></option>-->
          <!--<option value="#facccc"></option>-->
          <!--<option value="#ffebcc"></option>-->
          <!--<option value="#ffffcc"></option>-->
          <!--<option value="#cce8cc"></option>-->
          <!--<option value="#cce0f5"></option>-->
          <!--<option value="#ebd6ff"></option>-->
          <!--<option value="#bbbbbb"></option>-->
          <!--<option value="#f06666"></option>-->
          <!--<option value="#ffc266"></option>-->
          <!--<option value="#ffff66"></option>-->
          <!--<option value="#66b966"></option>-->
          <!--<option value="#66a3e0"></option>-->
          <!--<option value="#c285ff"></option>-->
          <!--<option value="#888888"></option>-->
          <!--<option value="#a10000"></option>-->
          <!--<option value="#b26b00"></option>-->
          <!--<option value="#b2b200"></option>-->
          <!--<option value="#006100"></option>-->
          <!--<option value="#0047b2"></option>-->
          <!--<option value="#6b24b2"></option>-->
          <!--<option value="#444444"></option>-->
          <!--<option value="#5c0000"></option>-->
          <!--<option value="#663d00"></option>-->
          <!--<option value="#666600"></option>-->
          <!--<option value="#003700"></option>-->
          <!--<option value="#002966"></option>-->
          <!--<option value="#3d1466"></option>-->
          <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
          <!--<select class="ql-font">-->
          <!--<option selected="selected"></option>-->
          <!--<option value="serif"></option>-->
          <!--<option value="monospace"></option>-->
          <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
          <!--<select class="ql-align">-->
          <!--<option selected="selected"></option>-->
          <!--<option value="center"></option>-->
          <!--<option value="right"></option>-->
          <!--<option value="justify"></option>-->
          <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-clean"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-link"></button></span>-->
          <span class="ql-formats">
            <el-upload action="/goodsAdmin/goods/file/imageUpload" :data="picUpload" :multiple="true" :show-file-list="false" :on-success="handleDetailSuccess" :before-upload="beforeAvatarUploadDetail">
              <button type="button">
                <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
              </button>
            </el-upload>
          </span>
          <!--<span class="ql-formats">-->
            <!--<el-upload  action="/goodsAdmin/goods/file/upZip"-->
                        <!--:data="batchUpload"-->
                        <!--:show-file-list="false"-->
                        <!--:on-success="batchUploadSuccess"-->
                        <!--:on-error="batchUploadError"-->
                        <!--:before-upload="beforeBatchUpload">-->
              <!--<button type="button" @click="batchMainPic(2)" >-->
                <!--<i class="el-icon-upload" style="font-size: 18px"></i>-->
                <!--&lt;!&ndash;<svg viewBox="0 0 18 18">&ndash;&gt;-->
                <!--&lt;!&ndash;<rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>&ndash;&gt;-->
                <!--&lt;!&ndash;<circle class="ql-fill" cx="6" cy="7" r="1"></circle>&ndash;&gt;-->
                <!--&lt;!&ndash;<polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>&ndash;&gt;-->
                <!--&lt;!&ndash;<rect class="ql-stroke" height="10" width="8" x="10" y="4"></rect>&ndash;&gt;-->
                <!--&lt;!&ndash;</svg>&ndash;&gt;-->
              <!--</button>-->
            <!--</el-upload>-->
          <!--</span>-->

          <!--<span class="ql-formats"><button type="button" class="ql-video"></button></span>-->
        </div>
      </quillEditor>
    </template>
  </div>
</template>
<script>
  import vDrag from 'vuedraggable'
  import {quillEditor} from 'vue-quill-editor'
  import {mapActions,mapState} from 'vuex'
  export default {
    props:['uploadConfig'],
    data:()=>({
      constDetail:'', // 初始富文本
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      },
      editDetail:{
        isShow:false,
        content:''
      }, //弹窗修改
      picUpload:{
        file:null,
      }, //上传格式
      batchUpload:{
        imageZipFile:null
      },
      batchUploadType:'',
      batchUploading:false,
      isVideoUpload:false,
      videoUploadType:'',
      videoUpload:{
          file:null,
        limitDuration:'',
        type:''
      },
      detailMultipleCheck:[],
      detailMultipleMap:{},
      routeName:'',
      routeMap:{
        baseGoodsEdit:{
            1:3,
            2:4
        },
        saleGoodsDetail:{
            1:1,
            2:2
        }
      }
    }),
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['productUpload']),
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      ...mapActions(['setProductUpload','setStartToast','setViewImage']),
      initView(){
        this.routeName = this.$route.name
        this.constDetail = this.productUpload.detail
      },
      callEditDetail(type){
        switch (type){
          case 1:
            this.callMessageBox('前台商品图片默认与后台商品保持一致，若单独上传前台商品，则后续后台商品有更新将不会同步。是否确认该前台商品需要单独上传商品图片？')
              .then(()=>{
                this.editDetail.content = this.productUpload.detail
                this.editDetail.isShow = true
              })

            break
          case 2:
            this.callMessageBox('该前台商品已开启自定义商品图片，若关闭自定义商品图片，则商品图片会立即更新为后台商品图片。是否确认该前台商品与后台商品的图片保持一致？')
              .then(()=>{
                this.productUpload.detail = this.constDetail
                this.editDetail.isShow = false
              })

        }

      },
      callMessageBox(msg){
        let _this = this
        return new Promise(function(resolve){
          _this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            resolve()
          }).catch(()=>{

          })

        })

      },
      operaDetail(type){
        if(type == 1){
          this.productUpload.detail = this.editDetail.content
        }
        this.editDetail.content = ''
        this.editDetail.isShow = false
      },
      //视频上传类型
      mapVideoUpload(type){
        this.videoUploadType = type
      },
      //视频上传成功
      videoUploadSuccess(res){
        if(res.code != 1){
          this.getToast(res.message)
          this.isVideoUpload = false
          return false
        }
        if(this.videoUploadType == 1 && res.data.time > 10){
          this.getToast('视频时长限制10S');
          this.isVideoUpload = false
          return false;
        }
        let _opts = {
          id: '',
          url: res.data.url,
          type: 2,
          width:res.data.width,
          height:res.data.height,
          sortOrder: 1,
          name:res.data.originName,
          duration: res.data.time
        }

        if(this.videoUploadType == 1){
          this.productUpload.imagesVideo = [_opts]
        } else if(this.videoUploadType == 2){
          this.productUpload.detailVideos = this.productUpload.detailVideos.filter(item=>item.type != 2)
          this.productUpload.detailVideos.push(_opts)
        }
        this.isVideoUpload = false

      },
      //视频删除
      delVideo(type){
          if(type == 1){
            this.productUpload.imagesVideo = []
          } else {
            this.productUpload.detailVideos = this.productUpload.detailVideos.filter(item=>item.type != 2)
          }
      },
      //视频上传前
      beforeVideoUpload(file){
        const isMP4 = file.type === 'video/mp4';
//        baseGoodsEdit
//        saleGoodsDetail
        if(!isMP4){
          this.getToast('上传视频格式不正确');
        } else {
          this.isVideoUpload = true
        }
        if(this.videoUploadType == 1){
          this.videoUpload.limitDuration = 10
        } else {
          delete this.videoUpload.limitDuration
        }
        this.videoUpload.type = this.routeMap[this.routeName][this.videoUploadType]
        this.videoUpload.file = file
        return isMP4

      },
      //详情视频主图上传成功
      handleDetailVideosSuccess(res){
        if(res.code != 1){
          this.getToast(res.message)
          return false
        }
        if(res.data.width != 750 || res.data.height != 420){
          this.getToast('图片限制750*420');
          return false;
        }

        let _opt = {
          id:'',
          url:res.data.url,
          width:res.data.width,
          height:res.data.height,
          sortOrder: 1,
          duration: 0,
          type:1
        }
        this.productUpload.detailVideos.push(_opt)

      },
      videoUploadError(){
        this.getToast('视频上传失败');
        this.isVideoUpload = false
      },
      //详情视频主图上传判断
      beforeDetailVideosUpload(file){
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024  < 401;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传图片大小不能超过 400KB!');
        }
        this.picUpload.file=file
        this.picUpload.limitWidth = ''
        this.picUpload.limitDirection = '-1'
        return isJPG && isLt2M;
      },
      //详情图上传成功
      handleDetailSuccess(res,file){
        if(this.detailMultipleCheck.includes(file.uid)){
          let _index = this.detailMultipleCheck.findIndex(item=> item == file.uid)
          this.detailMultipleCheck.splice(_index,1)
        }
        if(res.code != 1){
          this.getToast(res.message)
          return false
        }
//        if(res.data.width < 620){
//          this.getToast('商品详情图片尺寸宽度必须大于620');
//          return false;
//        }
        this.detailMultipleMap[file.uid] = res.data.url

//        console.log(this.detailMultipleMap)
        if(this.detailMultipleCheck.length == 0){
          this.setDetailMultiple()
        }
//        this.editor.focus();
//        var range = this.editor.getSelection();
//        var length = range.index;
//        this.editor.insertEmbed(length, 'image', res.data.url);
//        this.editor.setSelection(length+1)

      },
      setDetailMultiple(){
        this.editor.focus();

        var range = this.editor.getSelection();
        var length = range.index;
        let _list = UtilTool.ObjectToArray(this.detailMultipleMap)
        _list.reverse()
        _list.forEach((item)=>{
          this.editor.insertEmbed(length, 'image', item);
          this.editor.setSelection(length+1)
        })
        this.detailMultipleCheck = []
        this.detailMultipleMap = {}

      },
      //主图上传成功
      handleAvatarSuccess(res, file) {
        if(res.code != 1){
          this.getToast(res.message)
          return file
        }
        if(res.data.width != 640 || res.data.height != 640){
          this.getToast('图片限制640*640并且大小<=400k');
          return false;
        }
        if(this.productUpload.images.length > 4){
          this.getToast('商品主图不超过5张');
          return false
        }
        let _opt = {
          id:'',
          url:res.data.url,
          width:res.data.width,
          height:res.data.height,
        }
        this.productUpload.images.push(_opt);
      },
      //批量上传类型
      batchMainPic(type){
        this.batchUploadType = type
      },
      beforeBatchUpload(file){
        const isZIP = file.name.split('.').pop() === 'zip'
        this.batchUpload.imageZipFile = file
        if (!isZIP) {
          this.getToast('批量上传请上传zip压缩包');
        } else {
          this.batchUploading = true
        }
        return isZIP
      },
      //批量上传失败
      batchUploadError(){
        this.getToast('上传失败');
        this.batchUploading = false
      },
      //批量上传成功
      batchUploadSuccess(res){
        if(res.code != 1){
          this.getToast(res.message)
          this.batchUploading = false
          return false
        }
        let _list = []
        switch (this.batchUploadType){
          case 1:
            this.productUpload.images = []
            _list = res.data.slice(0,5)
            break
          case 2:
            this.productUpload.detail = ''
            _list = res.data.slice(0,22)
            break
        }


        _list.map((item)=>{
          let _opt = {
            id:'',
            url:item.url,
            width:item.width,
            height:item.height,
          }
          let _html = `<p><img src="${item.url}"></p>`
          switch (this.batchUploadType){
            case 1:
              this.productUpload.images.push(_opt);
              break
            case 2:
              this.productUpload.detail += _html
              break
          }
        })
        this.batchUploading = false
      },
      //主图上传前判断
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024  < 401;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传图片大小不能超过 400KB!');
        }
        if(this.productUpload.images.length > 4){
          this.getToast('商品主图不超过5张');
          return false
        }
        this.picUpload.file=file
        this.picUpload.limitWidth = '640'
        this.picUpload.limitDirection = '0'
        return isJPG && isLt2M;
      },
      //详情图上传判断
      beforeAvatarUploadDetail(file) {
        let _len = this.productUpload.detail.match(/<img src=/g) ? this.productUpload.detail.match(/<img src=/g).length : 0
        if(_len > 22){
          this.getToast('详情图上传不超过22张')
          return false
        }
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024  < 401;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传图片大小不能超过 400KB!');
        }
        this.detailMultipleCheck.push(file.uid)
        this.detailMultipleMap[file.uid] = ''
        this.picUpload.file=file
        this.picUpload.limitWidth = '620'
        this.picUpload.limitDirection = '-1'
        return isJPG && isLt2M;
      },
      delProductImage(idx) {
        this.productUpload.images.splice(idx,1)
      },
      delDetailVideos(idx) {
        this.productUpload.detailVideos.splice(idx,1)
      },
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
    },
    components: {
      vDrag,
      quillEditor
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .avatar-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      display: block;
      width: 100px;
      height: 100px;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      top:0;
      right:0;
      background-color: rgba(0,0,0,.5);
      i{
        cursor: pointer;
        padding: 0 10px;
        font-size: 20px;
        color: #8c939d;
      }
    }
    &:hover{
      .avatar-menu{
        display: block;
      }
    }
  }
  .avatar-uploader{
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
  .block-box{
    padding: 10px 0;
  }
  /*.detail-wrap{*/
  /*width: 620px;*/
  /*max-height: 1240px;*/
  /*overflow-x:hidden;*/
  /*overflow-y:scroll;*/
  /*}*/
  body{
    .ql-video{
      width: 620px;
    }
  }
  .item-box-upload-list{
    margin-bottom: 10px;
    width: 400px;
    height: 30px;
    line-height: 30px;
    position: relative;
    p{
      margin-left: 10px;
      width: 360px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #48576a;
    }
    .item-box-upload-list-menu{
      position: absolute;
      top:0;
      right:2px;
      width: 30px;
      line-height: 30px;
      text-align: right;
      .el-icon-document{
        color:#97a8be;
      }
      .el-icon-upload-success{
        color:#13ce66;
        display: inline-block;
      }
      .el-icon-close{
        display: none;
      }

    }
    &:hover{
      p{
        color:#20a0ff;
      }
      background-color: #eef1f6;
      border-radius: 4px;
      .el-icon-upload-success{
        display: none;
      }
      .el-icon-close{
        display: inline-block;
        cursor: pointer;
      }
    }
  }
  .video-view{
    width: 400px
  }

</style>
