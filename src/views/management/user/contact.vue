<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_user_contact')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow(),modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('userContactAdd')">{{$t('menu.management_user_contact_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('userContactDelete')">{{$t('menu.management_user_contact_delete')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
                        
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.master_id" :placeholder="$t('mix.table_please_enter')+$t('mix.table_account')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_account')}}</label>
							</template>
						</el-input>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.friend_id" :placeholder="$t('mix.table_please_enter')+$t('mix.table_friend_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_friend_name')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_block" :placeholder="$t('mix.table_is_block')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<div class="fixed-width-200 m-2">
							<el-date-picker class="custom-input fixed-width-200" v-model="searchData.created_at" type="daterange" range-separator="-" :start-placeholder="$t('mix.table_start_at')" :end-placeholder="$t('mix.table_end_at')" @change="initial()" />
						</div>

						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>
					
					<el-table-column type="selection" width="45"></el-table-column>
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
							<template #header>
								<p class="search-label">{{title.label}}</p>
						    </template>

                            <template v-if="title.prop == 'is_block'" #default="scope">
								<el-switch v-model="scope.row.is_block" active-value="1" inactive-value="0" @change="blockRow(scope.row)" :disabled="($p.permissionChecker('toolEventEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userContactEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('userContactDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>
                
				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
                </el-card>
            </div>
            
            <el-dialog v-model="modalList.addRow" :title="$t('menu.management_user_contact_add')" :before-close="clearPostForm">
                <el-form label-position="top" label-width="auto" @submit.native.prevent>
                <el-row :gutter="20">

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account')}}</label>
						<el-input class="custom-input mt-1 w-100" v-model="postForm.master_id" :placeholder="$t('mix.table_account')"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_friend_name')}}</label>
						<el-input class="custom-input mt-1 w-100" v-model="postForm.friend_id" :placeholder="$t('mix.table_friend_name')"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_block')}}</label>
                        <el-select class="custom-input w-100 mt-1" v-model="postForm.is_block" size="large">
                            <el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
                            <el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
                        </el-select>
                    </el-col>
                    
                    <el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
                    </el-col>
				
                </el-row>
			</el-form>
			
			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>
		
		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_user_contact_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">

					<el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account')}}</label>
                        <el-input class="custom-input mt-1 w-100" v-model="postForm.master_id" :min="0" disabled/>
                    </el-col>
                    
					<el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_contact')}}</label>
                        <el-input class="custom-input mt-1 w-100" v-model="postForm.friend_id" :min="0" disabled/>
                    </el-col>

                    <el-col :sm="12" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_block')}}</label>
                        <el-select class="custom-input w-100 mt-1" v-model="postForm.is_block" size="large">
                            <el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
                            <el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
                        </el-select>
                    </el-col>
                    
                    <el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
                        <el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
                    </el-col>
			
                </el-row>
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
</script>

<script>
let searchForm = {
	pagination: 1,
	limit: 10,
}

export default {
    inject:['preloader'],
	data() {
		return {
			loading: true,
			tableData: [],
			total: 0,
			errors: [],
            searchField: true,
			submitForm: {
				id: "",
				security:""
			},
			postData: {
				data: '',
				language: ''
			},
			searchData:Object.assign({}, searchForm),
			listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles: [{
				prop:"created_at",
				label:this.$t("mix.table_created_at"),
				width: "150",
			},{
				prop:"master_id",
				label:this.$t("mix.table_account"),
				width: "150",
			},{
				prop:"friend_id",
				label:this.$t("mix.table_friend_name"),
				width: "150",
			},{
				prop:"is_block",
				label:this.$t("mix.table_is_block"),
				width: "80",
				align:'center'
			},{
				prop:"action",
				label:this.$t("mix.table_action"),
				width: "200",
				align:'center'
			}],
			ajaxSearch: [{
				prop:"name",
				label:this.$t("mix.table_name")
			},{
				prop:"is_block",
				label:this.$t("mix.table_is_block")
			},{
				prop:"sort",
				label:this.$t("mix.table_sort")
			},{
				prop:"status",
				label:this.$t("mix.table_status")
			}],
			postForm: {
				id:'',
				friend_id:'',
				security: "",
				is_block: 1,
				selectedIds:[],
			},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			permissionList:[],
			postPermission:{
				id:'',
				permission:[],
			},
			defaultProps:{
				id: 'id',
				children: 'children',
				label: 'name'
			},
			userList:[],
			contactList:[],
			modalList:{},
			securityCheck: 0,
		}
	},
	methods:{
		initial() {
			this.loading = true;
			this.postData.data = JSON.stringify(this.searchData);
			var result = this.$m.postMethod("management/user/contact/ajaxTable", this.postData);
			result.then((value) => {
				var data = value.data;

				if (value.valid) {
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
				}
			});
		},clearPostForm(done){
			this.postForm.id = ''
			this.postForm.master_id = ''
			this.postForm.friend_id = ''
			this.postForm.is_block = 0
			
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('merchantAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('management/user/contact/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
                        this.userList = data.userList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
        },addRow() {
			if(this.$p.permissionChecker('userContactAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod("management/user/contact/DBadd",this.postData)
				
				result.then((value) => {
					var data = value.data

					if (value.valid) {
						this.$message({
							message: data.returnMsg,
							type: "success"
						});
						
						this.modalList.addRow = false
						this.clearPostForm()
						this.initial()
					} else {
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
					this.preloader(false)
				});
			}
		},getEditRow(id) {
			if(this.$p.permissionChecker('userContactEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.id = id;
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/user/contact/edit", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						this.postForm = data.thisDetail
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},editRow() {
			if(this.$p.permissionChecker('userContactEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod("management/user/contact/DBedit", this.postData)

				result.then((value) => {
					var data = value.data

					if (value.valid) {
						this.$message({
							message: data.returnMsg,
							type: "success"
						});
						
						this.modalList.editRow = false
						this.clearPostForm()
						this.initial()
					} else {
						this.$m.popupErrorMessage(data.returnMsg,this)
					}

					this.loading = false
					this.preloader(false)
				});
			}
		},blockRow(currentData){
			if(this.$p.permissionChecker('userContactEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.is_block = currentData.is_block
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/user/contact/DBblock',formData)
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
				});
			}
		},deleteRow(id) {
			if(this.$p.permissionChecker('userContactDelete') && this.loading == false){
				var valid = true
				if(id == 'multiple'){
					if(this.postForm.selectedIds.length < 1){
						valid = false
					}
				}
				
				if(valid){
					this.loading = true
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
						var result = this.$m.postMethod("management/user/contact/DBdelete", this.postData);
						result.then((value) => {
							var data = value.data
							if (value.valid) {
								this.$message({
									type: "success",
									message: data.returnMsg
								});

								this.initial()
								this.loading = false
							} else {
								this.$m.popupErrorMessage(data.returnMsg,this)
								this.loading = false
							}
						});
					}).catch(() => {
						this.loading = false;         
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
		},handleCheckChange(node, checked){
			if(checked){
				this.postPermission.permission.push(node.id)
			}else{
				const index = this.postPermission.permission.indexOf(node.id)
				if(index !== -1){
					this.postPermission.permission.splice(index, 1)
				}
			}
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id)
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
};
</script>