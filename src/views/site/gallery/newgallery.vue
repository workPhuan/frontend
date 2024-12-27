<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.site_gallery_lists')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<template #header>
					<div class="d-flex justify-content-between align-items-center">
						<div class="left-area">
							<el-button :loading="buttonloading" v-show="!topFolder" @click="backToParent()"><i class="fa-light fa-up-to-line"></i></el-button>
							<el-button :loading="buttonloading" @click="refreshPage()"><i class="fa-light fa-arrows-rotate"></i></el-button>
							<el-button :loading="buttonloading" @click="checkAll()"><i class="fa-light fa-list-check"></i></el-button>

							<el-popover v-if="$p.permissionChecker('galleryListsAdd')" placement="bottom" width="200" style="margin-left:10px; margin-right: 10px;" trigger="click">
								<template #reference>
									<el-button :loading="buttonloading"><i class="fa-light fa-folder-medical"></i></el-button>
								</template>
	  
								<el-form id="createForm" @submit.native.prevent label-position="top" label-width="auto">
									<el-form-item :label="$t('mix.table_folder_name')">
										<el-input v-model="createList.folder_name" :placeholder="$t('mix.table_folder_name')" />
									</el-form-item>
									<el-form-item :label="$t('mix.table_security')" v-if="securityCheck == 1">
										<el-input v-model="createList.security" show-password :placeholder="$t('mix.table_security')" />
									</el-form-item>
						
									<el-button type="primary" @click="createFolder">{{$t('button.submit')}}</el-button>
								</el-form>
							</el-popover>
							<el-button v-if="$p.permissionChecker('galleryListsDelete')" type="danger" :loading="buttonloading" @click="deleteRow"><i class="fa-light fa-trash"></i></el-button>
						</div>
							
						<div class="right-area">
							<el-popover v-if="$p.permissionChecker('galleryListsUpload')" placement="bottom-start" width="380" style="margin-left:10px;" trigger="click">
								<template #reference>
									<el-button :loading="buttonloading"><i class="fa-light fa-upload"></i></el-button>
								</template>
								
								<el-form id="uploadForm" @submit.native.prevent label-position="top" label-width="auto">
									<el-form-item :label="$t('mix.table_file_name')">
										<el-input v-model="createList.name" :placeholder="$t('mix.table_file_name')" />
									</el-form-item>
									<el-form-item :label="$t('mix.table_security')" v-if="securityCheck == 1">
										<el-input v-model="createList.security" show-password :placeholder="$t('mix.table_security')" />
									</el-form-item>

									<el-upload ref="uploadAdd" class="upload-demo w-100" list-type="picture" drag :auto-upload="false" :headers="headersData" :data="postData" :action="uploadImageURL" :on-success="uploadSuccess" :limit="1" accept="image/jpeg,image/jpg,image/png,image/webp">
										<i class="el-icon-upload"></i>
										<div class="el-upload__text">{{$t('msg.msg_upload_1')}} <em>{{$t('msg.msg_upload_2')}}</em></div>
									</el-upload>
									
									<el-button type="primary" @click="uploadImage" class="w-100 mt-3">{{$t('button.submit')}}</el-button>
								</el-form>
							</el-popover>
						</div>
					</div>
				</template>

				<div v-if="galleryList.length > 0"> 
					<el-checkbox-group v-model="dataList.urlList">
						<el-row :gutter="20">
							<el-col :cols="12" :md="8" :lg="6" v-for="(item,index) in galleryList" :key="index" class="pb-4">
								<div class="img-box">
									<template v-if="item.type == 'file'" >
										<div class="text-center img-body">
											<el-image :src="item.path" :preview-src-list="imageList" v-if="['jpg','jpeg','png','webp'].includes(item.file_type)"></el-image>
											<el-image :src="$m.getImageUrl('files/'+item.file_type+'.svg')" v-else-if="['ai','pdf','ppt'].includes(item.file_type)"></el-image>
											<el-image :src="$m.getImageUrl('files/doc.svg')" v-else></el-image>
											
											<el-checkbox :label="item.path" class="fix-top-left">
												<template slot="default"></template>
											</el-checkbox>
										</div>
									</template>
									
									<template v-else>
										<div class="text-center img-body">
											<img @click="nextDirectory(item.path);" src="@/assets/img/files/folder.svg" />
											
											<el-checkbox :label="item.path" class="fix-top-left">
												<template slot="default"></template>
											</el-checkbox>
										</div>
									</template>
									
									<div class="text-center img-footer">
										<template v-if="item.type == 'file'">
											<p class="p-0 m-0 w-100 font-7">{{item.name}}</p>
											
											<div class="w-100 h-100">
												<el-button type="info" class="w-100 h-100 border-none" @click="selectImage(item.path, index)">{{$t('button.select')}}</el-button>
												
												<input type="hidden" :id="'copy-link-'+index" :value="item.path" class="font-12" />
											</div>
										</template>
										
										<template v-else>
											<p class="p-0 m-0 w-100 font-7">{{item.name}}</p>
										</template>
									</div>
								</div>
							</el-col>
						</el-row>
					</el-checkbox-group>
				</div>
				
				<div v-else class="text-center">
					<img class="ajaxtable-empty-img pt-5 w-r-30" src="@/assets/img/common/search-1.svg">
					<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
					<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
				</div>

				<pagination class="mt-3" v-show="imageTotal > 0" :total="imageTotal" :default-page-size="imageListQuery.limit" :pageSizes.sync="imageListQuery.pageSizes" :page.sync="imageListQuery.page" :limit.sync="imageListQuery.limit" @paginationChange="imagePagination"/>
			</el-card>
		</div>
	</div>
