<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_systempayment')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('toolSystemPaymentAdd')">{{$t('menu.app_tools_systempayment_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolSystemPaymentDelete')">{{$t('menu.app_tools_systempayment_delete')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
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
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolSystemPaymentDBstatus')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolSystemPaymentEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolSystemPaymentDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>
	
				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

        <el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_systempayment_add')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_bonus')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.transaction_type" :placeholder="$t('mix.table_bonus')">
							<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
					</el-col>
				</el-row>
				
                <el-card class="mb-4" shadow="none">
                    <template #header>
                        <div>
                            {{$t('mix.table_formula')}}
                        </div>
                    </template>
                    
                    <div v-for="(item,key) in walletList" :key="item.id" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{item.name}}</label>
						<el-input class="custom-input w-100 mt-1" v-model="postForm.formula[item.id]" :placeholder="item.name" />
                    </div>
                </el-card>

				<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
					<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
				</el-col>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="addRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_systempayment_edit')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_bonus')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.transaction_type">
							<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
					</el-col>
				</el-row>
				
                <el-card class="mb-4" shadow="none">
                    <template #header>
                        <div>
                            {{$t('mix.table_formula')}}
                        </div>
                    </template>
                    
                    <div v-for="(item,key) in walletList" :key="item.id" class="mb-3">
                        <label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{item.name}}</label>
						<el-input class="custom-input w-100 mt-1" v-model="postForm.formula[item.id]" :placeholder="item.name" />
                    </div>
                </el-card>

				<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
					<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
					<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
				</el-col>
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
				status: 0
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
                prop:"transaction_type",
                label:this.$t('mix.table_transaction_type'),
                width:'150',
			},{
                prop:"formula",
                label:this.$t('mix.table_formula'),
                width:'120',
				align:'left'
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'180',
				align:'right'
			}],
			postForm:{
				transaction_type:'',
				account_id:'',
				formula:{},
				selectedIds:[],
                security: '',
			},
            typeList:[],
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
			var result = this.$m.postMethod('app/tools/systempayment/ajaxTable',this.postData)
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
			this.postForm.transaction_type = ''
			this.postForm.account_id = ''
			this.postForm.formula = {}
			this.postForm.selectedIds = []
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('toolSystemPaymentAdd') && this.loading == false){
				this.loading = true
				
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/systempayment/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.typeList = data.typeList
						this.walletList = data.walletList
						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow(){
			if(this.$p.permissionChecker('toolSystemPaymentAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/systempayment/DBadd',this.postData)

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
			if(this.$p.permissionChecker('toolSystemPaymentEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = id
				
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/systempayment/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.typeList = data.typeList
						this.walletList = data.walletList
						this.postForm = data.thisDetail
						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolSystemPaymentEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/tools/systempayment/DBedit',this.postData)

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
		},deleteRow(id) {
			if(this.$p.permissionChecker('toolSystemPaymentDelete') && this.loading == false){
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
						var result = this.$m.postMethod("app/tools/systempayment/DBdelete", this.postData);
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