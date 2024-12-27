<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_wallet')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="modalList.addRow = true" v-if="$p.permissionChecker('toolWalletAdd')">{{$t('menu.app_tools_wallet_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolWalletDelete')">{{$t('menu.app_tools_wallet_delete')}}</el-button>
                <el-dropdown class="ms-1" v-if="$p.permissionChecker('toolWalletCache')">
                    <el-button class="custom-button plain" :loading="loading">
                        {{$t('button.cache')}} <el-icon class="fa-solid fa-angle-down"></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="cache()" :loading="loading" v-if="$p.permissionChecker('toolWalletCache')">{{$t('menu.app_tools_cache')}}</el-dropdown-item>
                            <el-dropdown-item @click="cacheclear()" :loading="loading" v-if="$p.permissionChecker('toolWalletCacheClear')">{{$t('menu.app_tools_cacheclear')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
			</div>
		</div>

		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.code" :placeholder="$t('mix.table_please_enter')+$t('mix.table_code')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_code')}}</label>
							</template>
						</el-input>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_deposit" :placeholder="$t('mix.table_deposit')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_withdraw" :placeholder="$t('mix.table_withdraw')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_transfer" :placeholder="$t('mix.table_transfer')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>

					<el-table-column type="selection" width="55"></el-table-column>

					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>
							<template v-if="title.prop == 'status'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolWalletEdit')) ? false : true"></el-switch>
							</template>

							<template v-if="title.prop == 'is_deposit'" #default="scope">
								<el-switch v-model="scope.row.is_deposit" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolWalletEdit')) ? false : true"></el-switch>
							</template>

							<template v-if="title.prop == 'is_withdraw'" #default="scope">
								<el-switch v-model="scope.row.is_withdraw" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolWalletEdit')) ? false : true"></el-switch>
							</template>

							<template v-if="title.prop == 'is_transfer'" #default="scope">
								<el-switch v-model="scope.row.is_transfer" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolWalletEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'name'" #default="scope">
								<div class="d-flex align-items-center">
									<img :src="scope.row.img_url" class="w-r-2 h-auto me-2"/>
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
										<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
									</div>
								</div>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolWalletEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolWalletDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>


		<el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_wallet_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_decimal_number')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.decimal_number" :step="1" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_deposit')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_deposit" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_withdraw')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_withdraw" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_transfer')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_transfer" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language" size="large">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')" />
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>

					<el-col :sm="24" class="mb-3 d-flex flex-column">
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

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="imageChange(index)"/>
					</el-col>
				</el-row>

				<template v-if="postForm.multiple_language === 0">
					<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_name')" />
				</template>

				<template v-else>
					<el-tabs type="border-card" class="mt-3 mb-4">
						<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_wallet_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_decimal_number')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.decimal_number" :step="1" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_deposit')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_deposit" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_withdraw')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_withdraw" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_transfer')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_transfer" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status" size="large">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language" size="large">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')" />
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>

					<el-col :sm="24" class="mb-3 d-flex flex-column">
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

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" @change="imageChange(index)"/>
					</el-col>
				</el-row>

				<template v-if="postForm.multiple_language === 0">
					<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_name')" />
				</template>

				<template v-else>
					<el-tabs type="border-card" class="mt-3 mb-4">
						<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />
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
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'250',
				align:'left'
			},{
                prop:"is_deposit",
                label:this.$t('mix.table_deposit'),
                width:'100',
				align:'center'
			},{
                prop:"is_withdraw",
                label:this.$t('mix.table_withdraw'),
                width:'100',
				align:'center'
			},{
                prop:"is_transfer",
                label:this.$t('mix.table_transfer'),
                width:'100',
				align:'center'
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'100',
				align:'center'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			postForm:{
				code:'',
				img_url:'',
				decimal_number: 0,
				remark:'',
				display_type:'',
				display_bonus:'',
				is_withdraw: 0,
				is_deposit: 0,
				is_transfer: 0,
				min_transfer: 0,
				max_transfer: 0,
				status: 1,
				multiple_language: 1,
				security: '',
				single_name: '',
				name:[],
				selectedIds:[],
			},
			imagePickerFile:'',
			imagePickerFileUrl:'',
			languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},

			securityCheck: 0
		}
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/tools/wallet/ajaxTable',this.postData)
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
			this.postForm.img_url = this.defaultImage
			this.postForm.code = ''
			this.postForm.decimal_number = 0
			this.postForm.is_withdraw = 0
			this.postForm.is_transfer = 0
			this.postForm.min_transfer = 0
			this.postForm.max_transfer = 0
			this.postForm.status = 1
			this.postForm.remark = ''
			this.postForm.display_type = ''
			this.postForm.display_bonus = ''
			this.postForm.multiple_language = 1
			this.postForm.security = ''
			this.postForm.single_name = ''
			this.postForm.name = []
			this.postForm.selectedIds = []
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			if(done != undefined){
				done()
			}
		},addRow(){
			if(this.$p.permissionChecker('toolWalletAdd') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/wallet/DBadd',formData)
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
			if(this.$p.permissionChecker('toolWalletEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.id = id;
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod('app/tools/wallet/edit',this.postData);
				result.then((value) => {
					var data = value.data;

					if(value.valid){
						this.postForm = data.thisDetail
						this.postForm.status = parseInt(data.thisDetail.status)
						this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)
						this.postForm.decimal_number = parseInt(data.thisDetail.decimal_number)

						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},editRow(){
			if(this.$p.permissionChecker('toolWalletEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/wallet/DBedit',formData)
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
			if(this.$p.permissionChecker('toolWalletEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.submitForm.is_deposit = currentData.is_deposit
				this.submitForm.is_withdraw = currentData.is_withdraw
				this.submitForm.is_transfer = currentData.is_transfer
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('app/tools/wallet/DBstatus',formData)
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
		},colRow(col,currentData){
			if(this.$p.permissionChecker('toolWalletEdit') && this.loading == false){
				this.loading = true
				var form = {}
				form.id = currentData.id
				form[col] = currentData[col]
				this.postData.data = JSON.stringify(form)

				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('app/tools/wallet/DBstatus',formData)
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
			if(this.$p.permissionChecker('toolWalletDelete') && this.loading == false){
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
						var result = this.$m.postMethod("app/tools/wallet/DBdelete", this.postData);
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
        },cache() {
            if(this.$p.permissionChecker('toolWalletCache') && this.loading == false){
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
                    this.postData.data = JSON.stringify(this.postForm);
                    var result = this.$m.postMethod("app/tools/wallet/DBcache", this.postData);
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
                    this.loading = false;
                });
            }
        },cacheclear() {
            if(this.$p.permissionChecker('toolWalletCacheClear') && this.loading == false){
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
                    this.postData.data = JSON.stringify(this.postForm);
                    var result = this.$m.postMethod("app/tools/wallet/DBcacheclear", this.postData);
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
                    this.loading = false;
                });
            }
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}

			this.initial()
		},decoder (str) {
			var value = str;
			if(value){
				value = str.replace(/&quot/g,"'")
			}

			return value
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id);
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.mask = this.$m.getSecurityMask()
		this.initial()
	}
}
</script>