</template>

<script>
import config from '@/system/engine/config';
import pagination from '@/components/pagination/index.vue'

export default{
	components:{pagination},
	inject:['preloader'],
	data(){
		return{
			loading: true,
			buttonloading: false,
			topFolder: false,
			popvisible: false,
			uploadvisible: false,
			lastPath: '',
			postData:{
				data: '',
				language: '',
			},searchForm:{
				id: '',
			},
			searchData:{
				pagination: 1,
				limit: 12,
				url: ''
			},
			imageTotal: 0,
			imageListQuery: {
				page: 1,
				pageSizes: [12, 24, 36, 60, 120],
				limit: 12
			},
			dataList:{
				urlList: [],
				security: ''
			},
			createList:{
				url: '',
				name: '',
				folder_name: ''
			},
			galleryList: [],
			imageList: [],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			selectImageData:{
				index: '',
				path: ''
			},
			headersData:{
				XSPOT: ''
			},
			uploadImageURL: '',
			securityCheck: 0
		}
	},methods:{
		initial(){
			this.clearFolderList();
			this.imageList = [];
			this.loading = true;
			this.buttonloading = true;
			;
			this.postData.data = JSON.stringify(this.searchData);
			
			var result = this.$m.postMethod('site/gallery/lists/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data
				if(value.valid){
					this.topFolder = data.isTop;
					this.lastPath = data.lastPath;
					this.galleryList = data.galleryList;
					this.imageTotal = parseInt(data.total_number);
					this.imageListQuery.page = parseInt(data.current_pagination);
					this.imageListQuery.limit = parseInt(data.limit);
					
					// for(const gallery of this.galleryList) {
					// 	if(gallery.type !== 'folder'){
					// 		this.imageList.push(gallery.path);
					// 	}
					// }
				
					this.buttonloading = false;
					this.loading = false;
				}
			});
		},imagePagination(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			this.initial();
		},deleteRow(){
			if(this.$p.permissionChecker('galleryListsDelete')){
				this.loading = true;
				this.$prompt(this.$t('msg.msg_delete'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					showInput: (this.securityCheck == 1), 
					inputPlaceholder: this.$t('msg.msg_security_password'),
					inputType: 'password'
				}).then(({value}) => {
					this.dataList.security = value

					this.postData.data = JSON.stringify(this.dataList)
					var result = this.$m.postMethod('site/gallery/lists/DBdelete',this.postData)
					result.then((value) => {
						var data = value.data
						if(value.valid){
							this.$message({
								type: 'success',
								message: data.returnMsg
							})
							
							this.dataList.urlList = []
							this.initial()
						}else{
							this.$m.popupErrorMessage(data.returnMsg,this)
							
						}
						this.loading = false
					})
				}).catch(() => {
					this.loading = false          
				})
			}
		},nextDirectory(path){
			this.searchData.url = path;
			this.createList.url = path;
			this.initial();
		},refreshPage(){
			this.dataList.urlList = [];
			this.clearFolderList();
			this.initial();
		},backToParent(){
			this.searchData.url = this.lastPath;
			this.createList.url = this.lastPath;
			this.initial();
		},createFolder(){
			if(this.$p.permissionChecker('galleryListsAdd')){
				this.loading = true
				this.buttonloading = true
				
				this.postData.data = JSON.stringify(this.createList)
				
				var result = this.$m.postMethod('site/gallery/lists/DBadd',this.postData)
				result.then((value) => {
					var data = value.data
					
					if(value.valid){
						this.$message({
						type: 'success',
						message: data.returnMsg
						});
						
						this.initial()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.clearFolderList();
					this.loading = false
					this.buttonloading = false
				});
			}
		},clearFolderList(){
			this.createList.folder_name = '';
			this.createList.name = '';
			this.createList.security = '';
		},uploadImage(){
			if(this.$p.permissionChecker('galleryListsUpload')){
				this.postData.data = JSON.stringify(this.createList)
				this.$refs.uploadAdd.submit();
			}
		},uploadSuccess(value){
			var data = value.data
			var text = '';
			if(value.valid){
				this.$message({
					type: 'success',
					message: data.returnMsg
				});
				
				this.initial()
			}else{
				this.$m.popupErrorMessage(data.returnMsg,this)
			}
			
			this.$refs.uploadAdd.clearFiles();
			this.buttonloading = false;
			this.loading = false;
		},selectImage(path, index){

			this.selectImageData.path = path;
			let copyLink = document.querySelector('#copy-link-'+index);

			copyLink.setAttribute('type', 'text');
			copyLink.select();

			try {
				document.execCommand('copy');
				this.$message({showClose: true,message: this.$t('msg.msg_copy_success'),type: 'success'});
			} catch (err) {
				alert('Oops, unable to copy');
			}
			
			copyLink.setAttribute('type', 'hidden');
			window.getSelection().removeAllRanges();
		},checkAll(){
            if(this.dataList.urlList.length > 0){
				this.dataList.urlList = [];
            }else{
				for(const gallery of this.galleryList) {
                    this.dataList.urlList.push(gallery.path);
                }
			}
		}
	},created:function(){
		this.headersData.XSPOT = this.$m.getItem('authSignToken')
		this.uploadImageURL = config.url+'site/gallery/lists/DBupload'
		this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')??0
		this.initial();
	}
}
</script>