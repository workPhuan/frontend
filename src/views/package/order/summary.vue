<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.package_order_summary')}}
			</label>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.code" :placeholder="$t('mix.table_please_enter')+$t('mix.table_code')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_code')}}</label>
							</template>
						</el-input>
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
                        <el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.product_id" :placeholder="$t('mix.table_product')" clearable filterable @change="initial()">
							<el-option v-for="item in searchProductList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
                        <el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable filterable @change="initial()">
							<el-option v-for="item in searchStatusList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
                        <el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.agent_id" :placeholder="$t('mix.table_agent')" clearable filterable @change="initial()">
							<el-option v-for="item in searchAgentList" :label="item.name" :value="item.master_id">{{item.name}}</el-option>
						</el-select>
						
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="clearSearchForm()" :loading="loading"><i class="fa-light fa-brush me-2"></i>{{$t('button.clear')}}</el-button>

					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>
					
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type" >
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>

							<template v-if="title.prop == 'status_name'" #default="scope">
								<el-tag :type="scope.row.status_color">{{ scope.row.status_name }}</el-tag>
							</template>

							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="toOrderDetail(scope.row.id)">{{$t('button.order_info')}}</el-button>
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button primary m-1" @click="toClientDetail(scope.row.master_id)">{{$t('button.client_info')}}</el-button>
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.agent_id)">{{$t('mix.table_agent_info')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<el-dialog v-model="modalList.agentinfo" :title="$t('mix.table_agent_info')" :before-close="clearPostForm">
					<el-form label-position="top" label-width="auto" @submit.native.prevent>
						<el-row :gutter="20">
							
							<el-col :sm="12" class="mb-3">
								<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('menu.management_admin_agent')}}</label>
								<el-select class="custom-input mt-1 w-100" v-model="postForm.agent_id" :placeholder="$t('menu.management_admin_agent')">
									<el-option v-for="(list,index) in agentList" :key="index" :label="list.name" :value="list.master_id">{{list.name}}</el-option>
								</el-select>
							</el-col>

						</el-row>

						<div class="d-flex justify-content-center align-item-center">
							<el-button class="custom-button success font-8 pt-3 pb-3" @click="toAgentInfoPage(this.postForm.agent_id)" :loading="loading">{{$t('button.submit')}}</el-button>
							<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.agentinfo = false,clearPostForm()">{{$t('button.close')}}</el-button>
						</div>
					</el-form>
				</el-dialog>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
import { CopyDocument } from '@element-plus/icons-vue';
import { accountDetail } from '@/system/store/state.js'
import { storeTempID } from '@/system/store/state.js'

</script>

<script>
let searchForm = {
	pagination: 1,
	limit: 10,
}

export default {
    components: {
        CopyDocument,
    },
    inject:['preloader'],
	data() {
		return {
			loading: true,
			tableData: [],
			total: 0,
			errors: [],
			submitForm: {
				id: "",
				status: 0
			},
			postData: {
				data: "",
				language: ""
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
				align:'center'
			},{
				prop:"code",
				label:this.$t("mix.table_code"),
				width: "120",
				align:'center'
			},{
				prop:"product_name",
				label:this.$t("mix.table_product"),
				width: "150",
				align:'center'
			},{
				prop:"name",
				label:this.$t("mix.table_name"),
				width: "100",
			},{
				prop:"loan_amount",
				label:this.$t("mix.table_loan_amount"),
				width: "150",
				align:'center'
			},{
				prop:"status_name",
				label:this.$t("mix.table_status"),
				width: "150",
				align:'center'
			},{
				prop:"agent_name",
				label:this.$t("mix.table_agent"),
				width: "150",
				align:'center'
			},{
				prop:"action",
				label:this.$t("mix.table_action"),
				width: "270",
				align:'right'
			}],
			ajaxSearch: [{
				prop:"name",
				label:this.$t("mix.table_name")
			},{
				prop:"category",
				label:this.$t("mix.table_category")
			},{
				prop:"sort",
				label:this.$t("mix.table_sort")
			},{
				prop:"status",
				label:this.$t("mix.table_status")
			}],
			postForm: {
				status: "",
				security: "",
				code: "",
				master_id: '',
				name: '',
				account_package_id: '',
				selectedIds: [],
				name: []
			},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			defaultProps:{
				id: 'id',
				children: 'children',
				label: 'name'
			},
			modalList:{},
			searchProductList: [],
			productList: [],
            searchAgentList: [],
			agentList: [],
            searchStatusList: [],
			statusList: [],
			securityCheck: 0,
			imagePickerFile:'',
			imagePickerFileUrl:'',
		};
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('package/order/summary',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
                    this.searchProductList = data.productList
                    this.searchStatusList = data.statusList
                    this.searchAgentList = data.agentList
					this.multiActionMax = data.multiActionMax
				}
				this.initial()
			})
		},initial() {
			this.loading = true;
			this.postData.data = JSON.stringify(this.searchData);
			var result = this.$m.postMethod("package/order/summary/ajaxTable", this.postData);
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
		},toOrderDetail(id) {
		storeTempID.order_id = id;  
		this.$router.push('/package/order/detail');  
		},toClientDetail(id) {
		console.log(id);
		storeTempID.master_id = id;
		this.$router.push('/management/client/client/info');
		},getAgentRow(id){
            if(this.$p.permissionChecker('toolAttributeEdit') && this.loading == false){
				this.loading = true
				this.submitForm.agent_id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('package/order/summary/getAgent',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.agentList = data.agentList
						this.modalList.agentinfo = true
						this.loading = false
					}
					this.loading = false
				})
			}
        },toAgentInfoPage(id){
			storeTempID.agent_id = id
			this.$router.push('/management/admin/agentinfo');
		},
		clearPostForm(done){
			this.postForm.code = []
			this.postForm.group_id = []
			this.postForm.img_url = ''
			this.postForm.id = '' 
			this.postForm.name = []
			this.postForm.selectedIds = []
			this.postForm.domain_url = ''
			this.postForm.username = ''
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			if(done != undefined){
				done()
			}
		},getAssignRow(){
			if(this.$p.permissionChecker('userChatLogAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('package/order/assign/assign',this.postData)
				result.then((value)=>{
					var data = value.data
			
					if(value.valid){
						this.packageList = data.packageList
						this.modalList.addRow = true
						this.loading = false
					}
				})
			}
        },assignRow() {
			if(this.$p.permissionChecker('userChatGroupAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				var result = this.$m.postMethod("package/order/assign/DBassign", formData)

				result.then((value) => {
					var data = value.data;

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
		},deleteRow(id) {
			if(this.$p.permissionChecker('userChatGroupDelete') && this.loading == false){
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
						var result = this.$m.postMethod("management/chat/group/DBdelete", this.postData);
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
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
		},clearSearchForm(){
			this.searchData = Object.assign({}, searchForm)
			this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

			this.initial()
		},copyToClipboard(value) {
            navigator.clipboard.writeText(value).then(() => {
                this.$message.success('Copied successfully!'); 
            }).catch(() => {
                this.$message.error('Failed to copy!');
            });
        },paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			
			this.initial()
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id)
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
};
</script>