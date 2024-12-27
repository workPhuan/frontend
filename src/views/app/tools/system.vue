<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_system')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-tabs type="border-card">
				<el-tab-pane v-for="(item,index) in categoryList" :key="'category_'+index" :label="item.name">
					<div class="ps-5 pe-5 pt-4 pb-4">
						<div v-for="(subItem, index2) in item.item" :key="item.category+'_'+index2" class="d-flex flex-column">
							<label class="text-theme font-7 fw-bold">
								<span class="text-danger">*</span> {{subItem.name}} <span class="text-mute ms-2">{{subItem.subname}}</span>
							</label>
							<el-input v-if="subItem.type == 'word'" class="custom-input mt-1 mb-3" v-model="postForm[subItem.id]" :placeholder="subItem.name" />
							<el-input-number v-else-if="subItem.type == 'float'" class="custom-input mt-1 w-100 mb-3" v-model="postForm[subItem.id]" :precision="2" :min="0" :placeholder="subItem.name" />
							<el-input-number v-else-if="subItem.type == 'number'" class="custom-input mt-1 w-100 mb-3" v-model="postForm[subItem.id]" :precision="0" :min="0" :placeholder="subItem.name" />
							<el-time-picker v-else-if="subItem.type == 'timepicker'" class="custom-input mt-1 w-100 mb-3" v-model="postForm[subItem.id]" is-range range-separator="-" :start-placeholder="$t('mix.table_start_time')" :end-placeholder="$t('mix.table_end_time')" />
							<el-select v-else-if="subItem.type == 'switch'" class="custom-input w-100 mt-1 mb-3" v-model="postForm[subItem.id]">
								<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
								<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
							</el-select>
							<el-select v-else-if="subItem.type == 'dropdown'" class="custom-input w-100 mt-1 mb-3" v-model="postForm[subItem.id]">
								<el-option v-for="(dropItem, index3) in subItem.dropdown" :key="subItem.name+'_'+index3" :label="dropItem.name" :value="dropItem.value">{{dropItem.name}}</el-option>
							</el-select>
					
							<template v-else-if="subItem.type == 'progress'">
								<div class="slider-demo-block">
									<el-slider v-model="postForm[subItem.id]" range show-stops :max="100" />
								</div>
								<label class="text-mute font-7 mb-3">{{$t('mix.table_match_range')}}: {{postForm[subItem.id]}}</label>
							</template>
							
							<template v-else-if="subItem.type == 'imagepicker'">
								<el-popover placement="right" width="130" trigger="hover" class="img-thumbnail">
									<template #reference>
										<el-image class="img-preview-box p-2 mt-1 mb-3" fit="contain" :src="postForm[subItem.id]" slot="reference"></el-image>
									</template>
										
									<el-button type="primary" @click="openImage(subItem.id);"><i class="fa-regular fa-pen"></i></el-button>
									<el-button type="danger" @click="initialImage();"><i class="fa-regular fa-trash-can"></i></el-button>
								</el-popover>
							</template>
						</div>
						
						<hr class="border-dotted" />
				
						<div class="d-flex justify-content-center align-items-content p-3 pb-0" v-if="$p.permissionChecker('toolSystemEdit')">
							<el-button @click="editRow()" class="custom-button success font-8 pt-3 pb-3">{{$t('button.save_setting')}}</el-button>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane key="page" :label="$t('mix.table_page')">
					<div class="ps-5 pe-5 pt-4 pb-4">
						<el-table :data="pageList" v-loading="loading" class="custom-table mt-3" ref="tablePage" :show-header="true">
							<template #empty v-if="pageList.length=='0'">
								<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
								<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
								<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
							</template>

							<template v-for="title in ajaxTitles" :key="title.prop">
								<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
									<template #header>
										<p class="search-label">{{title.label}}</p>
									</template>

									<template v-if="title.prop == 'action'" #default="scope">
										<el-button v-if="$p.permissionChecker('toolSystemPage')" class="custom-button primary m-1" @click="getPageRow(scope.row.id)">{{$t('button.edit')}}</el-button>
									</template>
								</el-table-column>
							</template>
						</el-table>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		
		<el-dialog v-if="modalList.pageRow" v-model="modalList.pageRow" :title="postPageForm.name" class="dialog-md" :before-close="clearPageForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postPageForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<template v-if="postPageForm.multiple_language === 0">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
							<el-input class="custom-input mt-1" v-model="postPageForm.single_title" :placeholder="$t('mix.table_title')" />
							
							<label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
							<Tinymce class="mt-1 my_editor" v-model="postPageForm.single_content" :disabled="loading"/>
						</template>
						
						<template v-else>
							<el-tabs type="border-card">
								<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
									<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
									<el-input class="custom-input mt-1" v-model="postPageForm.title[item.id]" :placeholder="$t('mix.table_title')" />
									
									<label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
									<Tinymce class="mt-1 my_editor" v-model="postPageForm.content[item.id]" :disabled="loading"/>
								</el-tab-pane>
							</el-tabs>
						</template>
					</el-col>
				</el-row>
			</el-form>
			
			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="pageRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.pageRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import Tinymce from '@/components/tinymce/index.vue'
