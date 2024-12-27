<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_payment')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('toolPaymentAdd')">{{$t('menu.app_tools_payment_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolPaymentDelete')">{{$t('menu.app_tools_payment_delete')}}</el-button>
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

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.filter" :placeholder="$t('mix.table_please_enter')+$t('mix.table_filter')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_filter')}}</label>
							</template>
						</el-input>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_admin" :placeholder="$t('mix.table_is_admin')" clearable @change="initial()">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_member" :placeholder="$t('mix.table_is_member')" clearable @change="initial()">
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
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolPaymentStatus')) ? false : true"></el-switch>
							</template>
							<template v-else-if="title.prop == 'is_admin'" #default="scope">
								<el-switch v-model="scope.row.is_admin" active-value="1" inactive-value="0" @change="adminRow(scope.row)" :disabled="($p.permissionChecker('toolPaymentAdmin')) ? false : true"></el-switch>
							</template>
							<template v-else-if="title.prop == 'is_member'" #default="scope">
								<el-switch v-model="scope.row.is_member" active-value="1" inactive-value="0" @change="memberRow(scope.row)" :disabled="($p.permissionChecker('toolPaymentMember')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolPaymentEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolPaymentDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_payment_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_filter')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.filter" multiple clearable :placeholder="$t('mix.table_filter')">
							<el-option v-for="(list,index) in filterList" :key="index" :label="list.name" :value="list.value">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_admin')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_admin">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_member')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_member">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
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

				<el-row :glutter="20">
					<el-col :sm="24" class="mb-3 mt-3">
						<el-card class="mb-4" shadow="none">
							<template #header>
								<div>
									{{$t('mix.table_formula')}}
								</div>
							</template>

		                    <el-row :gutter="20" v-for="(item,key) in walletList" :key="item.id">
		                        <el-col :sm="12" class="mb-3">
		                            <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{item.name}}</label>
		                            <el-input class="custom-input w-100 mt-1" v-model="postForm.formula[item.id]" :placeholder="item.name" />
		                        </el-col>
		                        <el-col :sm="12" class="mb-3">
		                            <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_mode')}}</label>
		                            <el-select class="custom-input w-100 mt-1" v-model="postForm.mode[item.id]" :placeholder="$t('mix.table_mode')" >
		                                <el-option :label="$t('mix.table_min')" :value="'min'">{{$t('mix.table_min')}}</el-option>
		                                <el-option :label="$t('mix.table_max')" :value="'max'">{{$t('mix.table_max')}}</el-option>
		                                <el-option :label="$t('mix.table_equal')" :value="'equal'">{{$t('mix.table_equal')}}</el-option>
		                            </el-select>
		                        </el-col>
		                    </el-row>

						</el-card>
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_payment_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :step="1" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_filter')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.filter" multiple clearable :placeholder="$t('mix.table_filter')">
							<el-option v-for="(list,index) in filterList" :key="index" :label="list.name" :value="list.value">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_admin')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_admin">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_member')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.is_member">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
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

				<el-row :glutter="20">
					<el-col :sm="24" class="mb-3">
						<el-card class="mb-4 mt-3" shadow="none">
							<template #header>
								<div>
									{{$t('mix.table_formula')}}
								</div>
							</template>

                            <el-row :gutter="20" v-for="(item,key) in walletList" :key="item.id">
                                <el-col :sm="12" class="mb-3">
                                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{item.name}}</label>
                                    <el-input class="custom-input w-100 mt-1" v-model="postForm.formula[item.id]" :placeholder="item.name" />
                                </el-col>
                                <el-col :sm="12" class="mb-3">
                                    <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_mode')}}</label>
                                    <el-select class="custom-input w-100 mt-1" v-model="postForm.mode[item.id]" :placeholder="$t('mix.table_mode')" >
                                        <el-option :label="$t('mix.table_min')" :value="'min'">{{$t('mix.table_min')}}</el-option>
                                        <el-option :label="$t('mix.table_max')" :value="'max'">{{$t('mix.table_max')}}</el-option>
                                        <el-option :label="$t('mix.table_equal')" :value="'equal'">{{$t('mix.table_equal')}}</el-option>
                                    </el-select>
                                </el-col>
                            </el-row>

						</el-card>
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
				security:'',
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
                width: '100',
			},{
                prop:"filter",
                label:this.$t('mix.table_filter'),
                width:'150',
			},{
                prop:"formula",
                label:this.$t('mix.table_formula'),
                width:'300',
			},{
                prop:"mode",
                label:this.$t('mix.table_mode'),
                width:'200',
            },{
                prop:"is_admin",
                label:this.$t('mix.table_is_admin'),
                width:'100',
				align:'center'
			},{
                prop:"is_member",
                label:this.$t('mix.table_is_member'),
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
				code: '',
				filter:[],
				formula:{},
                mode:{},
				sort: 10,
				status: 1,
				is_admin: 0,
				is_member: 0,
				multiple_language: 0,
				security: '',
				single_name: '',
				name:[],
				selectedIds:[],
			},
			filterList:[],
			walletList:[],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},
			securityCheck: 0
		}
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/tools/payment/ajaxTable',this.postData)
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
			this.postForm.code = ''
			this.postForm.filter = []
			this.postForm.formula = {}
			this.postForm.mode = {}
			this.postForm.sort = 10
			this.postForm.status = 1
			this.postForm.is_admin = 0
			this.postForm.is_member = 0
			this.postForm.multiple_language = 1
			this.postForm.security = ''
			this.postForm.single_name = ''
			this.postForm.name = []
			this.postForm.selectedIds = []
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('toolPaymentAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/payment/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.filterList = data.filterList
						this.walletList = data.walletList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow(){
			if(this.$p.permissionChecker('toolPaymentAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/payment/DBadd',this.postData)

				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.$message({
							message: data.returnMsg,
							type: 'success'
						})

						this.modalList.addRow = false,
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
			if(this.$p.permissionChecker('toolPaymentEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/payment/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.postForm.sort = parseInt(data.thisDetail.sort)
						this.postForm.status = parseInt(data.thisDetail.status)
						this.postForm.is_admin = parseInt(data.thisDetail.is_admin)
						this.postForm.is_member = parseInt(data.thisDetail.is_member)
						this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)
						this.filterList = data.filterList
						this.walletList = data.walletList
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolPaymentEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/payment/DBedit',this.postData)

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
			if(this.$p.permissionChecker('toolPaymentStatus') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.status = currentData.status;
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('app/tools/payment/DBstatus',formData)
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
			};
		},adminRow(currentData){
			if(this.$p.permissionChecker('toolPaymentAdmin') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.is_admin = currentData.is_admin;
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('app/tools/payment/DBadmin',formData)
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
			};
		},memberRow(currentData){
			if(this.$p.permissionChecker('toolPaymentMember') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.is_member = currentData.is_member;
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('app/tools/payment/DBmember',formData)
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
			};
		},deleteRow(id) {
			if(this.$p.permissionChecker('toolPaymentDelete') && this.loading == false){
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
						var result = this.$m.postMethod("app/tools/payment/DBdelete", this.postData);
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
