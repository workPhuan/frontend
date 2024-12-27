<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.management_user_member')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button warning" @click="copy(selectedLogin),copySelected()" :loading="loading" v-if="0">{{$t('mix.table_copy_selected_user')}}</el-button>
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('memberManageListAdd')">{{$t('menu.management_user_member_add')}}</el-button>
				<el-button class="custom-button plain" @click="getExportTask()" :loading="loading" v-if="$p.permissionChecker('memberManageListExport') && 1">{{$t('menu.management_user_member_export')}}</el-button>
				<el-button class="custom-button primary" @click="getExportList()" :loading="loading"  v-if="$p.permissionChecker('memberManageListExport') && 1">{{$t('menu.management_user_member_exportList')}}</el-button>
				<el-button class="custom-button success" @click="modalList.multipleRow = true" :loading="loading"  v-if="$p.permissionChecker('memberManageListAdd') && 0">{{$t('menu.management_user_member_multipleaction')}}</el-button>
			</div>
		</div>

		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username_search')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_username')}}</label>
							</template>
						</el-input>

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.agent_id" :placeholder="$t('mix.table_agent')" clearable @change="initial()">
							<el-option v-for="item in searchAgentList" :label="item.name" :value="item.master_id">{{item.name}}</el-option>
						</el-select>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_name')}}</label>
							</template>
						</el-input>
						
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.email" :placeholder="$t('mix.table_please_enter')+$t('mix.table_email')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_email')}}</label>
							</template>
						</el-input>

						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.phone_mobile" :placeholder="$t('mix.table_please_enter')+$t('mix.table_phone_mobile')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_phone_mobile')}}</label>
							</template>
						</el-input>
						
						<div class="fixed-width-200">
							<el-date-picker class="custom-input fixed-width-200 m-2" v-model="searchData.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="initial()" />
						</div>

						<el-select class="custom-input fixed-width-200 m-2" size="large" v-model="searchData.account_id" :placeholder="$t('mix.table_account_type')" clearable @change="initial()">
							<el-option v-for="item in searchAccountList" :label="item.name" :value="item.id">{{item.name}}</el-option>
						</el-select>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_normal')" :value="'normal'">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="'suspended'">{{$t('mix.table_suspended')}}</el-option>
						</el-select>
						
						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.is_withdraw" :placeholder="$t('mix.table_is_withdraw')" clearable @change="initial()" size='large'>
							<el-option :label="$t('mix.table_normal')" :value="1">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="0">{{$t('mix.table_suspended')}}</el-option>
						</el-select>

						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="initial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
						<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="clearSearchForm()" :loading="loading"><i class="fa-light fa-brush me-2"></i>{{$t('button.clear')}}</el-button>

					</div>
				</div>

				<el-table :data="tableData" v-loading="loading || ajaxLoading" class="custom-table mt-3" ref="tableTest" :show-header="true" @selection-change="handleSelectionChange">
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

							<template v-if="title.prop == 'member_info'" #default="scope">
								<div class="d-flex align-items-center">
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{$t('mix.table_username')}}: {{scope.row.login}}</p>
										<p class="p-0 m-0">{{$t('mix.table_name')}}: {{scope.row.name}}</p>
										<p class="p-0 m-0">{{$t('mix.table_register_at')}}: {{scope.row.created_at}}</p>
										<p class="p-0 m-0">{{$t('mix.table_register_ip')}}: {{scope.row.register_ip}}</p>
									</div>
								</div>
							</template>

							<template v-if="title.prop == 'email'" #default="scope">
								<div class="d-flex align-items-center">
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{$t('mix.table_email')}}: {{scope.row.email}}</p>
										<p class="p-0 m-0">{{$t('mix.table_phone_mobile')}}: {{scope.row.phone_mobile}}</p>
									</div>
								</div>
							</template>

							<template v-if="title.prop == 'last_active'" #default="scope">
								<p><small>IP: {{scope.row.last_ip}}</small></p>
								<p><small>{{ $t('mix.table_date') }}: {{scope.row.last_login}}</small></p>
							</template>

							<template v-if="title.prop == 'status'" #default="scope">
								<p class="p-0 m-0">
									{{$t('mix.table_account_type')}}:
									<span >{{scope.row.account_name}}</span>
								</p>
								<p class="p-0 m-0">
									{{$t('mix.table_login')}}:
									<span class="text-success" v-if="scope.row[title.prop] == 'normal'">{{$t('mix.table_normal')}}</span>
									<span class="text-danger" v-else>{{$t('mix.table_suspended')}}</span>
								</p>
								<p class="p-0 m-0">
									{{$t('mix.table_withdraw')}}:
									<span class="text-success" v-if="scope.row.is_withdraw == 1">{{$t('mix.table_normal')}}</span>
									<span class="text-danger" v-else-if="scope.row.is_withdraw == 0">{{$t('mix.table_suspended')}}</span>
								</p>
								<p class="p-0 m-0">
									{{$t('mix.table_last_login_times')}}:
									<span >{{scope.row.total_login}}</span>
								</p>
							</template>

							<template v-if="title.prop == 'status_button'" #default="scope">
								<el-switch v-model="scope.row.status" active-value="normal" inactive-value="suspended" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('userChatRoleEdit')) ? false : true"></el-switch>
							</template>

							
							<template v-if="title.prop == 'created_at'" #default="scope">
								<p class="p-0 m-0">{{scope.row.created_at}}</p>
								<p class="p-0 m-0">{{scope.row.register_ip}}</p>
							</template>

							<template v-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('memberManageListEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.master_id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('memberManageListEdit')" :class="scope.row.status === 'normal' ? 'custom-button danger m-1' : 'custom-button success m-1'" @click="statusRow(scope.row)">{{ scope.row.status === 'normal' ? $t('button.suspend') : $t('button.activate') }}</el-button>
								<el-button v-if="$p.permissionChecker('memberManageListAdd')" class="custom-button m-1" @click="searchLoginForm.master_id=scope.row.master_id, loginInitial()">{{$t('menu.management_user_login')}}</el-button>	
								<el-button v-if="$p.permissionChecker('memberManageListPassword')" class="custom-button warning m-1" @click="getPasswordRow(scope.row.master_id)">{{$t('button.forgetpassword')}}</el-button>
								<el-button v-if="$p.permissionChecker('memberManageListSecurity')" class="custom-button warning m-1" @click="getSecurityRow(scope.row.master_id)">{{$t('button.change_security')}}</el-button>

							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

		<el-dialog v-model="modalList.addRow" :title="$t('menu.management_user_member_add')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.username" :placeholder="$t('mix.table_username')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_email')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.email" :placeholder="$t('mix.table_email')" />
					</el-col>

					<el-col :sm="12" class="mb-3">	
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_phone_mobile')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.phone_mobile" :placeholder="$t('mix.table_phone_mobile')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account_type')}}</label>
						<el-select v-if="postForm.account != 1" size="large" class="custom-input mt-1 w-100" v-model="postForm.account_id" :placeholder="$t('msg.msg_select')" filterable>
							<el-option v-for="(list,index) in accountList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
						</el-select>
						<el-input v-else class="custom-input mt-1" v-model="postForm.account_name" :placeholder="$t('mix.table_account_type')" disabled="disabled" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_agent')}}</label>
						<el-select size="large" class="custom-input mt-1 w-100" v-model="postForm.agent_id" :placeholder="$t('msg.msg_select')" filterable>
							<el-option v-for="(list,index) in agentList" :key="index" :label="list.name" :value="list.master_id">{{list.name}}</el-option>
						</el-select>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.password" show-password :placeholder="$t('mix.table_password')"  />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security_password" show-password :placeholder="$t('mix.table_security_password')"  />
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')"  />
					</el-col>

					<el-col :sm="12" class="mb-3"  v-if="0">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input mt-1 w-100" size="large" v-model="postForm.status" :placeholder="$t('msg.msg_select')" filterable>
							<el-option :label="$t('mix.table_normal')" :value="'normal'">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="'suspended'">{{$t('mix.table_suspended')}}</el-option>
						</el-select>
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.management_user_member_edit')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('mix.table_username')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_email')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.email" :placeholder="$t('mix.table_email')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_phone_mobile')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.phone_mobile" :placeholder="$t('mix.table_phone_mobile')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_account_type')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.account_id" :placeholder="$t('msg.msg_select')" size="large">
							<el-option v-for="(list,index) in accountList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_agent')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.agent_id" :placeholder="$t('msg.msg_select')" size="large">
							<el-option v-for="(list,index) in agentList" :key="index" :label="list.name" :value="list.master_id">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.status" :placeholder="$t('msg.msg_select')" size="large" filterable>
							<el-option :label="$t('mix.table_normal')" :value="'normal'">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="'suspended'">{{$t('mix.table_suspended')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_withdraw')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_withdraw" :placeholder="$t('msg.msg_select')" size="large" filterable>
							<el-option :label="$t('mix.table_normal')" :value="1">{{$t('mix.table_normal')}}</el-option>
							<el-option :label="$t('mix.table_suspended')" :value="0">{{$t('mix.table_suspended')}}</el-option>
						</el-select>
					</el-col>
					
					<template v-if="0">
						<el-col :sm="12" class="mb-3" >
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_bonus')}}</label>
							<el-select class="custom-input mt-1 w-100" v-model="postForm.is_bonus" :placeholder="$t('msg.msg_select')" filterable>
								<el-option :label="$t('mix.table_normal')" :value="1">{{$t('mix.table_normal')}}</el-option>
								<el-option :label="$t('mix.table_suspended')" :value="0">{{$t('mix.table_suspended')}}</el-option>
							</el-select>
						</el-col>
						
						<el-col :sm="12" class="mb-3" >
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_ban_chat')}}</label>
							<el-select class="custom-input mt-1 w-100" v-model="postForm.is_ban_chat" :placeholder="$t('msg.msg_select')" filterable>
								<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
								<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
							</el-select>
						</el-col>
						
						<el-col :sm="12" class="mb-3" >
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_is_transfer_remark')}}</label>
							<el-select class="custom-input mt-1 w-100" v-model="postForm.is_transfer_remark" :placeholder="$t('msg.msg_select')" filterable>
								<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
								<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
							</el-select>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_downline')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_downline" :step="1" :min="0"/>
						</el-col>
						
						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_valid_downline_number')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_valid_downline" :step="1" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_group')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_group" :step="1" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_sales')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_sales" :step="1" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_downline_sales')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_downline_sales" :step="1" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_today_bonus')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_today_bonus" :step="1" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_accumulate_bonus')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_accumulate_bonus" :step="1" :min="0"/>
						</el-col>
						
						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_total_invest')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_invest" :step="1" :min="0"/>
						</el-col>

						<el-col :sm="12" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_virtual_my_bonus')}}</label>
							<el-input-number class="custom-input mt-1 w-100" v-model="postForm.virtual_bonus" :step="1" :min="0"/>
						</el-col>
					</template>
					

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="0">
						<small><b>{{ $t('mix.table_downline_number') }}:</b> {{ networkDetail.direct_downline+postForm.virtual_downline }}</small><br>
						<small><b>{{ $t('mix.table_valid_downline_number') }}:</b> {{ networkDetail.valid_direct_downline+postForm.virtual_valid_downline }}</small><br>
						<small><b>{{ $t('mix.table_group_number') }}:</b> {{ networkDetail.team_number+postForm.virtual_group }}</small><br>
						<small><b>{{ $t('mix.table_team_sales') }}:</b> {{ (parseFloat(networkDetail.team_sales)+parseFloat(postForm.virtual_sales)).toFixed(2) }}</small><br>
						<small><b>{{ $t('mix.table_downline_sales') }}:</b> {{ (parseFloat(networkDetail.downline_sales)+parseFloat(postForm.virtual_downline_sales)).toFixed(2) }}</small><br>
						<small><b>{{ $t('mix.table_today_bonus') }}:</b> {{ (parseFloat(networkDetail.today_bonus)+parseFloat(postForm.virtual_today_bonus)).toFixed(2) }}</small><br>
						<small><b>{{ $t('mix.table_accumulate_bonus') }}:</b> {{ (parseFloat(networkDetail.total_bonus)+parseFloat(postForm.virtual_accumulate_bonus)).toFixed(2) }}</small><br>
						<small><b>{{ $t('mix.table_total_invest') }}:</b> {{ (parseFloat(networkDetail.total_invest)+parseFloat(postForm.virtual_invest)).toFixed(2) }}</small><br>
						<small><b>{{ $t('mix.table_my_bonus') }}:</b> {{ (parseFloat(networkDetail.total_bonus)+parseFloat(postForm.virtual_bonus)).toFixed(2) }}</small>
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

		<el-dialog v-model="modalList.approveRow" :title="$t('menu.management_user_member_approve')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('mix.table_username')" :disabled="true"/>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_withdraw')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_withdraw" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_transfer')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_transfer" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_swap')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_swap" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_change_password')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_change_password" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_change_security')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_change_security" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_bind_bank')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_bind_bank" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_bind_erc20')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_bind_erc20" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3" >
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_bind_trc20')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.is_bind_trc20" :placeholder="$t('msg.msg_select')" size="large">
							<el-option :label="$t('general.on')" :value="1">{{$t('general.on')}}</el-option>
							<el-option :label="$t('general.off')" :value="0">{{$t('general.off')}}</el-option>
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
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="approveRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.approveRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog v-model="modalList.depositRow" :title="$t('menu.management_user_member_deposit')" :before-close="clearPostForm" class="dialog-md">
			<el-form label-position="top" label-width="auto" @submit.native.prevent class="submit-form">
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.member" :placeholder="$t('mix.table_username')" disabled/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_wallet')}}</label>
						<el-select class="custom-input mt-1 w-100" v-model="postForm.wallet_id" :placeholder="$t('msg.msg_select')" filterable size="large">
							<el-option v-for="(list,index) in walletList" :key="index" :label="list.name" :value="list.id">{{list.name}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_amount')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.amount" :placeholder="$t('mix.table_amount')"/>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="depositRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.depositRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog v-model="modalList.topupDeductRow" :title="$t('menu.management_user_member_topupdeduct')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>	
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.member" :placeholder="$t('mix.table_username')" disabled/>
					</el-col>
					
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_topup_deduct')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.topup_deduct_type" :placeholder="$t('mix.table_topup_deduct')" size="large">
							<el-option :label="$t('button.topup')" value="topup"></el-option>
							<el-option :label="$t('button.deduct')" value="deduct"></el-option>
						</el-select>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')"/>
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
				
                <el-card class="mb-4" shadow="never">
					<div v-for="list in walletList" :key="list.id" :label="list.name" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{list.name}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.wallet[list.id]" />
					</div>
                </el-card>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="topupDeductRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.topupDeductRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.passwordRow" :title="$t('menu.management_user_member_password')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('mix.table_username')" disabled="disabled" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold">
							<span class="text-danger">*</span> {{$t('mix.table_new_password')}}
						</label>
						<el-input class="custom-input mt-1" v-model="postForm.password" show-password :placeholder="$t('mix.table_current_password')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="passwordRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.passwordRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.securityRow" :title="$t('mix.table_change_security')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.login" :placeholder="$t('mix.table_username')" disabled="disabled" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold">
							<span class="text-danger">*</span> {{$t('mix.table_new_security')}}
						</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_new_security')"/>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.my_security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" @click="securityRow()" :loading="loading">{{$t('button.save_data')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.securityRow = false, clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.loginRow" :title="$t('menu.management_user_member_login')" :before-close="clearPostForm" custom-class="dialog-lg">
			<el-table :data="loginData" v-loading="loading" class="custom-table mt-3" ref="tableProject" :show-header="true" show-summary :summary-method="getSummaries">
				<template #empty v-if="loginData.length=='0'">
					<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
					<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
					<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
				</template>

				<template v-for="title in loginAjaxTitles" :key="title.prop">
					<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
						<template #header>
							<p class="search-label">{{title.label}}</p>
						</template>
					</el-table-column>
				</template>
			</el-table>

			<pagination class="mt-3" v-show="loginTotal > 0" :total="loginTotal" :page.sync="listQueryLogin.page" :limit.sync="listQueryLogin.limit" @paginationChange="paginationLoginChange"/>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.loginRow = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.transactionRow" :title="$t('menu.management_user_wallet_transaction')" class="dialog-xl">
			<div class="page-filter">
				<legend>{{$t('mix.table_filter')}}</legend>
				<div class="p-3 d-flex flex-wrap">
					<el-input class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username_search')" @keyup.enter.native="transactionInitial()">
						<template #prepend>
							<label>{{$t('mix.table_username')}}</label>
						</template>
					</el-input>

					<el-input class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.from_login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username_search')" @keyup.enter.native="transactionInitial()">
						<template #prepend>
							<label>{{$t('mix.table_from_user')}}</label>
						</template>
					</el-input>

					<el-input class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.to_login" :placeholder="$t('mix.table_please_enter')+$t('mix.table_username_search')" @keyup.enter.native="transactionInitial()">
						<template #prepend>
							<label>{{$t('mix.table_to_user')}}</label>
						</template>
					</el-input>

					<el-select class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.transaction_type" :placeholder="$t('mix.table_transaction_type')" clearable @change="transactionInitial()" size="large">
						<el-option v-for="item in searchStatusList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
					</el-select>

					<el-select class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.bonus_type" :placeholder="$t('mix.table_bonus_type')" clearable @change="transactionInitial()" size="large">
						<el-option v-for="item in searchAttributeList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
					</el-select>

					<el-select class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.wallet_id" :placeholder="$t('mix.table_wallet')" clearable @change="transactionInitial()" size="large">
						<el-option v-for="item in searchWalletList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
					</el-select>

					<div class="fixed-width-200">
						<el-date-picker class="custom-input fixed-width-200 m-2" v-model="transactionSearchForm.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" @change="transactionInitial()" />
					</div>
					<el-button class="custom-button plain m-2 h-r-2-5 pe-4 ps-4" @click="transactionInitial()" :loading="loading"><i class="fa-light fa-search me-2"></i>{{$t('button.search')}}</el-button>
					<div v-if="ajaxTableCheck && 0" class="m-2 pe-4 ps-4 align-self-center text-danger font-8">{{$t('mix.table_search_data')}}</div>
				</div>
			</div>

			<el-table :data="transactionTableData" v-loading="loading" class="custom-table mt-3" ref="tableProject" :show-header="true" show-summary :summary-method="transactionGetSummaries">
				<template #empty v-if="transactionTableData.length=='0'">
					<img class="ajaxtable-empty-img pt-5" src="@/assets/img/common/search-1.svg">
					<div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
					<div class="ajaxtable-empty-desc">{{$t('msg.msg_ajaxtable_desc_empty')}}</div>
				</template>

				<template v-for="title in transactionAjaxTitles" :key="title.prop">
					<el-table-column :prop="title.prop" :label="title.label" :min-width="title.width" :align="title.align" :type="title.type">
						<template #header>
							<p class="search-label">{{title.label}}</p>
						</template>
					</el-table-column>
				</template>
			</el-table>

			<pagination class="mt-3" v-show="transactionTotal > 0" :total="transactionTotal" :page.sync="transactionListQuery.page" :limit.sync="transactionListQuery.limit" @paginationChange="transactionPaginationChange"/>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.transactionRow = false">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.multipleRow" :title="$t('menu.management_user_member_multipleaction')" class="dialog-xl" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_username')}}</label>
						<el-input class="w-100 mt-1" type="textarea" :rows="5" v-model="multipleForm.users" :placeholder="$t('mix.table_username')" />
					</el-col>
					<small class="text-danger p-3">* {{ $t('mix.table_multiple_desc',{max:multiActionMax}) }}</small>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button danger font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('suspended')" :loading="loading">{{$t('mix.table_suspended')}}</el-button>
					<el-button class="custom-button success font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('normal')" :loading="loading">{{$t('mix.table_unsuspended')}}</el-button>
					<el-button class="custom-button success font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('on_withdraw')" :loading="loading">{{$t('mix.table_on_withdraw')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('off_withdraw')" :loading="loading">{{$t('mix.table_off_withdraw')}}</el-button>
					<el-button class="custom-button success font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('on_bonus')" :loading="loading">{{$t('mix.table_on_bonus')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('off_bonus')" :loading="loading">{{$t('mix.table_off_bonus')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('cancel_withdraw')" :loading="loading">{{$t('mix.table_cancel_withdraw')}}</el-button>
					<el-button class="custom-button warning font-8 pt-3 pb-3" v-if="$p.permissionChecker('memberManageListAdd')" @click="multipleRow('kickout')" :loading="loading">{{$t('mix.table_kickout')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.checkPasswordRow" :title="$t('menu.management_user_member_checkpassword')" class="dialog-sm" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1"  v-model="postForm.login" :placeholder="$t('mix.table_username')" readonly/>
					</el-col>
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_password')}}</label>
						<el-input class="custom-input mt-1"  v-model="postForm.password" :placeholder="$t('mix.table_password')" readonly/>
					</el-col>
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1"  v-model="postForm.security" :placeholder="$t('mix.table_security')" readonly/>
					</el-col>
				</el-row>
			</el-form>
        </el-dialog>

		<el-dialog v-model="modalList.exportTask" :title="$t('menu.management_user_member_export')" class="dialog-sm" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20" v-if="!exportCheck">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_page')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="searchData.export_page" size="large">
							<el-option v-for="(item,key) in sizeList" :key="key" :label="item" :value="key">{{item}}</el-option>
						</el-select>
					</el-col>
					<template v-if="0">
						<el-col :sm="24" class="mb-3">
							<label class="text-theme font-8 fw-bold">{{$t('mix.table_date')}}</label>
							<el-date-picker class="custom-input w-100 mt-1" v-model="exportForm.date_range" type="daterange" range-separator="-" :start-placeholder="$t('general.date_start')" :end-placeholder="$t('general.date_end')" />
						</el-col>
						<el-col :sm="24" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
							<el-input class="custom-input mt-1" v-model="exportForm.login" :placeholder="$t('mix.table_username')" />
						</el-col>
						<el-col :sm="24" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_affiliate_id')}} ({{ $t('mix.table_search_team') }})</label>
							<el-input class="custom-input mt-1" v-model="exportForm.affiliate_id" :placeholder="$t('mix.table_affiliate_id')" />
						</el-col>
						<el-col :sm="24" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sponsor')}}</label>
							<el-input class="custom-input mt-1" v-model="exportForm.sponsor_username" :placeholder="$t('mix.table_sponsor')" />
						</el-col>
						<el-col :sm="24" class="mb-3">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_agent')}}</label>
							<el-input class="custom-input mt-1" v-model="exportForm.agent_id" :placeholder="$t('mix.table_agent')" />
						</el-col>
						<el-col :sm="24" class="mb-3">
							<label class="text-theme font-8 fw-bold">{{$t('mix.table_login')}}</label>
							<el-select class="custom-input w-100 mt-1" v-model="exportForm.status" size="large">
								<el-option :label="$t('mix.table_enabled')" value="normal">{{$t('mix.table_enabled')}}</el-option>
								<el-option :label="$t('mix.table_disabled')" value="suspended">{{$t('mix.table_disabled')}}</el-option>
							</el-select>
						</el-col>
					</template>
					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="exportForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
				<el-row :gutter="20" v-else>
                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold text-warning">{{$t('msg.msg_export_fail')}}</label>
                    </el-col>
                </el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button success font-8 pt-3 pb-3" v-if="!exportCheck" @click="exportTask()" :loading="loading">{{$t('button.export')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.exportTask = false,clearPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.exportList" :title="$t('menu.management_user_member_exportList')" class="dialog-sm">
            <el-form label-position="top" label-width="auto" @submit.native.prevent>
                <el-row :gutter="20">
                    <el-col :sm="24" class="mb-3">
                        <label class="text-theme font-8 fw-bold">{{$t('general.exportlist')}}</label>
                        <el-table :data="fileList" v-loading="loading" class="custom-table mt-3" ref="tableExport">
                            <template #empty v-if="fileList.length=='0'">
                                <div class="ajaxtable-empty-title">{{$t('msg.msg_ajaxtable_empty')}}</div>
                            </template>

                            <template v-for="title in fileTitles" :key="title.prop">
                                <el-table-column :prop="title.prop" :label="title.label" :min-width="title.width">
                                    <template v-if="title.prop == 'file'" #default="scope">
                                        <a :href="scope.row.url" target="_blank">{{scope.row.file}}</a>
                                    </template>
                                    <template v-if="title.prop == 'action'" #default="scope">
                                        <el-button v-if="$p.permissionChecker('memberManageListDelete')" class="custom-button danger m-1" @click="exportDelete(scope.row.file)">{{$t('button.delete')}}</el-button>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <div class="d-flex justify-content-center align-item-center">
                    <el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.exportList = false">{{$t('button.close')}}</el-button>
                </div>
            </template>
        </el-dialog>
	</div>
</template>

<script setup>
import pagination from '@/components/pagination/index.vue'
import { accountDetail } from '@/system/store/state.js'
import { useClipboard } from '@vueuse/core'
const {copy} = useClipboard()
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
			ajaxLoading: true,
			tableData: [],
			transactionTableData: [],
			loginData: [],
			total: 0,
			transactionTotal: 0,
			loginTotal: 0,
			errors: [],
			submitForm: {
				id:'',
			},
			postData: {
				data: '',
				language: '',
			},
			searchData: (this.$m.getItem('storeAjaxTableDetail')) ? JSON.parse(this.$m.getItem('storeAjaxTableDetail')) : Object.assign({}, searchForm),
			transactionSearchForm: {
				master_id: '',
				pagination: 1,
				limit: 10,
			},
			listQuery: {
				page: 1,
				limit: 10
			},
			listQueryLogin: {
				page: 1,
				limit: 10
			},
			transactionListQuery: {
				page: 1,
				limit: 10
			},
			ajaxTitles:[{
                prop:"member_info",
                label:this.$t('mix.table_username'),
                width:'250',
			},{
				prop:"email",
                label:this.$t('mix.table_contact'),
                width:'320',
			},{
				prop:"agent_name",
                label:this.$t('mix.table_agent'),
                width:'120',
			},{
                prop:"last_active",
                label:this.$t('mix.table_last_login'),
                width:'250',
			},{
                prop:"status",
                label:this.$t('mix.table_account_status'),
                width:'250',
			},{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'320',
				align: 'right'
			}
			],
			loginAjaxTitles:[{
                prop:"no",
                label:this.$t('mix.table_id'),
                width:'60',
			},{
                prop:"login",
                label:this.$t('mix.table_username'),
                width:'150',
			},{
                prop:"ip",
                label:this.$t('mix.table_action_ip'),
                width:'200',
			},{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'150',
			},{
                prop:"user_agent",
                label:this.$t('mix.table_action_device'),
                width:'500',
			}],
			transactionAjaxTitles:[{
                prop:"id",
                label:this.$t('mix.table_id'),
                width:'80',
			},{
                prop:"login",
                label:this.$t('mix.table_username'),
                width:'180',
			},{
                prop:"from_login",
                label:this.$t('mix.table_from_user'),
                width:'180',
			},{
                prop:"to_login",
                label:this.$t('mix.table_to_user'),
                width:'180',
			},{
                prop:"income",
                label:this.$t('mix.table_income'),
                width:'150',
			},{
                prop:"spend",
                label:this.$t('mix.table_spend'),
                width:'150',
			},{
                prop:"before_value",
                label:this.$t('mix.table_before_wallet'),
                width:'150',
			},{
                prop:"after_value",
                label:this.$t('mix.table_after_wallet'),
                width:'150',
			},{
                prop:"wallet_id",
                label:this.$t('mix.table_wallet'),
                width:'100',
			},{
                prop:"transaction_name",
                label:this.$t('mix.table_transaction_type'),
                width:'250',
			},{
                prop:"created_at",
                label:this.$t('mix.table_created_at'),
                width:'160',
			}],
			searchLoginForm:{
				master_id: '',
				pagination: 1,
				limit: 10,
			},
			postForm:{
				member:'',
				is_withdraw:'',
				username:'',
				agent_id:'',
				name:'',
				email:'',
				phone_mobile:'',
				last_login:'',
				last_active_ip:'',
				new_security:'',
				new_password:'',
				sponsor:'',
				security: '',
				wallet_id: '',
				amount: 0,
				wallet: {},
			},
			multipleForm:{
				users:'',
				action:'',
				security: '',
			},
			exportForm:{
				export_page:'',
				date_range:[],
				login:'',
				affiliate_id:'',
				sponsor_username:'',
				agent_id:'',
				status:'',
				security:''
			},
			networkDetail:{},
			defaultImage: '',
			openImageDialog: false,
			modalList:{},
			securityCheck: 0,
			imagePickerFile:'',
			imagePickerFileUrl:'',
			exportCheck: false,
			isAgent: false,
			searchAgentList: [],
			searchAccountList: [],
			searchStatusList: [],
            searchAttributeList: [],
            searchWalletList: [],
			walletList: [],
			accountList: [],
			agentList: [],

			fileList: [],
			fileTitles:[{
                prop:"file",
                label:this.$t('mix.table_file'),
                width:'200',
            },{
                prop:"action",
                label:this.$t('mix.table_action'),
                width:'80',
                align:'right'
            }],
			selectedLogin: '',
			multiActionMax: 0
		}
	},
	methods:{
		getInitial(){
            this.searchData.pagination = 1
			this.loading = true
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('management/user/member',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.searchAgentList = data.agentList
					this.searchAccountList = data.accountList
					this.multiActionMax = data.multiActionMax
				}
				this.initial()
			})
		},initial(){
			this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

			this.loading = true
			this.ajaxLoading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('management/user/member/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.isAgent = data.isAgent
					this.tableData = data.datatable.data
					this.total = parseInt(data.datatable.total_number)
					this.listQuery.page = parseInt(data.datatable.current_pagination)
					this.listQuery.limit = parseInt(data.datatable.limit)
				}
				this.loading = false
				this.ajaxLoading = false
			})
		},loginInitial(){
			this.loading = true

			this.postData.data = JSON.stringify(this.searchLoginForm)
			var result = this.$m.postMethod('management/user/login/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.loginData = data.datatable.data
					this.loginTotal = parseInt(data.datatable.total_number)
					this.listQueryLogin.page = parseInt(data.datatable.current_pagination)
					this.listQueryLogin.limit = parseInt(data.datatable.limit)
				}
				this.modalList.loginRow = true
				this.loading = false
			})
		},getTransactionInitial(){
			this.loading = true
			this.ajaxLoading = true

			this.postData.data = JSON.stringify(this.transactionSearchForm)
			var result = this.$m.postMethod('financial/manage/transaction',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.searchStatusList = data.statusList
                    this.searchAttributeList = data.attributeList
                    this.searchWalletList = data.walletList
					this.transactionInitial()
				}
			})
		},transactionInitial(){
			this.loading = true
			this.ajaxLoading = true

			this.postData.data = JSON.stringify(this.transactionSearchForm)
			var result = this.$m.postMethod('financial/manage/transaction/ajaxTable',this.postData)
			result.then((value) => {
				var data = value.data

				if(value.valid){
					this.transactionTableData = data.datatable.data
					this.transactionTotal = parseInt(data.datatable.total_number)
					this.transactionListQuery.page = parseInt(data.datatable.current_pagination)
					this.transactionListQuery.limit = parseInt(data.datatable.limit)
					this.loading = false
					this.ajaxLoading = false
					this.modalList.transactionRow = true
				}
			})
		},clearPostForm(done){
			this.postForm.login=''
			this.postForm.member=''
			this.postForm.username=''
			this.postForm.name=''
			this.postForm.email=''
			this.postForm.phone_mobile=''
			this.postForm.password=''
			this.postForm.security_password=''
			this.postForm.security=''
			this.postForm.agent_id=''
			this.postForm.sponsor=''
			this.postForm.wallet_id=''
			this.postForm.amount=0
			this.postForm.wallet={}
			
			this.postForm.new_password=''
			this.postForm.new_security=''
			
			this.exportForm.export_page=''
			this.exportForm.date_range=[]
			this.exportForm.login=''
			this.exportForm.affiliate_id=''
			this.exportForm.sponsor_username=''
			this.exportForm.agent_id=''
			this.exportForm.status=''
			this.exportForm.security=''

			this.multipleForm.users=''
			this.multipleForm.action=''
			this.multipleForm.security=''

			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('management/user/member/add',this.postData)
				result.then((value)=>{
					var data = value.data

					if(value.valid){
						this.accountList = data.accountList
						this.agentList = data.agentList
						this.modalList.addRow = true
						this.loading = false
					}
				})
			}
        },addRow(){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)
				
                this.postData.data = JSON.stringify(this.postForm)
                var result = this.$m.postMethod('management/user/member/DBadd',this.postData)	

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
		},getEditRow(masterID){
			if((this.$p.permissionChecker('memberManageListEdit') || this.$p.permissionChecker('memberManageListEdit')) && this.loading == false){
				this.loading = true

				this.submitForm.master_id = masterID
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/user/member/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						
						this.modalList.editProfile = true
						this.postForm = data.thisDetail
						this.accountList = data.accountList
						this.agentList = data.agentList
						this.networkDetail = data.networkDetail

						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if((this.$p.permissionChecker('memberManageListEdit') || this.$p.permissionChecker('memberManageListEdit')) && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)
				
                var result = this.$m.postMethod('management/user/member/DBedit',this.postData)
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
                });
			}
		},deleteRow(masterID) {
			if(this.$p.permissionChecker('memberManageListDelete') && this.loading == false){
				var valid = true
				if(masterID == 'multiple'){
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
						this.postForm.master_id = masterID
						this.postData.data = JSON.stringify(this.postForm);
						var result = this.$m.postMethod("management/user/member/DBdelete", this.postData);
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
		},walletSyncRow(masterID){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true
				this.$confirm(this.$t('msg.msg_confirmation'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.yes'),
					cancelButtonText: this.$t('button.no'),
					customClass: 'input-dialog',
					showInput: true,
					inputPlaceholder: this.$t('mix.table_security'),
					inputType: 'password',
				}).then(({value}) => {
					this.preloader(true)
					this.postForm.security = value
					this.postForm.master_id = masterID
					this.postData.data = JSON.stringify(this.postForm)

					var result = this.$m.postMethod('management/transaction/wallet/DBsyncWallet',this.postData)

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
		},getApproveRow(masterID){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true

				this.submitForm.master_id = masterID
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/user/member/approve',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.modalList.approveRow = true
					}
					this.loading = false
				})
			}
		},approveRow(){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)
				
                var result = this.$m.postMethod('management/user/member/DBapprove',this.postData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.approveRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},multipleRow(action){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
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
					this.multipleForm.security = value
					this.multipleForm.action = action
					this.postData.data = JSON.stringify(this.multipleForm)

					var result = this.$m.postMethod('management/user/member/DBmultipleAction',this.postData)

					result.then((value) => {
						var data = value.data

						if(value.valid){
							this.$message({
								message: data.returnMsg,
								type: 'success'
							})
							this.modalList.multipleRow = false
                        	this.clearPostForm()
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
		},checkPasswordRow(masterID){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)
				this.postForm.master_id = masterID
                this.postData.data = JSON.stringify(this.postForm)
				
                var result = this.$m.postMethod('management/user/member/DBcheckPassword',this.postData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.postForm = data.thisDetail
                        this.modalList.checkPasswordRow = true
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},getDepositRow(id, login){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true

				this.submitForm.master_id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/transaction/wallet/deposit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm.member = login
						this.walletList = data.walletList
						this.modalList.depositRow = true
					}
					this.loading = false
				})
			}
		},depositRow(){
			if(this.$p.permissionChecker('memberManageListAdd') && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)
				
                var result = this.$m.postMethod('management/transaction/wallet/DBdeposit',this.postData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.depositRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},getTopupDeductRow(id, login){
			if(this.$p.permissionChecker('memberManageListAdd')){
				this.loading = true
				this.submitForm.master_id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/transaction/wallet',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.walletList = data.walletList
                        this.walletList.forEach((item)=>{
                            this.postForm.wallet[item.id] = 0
                        })
						this.postForm.member = login
						this.modalList.topupDeductRow = true
					}
					this.loading = false
				})
			}
		},topupDeductRow(){
			if(this.$p.permissionChecker('memberManageListAdd')){
				this.loading = true
                this.preloader(true)
                this.postData.data = JSON.stringify(this.postForm)
				
				var url = 'management/transaction/wallet/DBtopup'
				if(this.postForm.topup_deduct_type == 'deduct'){
					url = 'management/transaction/wallet/DBdeduct'
				}

                var result = this.$m.postMethod(url,this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })
                        
                        this.modalList.topupDeductRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{					
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }
                    
                    this.loading = false
                    this.preloader(false)
                })
			}
		},getPasswordRow(masterID){
			if((this.$p.permissionChecker('memberManageListPassword') || this.$p.permissionChecker('memberManageListPassword')) && this.loading == false){
				this.loading = true

				this.submitForm.master_id = masterID
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/user/member/password',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail

						this.modalList.passwordRow = true
					}
					this.loading = false
				})
			}
		},passwordRow(){
			if((this.$p.permissionChecker('memberManageListPassword') || this.$p.permissionChecker('memberManageListPassword')) && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/user/member/DBpassword',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.passwordRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},getSecurityRow(masterID){
			if((this.$p.permissionChecker('memberManageListSecurity') || this.$p.permissionChecker('memberManageListSecurity')) && this.loading == false){
				this.loading = true

				this.submitForm.master_id = masterID
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/user/member/security',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail

						this.modalList.securityRow = true
					}
					this.loading = false
				})
			}
		},securityRow(){
			if((this.$p.permissionChecker('memberManageListSecurity') || this.$p.permissionChecker('memberManageListSecurity')) && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('management/user/member/DBsecurity',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.securityRow = false
                        this.clearPostForm()
                        this.initial()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},statusRow(currentData) {
			if (this.$p.permissionChecker('memberManageListEdit') && !this.loading) {
				this.$confirm(this.$t('msg.msg_action'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.yes'),
					cancelButtonText: this.$t('button.no'),
					customClass: 'input-dialog',
					showInput: (this.securityCheck == 1), 
					inputPlaceholder: this.$t('mix.table_security'),
					inputType: 'password',
				}).then(({ value }) => {
					this.loading = true;
					
					this.submitForm.master_id = currentData.master_id;
					this.submitForm.status = currentData.status === 'normal' ? 'suspended' : 'normal';
					this.postData.data = JSON.stringify(this.submitForm);
					
					var formData = new FormData();
					formData.append('data', this.postData.data);
					formData.append('language', this.postData.language);

					if (this.securityCheck == 1) {
						formData.append('security', value);
					}
					
					var result = this.$m.postMethod('management/user/member/DBstatus', formData);
					result.then((response) => {
						var data = response.data;
						if (response.valid) {
							this.$message({
								message: data.returnMsg,
								type: 'success'
							});
							currentData.status = this.submitForm.status;
						} else {
							this.$m.popupErrorMessage(data.returnMsg, this);
						}
						this.clearPostForm();
						this.initial();
						this.loading = false;
					});
				}).catch(() => {
					this.loading = false;
				});
			}
		},getExportTask(){
			if(this.$p.permissionChecker('memberManageListExport') && this.loading == false){
				this.loading = true

				this.submitForm.total_record = this.total
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('management/user/member/export',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.sizeList = data.sizeList
						this.exportCheck = data.is_progress
						this.modalList.exportTask = true
					}
					this.loading = false
				})
			}
		},exportTask(){
			if(this.$p.permissionChecker('memberManageListExport') && this.loading == false){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.searchData)
                var result = this.$m.postMethod('management/user/member/DBexport',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.exportTask = false,
                        this.clearPostForm()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},getExportList(){
            if(this.$p.permissionChecker('memberManageListExport') && this.loading == false){
                this.loading = true

                this.postData.data = JSON.stringify(this.submitForm)
                var result = this.$m.postMethod('management/user/member/exportList',this.postData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.fileList = data.fileList
                        this.modalList.exportList = true
                    }
                    this.loading = false
                })
            }
        },exportDelete(id) {
            if(this.$p.permissionChecker('memberManageListExport') && this.loading == false){
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
                        var result = this.$m.postMethod("management/user/member/DBexportDelete", this.postData);
                        result.then((value) => {
                            var data = value.data;
                            if (value.valid) {
                                this.$message({
                                    type: "success",
                                    message: data.returnMsg
                                });
                                this.fileList = data.fileList

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
		},paginationLoginChange(value){
			if(value.page != ""){
				this.searchLoginForm.pagination = value.page
			}

			if(value.limit != ""){
				this.searchLoginForm.limit = value.limit
			}

			this.loginInitial()
		},transactionPaginationChange(value){
			if(value.page != ""){
				this.transactionSearchForm.pagination = value.page
			}

			if(value.limit != ""){
				this.transactionSearchForm.limit = value.limit
			}

			this.transactionInitial()
		},clearSearchForm(){
			this.searchData = Object.assign({}, searchForm)
			this.$m.setItem('storeAjaxTableDetail', JSON.stringify(this.searchData))

			this.initial()
		},initialImage(){
			this.notificationForm.img_url = this.defaultImage;
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			document.getElementById('file').value = ''
		},openImage(){
			this.openImageDialog = true;
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
		},closeImageDialog(data) {
			this.openImageDialog = data;
		},getImageDialog(data){
			this.notificationForm.img_url = data.path;
			this.openImageDialog = false;
		},getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = this.$t('general.total');
					return;
				}

				if(index == 2){
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = parseFloat(sums[index]).toFixed(2)
					} else {
						sums[index] = '';
					}
				}else{
					return;
				}
			});

			return sums;
		},transactionGetSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = this.$t('general.total');
					return;
				}

				if(index >= 4 && index <= 7){
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = parseFloat(sums[index]).toFixed(2)
					} else {
						sums[index] = '';
					}
				}else{
					return;
				}
			});

			return sums;
		},handleSelectionChange(selection){
			this.selectedLogin = selection.map((row) => row.login);
			this.selectedLogin = this.selectedLogin.join(',')
		},copySelected(){
			try {
                this.$message({showClose: true,message: this.$t('msg.msg_copy_success'),type: 'success'});
            } catch (err) {
            }
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.getInitial()
	}
}
</script>
