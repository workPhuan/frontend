<template>
	<div class="page-container">
		<div class="page-header">
			<label>
				<i class="fa-solid fa-arrow-right-to-bracket pe-2"></i> {{$t('menu.app_tools_package')}}
			</label>
			<div class="page-toolbar">
				<el-button class="custom-button plain" @click="getAddRow()" :loading="loading" v-if="$p.permissionChecker('toolPackageAdd')">{{$t('menu.app_tools_package_add')}}</el-button>
				<el-button class="custom-button plain" @click="deleteRow('multiple')" :loading="loading" v-if="$p.permissionChecker('toolPackageDelete')">{{$t('menu.app_tools_package_delete')}}</el-button>
			</div>
		</div>

		<div class="page-body p-3">
			<el-card shadow="never">
				<div class="page-filter">
					<legend>{{$t('mix.table_filter')}}</legend>
					<div class="p-3 d-flex flex-wrap">
						<el-input class="custom-input fixed-width-200 m-2" v-model="searchData.name" :placeholder="$t('mix.table_please_enter')+$t('mix.table_package_name')" @keyup.enter.native="initial()">
							<template #prepend>
								<label>{{$t('mix.table_package_name')}}</label>
							</template>
						</el-input>

						<el-select class="custom-input fixed-width-200 m-2" v-model="searchData.status" :placeholder="$t('mix.table_status')" clearable @change="initial()">
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
								<el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="statusRow(scope.row)" :disabled="($p.permissionChecker('toolPackageEdit')) ? false : true"></el-switch>
							</template>

							<template v-else-if="title.prop == 'name'" #default="scope">
								<div class="d-flex align-items-center">
									<img :src="scope.row.img_url" class="w-r-2 h-auto me-2"/>
									<div class="d-flex flex-column">
										<p class="p-0 m-0">{{scope.row[title.prop]}}</p>
										<small class="text-muted is-hidden-mobile">{{scope.row.code}}</small>
									</div>
								</div>
							</template>

							<template v-else-if="title.prop == 'action'" #default="scope">
								<el-button v-if="$p.permissionChecker('toolPackageEdit')" class="custom-button primary m-1" @click="getEditRow(scope.row.id)">{{$t('button.edit')}}</el-button>
								<el-button v-if="$p.permissionChecker('toolPackageDelete')" class="custom-button danger m-1" @click="deleteRow(scope.row.id)">{{$t('button.delete')}}</el-button>
							</template>
						</el-table-column>
					</template>
				</el-table>

				<pagination class="mt-3" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @paginationChange="paginationChange"/>
			</el-card>
		</div>

        <el-dialog v-model="modalList.addRow" :title="$t('menu.app_tools_package_add')" class="dialog-md" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3 d-flex flex-column">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_file')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
						</div>
						<div class="upload-selected align-items-center" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}<br/>{{imagePickerFileSize}}</div>
                            <!--div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div-->
                            <el-button class="custom-button success font-8 pt-3 pb-3" v-if="imagePickerFileUpload" @click="uploadFile()" :loading="loading">{{$t('button.uploadinstant')}}</el-button>
                            <el-button class="custom-button danger font-8 pt-3 pb-3" @click="initialImage()" :loading="loading"><i class="fa-light fa-xmark"></i>  </el-button>
						</div>

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="imageChange(index)"/>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="Object.keys(fileDetail).length !== 0">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_file')}}</label>
                        <div class="d-flex align-items-center">
                            <el-input class="custom-input mt-1" :id="'file-url'" v-model="fileDetail.url" readonly :placeholder="$t('mix.table_file')" disabled/>
                            <el-button class="custom-button primary ms-3" @click="copy(fileDetail.url),copyInput()">{{$t('button.copy')}}</el-button>
                        </div>
                    </el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_img_url')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.img_url" :placeholder="$t('mix.table_img_url')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sales_value" :precision="8" :min="0" :placeholder="$t('mix.table_price')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_period')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.period" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<!-- <el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.addRow" @change="imageChange(index)"/>
					</el-col> -->

					<el-col :sm="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>

					<el-col :sm="24" :md="12" class="mb-3" v-for="item in attributeList" :key="item.id">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span>{{ item.name }}</label>
						<el-input class="custom-input mt-1" v-model="postForm.attribute_list[item.id]" :placeholder="item.name" />
						<span class="text-danger">*{{ item.description }}</span>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')" />
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>

				<el-row :gutter="20" class="mt-4">
					<el-col :span="24" class="mb-3">
						<template v-if="postForm.multiple_language === 0">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_name')" />

							<label class="mt-4 text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
							<Tinymce v-model="postForm.single_description" class="my_editor" :disabled="loading"/>
						</template>

						<template v-else>
							<el-tabs type="border-card" class="mt-3 mb-4">
								<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
									<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
									<el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />

									<label class="mt-4 text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
									<Tinymce v-model="postForm.description[item.id]" class="my_editor" :disabled="loading"/>
								</el-tab-pane>
							</el-tabs>
						</template>
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

		<el-dialog v-model="modalList.editRow" :title="$t('menu.app_tools_package_edit')" class="dialog-md" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3 d-flex flex-column">
						<label class="text-theme font-8 fw-bold">{{$t('mix.table_file')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
						</div>
						<div class="upload-selected align-items-center" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}<br/>{{imagePickerFileSize}}</div>
                            <!--div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div-->
                            <el-button class="custom-button success font-8 pt-3 pb-3" v-if="imagePickerFileUpload" @click="uploadFile()" :loading="loading">{{$t('button.uploadinstant')}}</el-button>
                            <el-button class="custom-button danger font-8 pt-3 pb-3" @click="initialImage()" :loading="loading"><i class="fa-light fa-xmark"></i>  </el-button>
						</div>

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="imageChange(index)"/>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="Object.keys(fileDetail).length !== 0">
                        <label class="text-theme font-8 fw-bold">{{$t('mix.table_file')}}</label>
                        <div class="d-flex align-items-center">
                            <el-input class="custom-input mt-1" :id="'file-url'" v-model="fileDetail.url" readonly :placeholder="$t('mix.table_file')" disabled/>
                            <el-button class="custom-button primary ms-3" @click="copy(fileDetail.url),copyInput()">{{$t('button.copy')}}</el-button>
                        </div>
                    </el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_img_url')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.img_url" :placeholder="$t('mix.table_img_url')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_code')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.code" :placeholder="$t('mix.table_code')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_price')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sales_value" :precision="8" :min="0" :placeholder="$t('mix.table_price')" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_period')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.period" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_sort')}}</label>
						<el-input-number class="custom-input mt-1 w-100" v-model="postForm.sort" :min="0"/>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_status')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.status">
							<el-option :label="$t('mix.table_enabled')" :value="1">{{$t('mix.table_enabled')}}</el-option>
							<el-option :label="$t('mix.table_disabled')" :value="0">{{$t('mix.table_disabled')}}</el-option>
						</el-select>
					</el-col>

					<!-- <el-col :span="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_image')}}</label>
						<div class="upload-frame pointer" @click="openImage()">
							<i class="fa-duotone fa-cloud-arrow-up upload-icon"></i>
							<div class="upload-text">{{$t('msg.msg_upload_2')}}</div>
							<small class="text-danger">* {{$t('msg.msg_upload_edit')}}</small>
						</div>
						<div class="upload-selected" v-if="imagePickerFileUrl">
							<el-image class="upload-display-image" fit="fill" :src="imagePickerFileUrl"></el-image>
							<div class="upload-selected-name">{{imagePickerFile.name}}</div>
							<div class="upload-selected-cancel pointer" @click="initialImage()"><i class="fa-light fa-xmark"></i></div>
						</div>

						<input type="file" id="file" accept=".png,.jpg,.jpeg,.webp,.gif" style="display:none" v-if="modalList.editRow" @change="imageChange(index)"/>
					</el-col> -->

					<el-col :sm="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>

					<el-col :sm="24" :md="12" class="mb-3" v-for="item in attributeList" :key="item.id">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span>{{ item.name }}</label>
						<el-input class="custom-input mt-1" v-model="postForm.attribute_list[item.id]" :placeholder="item.name" />
						<span class="text-danger">*{{ item.description }}</span>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<hr class="border-dotted" />
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_language')}}</label>
						<el-select class="custom-input w-100 mt-1" v-model="postForm.multiple_language">
							<el-option :label="$t('mix.table_single_language')" :value="0">{{$t('mix.table_single_language')}}</el-option>
							<el-option :label="$t('mix.table_multiple_language')" :value="1">{{$t('mix.table_multiple_language')}}</el-option>
						</el-select>
					</el-col>

					<el-col :sm="12" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_remark')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.remark" :placeholder="$t('mix.table_remark')" />
					</el-col>

					<el-col :sm="12" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>

				<el-row :gutter="20" class="mt-4">
					<el-col :span="24" class="mb-3">
						<template v-if="postForm.multiple_language === 0">
							<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
							<el-input class="custom-input mt-1" v-model="postForm.single_name" :placeholder="$t('mix.table_name')" />

							<label class="mt-4 text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
							<Tinymce v-model="postForm.single_description" class="my_editor" :disabled="loading"/>
						</template>

						<template v-else>
							<el-tabs type="border-card" class="mt-3 mb-4">
								<el-tab-pane v-for="item in languageList" :key="item.id" :item="item" :label="item.name">
									<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
									<el-input class="custom-input mt-1" v-model="postForm.name[item.id]" :placeholder="$t('mix.table_name')" />

									<label class="mt-4 text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_description')}}</label>
									<Tinymce v-model="postForm.description[item.id]" class="my_editor" :disabled="loading"/>
								</el-tab-pane>
							</el-tabs>
						</template>
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
import Tinymce from '@/components/tinymce/index.vue'
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
			tableData: [],
			openImageDialog: false,
			total: 0,
			errors: [],
			submitForm: {
				id:'',
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
				align:'left'
            },{
                prop:"sales_value",
                label:this.$t('mix.table_value'),
                width:'100',
            },{
                prop:"period",
                label:this.$t('mix.table_period'),
                width:'100',
			},{
                prop:"remark",
                label:this.$t('mix.table_remark'),
                width:'150',
			},{
                prop:"sort",
                label:this.$t('mix.table_sort'),
                width:'100',
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
				code:'',
				period:0,
				sales_value:0,
				sort: 10,
				img_url: '',
				inactive_img_url: '',
				status: 1,
				single_name:'',
				single_description:'',
				multiple_language: 0,
				name:[],
				description:[],
				selectedIds: [],
				attribute_list: {},
			},
            languageList:JSON.parse(this.$m.getItem('languageList')),
			modalList:{},
			attributeList:[],
			securityCheck: 0,
			imagePickerFile: '',
			imagePickerFileUrl: '',
			imagePickerFileUpload:true,
			fileDetail:{},
		}
	},
	methods:{
		initial(){
			this.loading = true
			this.postData.data = JSON.stringify(this.searchData)
			var result = this.$m.postMethod('app/tools/package/ajaxTable',this.postData)
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
			this.postForm.period = 0
			this.postForm.img_url = ''
			this.postForm.inactive_img_url = ''
			this.postForm.sales_value = 0
			this.postForm.sort = 10
			this.postForm.status = 1
			this.postForm.multiple_language = 0
			this.postForm.selectedIds = []
			this.postForm.single_name = ''
			this.postForm.single_description = ''
			this.postForm.name = []
			this.postForm.description = []
			this.postForm.attribute_list = {}
			this.postForm.security = ''
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			this.imagePickerFileUpload = true
			if(done != undefined){
				done()
			}
		},getAddRow(){
			if(this.$p.permissionChecker('toolPackageAdd') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/package/add',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.attributeList = data.attributeList

						this.modalList.addRow = true
					}
					this.loading = false
				})
			}
		},addRow(){
			if(this.$p.permissionChecker('toolPackageAdd') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/package/DBadd',formData)
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
			if(this.$p.permissionChecker('toolPackageEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = id
				this.postData.data = JSON.stringify(this.submitForm)
				var result = this.$m.postMethod('app/tools/package/edit',this.postData)
				result.then((value) => {
					var data = value.data

					if(value.valid){
						this.postForm = data.thisDetail
						this.postForm.multiple_language = parseInt(data.thisDetail.multiple_language)
                        this.postForm.status = parseInt(data.thisDetail.status)

                        // var name = '';
                        // name = this.decoder(JSON.stringify(this.postForm.name))
						// this.postForm.name = JSON.parse(title)

                        var description = '';
						description = this.$m.htmlDecoder(JSON.stringify(this.postForm.description))
						this.postForm.description = JSON.parse(description)

                        // this.postForm.single_name = this.decoder(this.postForm.single_name)
						this.postForm.single_description = this.$m.htmlDecoder(this.postForm.single_description)
						this.attributeList = data.attributeList

						this.modalList.editRow = true
					}
					this.loading = false
				})
			}
		},editRow(){
			if(this.$p.permissionChecker('toolPackageEdit') && this.loading == false){
				this.loading = true
				this.preloader(true)

				var formData = new FormData()
				formData.append('file',this.imagePickerFile)
				formData.append('data',JSON.stringify(this.postForm))
				formData.append('language',this.postData.language)

				var result = this.$m.postMethod('app/tools/package/DBedit',formData)
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
			if(this.$p.permissionChecker('toolPackageEdit') && this.loading == false){
				this.loading = true
				this.submitForm.id = currentData.id;
				this.submitForm.status = currentData.status;
				this.postData.data = JSON.stringify(this.submitForm)

				var formData = new FormData();
				formData.append('data', this.postData.data);
				formData.append('language', this.postData.language);

				var result = this.$m.postMethod('app/tools/package/DBstatus',formData)
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
			if(this.$p.permissionChecker('toolPackageDelete') && this.loading == false){
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
						var result = this.$m.postMethod("app/tools/package/DBdelete", this.postData);
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
		},initialImage(){
			this.imagePickerFile = ''
			this.imagePickerFileUrl = ''
			this.imagePickerFileUpload = true
			document.getElementById('file').value = ''
		},uploadFile(){
            if(this.$p.permissionChecker('toolPackageUpload')){
                this.loading = true
                this.preloader(true)
                this.fileDetail = {}

                var formData = new FormData()
                formData.append('file',this.imagePickerFile)

                var result = this.$m.postMethod('app/tools/package/DBupload',formData)
                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.initialImage()
                        this.fileDetail = data.fileDetail
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })

            }
		},openImage(){
			document.getElementById('file').click()
		},imageChange(){
			this.imagePickerFile = document.getElementById('file').files[0];
			this.imagePickerFileUrl = URL.createObjectURL(document.getElementById('file').files[0])
			this.imagePickerFileSize = this.byteFormat(this.imagePickerFile.size,'KB')
            let maxSize = 30 * 1024 * 1024;
            if (this.imagePickerFile.size > maxSize) {
                this.imagePickerFileSize = '文件不可大于'+this.byteFormat(maxSize,'MB');
                this.imagePickerFileUpload = false
            }
		},handleSelectionChange(selection){
			this.postForm.selectedIds = selection.map((row) => row.id);
		},decoder (str) {
			var value = str;
			if(value){
				value = str.replace(/&quot/g,"'")
			}

			return value
		},byteFormat(data,to){
            const const_term = 1024;

            // Convert the values and concatenate
            // the appropriate unit
            if (to === "KB") {
                return (data / const_term).toFixed(3) + "KB";
            } else if (to === "MB") {
                return (data / const_term ** 2).toFixed(3) + "MB";
            } else if (to === "GB") {
                return (data / const_term ** 3).toFixed(3) + "GB";
            } else if (to === "TB") {
                return (data / const_term ** 4).toFixed(3) + "TB";
            } else {
                return data;
            }
        },copyInput(){
            try {
                this.$message({showClose: true,message: this.$t('msg.msg_copy_success'),type: 'success'});
            } catch (err) {
                // alert('Oops, unable to copy');
            }
		}
	},created(){
        this.postData.language = this.$m.getItem('currentLang')??'en'
		this.securityCheck = this.$m.getItem('securityCheck')
		this.initial()
	}
}
</script>