</script>

<script>

export default {
    inject:['preloader'],
	data(){
		return {
			loading: true,
			errors: [],
			submitForm: {
				id:''
			},
			postData: {
				data: '',
				language: '',
			},
			ajaxTitles:[{
                prop:"name",
                label:this.$t('mix.table_name'),
                width: '100',
				align:'left'
            },{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			postForm:{},
			postOriginalForm:{},
			postEditForm:{},
			postPageForm:{
				id: '',
				multiple_language: 0,
				single_title: '',
				single_content: '',
				title:[],
				content:[],
			},
			openImageDialog: false,
			defaultImage:'',
			currentImageID:'',
			modalList:{},
			pageList:[],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			categoryList: [],
			securityCheck: 0
		};
	},
	methods:{
		initial(){
            this.loading = true
            this.postData.data = JSON.stringify(this.submitForm)
            var result = this.$m.postMethod('app/tools/systems/index',this.postData)
            result.then((value) => {
                var data = value.data

                if(value.valid){
                    this.pageList = data.pageList
                    this.categoryList = data.categoryList
					
					this.categoryList.forEach((value, index) => {
						value.item.forEach((subItem, index2) =>{
							this.postForm[subItem.id] = subItem.value
							this.postOriginalForm[subItem.id] = subItem.value
						})					
					})
					
                    this.loading = false
                }
            })
		},clearPostForm(done){
			this.postForm = {}
			this.postEditForm = {}
			this.postOriginalForm = {}
			this.currentImageID = ''
			
			this.postPageForm.id = ''
			this.postPageForm.multiple_language = 0
			this.postPageForm.single_title = ''
			this.postPageForm.single_content = ''
			this.postPageForm.title = []
			this.postPageForm.content = []
			
			if(done != undefined){
				done()
			}
		},clearPageForm(done){
			this.postPageForm.id = ''
			this.postPageForm.multiple_language = 0
			this.postPageForm.single_title = ''
			this.postPageForm.single_content = ''
			this.postPageForm.title = []
			this.postPageForm.content = []
			
			if(done != undefined){
				done()
			}
		},editRow(){
			if(this.$p.permissionChecker('toolSystemEdit')){
				this.postEditForm = {}
				const keys = Object.keys(this.postOriginalForm);
				keys.forEach((key) => {
					if(this.postOriginalForm[key] != this.postForm[key]){
						this.postEditForm[key] = this.postForm[key]
					}
				});

				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postEditForm)
				var result = this.$m.postMethod('app/tools/systems/DBedit',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})

						this.clearPostForm()
						this.initial()
					}else{					
                       this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				})
			}
		},getPageRow(id){
			if(this.$p.permissionChecker('toolSystemPage')){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/systems/page',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postPageForm = data.thisDetail
						this.postPageForm.multiple_language = parseInt(data.thisDetail.multiple_language)
						
						var content = '';
						content = this.decoder(JSON.stringify(this.postPageForm.content))
						this.postPageForm.content = JSON.parse(content)
						
						this.postPageForm.single_content = this.decoder(this.postPageForm.single_content)
						this.modalList.pageRow = true
					}
					this.loading = false
				})
			}
		},pageRow(){
			if(this.$p.permissionChecker('toolSystemPage')){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postPageForm)
				var result = this.$m.postMethod('app/tools/systems/DBpage',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})
						
						this.modalList.pageRow = false
						this.clearPostForm()
						this.clearPageForm()
						this.initial()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				})
			}
		},openImage(id){
			this.currentImageID = id
			this.openImageDialog = true
		},closeImageDialog(data) {
			this.openImageDialog = data
		},getImageDialog(data){
			this.postForm[this.currentImageID] = data.path
			this.openImageDialog = false
		},decoder (str) {
			var value = str;
			if(value){
				value = str.replace(/&quot/g,"'")	
			}
			
			return value
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>