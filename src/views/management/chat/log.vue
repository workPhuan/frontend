<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_chat_log')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('userChatLogDelete')">{{$t('menu.management_chat_log_delete')}}</el-button>
			</div>
		</div>
		
		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
                    <div class="p-3 d-flex flex-wrap">
                    <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.conv_id" :placeholder="$t('mix.table_please_enter')+$t('mix.table_conv_id')" @keyup.enter.native="initial()">
                        <template #prepend>
                            <label>{{$t('mix.table_conv_id')}}</label>
                        </template>
                    </el-input>

                    <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.msg_id" :placeholder="$t('mix.table_please_enter')+$t('mix.table_msg_id')" @keyup.enter.native="initial()">
                        <template #prepend>
                            <label>{{$t('mix.table_msg_id')}}</label>
                        </template>
                    </el-input>
					<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.account_package_id" :placeholder="$t('mix.table_account_package')" clearable filterable @change="initial()">
						<el-option v-for="item in searchPackageList" :label="item.code" :value="item.id">{{item.code}}</el-option>
					</el-select>
					<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.chat_group_id" :placeholder="$t('mix.table_chat_group')" clearable filterable @change="initial()">
						<el-option v-for="item in searchGroupList" :label="item.name" :value="item.id">{{item.name}}</el-option>
					</el-select>
					<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.from_chat_member_id" :placeholder="$t('mix.table_from_chat_member_id')" clearable filterable @change="initial()">
						<el-option v-for="item in searchMemberList" :label="item.name" :value="item.id">{{item.name}}</el-option>
					</el-select>
					<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.to_chat_member_id" :placeholder="$t('mix.table_to_chat_member_id')" clearable filterable @change="initial()">
						<el-option v-for="item in searchMemberList" :label="item.name" :value="item.id">{{item.name}}</el-option>
					</el-select>
                    <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.from_user" :placeholder="$t('mix.table_please_enter')+$t('mix.table_from_user')" @keyup.enter.native="initial()">
                        <template #prepend>
                            <label>{{$t('mix.table_from_user')}}</label>
                        </template>
                    </el-input>
                    <el-input class="custom-input fixed-width-200 m-2" v-model="searchData.content" :placeholder="$t('mix.table_please_enter')+$t('mix.table_content')" @keyup.enter.native="initial()">
                        <template #prepend> 
                            <label>{{$t('mix.table_content')}}</label>
                        </template>
                    </el-input>
					<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
                    </div>
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
					
					<el-table-column type="selection" width="55"></el-table-column>
					<template v-for="title in ajaxTitles" :key="title.prop">
						<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
							<template #header>
								<p class="search-label">{{title.label}}</p>
							</template>
							
							<template v-if="title.prop == 'conv_id'" #default="scope">
								<div class="d-flex align-items-center">
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{$t('mix.table_conv_id')}}: {{scope.row.conv_id}}</p>
										<p class="p-0 m-0">{{$t('mix.table_msg_id')}}: {{scope.row.msg_id}}</p>
									</div>
								</div>
							</template>
							
							<template v-if="title.prop == 'content'" #default="scope">
								<div v-if="scope.row.contentType === 'string'">
									<p class="p-0 m-0">{{scope.row.content}}</p>
								</div>
								<div class="d-flex align-items-center">
									<div class="d-flex flex-column">
										<div v-if="scope.row.contentType === 'object'">
											<p class="p-0 m-0">{{$t('mix.table_md5')}}: {{scope.row.content.md5}}</p>
											<p class="p-0 m-0">{{$t('mix.table_file_name')}}: {{scope.row.content.file_name}}</p>
											<p class="p-0 m-0">{{$t('mix.table_file_size')}}: {{scope.row.content.file_size}}</p>
											<p class="p-0 m-0">{{$t('mix.table_download_url')}}: <a :href="scope.row.content.download_url" target="_blank">{{ scope.row.content.download_url }}</a></p>										</div>
									</div>
								</div>
							</template>

							<template v-if="title.prop == 'from_member_name'" #default="scope">
								<div class="d-flex align-items-center">
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{$t('mix.table_from_chat_member_id')}}: {{scope.row.from_member_name}}</p>
										<p class="p-0 m-0">{{$t('mix.table_to_chat_member_id')}}: {{scope.row.to_member_name}}</p>
									</div>
								</div>
							</template>

							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('userChatLogDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>
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
				prop:"no",
				label:this.$t("mix.table_id"),
				width: "100",
                align:'center'
			},{
                prop:"created_at",
				label:this.$t("mix.table_created_at"),
				width: "200",
			},{
				prop:"from_member_name",
				label:this.$t("mix.table_chat_member_id"),
				width: "280",
                align:'left'
			},{
				prop:"group_name",
				label:this.$t("mix.table_chat_group"),
				width: "180",
                align:'center'
			},{
				prop:"content",
				label:this.$t("mix.table_content"),
				width: "250",
			},{
				prop:"conv_id",
				label:this.$t("mix.table_conv_id"),
				width: "250",
                align:'left'
			},{
				prop:"package_code",
				label:this.$t("mix.table_account_package"),
				width: "180",
                align:'center'
			},{
				prop:"from_user",
				label:this.$t("mix.table_from_user"),
				width: "180",
                align:'center'
			},{
				prop:"action",
				label:this.$t("mix.table_action"),
				width: "170",
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
				security: "",
				msg_id: "",
				conv_id : '',
				account_package_id: "",
				chat_group_id: '',
				from_chat_member_id: '',
				to_chat_member_id: '',
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
			memberList: [],
			packageList: [],
			groupList: [],
			searchMemberList: [],
			searchPackageList: [],
			searchGroupList: [],
			securityCheck: 0
		};
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('management/chat/log',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.searchPackageList = data.packageList
					this.searchMemberList = data.memberList
					this.searchGroupList = data.groupList
					this.multiActionMax = data.multiActionMax
				}
				this.initial()
			})
		},initial() {
			this.loading = true;
			this.postData.data = JSON.stringify(this.searchData);
			var result = this.$m.postMethod("management/chat/log/ajaxTable", this.postData);

			result.then((value) => {
				var data = value.data;

				if (value.valid) {
				this.tableData = data.datatable.data;
				this.total = parseInt(data.datatable.total_number);
				this.listQuery.page = parseInt(data.datatable.current_pagination);
				this.listQuery.limit = parseInt(data.datatable.limit);

				this.tableData = this.tableData.map(item => {
					if (typeof item.content === 'object') {
					item.contentType = 'object'; 
					} else {
					item.contentType = 'string';
					}
					return item;
				});

				this.loading = false;
				}
			});
		},clearPostForm(done){
			this.postForm.name = []
            this.postForm.content = ""
            this.postForm.msg_id = ''
            this.postForm.conv_id = ""
			this.postForm.from_user = ""
            this.postForm.account_package_id = ""
            this.postForm.chat_group_id = ""
            this.postForm.from_chat_member_id = ""
            this.postForm.to_chat_member_id = ""

			this.postForm.selectedIds = []			
			if(done != undefined){
				done()
			}
		},deleteRow(id) {
			if(this.$p.permissionChecker('userChatLogDelete') && this.loading == false){
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
						var result = this.$m.postMethod("management/chat/log/DBdelete", this.postData);
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
		},clearSearchForm(){
			this.searchData = Object.assign({}, searchForm)
			this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

			this.initial()
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