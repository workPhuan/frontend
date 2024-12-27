<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_setting')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="modalList.addRow = true" :loading="loading" v-if="$p.permissionChecker('toolSettingAdd')">{{$t('menu.app_tools_setting_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolSettingDelete')">{{$t('menu.app_tools_setting_delete')}}</el-button>
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
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.category" :placeholder="$t('mix.table_please_enter')+$t('mix.table_category')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_category')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.code" :placeholder="$t('mix.table_please_enter')+$t('mix.table_code')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_code')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.value" :placeholder="$t('mix.table_please_enter')+$t('mix.table_value')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_value')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.sort" :placeholder="$t('mix.table_please_enter')+$t('mix.table_sort')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_sort')}}</label>
							</template>
						</el-input>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_view" :placeholder="$t('mix.table_is_view')" clearable @change="initial()" size='large'>
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
							
							<template v-if="title.prop == 'name'" #default="scope">
								<div class="vertical-middle-item">
									<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
									<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
								</div>
							</template>
							
							<template v-else-if="title.prop == 'is_view'" #default="scope">
								<el-switch v-model="scope.row.is_view" active-value="1" inactive-value="0" @change="viewRow(scope.row)" :disabled="($p.permissionChecker('toolSettingEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolSettingEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolSettingDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="searchData.pagination" :limit.sync="searchData.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_setting_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_subname')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.subname" :placeholder="$t('mix.table_subname')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="w-100 custom-input mt-1" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_category')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.category" :placeholder="$t('mix.table_category')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.type">
							<el-option :label="$t('mix.table_input')" value="word">{{$t('mix.table_input')}}</el-option>
							<el-option :label="$t('mix.table_number')" value="number">{{$t('mix.table_number')}}</el-option>
							<el-option :label="$t('mix.table_float')" value="float">{{$t('mix.table_float')}}</el-option>
							<el-option :label="$t('mix.table_progress')" value="progress">{{$t('mix.table_progress')}}</el-option>
							<el-option :label="$t('mix.table_timepicker')" value="timepicker">{{$t('mix.table_timepicker')}}</el-option>
							<!-- <el-option :label="$t('mix.table_imagepicker')" value="imagepicker">{{$t('mix.table_imagepicker')}}</el-option> -->
							<el-option :label="$t('mix.table_switch')" value="switch">{{$t('mix.table_switch')}}</el-option>
							<el-option :label="$t('mix.table_dropdown')" value="dropdown">{{$t('mix.table_dropdown')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_value')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.value" :placeholder="$t('mix.table_value')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_view')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_view">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_dropdown_item')}}</label>
						<el-input type="textarea" rows="3" class="mt-1" v-model="postForm.dropdown" :placeholder="$t('mix.table_dropdown_item')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
						<el-input type="textarea" rows="3" class="mt-1" v-model="postForm.description" :placeholder="$t('mix.table_description')" />
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_setting_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_subname')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.subname" :placeholder="$t('mix.table_subname')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input w-100 mt-1" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_category')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.category" :placeholder="$t('mix.table_category')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_type')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.type">
							<el-option :label="$t('mix.table_input')" value="word">{{$t('mix.table_input')}}</el-option>
							<el-option :label="$t('mix.table_number')" value="number">{{$t('mix.table_number')}}</el-option>
							<el-option :label="$t('mix.table_float')" value="float">{{$t('mix.table_float')}}</el-option>
							<el-option :label="$t('mix.table_progress')" value="progress">{{$t('mix.table_progress')}}</el-option>
							<el-option :label="$t('mix.table_timepicker')" value="timepicker">{{$t('mix.table_timepicker')}}</el-option>
							<!-- <el-option :label="$t('mix.table_imagepicker')" value="imagepicker">{{$t('mix.table_imagepicker')}}</el-option> -->
							<el-option :label="$t('mix.table_switch')" value="switch">{{$t('mix.table_switch')}}</el-option>
							<el-option :label="$t('mix.table_dropdown')" value="dropdown">{{$t('mix.table_dropdown')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_value')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.value" :placeholder="$t('mix.table_value')" />
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_view')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_view">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_dropdown_item')}}</label>
						<el-input type="textarea" rows="3" class="mt-1" v-model="postForm.dropdown" :placeholder="$t('mix.table_dropdown_item')" />
					</el-col>
					
					<el-col :span="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
						<el-input type="textarea" rows="3" class="mt-1" v-model="postForm.description" :placeholder="$t('mix.table_description')" />
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
			errors: [],
			submitForm: {
				id:'',
				security:''
			},
			postData: {
				data: '',
				language: '',
			},
			searchData:Object.assign({}, searchForm),
			ajaxTitles:[{
                prop:"id",
                label:this.$t('mix.table_id'),
                width:'50',
            },{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'180',
            },{
                prop:"category",
                label:this.$t('mix.table_category'),
                width:'150',
            },{
                prop:"value",
                label:this.$t('mix.table_value'),
                width:'300',
			},{
                prop:"sort",
                label:this.$t('mix.table_sort'),
                width:'100',
			},{
                prop:"is_view",
                label:this.$t('mix.table_is_view'),
                width:'100',
				align:'center'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			ajaxSearch:[{
                prop:"id",
                label:this.$t('mix.table_id'),
            },{
                prop:"category",
                label:this.$t('mix.table_category'),
            },{
                prop:"code",
                label:this.$t('mix.table_code'),
			},{
                prop:"value",
                label:this.$t('mix.table_value'),
			},{
                prop:"is_view",
                label:this.$t('mix.table_is_view'),
			}],
			postForm:{
				category:'',
				code:'',
				type: 'word',
				is_view: 0,
				value:'',
				name:'',
				subname:'',
				sort: 100,
				description:'',
				dropdown:'',
				selectedIds: [],
			},
			modalList:{},
			securityCheck: 0
		};
	},
	methods:{
		initial(){
            this.loading = true
            this.postData.data = JSON.stringify(this.searchData)
            var result = this.$m.postMethod('app/tools/setting/ajaxTable',this.postData)
            result.then((value) => {
                var data = value.data

                if(value.valid){
                    this.tableData = data.datatable.data
                    this.total = parseInt(data.datatable.total_number)
                    this.searchData.page = parseInt(data.datatable.current_pagination)
                    this.searchData.limit = parseInt(data.datatable.limit)
                    this.loading = false
                }
            })
		},clearPostForm(done){
			this.postForm.category = ''
			this.postForm.name = ''
			this.postForm.subname = ''
			this.postForm.code = ''
			this.postForm.sort = 100
			this.postForm.type = 'word'
			this.postForm.is_view = 0
			this.postForm.value = ''
			this.postForm.description = ''
			this.postForm.selectedIds = []
			
			if(done != undefined){
				done()
			}
		},addRow(){
			if(this.$p.permissionChecker('toolSettingAdd')){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/setting/DBadd',this.postData)

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
			if(this.$p.permissionChecker('toolSettingEdit')){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/setting/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.postForm.is_view = parseInt(data.thisDetail.is_view)
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolSettingEdit')){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/setting/DBedit',this.postData)

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
		},viewRow(currentData){
			if(this.$p.permissionChecker('toolSettingEdit')){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.is_view = currentData.is_view;
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('app/tools/setting/DBview',formData)
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
					this.initial()
					this.loading = false
				});
			};
		},deleteRow(id){
			if(this.$p.permissionChecker('toolSettingDelete')){
				var valid = true
				if(id == 'multiple'){
					if(this.postForm.selectedIds.length < 1){
						valid = false
					}
				}
				
				if(valid){
					this.loading = true;
					this.$prompt(this.$t('msg.msg_delete'), this.$t('msg.prompt'), {
						confirmButtonText: this.$t('button.confirm'),
						cancelButtonText: this.$t('button.cancel'),
						inputPlaceholder: this.$t('msg.msg_security_password'),
						inputType: 'password'
					}).then(({value}) => {
						this.submitForm.id = id
						this.submitForm.selectedIds = this.postForm.selectedIds
						this.submitForm.security = value

						this.postData.data = JSON.stringify(this.submitForm)
						var result = this.$m.postMethod('app/tools/setting/DBdelete',this.postData)
						result.then((value) => {
							var data = value.data
							if(value.valid){
								this.$message({
									type: 'success',
									message: data.returnMsg
								})
								
								this.initial()
								this.loading = false
							}else{
								this.$m.popupErrorMessage(data.returnMsg,this)
								this.loading = false
							}
						})
					}).catch(() => {
						this.loading = false          
					})
				}else{
					this.$message.error(this.$t('error.msg_checkbox_select'));
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
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id);
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>