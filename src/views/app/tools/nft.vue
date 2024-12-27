<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_nft')}}
			</label>
            <div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('toolNftAdd')">{{$t('menu.app_tools_nft_add')}}</el-button>
			</div>
		</div>

		<div class="page-body p-3">
			<el-card shadow="never">
                <div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
                        <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.title" :placeholder="$t('mix.table_please_enter')+$t('mix.table_title')" @keyup.enter.native="initial()">
                            <template #prepend>
                                <label>{{$t('mix.table_title')}}</label>
                            </template>
                        </el-input>

                        <el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>

					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>

							<template v-if="title.prop == 'name'" #default="scope">
								<div class="d-flex align-items-center">
									<img :src="scope.row.img_url" class="w-r-2 h-auto me-2"/>
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
										<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
									</div>
								</div>
							</template>

							<template v-if="title.prop == 'created_at'" #default="scope">
								<p>{{$t('mix.table_created_at')}} : {{scope.row.created_at}}</p>
								<p>{{$t('mix.table_start_at')}} : {{scope.row.start_at}}</p>
								<p>{{$t('mix.table_completed_at')}} : {{scope.row.end_at}}</p>
							</template>

                            <template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolNftStatus')) ? false : true"></el-switch>
							</template>

                            <template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolNftEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolNftDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

        <el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_nft_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">

					<el-col v-if="0" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('general.date_start')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" v-model="postForm.start_at" type="datetime" size="large" :placeholder="$t('general.date_start')" />
                    </el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('general.date_end')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" v-model="postForm.end_at" type="datetime" size="large" :placeholder="$t('general.date_end')" />
                    </el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.price" :placeholder="$t('mix.table_price')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_quantity')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.stock" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_wallet')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.payment" multiple collapse-tags :max-collapse-tags="2">
							<el-option v-for="item in walletList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="imageChange(index)"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
                            <el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
                            <el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>

				<el-col :sm="24" class="mb-3">
					<hr class="border-dotted" />
				</el-col>

				<template v-if="postForm.multiple_language === 0">
					<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_title')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_title')" />

                    <label class="text-theme font-8 fw-bold mt-3"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
					<Tinymce class="mt-1 my_editor" v-model="postForm.single_content" :disabled="loading"/>

				</template>

				<template v-else>
					<el-tabs type="border-card" class="mt-3 mb-4">
						<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />

                            <label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
							<Tinymce class="mt-1 my_editor" v-model="postForm.content[item.id]" :disabled="loading"/>
						</el-tab-pane>
					</el-tabs>
				</template>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>

        <el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_nft_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col v-if="0" :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('general.date_start')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" v-model="postForm.start_at" type="datetime" size="large" :placeholder="$t('general.date_start')" />
                    </el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('general.date_end')}}</label>
                        <el-date-picker class="custom-input mt-1 w-100" v-model="postForm.end_at" type="datetime" size="large" :placeholder="$t('general.date_end')" />
                    </el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.price" :placeholder="$t('mix.table_price')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_quantity')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.stock" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_wallet')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.payment" multiple collapse-tags :max-collapse-tags="2">
							<el-option v-for="item in walletList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
					</el-col>

                    <el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
							<small class="text-danger">* {{$t('msg.msg_upload_edit')}}</small>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="imageChange(index)"/>
					</el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
                        <el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
                            <el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
                            <el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
                        </el-select>
                    </el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>

				<template v-if="postForm.multiple_language === 0">
					<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_name')" />

                    <label class="text-theme font-8 fw-bold mt-3"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
					<Tinymce class="mt-1 my_editor" v-model="postForm.single_content" :disabled="loading"/>
				</template>

				<template v-else>
					<el-tabs type="border-card" class="mt-3 mb-4">
						<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />

                            <label class="text-theme font-8 fw-bold mt-4"><span class="text-danger">*</span> {{$t('mix.table_content')}}</label>
							<Tinymce class="mt-1 my_editor" v-model="postForm.content[item.id]" :disabled="loading"/>
						</el-tab-pane>
					</el-tabs>
				</template>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="editRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.editRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>

	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
import Tinymce from '@/components/tinymce/index.vue'
import { useClipboard } from '@vueuse/core'
const {copy} = useClipboard()
</script>

<script>

let searchForm = {
	pagination: 1,
	limit: 10,
}

