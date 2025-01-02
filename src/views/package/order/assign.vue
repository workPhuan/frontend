<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.package_order_assign')}}
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
						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.product_id" :placeholder="$t('mix.table_product')" clearable filterable @change="initial()">
							<el-option v-for="item in searchProductList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
                        <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.phone_mobile" :placeholder="$t('mix.table_please_enter')+$t('mix.table_phone_mobile')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_phone')}}</label>
							</template>
						</el-input>
                        <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.icpass" :placeholder="$t('mix.table_please_enter')+$t('mix.table_icpass')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_icpass')}}</label>
							</template>
						</el-input>
						
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="clearSearchForm()" :loading="loading"><i class="fa-light fa-brush me-2"></i>{{$t('button.clear')}}</el-button>

					</div>
				</div>

				<el-table :data="tableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange" v-model="selectedRows">
					<template #empty v-if="tableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>
					
					<el-table-column type="selection" width="55" ></el-table-column>
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type" >
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>


							<!-- <template v-if="title.prop == 'code'" #default="scope">
								<el-link type="primary" @click="setTempID(scope.row.id)">{{ scope.row.code }}</el-link>
								<el-tooltip content="Copy" placement="top">
									<el-icon class="ml-3 clickable-icon" @click="copy($m.getItem('system_id')), $m.copyMessage($t('msg.msg_copy_success'))"></el-icon>
								</el-tooltip>
							</template> -->


							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="setTempID(scope.row.id)">{{$t('button.info')}}</el-button>
								<el-button v-if="selectedRowId.includes(scope.row.id) && $p.permissionChecker('userChatGroupDelete')" class="custom-button danger m-1" @click="getAssignRow(selectedRows), modalList.getAssignRow = true">{{$t('button.assign')}}</el-button>							
							</template>
						</el-table-column>
					</template>
				</el-table>

				<el-dialog v-model="modalList.assignRow" :title="$t('menu.package_order_assign')" :before-close="clearPostForm">
					<el-form label-position="top" label-width="auto" @submit.native.prevent>
						<el-text class="mx-1">{{$t('mix.table_agent')}}</el-text>
						<el-row :gutter="20">
						<div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }">
							<div v-for="(agent, index) in agentList" :key="agent.master_id">
								<el-checkbox v-model="selectedAgents" :label="agent.master_id">
									{{ agent.name }}
								</el-checkbox>
							</div>
						</div>
						</el-row>
					</el-form>
					
					<template #footer>
						<div class="d-flex justify-content-center align-item-center">
							<el-button class="custom-button success font-8 pt-3 pb-3" @click="assignRow(selectedAgents, selectedRows)" :loading="loading">{{$t('button.assign	')}}</el-button>
						</div>
					</template>
				</el-dialog>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
import { CopyDocument } from '@element-plus/icons-vue';
import { storeTempID } from '@/system/store/state.js'
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard()

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
				width: "100",
				align:'center'
			},{
				prop:"code",
				label:this.$t("mix.table_code"),
				width: "150",
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
				prop:"phone_mobile",
				label:this.$t("mix.table_phone_mobile"),
				width: "150",
				align:'center'
			},{
				prop:"icpass",
				label:this.$t("mix.table_icpass"),
				width: "150",
				align:'center'
			},{
				prop:"loan_amount",
				label:this.$t("mix.table_loan_amount"),
				width: "150",
				align:'center'
			},{
				prop:"total_order",
				label:this.$t("mix.table_total_order"),
				width: "100",
				align:'center'
			},{
				prop:"total_overdue",
				label:this.$t("mix.table_total_overdue"),
				width: "100",
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
				status: 1,
				security: "",
				code: "",
				master_id: '',
				selectedRowId: [],
				selectedAgents: [],
				selectedRows: [],
			},
			languageList:JSON.parse(this.$m.getItem('languageList')),
			defaultProps:{
				id: 'id',
				children: 'children',
				label: 'name'
			},
			modalList:{},
			searchProductList: [],
			agentList: [],
			selectedAgents: [],
			selectedIds: [],
			selectedRowId: [],
			selectedRows: [],
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
			var result = this.$m.postMethod('package/order/assign',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
                    this.searchProductList = data.productList
					this.multiActionMax = data.multiActionMax
				}
				this.initial()
			})
		},initial() {
			this.loading = true;
			this.postData.data = JSON.stringify(this.searchData);
			var result = this.$m.postMethod("package/order/assign/ajaxTable", this.postData);
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
		},setTempID(id) {
			storeTempID.value = id;  
			this.$router.push('/package/order/detail');  
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
		},getAssignRow(selectedRows){
			if(this.$p.permissionChecker('userChatLogAdd') && this.loading == false){
				this.loading = true
				this.postForm.selectedRows = selectedRows;
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('package/order/assign/assign',this.postData)
				result.then((value)=>{
					var data = value.data
			
					if(value.valid){
						this.agentList = data.agentList
						this.modalList.assignRow = true
						this.loading = false
					}
				})
			}
        },assignRow(selectedAgents,selectedRows) {
			if(this.$p.permissionChecker('userChatGroupAdd') && this.loading == false){
				this.preloader(true)
				this.loading = true
				this.postForm.selectedAgents = selectedAgents;
				this.postForm.selectedRows = selectedRows;

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
						
						this.modalList.assignRow = false
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
		},setTempID(id) {
			storeTempID.value = id;  
			this.$router.push('/package/order/detail');  
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
		},handleSelectionChange(selectedRows) {
			this.selectedRows = selectedRows;
			this.selectedRowId = selectedRows.length === 1 ? [selectedRows[0].id] : selectedRows.map(row => row.id);

		},
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
};
</script>