<template>
	<div class="page-container">
		<div class="page-header">
			<el-button style="cursor: pointer;" class="custom-button" type="info" @click="returnToPage()">
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{"Back to " + $t('menu.package_order_summary')}}
			</el-button>
            <el-button v-if="$p.permissionChecker('userChatRoleEdit')" class="custom-button success m-1" @click="getAgentRow(scope.row.agent_id)">{{$t('mix.table_agent_info')}}</el-button>

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
                        <el-descriptions-item :label="$t('mix.table_status')"><el-tag :type="orderDetail.status_color">{{ orderDetail.status_name }}</el-tag></el-descriptions-item>                        <el-descriptions-item :label="$t('mix.table_product')">{{ orderDetail.product_name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_period')">{{ orderDetail.period }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_agent')">{{ orderDetail.agent_name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_loan_amount')">{{ orderDetail.loan_amount }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_payment_period')">{{ orderDetail.payment_period }}</el-descriptions-item>
                    </el-descriptions>

                     </div>
                <el-tabs type="border-card" @tab-click="loadTable">
                    <el-tab-pane key="application" :label="$t('mix.table_application_details')">   
                        <el-button class="custom-button plain" @click="loadTable('basic')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.basic_information')}}</el-button>
                        <el-button class="custom-button plain" @click="loadTable('job')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.job_information')}}</el-button>
                        <el-button class="custom-button plain" @click="loadTable('bank')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.bank_information')}}</el-button>
                        <el-button class="custom-button plain" @click="loadTable('contact')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.contact_information')}}</el-button>
                        <el-button class="custom-button plain" @click="loadTable('message')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.message_information')}}</el-button>
                        <el-button class="custom-button plain" @click="loadTable('location')" :loading="loading" v-if="$p.permissionChecker('userChatRoleAdd')">{{$t('button.location_information')}}</el-button>
                    </el-tab-pane>

                    <el-tab-pane key="record" :label="$t('mix.table_order_records')">
                        <el-table :data="orderTableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
                            <template #empty v-if="callTableData.length=='0'">
                                <img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
                                <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                                <div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
                            </template>
                            
                            <template v-for="title in ajaxOrderTitles" :key="title.prop">
                                <el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type" >
                                    <template #header>
                                        <p class="search-label">{{title.label}}</p>
                                    </template>
                                    
                                    <template v-if="title.prop == 'old_status'" #default="scope">
                                        <el-tag 
                                            :type="scope.row.old_status_color">
                                            {{ scope.row.old_status }}
                                        </el-tag>
                                    </template>

                                    <template v-if="title.prop == 'current_status'" #default="scope">
                                        <el-tag 
                                            :type="scope.row.current_status_color">
                                            {{ scope.row.current_status }}
                                        </el-tag>
                                    </template>

                                </el-table-column>
                            </template>
                        </el-table>
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
                        <el-descriptions-item :label="$t('mix.table_child')">{{ clientProfile.child_number }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_icpass')">{{ clientDetail.icpass }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_current_address')">{{ clientProfile.current_address }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_gender')">{{ clientDetail.gender }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_house_holding')">{{ clientDetail.house_holding }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_birthdate')">{{ clientProfile.dob }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_address')">{{ clientProfile.address }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_education')">{{ clientDetail.education }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('mix.table_line_id')">{{ clientProfile.line_id }}</el-descriptions-item>
                </el-descriptions>
                <el-descriptions>
                    <el-descriptions-item>
                        <img :src="clientProfile.icpass_front_url" class="w-r-2 h-auto me-2"/>
                        <div class="d-flex flex-column">
                            <p class="p-0 m-0">{{ $t('mix.table_icpass_front_url') }}</p>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <img :src="clientProfile.icpass_back_url" class="w-r-2 h-auto me-2"/>
                        <div class="d-flex flex-column">
                            <p class="p-0 m-0">{{ $t('mix.table_icpass_back_url') }}</p>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <img :src="clientProfile.icpass_holding_url" class="w-r-2 h-auto me-2"/>
                        <div class="d-flex flex-column">
                            <p class="p-0 m-0">{{ $t('mix.table_icpass_holding_url') }}</p>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <img :src="clientProfile.application_img_url" class="w-r-2 h-auto me-2"/>
                        <div class="d-flex flex-column">
                            <p class="p-0 m-0">{{ $t('mix.table_application_img_url') }}</p>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <img :src="clientProfile.contract_img_url" class="w-r-2 h-auto me-2"/>
                        <div class="d-flex flex-column">
                            <p class="p-0 m-0">{{ $t('mix.table_contract_img_url') }}</p>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>
        </div>

        <div v-if="modalList.jobAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                
                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_company_name')">{{ clientDetail.company_name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_address')">{{ clientDetail.company_address }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_company_phone_mobile')">{{ clientDetail.company_phone_mobile }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_position')">{{ clientDetail.position }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_experience')">{{ clientDetail.experience }} {{ $t('mix.table_year') }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_salary')">{{ clientDetail.salary }} {{ $t('mix.table_month') }}</el-descriptions-item>
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
                <el-text class="mx-1">{{$t('mix.table_call_records')}}</el-text>
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

        <div v-if="modalList.messageAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                <el-table :data="messageTableData" v-loading="loading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange" v-model="selectedRows">
					<template #empty v-if="messageTableData.length=='0'">
						<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
						<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
						<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
					</template>
					
					<template v-for="title in ajaxMessageTitles" :key="title.prop">
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

        <div v-if="modalList.locationAjaxTable" class="page-body p-3">
            <el-card shadow="never">
                <el-text class="mx-1">{{$t('mix.table_home_address')}}</el-text>
                <br>
                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_city')">{{ clientDetail.city }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_town')">{{ clientDetail.town}}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_address')">{{ clientDetail.address }}</el-descriptions-item>
                </el-descriptions>
                <el-text class="mx-1">{{$t('mix.table_application_address')}}</el-text>
                <br>

                <el-descriptions>
                    <el-descriptions-item :label="$t('mix.table_city')">{{ clientDetail.city_application }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_town')">{{ clientDetail.town_application }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('mix.table_address')">{{ clientDetail.address_application }}</el-descriptions-item>
                </el-descriptions>

            </el-card>
        </div>

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
            messageTableData: [],
            orderTableData: [],


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
            ajaxMessageTitles: [{
				prop:"created_at",
				label:this.$t("mix.table_created_at"),
				width: "100",
				align:'center'
			},{
				prop:"name",
				label:this.$t("mix.table_name"),
				width: "150",
				align:'center'
			},{
				prop:"phone_mobile",
				label:this.$t("mix.table_phone_mobile"),
				width: "150",
				align:'center'
			},{
				prop:"content",
				label:this.$t("mix.table_content"),
				width: "270",
                align:'left'
			}],
            ajaxOrderTitles: [{
				prop:"created_at",
				label:this.$t("mix.table_created_at"),
				width: "100",
				align:'center'
			},{
				prop:"old_status",
				label:this.$t("mix.table_order_status"),
				width: "150",
				align:'center'
			},{
				prop:"action",
				label:this.$t("mix.table_action"),
				width: "150",
				align:'center'
			},{
				prop:"handler",
				label:this.$t("mix.table_handler"),
				width: "120",
                align:'center'
			},{
				prop:"agent",
				label:this.$t("mix.table_agent"),
				width: "120",
                align:'center'
			},{
				prop:"current_status",
				label:this.$t("mix.table_status_change"),
				width: "120",
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
			this.postData.id = storeTempID.order_id;
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
			this.searchData.id = storeTempID.order_id;
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
            this.postData.id = storeTempID.order_id;
            this.postData.data = JSON.stringify(this.postData);
            this.modalList = {
                basicAjaxTable: false,
                jobAjaxTable: false,
                bankAjaxTable: false,
                contactAjaxTable: false,
                callAjaxTable: false,
                messageAjaxTable: false,
                locationAjaxTable: false,
            };


            let table;

            if (tab === 'basic') {
                this.basicData()

            } else if (tab === 'job') {
                this.jobData()

            } else if (tab === 'bank') {
                this.bankData()

            } else if (tab === 'contact') {
                this.contactData()
                this.callData()

            } else if (tab === 'message') {
                this.messageData()

            } else if (tab === 'location') {
                this.locationData()

            } else if (tab.index == 1) {
                this.orderData()

            } else {
                this.loading = false;
                return;
            }
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

		},messageData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/messageAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.messageTableData = data.datatable.data
                    this.total = parseInt(data.datatable.total_number)
                    this.listQuery.page = parseInt(data.datatable.current_pagination)
                    this.listQuery.limit = parseInt(data.datatable.limit)
                    this.modalList.messageAjaxTable = true

                    this.loading = false
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
                    this.clientDetail = data.clientDetail;
                    this.modalList.locationAjaxTable = true
                }
                this.loading = false;
            })
		},orderData(){
            this.loading = true

            this.postData.data = JSON.stringify(this.searchData)

            var result = this.$m.postMethod('package/order/detail/orderAjaxTable',this.postData)
            result.then((value) => {
                var data = value.data
                
                if (value.valid) {
                    this.orderTableData = data.datatable.data
                    this.total = parseInt(data.datatable.total_number)
                    this.listQuery.page = parseInt(data.datatable.current_pagination)
                    this.listQuery.limit = parseInt(data.datatable.limit)
                    this.loading = false
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
        console.log(storeTempID.order_id);
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
        if(storeTempID.order_id == '' || storeTempID.order_id == undefined){
            this.$router.push('/package/order/summary')
        }else{
            this.getInitial()
        }
	}
};
</script>