export default {
    inject:['preloader'],
	data(){
		return {
			loading: true,
			tableData: [],
			total: 0,
			openImageDialog: false,
			errors: [],
			submitForm: {
				id:''
			},
			postData: {
				data: '',
				language: '',
			},
			searchData:Object.assign({}, searchForm),
			listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'80',
				align:'left'
			},{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'200',
				align:'left'
			},{
                prop:"price",
                label:this.$t('mix.table_price'),
                width:'80',
				align:'left'
			},{
                prop:"stock",
                label:this.$t('mix.table_quantity'),
                width:'80',
				align:'left'
			},{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'180',
				align:'left'
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'80',
				align:'left'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'200',
				align:'right'
			}],
			postForm:{
				id: '',
                multiple_language: 0,
				single_name: '',
				name:[],
				single_content: '',
				content:[],
				img_url:'',
				start_at:'',
				end_at:'',
                code:'',
                price:0,
                stock:0,
				status:1,
			},
			defaultImage:'',
			languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},
			walletList:[],
			securityCheck: 0,
			imagePickerFile:'',
			imagePickerFileUrl:'',
		}
	},
	methods:{
        getInitial(){
            this.loading = true

            this.postData.data = JSON.stringify(this.submitForm)
            var result = this.$m.postMethod('app/tools/nft',this.postData)
            result.then((value) => {
                var data = value.data

                if(value.valid){
                    this.initial()
                }
                this.loading = false
            })
        },initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/tools/nft/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
				}
			})
		},clearPostForm(done){
			this.postForm.id = ''
			this.postForm.multiple_language = 0
			this.postForm.single_name = ''
			this.postForm.name = []
			this.postForm.single_content = ''
			this.postForm.content = []
			this.postForm.img_url = ''
			this.postForm.start_at = ''
			this.postForm.end_at = ''
			this.postForm.code = ''
			this.postForm.price = 0
			this.postForm.stock = 0
			this.postForm.status = 1
			this.postForm.security = ''
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('toolNftAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/nft/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.walletList = data.walletList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow(){
			if(this.$p.permissionChecker('toolNftAdd') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/nft/DBadd',formData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})

						this.modalList.addRow = false
						this.clearPostForm()
						this.initial()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}

					this.loading = false
					this.preloader(false)
				})
			}
		},getEditRow(id){
			if(this.$p.permissionChecker('toolNftEdit') && this.loading == false){
				this.loading = true
                this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/nft/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
                        this.postForm = data.thisDetail
                        this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)
                        this.postForm.status = parseInt(data.thisDetail.status)

						this.walletList = data.walletList

                        var title = '';
                        title = this.decoder(JSON.stringify(this.postForm.name))
						this.postForm.name = JSON.parse(title)

                        var content = '';
                        content = this.$m.htmlDecoder(JSON.stringify(this.postForm.content))
                        this.postForm.content = JSON.parse(content)

                        this.postForm.single_name = this.decoder(this.postForm.single_name)
						this.postForm.single_content = this.$m.htmlDecoder(this.postForm.single_content)

						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolNftEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/nft/DBedit',formData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})

						this.modalList.editRow = false
						this.clearPostForm()
						this.initial()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}

					this.loading = false
					this.preloader(false)
				})
			}
		},statusRow(currentData){
			if(this.$p.permissionChecker('toolNftStatus') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('app/tools/nft/DBstatus',formData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						});
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					this.clearPostForm()
					this.initial()
					this.loading = false
				})
			}
		},deleteRow(id) {
			if(this.$p.permissionChecker('toolNftDelete') && this.loading == false){
				var valid = true
				if(id == 'multiple'){
					if(this.postForm.selectedIds.length < 1){
						valid = false
					}
				}

				if(valid){
					this.loading = true;
					this.$confirm(this.$t('msg.msg_delete'), this.$t('msg.prompt'), {
						confirmButtonText: this.$t('button.yes'),
						cancelButtonText: this.$t('button.no'),
						customClass: 'input-dialog',
						showInput: (this.securityCheck == 1),
						inputPlaceholder: this.$t('mix.table_security'),
						inputType: 'password',
					}).then(({value}) => {
						this.postForm.security = value
						this.postForm.id = id
						this.postData.data = JSON.stringify(this.postForm);
						var result = this.$m.postMethod("app/tools/nft/DBdelete", this.postData);
						result.then((value) => {
							var data = value.data;
							if (value.valid) {
								this.$message({
									type: "success",
									message: data.returnMsg
								});

								this.initial();
								this.loading = false;
							} else {
								this.$m.popupErrorMessage(data.returnMsg,this)
								this.loading = false;
							}
						});
					}).catch(() => {
						this.loading = false
					});
				}else{
					this.$message.error(this.$t('error.msg_checkbox_select'))
				}
			}
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}

			this.initial()
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
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
		this.mask = this.$m.getSecurityMask()
        this.getInitial()
	}
}
</script>
