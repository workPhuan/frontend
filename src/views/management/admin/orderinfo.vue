<template>
	<div class="page-container">
		<div class="page-header">
			<el-button style="cursor: pointer;" class="custom-button" type="info" @click="toAgentPage()">
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{"Back to " + $t('menu.management_admin_agent')}}
			</el-button>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
                    <div>
                    <br>
                    <h5>{{$t('menu.package_order_details')}}</h5>
                    <br>
                    <el-descriptions>
                        <el-descriptions-item :label="$t('mix.table_code')">{{ orderDetail.code }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_created_at')">{{ orderDetail.created_at }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_status')">{{ orderDetail.status_name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_product')">{{ orderDetail.product_name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_period')">{{ orderDetail.period }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_agent')">{{ orderDetail.name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_loan_amount')">{{ orderDetail.loan_amount }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_payment_period')">{{ orderDetail.payment_period }}</el-descriptions-item>
                    </el-descriptions>
                     </div>
                <el-tabs type="border-card">
                    <el-tab-pane key="application" :label="$t('mix.table_application_details')">   
                            <el-button class="custom-button plain" @click="loadTable('basic')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.basic_information')}}</el-button>
                            <el-button class="custom-button plain" @click="loadTable('job')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.job_information')}}</el-button>
                            <el-button class="custom-button plain" @click="loadTable('bank')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.bank_information')}}</el-button>
                            <el-button class="custom-button plain" @click="loadTable('contact')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.contact_information')}}</el-button>
                            <el-button class="custom-button plain" @click="loadTable('news')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.news_information')}}</el-button>
                            <el-button class="custom-button plain" @click="loadTable('location')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.location_information')}}</el-button>
                    </el-tab-pane>

                    <el-tab-pane key="record" :label="$t('mix.table_order_records')">
                        
                    </el-tab-pane>
                </el-tabs>
			</el-card>
		</div>

        <div v-if="modalList.basicAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                <el-descriptions>
                
                        <el-descriptions-item :label="$t('mix.table_name')">{{ clientDetail.name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_marital_status')">{{ clientDetail.marital_status }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_phone_mobile')">{{ clientDetail.phone_mobile }}</el-descriptions-item>
                        <!-- <el-descriptions-item :label="$t('mix.table_child')">{{ clientProfile.child_number }}</el-descriptions-item> -->
                        <el-descriptions-item :label="$t('mix.table_icpass')">{{ clientDetail.icpass }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_current_address')">{{ clientProfile.current_address }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_gender')">{{ clientDetail.gender }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_house_holding')">{{ clientDetail.house_holding }}</el-descriptions-item>
                        <!-- <el-descriptions-item :label="$t('mix.table_birthdate')">{{ clientProfile.dob }}</el-descriptions-item> -->
                        <!-- <el-descriptions-item :label="$t('mix.table_address')">{{ clientProfile.address }}</el-descriptions-item> -->
                        <el-descriptions-item :label="$t('mix.table_education')">{{ clientDetail.education }}</el-descriptions-item>
                        <!-- <el-descriptions-item :label="$t('mix.table_line_id')">{{ clientProfile.line_id }}</el-descriptions-item> -->
                </el-descriptions>
                <!-- <div>
                    <img :src="clientProfile.icpass_front_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_icpass_front_url') }}</p>
                    </div>

                    <img :src="clientProfile.icpass_back_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_icpass_back_url') }}</p>
                    </div>

                    <img :src="clientProfile.icpass_holding_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_icpass_holding_url') }}</p>
                    </div>

                    <img :src="clientProfile.application_img_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_application_img_url') }}</p>
                    </div>

                    <img :src="clientProfile.contract_img_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_contract_img_url') }}</p>
                    </div>
                </div> -->
            </el-card>
        </div>

        <div v-if="modalList.jobAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                
                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_company_name')">{{ clientDetail.company_name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_address')">{{ clientDetail.company_address }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ clientDetail.company_phone_mobile }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_position')">{{ clientDetail.position }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_experience')">{{ clientDetail.experience }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_salary')">{{ clientDetail.salary }}</el-descriptions-item>
                </el-descriptions>
                <div>
                    <img :src="clientDetail.staff_id_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_bussiness_card_url') }}</p>
                    </div>

                    <img :src="clientDetail.bussiness_card_url" class="w-r-2 h-auto me-2"/>
                    <div class="d-flex flex-column">
                        <p class="p-0 m-0">{{ $t('mix.table_staff_id_url') }}</p>
                    </div>
                </div>

            </el-card>
        </div>

        <div v-if="modalList.bankAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_bank_account_holder')">{{ clientDetail.bank_account_holder }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_bank_account_no')">{{ clientDetail.bank_account_no }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_bank_name')">{{ clientDetail.bank_name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_bank_branch')">{{ clientDetail.bank_branch }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
        </div>

        <div v-if="modalList.contactAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                <el-text class="mx-1">{{$t('mix.table_emergency_contacts')}}</el-text>
                <el-table :data="contactTableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange" v-model="selectedRows">
                    <template #empty v-if="callTableData.length=='0'">
                        <img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
                        <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                        <div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
                    </template>
                    
                    <template v-for="title in ajaxContactTitles" :key="title.prop">
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
            </el-card>
        </div>

        <div v-if="modalList.callAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                
                <el-table :data="callTableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange" v-model="selectedRows">
					<template #empty v-if="callTableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>
					
					<template v-for="title in ajaxCallTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type" >
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>

							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="setTempID(scope.row.id)">{{$t('button.info')}}</el-button>
								<el-button v-if="selectedRowId.includes(scope.row.id) && $p.permissionChecker('userChatGroupDelete')" class="custom-button danger m-1" @click="getAssignRow(selectedRows), modalList.getAssignRow = true">{{$t('button.assign')}}</el-button>							
							</template>
						</el-table-column>
					</template>
				</el-table>
                <pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>

            </el-card>
        </div>

        <div v-if="modalList.newsAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                
                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_company_name')">{{ clientDetail.company_name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_address')">{{ clientDetail.company_address }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ clientDetail.company_phone_mobile }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_position')">{{ clientProfile.position }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_experience')">{{ clientDetail.experience }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_salary')">{{ clientProfile.salary }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
        </div>

        <div v-if="modalList.locationAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                
                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_company_name')">{{ clientDetail.company_name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_address')">{{ clientDetail.company_address }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ clientDetail.company_phone_mobile }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_position')">{{ clientProfile.position }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_experience')">{{ clientDetail.experience }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_salary')">{{ clientProfile.salary }}</el-descriptions-item>
                </el-descriptions>

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
            contactTableData: [],
            callTableData: [],


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
            ajaxCallTitles: [{
				prop:"name",
				label:this.$t("mix.table_name"),
				width: "100",
				align:'center'
			},{
				prop:"phone_mobile",
				label:this.$t("mix.table_phone_mobile"),
				width: "150",
				align:'center'
			},{
				prop:"start_at",
				label:this.$t("mix.table_start_at"),
				width: "150",
				align:'center'
			},{
				prop:"duration",
				label:this.$t("mix.table_duration"),
				width: "100",
                align:'center'
			}],
            ajaxContactTitles: [{
				prop:"name",
				label:this.$t("mix.table_name"),
				width: "100",
				align:'center'
			},{
				prop:"phone_mobile",
				label:this.$t("mix.table_phone_mobile"),
				width: "100",
				align:'center'
			},{
				prop:"relation",
				label:this.$t("mix.table_relation"),
				width: "100",
				align:'center'
			}],
			ajaxSearch: [{
				prop:"name",
				label:this  .$t("mix.table_name")
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
            orderDetail: [],
            clientDetail: [],
            clientProfile: [],
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
			this.postData.id = storeTempID;
            console.log()
			this.postData.data = JSON.stringify(this.postData)
			var result = this.$m.postMethod('package/order/detail',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
                    this.searchProductList = data.productList
                    this.searchStatusList = data.statusList
                    this.searchAgentList = data.agentList
                    this.orderDetail = data.orderDetail
					this.multiActionMax = data.multiActionMax
				}
				this.initial()
			})
		},initial(){
			this.searchData.id = storeTempID;
			this.loading = true

			this.postData.data = JSON.stringify(this.searchData)

			var result = this.$m.postMethod('package/order/detail/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data
				
				if(value.valid){
					this.tableData = data.datatable.data
					this.memberTotal = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
				}
				this.loading = false
		})
		},loadTable(tab) {
            this.loading = true;
            this.postData.id = storeTempID;
            this.postData.data = JSON.stringify(this.postData);
            this.modalList = {
                basicAjaxTable: false,
                jobAjaxTable: false,
                bankAjaxTable: false,
                contactAjaxTable: false,
                callAjaxTable: false,
                newsAjaxTable: false,
                locationAjaxTable: false,
            };


            let table;

            if (tab === 'basic') {
                table = 'package/order/detail/basicAjaxTable';
                this.modalList.basicAjaxTable = true;
                this.basicData()

            } else if (tab === 'job') {
                table = 'package/order/detail/jobAjaxTable';
                this.modalList.jobAjaxTable = true;
                this.jobData()

            } else if (tab === 'bank') {
                table = 'package/order/detail/bankAjaxTable';
                this.modalList.bankAjaxTable = true;
                this.bankData()

            } else if (tab === 'contact') {
                this.modalList.contactAjaxTable = true;
                this.contactData()
                this.callData()

            } else if (tab === 'news') {
                table = 'package/order/detail/newsAjaxTable';
                this.modalList.newsAjaxTable = true;
                this.newsData()

            } else if (tab === 'location') {
                table = 'package/order/detail/locationAjaxTable';
                this.modalList.locationAjaxTable = true;
                this.locationData()

            } else {
                this.loading = false;
                return;
            }

            // this.$m.postMethod(table, this.postData)
            //     .then((value) => {
            //         var data = value.data;

            //         if (value.valid) {
            //             this.clientProfile = data.clientProfile;
            //             this.clientDetail = data.clientDetail;
            //             // this.tableData1 = data.datatable.data
            //             // this.tableData2 = data.datatable.data
                        
            //         }
            //         this.loading = false;

            //     })
        },basicData(){
			this.loading = true

			this.postData.data = JSON.stringify(this.searchData)

			var result = this.$m.postMethod('package/order/detail/basicAjaxTable',this.postData)
			result.then((value) => {
				var data = value.data
				
                if (value.valid) {
                    this.clientProfile = data.clientProfile;
                    this.clientDetail = data.clientDetail;
                    this.modalList.basicAjaxTable = true

                }
                this.loading = false;
		})
		},jobData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/jobAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.clientDetail = data.clientDetail;
                    this.modalList.jobAjaxTable = true

                }
                this.loading = false;
            })
		},bankData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/bankAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.clientDetail = data.clientDetail;
                    this.modalList.bankAjaxTable = true

                }
                this.loading = false;
            })
		},contactData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/contactAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.contactTableData = data.datatable.data
                    this.total = parseInt(data.datatable.total_number)
                    this.listQuery.page = parseInt(data.datatable.current_pagination)
                    this.listQuery.limit = parseInt(data.datatable.limit)
                    this.modalList.contactAjaxTable = true

                    this.loading = false
                }
                this.loading = false;
            })

		},callData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)
            
            var result = this.$m.postMethod('package/order/detail/callAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.callTableData = data.datatable.data
                    this.total = parseInt(data.datatable.total_number)
                    this.listQuery.page = parseInt(data.datatable.current_pagination)
                    this.listQuery.limit = parseInt(data.datatable.limit)
                    this.modalList.callAjaxTable = true

                    this.loading = false
                }
                this.loading = false;
            })

		},newsData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/newsAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.clientProfile = data.clientProfile;
                    this.clientDetail = data.clientDetail;
                    this.modalList.newsAjaxTable = true

                }
                this.loading = false;
            })
		},locationData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/locationAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.clientProfile = data.clientProfile;
                    this.clientDetail = data.clientDetail;
                    this.modalList.locationAjaxTable = true

                }
                this.loading = false;
            })
		},returnToPage(){
			this.$router.push('/package/order/summary');
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
		},getEditRow(id) {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true;
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm);
				var result = this.$m.postMethod("management/chat/group/edit", this.postData);
				result.then((value) => {
					var data = value.data;

					if (value.valid) {
						
						this.postForm = data.thisDetail
						this.packageList = data.packageList
						this.modalList.editRow = true
					}
					this.loading = false
				});
			}
		},
		editRow() {
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)
				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				var result = this.$m.postMethod("management/chat/group/DBedit", formData)

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
		},statusRow(currentData){
			if(this.$p.permissionChecker('userChatGroupEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id
				this.submitForm.status = currentData.status
				this.postData.data = JSON.stringify(this.submitForm)
				
				var formData = new FormData()
				formData.append('data', this.postData.data)
				formData.append('language', this.postData.language)

				var result = this.$m.postMethod('management/chat/group/DBstatus',formData)
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
		},toAgentPage(){
			this.$router.push('/management/admin/agent');
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
        if(storeTempID.value != '' && storeTempID.value != undefined){
            this.getInitial()
        }else{
            this.$router.push('/package/order/detail')
        }
	}
};
</script>