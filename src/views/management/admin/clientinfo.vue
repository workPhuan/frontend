<template>
	<div class="page-container">
		<div class="page-header">
			<el-button style="cursor: pointer;" class="custom-button" type="info" @click="toAgentInfoPage()">
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{"Back to " + $t('menu.management_client_client')}}
			</el-button>
		</div>
		
		<div class="page-body p-3">
            <el-card shadow="never">
                <div>
                    <h5 class="mb-3">{{$t('button.client_info')}}</h5>
                    <div class="info-container">
                        <div class="info">
                            <div class="tag">
                                <p>{{$t('mix.table_name')}} :</p>
                                <p>{{ $t('mix.table_icpass')}} :</p>
                                <p>{{ $t('mix.table_phone') }} :</p>
                            </div>
                            <div class="detail">
                                <p>{{ accountDetails.icpass }}</p>
                                <p>{{ accountDetails.name }}</p>
                                <p>{{ accountDetails.phone_mobile }}</p></div>
                        </div>
                        <div class="info-box">
                            <div class="details-box">
                                <p>{{ $t('mix.table_loan_time') }}</p>
                                <p>{{ accountDetails.total_order }}</p>
                            </div>
                            <div class="details-box">
                                <p>{{ $t('mix.table_total_overdue') }}</p>
                                <p>{{ accountDetails.total_overdue }}</p>
                            </div>
                            <div class="details-box">
                                <p>{{ $t('mix.table_total_loan') }}</p>
                                <p>{{ accountDetails.total_loan }}</p>
                            </div>
                            <div class="details-box">
                                <p>{{ $t('mix.table_total_repay') }}</p>
                                <p>{{ accountDetails.total_repay }}</p>
                            </div>
                            <div class="details-box">
                                <p>{{ $t('mix.table_early_repay') }}</p>
                                <p>0</p>
                            </div>
                            <div class="details-box">
                                <p>{{ $t('mix.table_today_overdue') }}</p>
                                <p>0</p>
                            </div>
                        </div>
                    </div>

                </div>
                <el-tabs type="border-card" @tab-click="loadTable">
                    <el-tab-pane key="loan" :label="$t('mix.table_loan_record')">
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

                                    <template v-if="title.prop == 'status'" #default="scope">
                                        <el-tag :type="scope.row.status_color">{{scope.row.status}}</el-tag>
                                    </template>
                                    
                                    <template v-if="title.prop == 'action'" #default="scope">
                                        <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="toAgentPage(scope.row.agent_id)">{{$t('mix.table_agent_info')}}</el-button>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                        <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
                    </el-tab-pane>
                        
                    <el-tab-pane key="basic" :label="$t('mix.table_basic_info')">
                        <el-card shadow="never">
                            <el-descriptions>
                                    <el-descriptions-item :label="$t('mix.table_name')">{{ userDetails.master_id }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_marital_status')">{{ userDetails.marital_id }}</el-descriptions-item>
                                    <br>
                                    <el-descriptions-item :label="$t('mix.table_phone_mobile')">{{ userDetails.phone_mobile }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_child')">{{ userDetails.child_number }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_icpass')">{{ userDetails.icpass }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_current_address')">{{ userDetails.current_address }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_gender')">{{ userDetails.gender_id }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_house_holding')">{{ userDetails.house_holding_id }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_birthdate')">{{ userDetails.dob }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_address')">{{ userDetails.address }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_education')">{{ userDetails.education_id }}</el-descriptions-item>
                                    <el-descriptions-item :label="$t('mix.table_line_id')">{{ userDetails.line_id }}</el-descriptions-item>
                            </el-descriptions>
                            <el-descriptions>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_icpass_front_url')}}</p>
                                    </label>
                                    <img :src="userDetails.icpass_front_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_icpass_back_url')}}</p>
                                    </label>
                                    <img :src="userDetails.icpass_back_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_icpass_holding_url')}}</p>
                                    </label>
                                    <img :src="userDetails.icpass_holding_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_application_img_url')}}</p>
                                    </label>
                                    <img :src="userDetails.application_img_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_contract_img_url')}}</p>
                                    </label>
                                    <img :src="userDetails.contract_img_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-card>
                    </el-tab-pane>
                        
                    <el-tab-pane key="work" :label="$t('mix.table_work_info')">
                        <el-card shadow="never">
                            <el-descriptions>
                                <el-descriptions-item :label="$t('mix.table_company_name')">{{ userDetails.company_name }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_company_address')">{{ userDetails.company_address }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ userDetails.company_phone_mobile }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_position')">{{ userDetails.position }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_experience')">{{ userDetails.experience }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_salary')">{{ userDetails.salary }}</el-descriptions-item>
                            </el-descriptions>
                            <el-descriptions>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_staff_id_url')}}</p>
                                    </label>
                                    <img :src="userDetails.staff_id_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <label>
                                        <p class="p-0 m-0">{{$t('mix.table_bussiness_card_url')}}</p>
                                    </label>
                                    <img :src="userDetails.bussiness_card_url" class="w-r-2 h-auto me-2"/>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-card>
                    </el-tab-pane>
                    
                    <el-tab-pane key="bank" :label="$t('mix.table_bank_info')">
                        <el-card shadow="never">
                            <el-descriptions>
                                <el-descriptions-item>{{$t('mix.table_bank_name')}} : {{ userDetails.bank_id }}</el-descriptions-item>
                                <el-descriptions-item>{{$t('mix.table_branch_bank')}} : {{ userDetails.bank_name }}</el-descriptions-item>
                                <el-descriptions-item>{{$t('mix.table_bank_account_holder')}} : {{ userDetails.bank_account_holder }}</el-descriptions-item>
                                <el-descriptions-item>{{$t('mix.table_bank_account_no')}} : {{ userDetails.bank_account_no }}</el-descriptions-item>
                            </el-descriptions>
                        </el-card>
                    </el-tab-pane>
                    
                    <el-tab-pane key="contact" :label="$t('mix.table_contact_info')">
                        <el-card shadow="never">
                            <el-descriptions>
                                <el-descriptions-item :label="$t('mix.table_company_name')">{{ userDetails.company_name }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_company_address')">{{ userDetails.company_address }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ userDetails.company_phone_mobile }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_position')">{{ userDetails.position }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_experience')">{{ userDetails.experience }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_salary')">{{ userDetails.salary }}</el-descriptions-item>
                            </el-descriptions>
                            <div class="d-flex align-items-center">
                                <img :src="userDetails.staff_id_url" class="w-r-2 h-auto me-2"/>
                                <div class="d-flex flex-column">
                                    <p class="p-0 m-0">$t('mix.staff_id_url')</p>
                                </div>
                            </div>

                            <div class="d-flex align-items-center">
                                <img :src="userDetails.bussiness_card_url" class="w-r-2 h-auto me-2"/>
                                <div class="d-flex flex-column">
                                    <p class="p-0 m-0">$t('mix.bussiness_card_url')</p>
                                </div>
                            </div>

                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane key="message" :label="$t('mix.table_message_log')">
                        
                    </el-tab-pane>

                    <el-tab-pane key="location" :label="$t('mix.table_location_info')">
                        <el-card shadow="never">
                            <el-descriptions>
                                <el-descriptions-item :label="$t('mix.table_company_name')">{{ userDetails.company_name }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_company_address')">{{ userDetails.company_address }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ userDetails.company_phone_mobile }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_position')">{{ userDetails.position }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_experience')">{{ userDetails.experience }}</el-descriptions-item>
                                <el-descriptions-item :label="$t('mix.table_salary')">{{ userDetails.salary }}</el-descriptions-item>
                            </el-descriptions>
                            <div class="d-flex align-items-center">
                                <img :src="userDetails.staff_id_url" class="w-r-2 h-auto me-2"/>
                                <div class="d-flex flex-column">
                                    <p class="p-0 m-0">$t('mix.staff_id_url')</p>
                                </div>
                            </div>

                            <div class="d-flex align-items-center">
                                <img :src="userDetails.bussiness_card_url" class="w-r-2 h-auto me-2"/>
                                <div class="d-flex flex-column">
                                    <p class="p-0 m-0">$t('mix.bussiness_card_url')</p>
                                </div>
                            </div>

                        </el-card>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
		</div>
	
		
	</div>
</template>

<script setup>
import Tinymce from '@/components/tinymce/index.vue'
import { storeTempID } from '@/system/store/state.js'
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
			errors: [],
            tableData: [],
            tableData1: [],
            tableData2: [],
            tableData3: [],
            total: 0,
            searchData:Object.assign({}, searchForm),
			submitForm: {
				id:'',
				master_id:'',
                status:'',
                is_view_other:''
			},
			postData: {
				data: '',
				language: '',
			},
            listQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'100',
			},{
                prop:"code",
                label:this.$t('mix.table_product_no'),
                width:'100',
			},{
                prop:"product_id",
                label:this.$t('mix.table_product'),
                width:'100',
                align:'center'
			},{
                prop:"loan_amount",
                label:this.$t('mix.table_loan_amount'),
                width:'90',
                align: 'center'
			},{
                prop:"status",
                label:this.$t('mix.table_status'),
                width:'90',
			},{
                prop:"agent_name",
                label:this.$t('mix.table_agent'),
                width:'100',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
			ajaxTitles1:[{
                prop:"login",
                label:this.$t('mix.table_name'),
                width:'120',
			},{
                prop:"phone_mobile",
                label:this.$t('mix.table_phone'),
                width:'120',
			},{
                prop:"icpass",
                label:this.$t('mix.table_icpass'),
                width:'120',
			},{
                prop:"loan_time",
                label:this.$t('mix.table_loan_time'),
                width:'120',
			},{
                prop:"total_overdue",
                label:this.$t('mix.table_total_overdue'),
                width:'120',
			},{
                prop:"total_loan",
                label:this.$t('mix.table_total_loan'),
                width:'120',
			},{
                prop:"total_repay",
                label:this.$t('mix.table_total_repay'),
                width:'120',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'150',
				align: 'center'
			}],
            ajaxTitles2:[{
                prop:"name",
                label:this.$t('mix.table_name'),
                width:'100',
			},{
                prop:"period",
                label:this.$t('mix.table_period'),
                width:'100',
			},{
                prop:"status",
                label:this.$t('mix.table_account_status'),
                width:'150',
			}],
            ajaxTitles3:[{
                prop:"created_at",
                label:this.$t('mix.table_name'),
                width:'120',
			},{
                prop:"status",
                label:this.$t('mix.table_consumption_type'),
                width:'120',
			},{
                prop:"master_id",
                label:this.$t('mix.table_name'),
                width:'120',
			},{
                prop:"value",
                label:this.$t('mix.table_expense'),
                width:'120',
			},{
                prop:"after_amount",
                label:this.$t('mix.table_expense'),
                width:'120',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'120',
			}],
            postForm:{
				password: "",
                confirm_password: "",
                is_view_other: '',
                status: '',
				security: "",
				userDetails: "",
				name:[],
				selectedIds:[],
			},
            userDetails: [],
            accountDetails: [],
			postForm:{},
			modalList:{},
            userDetails:[],
			languageList:JSON.parse(this.$m.getItem('languageList')),
			categoryList: [],
			securityCheck: 0
		};
	},
	methods:{
        getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/clientinfo',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
                    this.accountDetails = data.userDetails
				}
				this.initial()
			})

		},
		initial(){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/agent/clientinfo/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
		},clearPostForm(done){
			this.postForm.code = ""
			this.postForm.group_id = ""
			this.postForm.group_name = ""
			this.postForm.username = ""
			this.postForm.account_package_id = ""
			this.postForm.status = 1
			this.postForm.img_url = ''
			this.imagePickerFileUrl = ''
			this.imagePickerFile = ''
			this.postForm.security = ""
			this.postForm.userDetails = ""
			
			if(done != undefined){
				done()
			}
		},resetPasswordRow(id) {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.master_id = id
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/agent/clientinfo/resetPassword", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},editRow() {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
                this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod("management/agent/clientinfo/DBresetPassword",this.postData)

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
		},loadTable(tab){
            this.loading = true
            this.searchData.master_id = storeTempID.master_id
			this.postData.data = JSON.stringify(this.searchData)
            if(tab.index == 0){
                this.initial()
            }else if(tab.index == 1){
                this.clientDetails(this.postData.data)
            }else if(tab.index == 2){
                this.companyDetails(this.postData.data)
            }else if(tab.index == 3){
                this.bankDetails(this.postData.data)
            }else if(tab.index == 4){
                this.contactDetails(this.postData.data)
            }else if(tab.index == 5){
                this.messageLog(this.postData.data)
            }else if(tab.index == 6){
                this.LocationDetails(this.postData.data)
            }
        },clientDetails(data){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = data
			var result = this.$m.postMethod('management/agent/clientinfo/clientDetails',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
                    this.userDetails = data.userDetails
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
        },companyDetails(data){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = data
			var result = this.$m.postMethod('management/agent/clientinfo/companyDetails',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
                    this.userDetails = data.userDetails
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
        },bankDetails(data){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = data
			var result = this.$m.postMethod('management/agent/clientinfo/bankDetails',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
                    this.userDetails = data.userDetails
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
        },contactDetails(data){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = data
			var result = this.$m.postMethod('management/agent/clientinfo/contactDetails',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
                    this.userDetails = data.userDetails
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
        },messageLog(data){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = data
			var result = this.$m.postMethod('management/agent/clientinfo/messagelog',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
        },LocationDetails(data){
            this.loading = true
			this.searchData.master_id = storeTempID.master_id
			this.postData.data = data
			var result = this.$m.postMethod('management/agent/clientinfo/locationDetails',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
			})
        },toAgentInfoPage(){
			this.$router.push('/management/admin/agentinfo');
		},getAddRow(){
			if(this.$p.permissionChecker('adminAdminAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('package/product/item/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
						this.attributeList = data.attributeList
						this.postForm.attribute_list = this.attributeList
						this.modalList.addRow = true
						this.loading = false
					}
				})
			}
        },addRow(){
			if(this.$p.permissionChecker('adminAdminAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)
                
                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('package/product/item/DBadd',this.postData)

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
		},userStatusRow(id,status){
			if(this.$p.permissionChecker('toolAttributeEdit') && this.loading == false){
                this.loading = true
                this.$confirm(this.$t('msg.msg_run_task'), this.$t('msg.prompt'), {
						confirmButtonText: this.$t('button.yes'),
						cancelButtonText: this.$t('button.no'),
						customClass: 'input-dialog',
						showInput: (this.securityCheck == 1), 
						inputPlaceholder: this.$t('mix.table_security'),
						inputType: 'password',
					}).then(({value}) => {
                        this.loading = true
                        this.submitForm.master_id = id;
                        this.submitForm.status = status;
                        this.postData.data = JSON.stringify(this.submitForm)
                        
                        var formData = new FormData();
                        formData.append('data', this.postData.data);
                        formData.append('language', this.postData.language);
        
                        
                        var result = this.$m.postMethod('management/agent/clientinfo/DBstatus',formData)
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

                    })
			};
		},viewOtherRow(id,is_view_other){
			if(this.$p.permissionChecker('toolAttributeEdit') && this.loading == false){
                this.loading = true
				this.submitForm.master_id = id
				this.submitForm.is_view_other = is_view_other
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/agent/clientinfo/DBviewOther',formData)
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
		},statusRow(masterID){
			if(this.$p.permissionChecker('userMemberStatus') && this.loading == false){
				this.loading = true
				this.$confirm(this.$t('msg.msg_confirmation'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.yes'),
					cancelButtonText: this.$t('button.no'),
					customClass: 'input-dialog',
					showInput: (this.securityCheck == 1), 
					inputPlaceholder: this.$t('mix.table_security'),
					inputType: 'password',
				}).then(({value}) => {
					this.preloader(true)
					this.postForm.security = value
					this.postForm.master_id = masterID
					this.postData.data = JSON.stringify(this.postForm)

					var result = this.$m.postMethod('management/admin/admin/DBstatus',this.postData)

					result.then((value) => {
						var data = value.data

						if(value.valid){
							this.$message({
								message: data.returnMsg,
								type: 'success'
							})
							this.initial()
						}else{					
							this.$m.popupErrorMessage(data.returnMsg,this)
						}
						
						this.loading = false
						this.preloader(false)
					})
				}).catch(() => {
					this.loading = false          
				})
			}
			
		},paginationChange(value){
			if(value.page != ""){
				this.searchData.pagination = value.page
			}

			if(value.limit != ""){
				this.searchData.limit = value.limit
			}
			
			this.initial()
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
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
        if(storeTempID.master_id == "" || storeTempID.master_id == undefined){
			this.$router.push('/management/admin/agentinfo');
		}else{
            this.getInitial()
        }
	}
}
</script>