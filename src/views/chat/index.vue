<template>
    <div class="custom-size">
        <div class="d-flex align-items-center p-2 font-13">
			<img height="30px" width="auto" :src="$m.getItem('logoImage')"/>
            <p class="font-weight-bold ms-2">
            <!-- <p class="font-weight-bold ms-2" @click="uploadLog()"> -->
				{{$t('mix.table_customer_service')}}
			</p>
			<el-button class="ms-3 pointer" @click="refreshZego()">{{ $t('mix.table_refresh_room_list') }} <i class="fa-duotone fa-arrows-rotate ms-2"></i></el-button>
			<div v-if="0" class="ms-auto font-10 pointer" @click="getEditUserName()">{{ currentUserName }} <i class="fa-regular fa-pen text-primary"></i></div>
			<div class="ms-auto font-10 pointer">ID: {{ agentID }}</div>
			<div class="ps-3 pb-1 pointer" @click="languagePanel='languages'">
				<!-- <div class="bg-white border-round-10 p-1"> -->
					<img :src="$m.getImageUrl('flag/'+$m.getItem('currentLang')+'.svg')" class="header-langauge-image">
				<!-- </div> -->
			</div>
			<div class="ps-3 pe-3 pointer">
				<el-dropdown>
					<span class="el-dropdown-link font-10" style="padding-top: 0.35rem;">
						{{accountDetail.username}}
						<i class="ps-2 fa-solid fa-caret-down font-10"></i>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-if="$p.permissionChecker('accountPassword')" @click="modalList.passwordRow = true"><i class="fa-solid fa-shield pe-2"></i>{{$t('menu.common_account_password')}}</el-dropdown-item>
							<el-dropdown-item divided @click="logout()"><i class="fa-solid fa-person-running pe-2"></i>{{$t('button.logout')}}</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
        </div>
        <div class="custom-bottom-padding chat custom-page-bg d-flex">
            <vue-advanced-chat
                class="chat-style w-100"
                height="calc(100vh - 50px)"
                theme="light"
				accepted-files="*"
				multiple-files="false"
                :responsive-breakpoint="500"
                :current-user-id="currentUserID"
                :auto-scroll="JSON.stringify(autoScroll)"
                :text-messages="JSON.stringify(textMessage)"
				:styles="JSON.stringify(defaultThemeStyles)"
				:menu-actions="JSON.stringify(menuAction)"

                :rooms="JSON.stringify(rooms)"
				:loading-rooms="loadingRooms"
                :rooms-loaded="roomLoaded"
				:room-actions="JSON.stringify(roomAction)"
				:room-message="defaultText"

                :messages="JSON.stringify(messages)"
                :messages-loaded="messagesLoaded"
				:message-actions="JSON.stringify(messageAction)"

				:show-audio="false"
				:show-reaction-emojis="false"
				:show-add-room="false"
				:load-first-room="false"

                @send-message="sendMessage($event.detail[0])"
                @fetch-messages="setConversation($event.detail[0])"
				@fetch-more-rooms="queryMoreConversationList()"
				@message-action-handler="messageActionHandler($event.detail[0])"
				@menu-action-handler="menuActionHandler($event.detail[0])"
				@room-action-handler="roomActionHandler($event.detail[0])"
				@open-file="openFile($event.detail[0])"
            >
            </vue-advanced-chat>
			<div class="chat-info" v-if="conv != ''" v-loading="loading">
				<div class="chat-info-tab">
					<el-tabs v-model="tab" stretch>
						<el-tab-pane :label="$t('mix.table_guest_info')" name="guest">
							<div>
								<p class="mb-3">
									<i class="fa-regular fa-signal-bars me-1 font-10"></i> 
									{{ $t('mix.table_online_state') }}: 
									<span v-if="isOnline" class="text-success font-weight-bold">{{ $t('mix.table_online') }}</span>
									<span v-else class="text-danger font-weight-bold">{{ $t('mix.table_offline') }}</span>
								</p>
								<p class="mb-3"><i class="fa-regular fa-location-arrow me-1 font-10"></i> {{ $t('mix.table_ip_address') }}: {{ memberInfo.last_active_ip }}</p>
								<p class="mb-3"><i class="fa-regular fa-location me-1 font-10"></i> {{ $t('mix.table_city') }}: {{ memberInfo.location }}</p>
								<p class="mb-3"><i class="fa-regular fa-clock me-1 font-10"></i> {{ $t('mix.table_first_access') }}: {{ memberInfo.created_at }}</p>
								<p class="mb-3"><i class="fa-regular fa-clock me-1 font-10"></i> {{ $t('mix.table_last_access') }}: {{ memberInfo.last_active }}</p>
								<p class="mb-3" v-if="0"><i class="fa-regular fa-user me-1 font-10"></i> {{ $t('mix.table_affiliate_id') }}: {{ memberInfo.affiliate_id }}</p>
							</div>
						</el-tab-pane>
						<el-tab-pane :label="$t('mix.table_blacklist')" name="blacklist" v-if="$p.permissionChecker('chatManageBan') && 0">
							<div class="d-flex align-items-center justify-content-between">
								<lable>{{ $t('mix.table_ban_chat') }}</lable>
								<el-switch v-model="postFormBan.is_ban_chat" class="ml-2" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #909399" :active-value="1" :inactive-value="0" @change="editBanRow()"/>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="chat-info-reply my-3">
					<div class="d-flex justify-content-between">
						<div class="font-weight-bold">{{ $t('mix.table_quick_reply') }}</div>
						<div v-if="$p.permissionChecker('chatManageAddCategory')" class="text-primary pointer" @click="modalList.addGroupRow = true"><i class="fa-light fa-plus"></i> {{ $t('mix.table_add_group') }}</div>
					</div>
					<div class="mt-3 text-black">
						<el-collapse v-model="collapse">
							<el-collapse-item v-for="item in replyList" :title="item.name" :name="item.id" custom-class="pb-0">
								<div v-for="list in item.message_list" class="reply-item pointer" @click="defaultText = list.message">
									<div><i class="fa-solid fa-message-text me-1"></i> {{ list.message }}</div>
									<div class="d-flex align-items-center">
										<div class="px-1 me-2" v-if="$p.permissionChecker('chatManageEditReply')" @click="getEditReplyRow(list)"><i class="fa-regular fa-pen text-primary"></i></div>
										<div class="px-1 me-2" v-if="$p.permissionChecker('chatManageDeleteReply')" @click="deleteReplyRow(list.id)"><i class="fa-solid fa-xmark font-10 text-danger"></i></div>
									</div>
								</div>
								<div class="mt-3 font-7 d-flex">
									<div v-if="$p.permissionChecker('chatManageAddReply')" class="text-primary pointer me-4" @click="postFormReply.category_id = item.id, modalList.addReplyRow = true"><i class="fa-light fa-plus"></i> {{ $t('mix.table_add_reply') }}</div>
									<div v-if="$p.permissionChecker('chatManageDeleteCategory')" class="text-danger pointer" @click="deleteCategoryRow(item.id)"><i class="fa-light fa-trash"></i> {{ $t('mix.table_delete_group') }}</div>
								</div>
							</el-collapse-item>
						</el-collapse>
					</div>
				</div>
			</div>
		</div>

		<el-dialog v-model="modalList.addGroupRow" :title="$t('mix.table_add_group')" class="dialog-xs" :before-close="clearCustomPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postFormReply.name" :placeholder="$t('mix.table_name')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postFormReply.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button primary font-8 pt-3 pb-3" @click="addGroupRow()" :loading="loading">{{$t('button.submit')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addGroupRow = false,clearCustomPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.addReplyRow" :title="$t('mix.table_add_reply')" class="dialog-xs" :before-close="clearCustomPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_message')}}</label>
						<el-input class="custom-input mt-1" v-model="postFormReply.message" :placeholder="$t('mix.table_message')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postFormReply.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button primary font-8 pt-3 pb-3" @click="addReplyRow()" :loading="loading">{{$t('button.submit')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.addReplyRow = false,clearCustomPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.editReplyRow" :title="$t('mix.table_edit_reply')" class="dialog-xs" :before-close="clearCustomPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_message')}}</label>
						<el-input class="custom-input mt-1" v-model="postFormReply.message" :placeholder="$t('mix.table_message')" />
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postFormReply.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button primary font-8 pt-3 pb-3" @click="editReplyRow()" :loading="loading">{{$t('button.submit')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.editReplyRow = false,clearCustomPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>
		
		<el-dialog v-model="modalList.editUserName" :title="$t('mix.table_edit_name')" class="dialog-xs" :before-close="clearCustomPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_name')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.name" :placeholder="$t('mix.table_name')" :loading="loading"/>
					</el-col>

					<el-col :sm="24" class="mb-3" v-if="securityCheck == 1">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_security')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.security" show-password :placeholder="$t('mix.table_security')" />
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<div class="d-flex justify-content-center align-item-center">
					<el-button class="custom-button primary font-8 pt-3 pb-3" @click="editUserName()" :loading="loading">{{$t('button.submit')}}</el-button>
					<el-button class="custom-button danger font-8 pt-3 pb-3" @click="modalList.editUserName = false,clearCustomPostForm()">{{$t('button.close')}}</el-button>
				</div>
			</template>
        </el-dialog>

		<el-dialog v-model="modalList.passwordRow" :title="$t('menu.common_account_password')" :before-close="clearPostForm">
			<el-form label-position="top" label-width="auto" @submit.native.prevent>
				<el-row :gutter="20">
					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_username')}}</label>
						<el-input class="custom-input mt-1" v-model="accountDetail.username" :placeholder="$t('mix.table_username')" disabled/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_current_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.current_password" :placeholder="$t('mix.table_current_password')" show-password />
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_password" :placeholder="$t('mix.table_new_password')" show-password/>
					</el-col>

					<el-col :sm="24" class="mb-3">
						<label class="text-theme font-8 fw-bold"><span class="text-danger">*</span> {{$t('mix.table_new_password_confirm')}}</label>
						<el-input class="custom-input mt-1" v-model="postForm.new_password_confirm" :placeholder="$t('mix.table_new_password_confirm')" show-password />
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

		<Language/>
	</div>
</template>

<script setup>
import Language from '@/components/language/index.vue'
import { currentLanguage,accountDetail,languagePanel } from '@/system/store/state.js'
import {ZIM} from 'zego-zim-web'
import { generateToken,generateSignature } from '@/components/zego-chat/utils.js'
</script>

<script>
import {defaultThemeStyles} from '@/views/chat/style.js'
import { register } from 'shiro-chat'
import moment from 'moment'
import { useClipboard } from '@vueuse/core'
import { toRaw } from "vue"
register()
const {copy} = useClipboard()

export default{
    inject:['preloader','notification'],
    data(){
        return{
            modalList:{},
			postData: {
				data: '',
				language: ''
			},
			submitForm:{
                popupnews: 0,
				searchGroupText:'',
				searchGroupMemberText:'',
			},
			postForm: {
				id:'',
			},
			postFormPassword:{
				current_password:'',
				new_password:'',
				new_password_confirm:'',
			},
			postFormBan: {
				system_id:'',
				is_ban_chat:'',
			},
			postFormReply: {
				id:'',
				category_id:'',
				name:'',
				message:'',
			},
			postFormZego: {
				groupID:'',
				groupMemberID:'',
				muteDuration: '',
			},
			postFormApi:{
				package_id:'',
				wallet_id:'',
			},
			packageList:[],
			walletList:[],
			newAccount:false,
            isChat: this.$m.getItem('isChat')??'false',
            currentUserName: this.$m.getItem('zegoUserName')??'',
            currentUserID: this.$m.getItem('zegoUserID')??'',
			// 1: owner,2: admin,3: member
            currentMemberRole: 3,
			rooms: [],
			messages: [],
			messagesLoaded: false,
			messageLoadLimit: 50,
            autoScroll: {
                send: {new: true,newAfterScrollUp:true},
                receive: {new: true,newAfterScrollUp: false}
            },
            textMessage:{
                ROOMS_EMPTY: this.$t('mix.table_no_data'),
                ROOM_EMPTY: this.$t('mix.table_no_data'),
                NEW_MESSAGES: this.$t('mix.table_new_message'),
                MESSAGE_DELETED: this.$t('mix.table_deleted_message'),
                MESSAGES_EMPTY: this.$t('mix.table_no_data'),
                CONVERSATION_STARTED: this.$t('mix.table_conversation_started')+' :',
                TYPE_MESSAGE: this.$t('mix.table_type_your_message'),
                SEARCH: this.$t('mix.table_search'),
                IS_ONLINE: this.$t('mix.table_is_online'),
                LAST_SEEN: this.$t('mix.table_last_seen')+' ',
                IS_TYPING: this.$t('mix.table_is_typing')+'...',
                CANCEL_SELECT_MESSAGE: this.$t('mix.table_cancel_select_message')
            },
			menuAction:[],
			roomAction:[],
			messageAction:[
				{ name: 'replyMessage', title: this.$t('button.reply') },
				{ name: 'copyMessage', title: this.$t('button.copy') },
			],
			queryGroupMemberConfig:{ nextFlag: 0, count: 500 },
			conversationInital:true,
			conversationIsOpen:false,
			conv:'',
			groupList:'',
			groupMemberResultList:'',
			groupMemberDisplayList:'',
			banChatTimeList:[
				{ code: '0', name: this.$t('mix.table_ban_chat_end') },
				{ code: '300', name: '5 '+this.$t('mix.table_minute') },
				{ code: '900', name: '15 '+this.$t('mix.table_minute') },
				{ code: '1800', name: '30 '+this.$t('mix.table_minute') },
				{ code: '3600', name: '60 '+this.$t('mix.table_minute') },
				{ code: '5400', name: '90 '+this.$t('mix.table_minute') },
				{ code: '7200', name: '120 '+this.$t('mix.table_minute') },
				{ code: '-1', name: this.$t('mix.table_forever') },
			],
			memberList:[],
			requestJoinGroupList:[],
			requestJoinGroupLastID:[],
			requestJoinGroupLoadMore:[],
			messageSendingID:'',
			defaultText:'',
			pageSize:20,
			pageNumber:1,
			isOnline:false,
			tab:'guest',
			collapse:'',
			replyList: [],
			memberInfo: {},
			loading: false,
			loadingRooms: true,
			roomLoaded: false,
			onlineInterval: '',
			lastConversation: null,
			conversationNum: 12,
			agentID: '',
        }
    },methods:{
		clearPostForm(done){
			this.submitForm.name = ''
			this.submitForm.searchGroupMemberText = ''
            this.postForm.user_id = ''
			this.postForm.to_user_id = ''
            this.postForm.group_id = ''
            this.postForm.role_id = ''
            this.postForm.username = ''
			this.postForm.lastID = ''
			this.postForm.loadMore = ''
			this.postForm.name = ''
			this.postFormPassword.new_password = ''
			this.postFormPassword.new_password_confirm = ''
			this.postFormPassword.current_password = ''
			this.pageNumber = 1
			
			this.requestJoinGroupList = []
			this.requestJoinGroupLastID = ''
			this.requestJoinGroupLoadMore = ''
			if(done != undefined){
				done()
			}
		},
		clearCustomPostForm(done){
			this.postFormBan.system_id = ''
			this.postFormBan.is_ban_chat = ''
			this.postFormReply.id = ''
			this.postFormReply.name = ''
			this.postFormReply.message = ''
			this.postFormReply.category_id = ''

			this.postForm.name = ''

			if(done != undefined){
				done()
			}
		},
		initial(){
			this.getInitial()
			this.initialZegoToken()
			if(this.onlineInterval != ''){
				clearInterval(this.onlineInterval)
			}
			this.onlineInterval = setInterval(()=>{
				if(this.conv != ''){
					this.getOnlineStatus()
				}
			},10000)
		},
		getInitial(){
			var form = {}
			this.postData.data = JSON.stringify(form)
			var result = this.$m.postMethod('chat/manage/lists/reply',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.agentID = data.agentID
					this.replyList = data.replyList
					if(data.replyList.length > 0){
						this.collapse = data.replyList[0].id
					}
				}
			})
		},editBanRow(){
			if(this.$p.permissionChecker('chatManageBan') && this.loading == false){
				this.loading = true

				this.postData.data = JSON.stringify(this.postFormBan)
				var result = this.$m.postMethod('chat/manage/lists/DBban',this.postData)
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
					
					this.loading = false
				})
			}
		},addGroupRow(){
			if(this.$p.permissionChecker('chatManageAddCategory') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postFormReply)
				var result = this.$m.postMethod('chat/manage/lists/DBaddCategory',this.postData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.replyList = data.replyList
						this.modalList.addGroupRow = false
						this.clearCustomPostForm()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					this.loading = false
				})
			}
		},
		deleteCategoryRow(id){
			if(this.$p.permissionChecker('chatManageDeleteCategory') && this.loading == false){
				this.loading = true
				var form = {}
				form.id = id
				this.postData.data = JSON.stringify(form)
				var result = this.$m.postMethod('chat/manage/lists/DBdeleteCategory',this.postData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.replyList = data.replyList
						this.clearCustomPostForm()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					this.loading = false
				})
			}
		},
		addReplyRow(){
			if(this.$p.permissionChecker('chatManageAddReply') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postFormReply)
				var result = this.$m.postMethod('chat/manage/lists/DBaddReply',this.postData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.replyList = data.replyList
						this.modalList.addReplyRow = false
						this.clearCustomPostForm()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					this.loading = false
				})
			}
		},
		getEditReplyRow(message){
			this.postFormReply.id= message.id
			this.postFormReply.message= message.message
			this.modalList.editReplyRow = true
		},
		editReplyRow(){
			if(this.$p.permissionChecker('chatManageEditReply') && this.loading == false){
				this.loading = true
				this.postData.data = JSON.stringify(this.postFormReply)
				var result = this.$m.postMethod('chat/manage/lists/DBeditReply',this.postData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.replyList = data.replyList
						this.modalList.editReplyRow = false
						this.clearCustomPostForm()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					
					this.loading = false
				})
			}
		},
		deleteReplyRow(id){
			if(this.$p.permissionChecker('chatManageDeleteReply') && this.loading == false){
				this.loading = true
				var form = {}
				form.id = id
				this.postData.data = JSON.stringify(form)
				var result = this.$m.postMethod('chat/manage/lists/DBdeleteReply',this.postData)
				result.then((value) => {
					var data = value.data
					if(value.valid){
						this.replyList = data.replyList
						this.clearCustomPostForm()
					}else{					
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
					this.loading = false
				})
			}
		},
		refreshZego(){
			this.$message({
				message: this.$t('mix.table_refresh_success'),
				type: 'success',
				duration: 1500
			})
			// if(this.conversationIsOpen==false){
			this.memberInfo = {}
			this.conv = ''
			this.lastConversation = null
			this.roomLoaded = false
			this.queryConversationList()
			// }
		},
		initialZegoToken(){
			var token = this.$m.getItem('zegoToken') ?? '';
			if(token != ''){
				this.initialZego()
			}else{
				token = generateToken(this.currentUserID)
				this.$m.setItem('zegoToken',token)
				setTimeout(()=>{
					this.initialZego()
				}, 500)
			}
		},
		initialZego(){
			var token = this.$m.getItem('zegoToken') ?? '';
			if(token != ''){
				if(this.currentUserName == ''){
					this.currentUserName = '在线客服'
					this.$m.setItem('zegoUserName','在线客服')
				}
				const config = {
					userName: this.currentUserName,
					token: token,
					isOfflineLogin: false, 
				}

				ZIM.getInstance().login(this.currentUserID,config).then((res) => {
					this.initialEvent()
					this.queryConversationList()
				}).catch((error) => {
					if([6000121,6000111].includes(error.code)){
						this.$m.setItem('zegoToken','')
						ZIM.getInstance().logout()
						setTimeout(()=>{
							this.initialZegoToken()
						}, 500)
					}
					else if([6000106,6000103,6000107].includes(error.code)){
						this.$m.setItem('zegoToken','')
						setTimeout(()=>{
							this.initialZegoToken()
						}, 500)
					}
				})
			}else{
				this.initialZegoToken()
			}
		},
		initialEvent(){
			ZIM.getInstance().on('conversationTotalUnreadMessageCountUpdated',(zim,data) => {
				if(this.conversationIsOpen==false){
                	this.queryConversationList()
				}
            })

			ZIM.getInstance().on('receivePeerMessage',(zim, { messageList, fromConversationID }) => {
				if(this.conv == ''){
					this.notification(messageList[0].message)
				}
				if(this.conversationIsOpen){
					if(this.conv.conversationID != fromConversationID){
						this.notification(messageList[0].message)
					}
					this.receiveNewMessage(messageList,fromConversationID)
				}else{
					this.queryConversationList()
				}
			})

			ZIM.getInstance().on('receiveGroupMessage',(zim, { messageList, fromConversationID }) => {
				if(this.conv == ''){
					this.notification()
				}
				if(this.conversationIsOpen){
					if(this.conv.conversationID != fromConversationID){
						this.notification()
					}
					this.receiveNewMessage(messageList,fromConversationID)
				}else{
					this.queryConversationList()
				}
			})

			ZIM.getInstance().on('messageRevokeReceived',(zim, { messageList }) => {
				messageList.forEach((item) => {
					var getIndex = this.messages.findIndex(x => x.messageID == item.messageID)
					if(getIndex != -1){
						var getUsername = JSON.parse(item.revokeExtendedData)
						this.messages[getIndex].type = item.type
						this.messages[getIndex].system = 'true'
						this.messages[getIndex].content = this.$t('mix.table_massage_has_recall',{user:getUsername.username})
						this.messages = [...this.messages]
					}
				})
			})

			ZIM.getInstance().on('groupMemberInfoUpdated',(zim, { state, groupID, userList, operatedInfo }) => {
				if(groupID == this.conv.conversationID){
					userList.forEach((element) => {
						var getIndex = this.conv.users.findIndex(x => x._id == element.userID)
						if(getIndex != -1){
							this.conv.users[getIndex].memberRole = element.memberRole
							this.conv.users[getIndex].muteExpiredTime = element.muteExpiredTime

							if(element.userID == this.currentUserID){
								this.currentMemberRole = element.memberRole
								this.checkMenuAction()
							}
						}	
					})
					this.groupMemberResultList = this.conv.users
					this.pageNumber = 1
					this.groupMemberDisplayList = this.pagination(this.groupMemberResultList,this.pageSize,this.pageNumber)
				}
			})

			ZIM.getInstance().on('groupMemberStateChanged',(zim, { groupID, state, event, userList, operatedInfo }) => {
				if(state == 0){
					userList.forEach((element) => {
						if(element.userID == this.currentUserID){
							if(groupID == this.conv.conversationID){
								this.queryConversationList()
							}
						}else{
							if(groupID == this.conv.conversationID){
								this.conv.users.splice(this.conv.users.findIndex((i)=>{
									return i._id == element.userID
								}), 1)
								this.groupMemberResultList = this.conv.users
								this.pageNumber = 1
								this.groupMemberDisplayList = this.pagination(this.groupMemberResultList,this.pageSize,this.pageNumber)
							}
						}
					})
				}

				if(state == 1){
					userList.forEach((element) => {
						if(element.userID == this.currentUserID){
							if(this.conversationIsOpen==false){
								setTimeout(()=>{
									this.queryConversationList()
								},400)
							}
						}else{
							if(groupID == this.conv.conversationID){
								var roomUsers = []
								roomUsers.push({
									_id:element.userID,
									username:element.userName,
									memberRole:element.memberRole,
								})
								this.conv.users = [...roomUsers,...this.conv.users]
								this.groupMemberResultList = this.conv.users
								this.pageNumber = 1
								this.groupMemberDisplayList = this.pagination(this.groupMemberResultList,this.pageSize,this.pageNumber)
							}
						}
					})
				}
			})

			ZIM.getInstance().on('messageReceiptChanged',(zim, { infos }) => {
				infos.forEach((item) => {
					var getIndex = this.messages.findIndex(x => x._id == item.messageID)
					if(getIndex != -1){
						if(item.status == 2){
							this.messages[getIndex].distributed = true
							this.messages[getIndex].seen = true
						}
						this.messages = [...this.messages]
					}
				})
			})

			ZIM.getInstance().on('conversationMessageReceiptChanged',(zim, { infos }) => {
				infos.forEach((item) => {
					var getIndex = this.messages.findIndex(x => x._id == item.messageID)
					if(getIndex != -1){
						if(item.status == 2){
							this.messages[getIndex].distributed = true
							this.messages[getIndex].seen = true
						}
						this.messages = [...this.messages]
					}
				})
			})
		},
		pagination(array,page_size,page_number) {
			return array.slice((page_number - 1) * page_size, page_number * page_size);
		},
		changePagination(number){
			this.pageNumber = number
			this.groupMemberDisplayList = this.pagination(this.groupMemberResultList,this.pageSize,this.pageNumber)
		},
		toggleRoomList(options) {
			this.conversationIsOpen = false
			this.clearConversationUnreadMessage()
            this.queryConversationList()
		},
		closeAllDialog(){
			this.modalList.groupList = false
			this.modalList.groupMemberList = false
			this.modalList.inviteGroupMember = false
			this.modalList.banChatMember = false
			this.modalList.roleMember = false
		},
		queryConversationList() {
			this.loadingRooms = true
			this.closeAllDialog()
			var option = {
				count: this.conversationNum,
			}
            return ZIM.getInstance().queryConversationList(option).then((res) => {
				var roomList = []
				if(res.conversationList.length < this.conversationNum){
					this.roomLoaded = true
				}

				res.conversationList.forEach((item,index) => {
					if(item.isDisabled == false){
						var roomDetail = structuredClone(toRaw(item))
						roomDetail.roomId = item.conversationID
						roomDetail.roomName = item.conversationName
						//roomDetail.avatar = 'https://storage.dongfhtec.com/source/2024-07-31/HqLzhtIaZHjBMJwjgWOX9F4HEzhLl2m5jES8sLt5.png'
						roomDetail.users = []
						roomDetail.unreadCount = item.unreadMessageCount
						roomDetail.lastMessage = {
							_id: item.lastMessage.messageID,
							content: (item.lastMessage.message==''&&item.lastMessage.fileName!='')?this.$t('mix.table_media_file'):item.lastMessage.message,
							timestamp: this.$m.formatDate(item.lastMessage.timestamp),
							timestampOri: item.lastMessage.timestamp,
						}

						if(item.lastMessage.extendedData){
							var dataDetail = JSON.parse(item.lastMessage.extendedData)
							if(dataDetail.system){
								roomDetail.lastMessage.content = this.translateMessage(dataDetail.system)
							}
						}
						
						roomList.push(roomDetail)
					}
					if(index == (res.conversationList.length-1)){
						this.lastConversation = item
					}
				})
				this.rooms = roomList
				this.loadingRooms = false
            })
        },
		queryMoreConversationList() {
			this.loadingRooms = true
			this.closeAllDialog()
			var option = {
				count: this.conversationNum,
				nextConversation: this.lastConversation
			}
            return ZIM.getInstance().queryConversationList(option).then((res) => {
				if(res.conversationList.length < this.conversationNum){
					this.roomLoaded = true
				}
				res.conversationList.forEach((item,index) => {
					if(item.isDisabled == false){
						var roomDetail = structuredClone(toRaw(item))
						roomDetail.roomId = item.conversationID
						roomDetail.roomName = item.conversationName
						//roomDetail.avatar = 'https://storage.dongfhtec.com/source/2024-07-31/HqLzhtIaZHjBMJwjgWOX9F4HEzhLl2m5jES8sLt5.png'
						roomDetail.users = []
						roomDetail.unreadCount = item.unreadMessageCount
						roomDetail.lastMessage = {
							_id: item.lastMessage.messageID,
							content: (item.lastMessage.message==''&&item.lastMessage.fileName!='')?this.$t('mix.table_media_file'):item.lastMessage.message,
							timestamp: this.$m.formatDate(item.lastMessage.timestamp),
							timestampOri: item.lastMessage.timestamp,
						}

						if(item.lastMessage.extendedData){
							var dataDetail = JSON.parse(item.lastMessage.extendedData)
							if(dataDetail.system){
								roomDetail.lastMessage.content = this.translateMessage(dataDetail.system)
							}
						}
						
						this.rooms.push(roomDetail)
					}
					if(index == (res.conversationList.length-1)){
						this.lastConversation = item
					}
				})
				this.loadingRooms = false
            })
        },
        setConversation(options) {
			this.conversationIsOpen = true
			if(options.options){
				this.conversationInital = true
			}else{
				this.conversationInital = false
			}
			this.conv = options.room
			this.clearConversationUnreadMessage()
			this.checkMenuAction()
			if (this.conv.type == 0) {
				this.getInfo()
				this.queryUserInfo()
			} else if (this.conv.type == 2) {
				this.queryGroupMemberList()
			}
		},
		clearConversationUnreadMessage(){
			ZIM.getInstance().clearConversationUnreadMessageCount(this.conv.conversationID,this.conv.type)
		},
		queryUserInfo(){
			ZIM.getInstance().queryUsersInfo([this.conv.conversationID],{ isQueryFromServer: true }).then((res) => {
				this.rooms.forEach((item) => {
					if(item.conversationID == this.conv.conversationID){
						var roomUsers = []
						res.userList.forEach((element) => {
							roomUsers.push({
								_id:element.baseInfo.userID,
								username:element.baseInfo.userName,
							})
						})
						item.users = [...roomUsers,...item.users]
						this.conv.users = [...roomUsers,...this.conv.users]
					}
				})
				this.queryHistoryMessage()
			})
		},
		queryGroupMemberList(){
			ZIM.getInstance().queryGroupMemberList(this.conv.conversationID,this.queryGroupMemberConfig).then((res) => {
				this.queryGroupMemberConfig.nextFlag = res.nextFlag
				this.rooms.forEach((item) => {
					if(item.conversationID == this.conv.conversationID){
						var roomUsers = []
						res.userList.forEach((element) => {
							roomUsers.push({
								_id:element.userID,
								username:(element.userName=='')?element.userID:element.userName,
								memberRole:element.memberRole,
								muteExpiredTime:element.muteExpiredTime,
							})

							if(element.userID == this.currentUserID){
								this.currentMemberRole = element.memberRole
								this.checkMenuAction()
							}
						})
						item.users = [...roomUsers,...item.users]
						this.conv.users = [...roomUsers,...this.conv.users]
						this.groupMemberResultList = this.conv.users
						this.pageNumber = 1
						this.groupMemberDisplayList = this.pagination(this.groupMemberResultList,this.pageSize,this.pageNumber)
					}
				})
				
				if (res.nextFlag) {
					this.queryGroupMemberList()
				}else{
					this.queryHistoryMessage()
				}
			}).catch((error) => {
				if(error.code==6000521){
					this.$m.popupSingleErrorMessage(this.$t('mix.table_you_have_been_remove_group'),this)
				}else{
					this.$m.popupSingleErrorMessage(this.$t('mix.table_send_msg_error')+', ['+error.code+'] '+error.message,this)
				}
			})
		},
		queryHistoryMessage() {
            var config = { nextMessage:null,count: this.messageLoadLimit,reverse: true}
			if(this.conversationInital){
            	this.messages = []
				this.messagesLoaded = false
			}else{
				config.nextMessage = this.messages[0]
			}
			
            ZIM.getInstance().queryHistoryMessage(this.conv.conversationID,this.conv.type, config,{ isQueryFromServer: true }).then((res) => {
				if(res.messageList.length>0){
					this.messages = [...this.addNewMessage(res.messageList),...this.messages]

				}else{
					this.messagesLoaded = true
				}

				if(this.messageLoadLimit>res.messageList.length){
					this.messagesLoaded = true
				}

				ZIM.getInstance().sendConversationMessageReceiptRead(this.conv.conversationID,this.conv.type).then((res)=>{
					
				})
            })
        },
		addNewMessage(messageList){
			var msgList = []
			messageList.forEach((item,index) => {
				const userDetail = this.conv.users.find((user) => user._id == item.senderUserID)
				var username = (userDetail!=undefined && userDetail.username!='')?userDetail.username:item.senderUserID
				var msgDetail = structuredClone(toRaw(item))
				msgDetail.reactions = {}
				msgDetail._id = item.messageID
				msgDetail.content = item.message
				msgDetail.senderId = item.senderUserID
				msgDetail.username = username
				msgDetail.date = moment(item.timestamp).format('YYYY年 MM月 DD日')
				msgDetail.timestamp = moment(item.timestamp).format('hh:mm a')
				msgDetail.timestampOri = item.timestamp
				msgDetail.saved = true
				msgDetail.seen = false
				if(item.receiptStatus == 2){
					msgDetail.distributed = true
					msgDetail.seen = true
				}
				
				// is media file
				if(msgDetail.type == 11 || msgDetail.type == 12 || msgDetail.type == 13 || msgDetail.type == 14){
					if((msgDetail.fileName==''&&msgDetail.fileSize=='') || (msgDetail.messageID!=''&&msgDetail.fileDownloadUrl==undefined)){
						msgDetail.content = this.$t('mix.table_file_corrupted')
						msgDetail.system = 'true'
					}else{
						var item = {
							name: msgDetail.fileName,
							size: msgDetail.fileSize,
							type: msgDetail.fileName.split('.').pop(),
							url: msgDetail.fileDownloadUrl
						}

						if(msgDetail.fileProgress!=undefined && msgDetail.fileDownloadUrl==''){
							item.progress = msgDetail.fileProgress
						}

						if(msgDetail.videoFirstFrameDownloadUrl!=undefined&&msgDetail.videoFirstFrameDownloadUrl!=''){
							item.preview = msgDetail.videoFirstFrameDownloadUrl
						}

						msgDetail.files = [item]
					}
				}

				// is recall message
				if(msgDetail.type == 31){
					msgDetail.system = 'true'
					msgDetail.content = this.$t('mix.table_massage_has_recall',{user:username})
				}
				
				if(msgDetail.extendedData){
					var dataDetail = JSON.parse(msgDetail.extendedData)
					if(dataDetail.message && (msgDetail.type == 11 || msgDetail.type == 12 || msgDetail.type == 13 || msgDetail.type == 14)){
						msgDetail.content = dataDetail.message.content
					}

					if(dataDetail.replyMessage){
						msgDetail.replyMessage = {
							_id: dataDetail.replyMessage._id,
							content: dataDetail.replyMessage.content,
							senderId: dataDetail.replyMessage.senderId,
							username: dataDetail.replyMessage.username,
						}

						if (dataDetail.replyMessage.files) {
							msgDetail.replyMessage.files = []
							msgDetail.replyMessage.files = structuredClone(toRaw(dataDetail.replyMessage.files))
						}
					}

					if(dataDetail.system){
						msgDetail.system = true

						if(dataDetail.system.event){
							msgDetail.content = this.translateMessage(dataDetail.system)
						}
					}
				}

				msgList.push(msgDetail)
			})
			return msgList
		},
		translateMessage(system){
			var returnMessage = ''
			if(system.event == 'join_group'){
				returnMessage = this.$t('mix.table_user_join_group',{username:system.name})
			}

			return returnMessage
		},
		receiveNewMessage(messageList,fromConversationID){
			if(this.conv.conversationID == fromConversationID){
				this.messages = [...this.messages,...this.addNewMessage(messageList)]
			}
			
			this.rooms.forEach((item,index)=>{
				if(item.roomId == fromConversationID){
					if(this.conv != '' && this.conv.conversationID != fromConversationID){
						this.rooms[index].unreadCount = this.rooms[index].unreadCount+1
					}
					this.rooms[index].lastMessage = {
						_id: messageList[0].id,
						content: (messageList[0].message==''&&messageList[0].fileName!='')?this.$t('mix.table_media_file'):messageList[0].message,
						timestamp: this.$m.formatDate(messageList[0].timestamp),
						timestampOri: messageList[0].timestamp
					}
				}
			})
		},
		sendMessage({content,roomId,files,replyMessage}) {
			if(replyMessage!=null){
				if(this.messageSendingID == replyMessage.messageID){
					this.$m.popupSingleErrorMessage(this.$t('mix.table_message_sending'),this)
				}else{
					if(files){
						this.sendMediaMessage(content,files,replyMessage)
					}else{
						this.sendTextMessage(content,replyMessage)
					}
				}
			}else{
				if(files){
					this.sendMediaMessage(content,files,replyMessage)
				}else{
					this.sendTextMessage(content,replyMessage)
				}
			}
		},
		sendTextMessage(content,replyMessage,system){
			var messageData = {
				type:1,
				message:content,
				extendedData:{},
			}

			if(system!=undefined){
				messageData.extendedData.system = true
			}

			const config = {priority: 2, hasReceipt: true}

			if(replyMessage){
				this.sendReplyMessage(messageData,replyMessage)
			}

			messageData.extendedData = JSON.stringify(messageData.extendedData)

			ZIM.getInstance().sendMessage(messageData,this.conv.conversationID,this.conv.type,config).then(({ message }) => {
				this.messages = [...this.messages,...this.addNewMessage([message])]
				this.rooms.forEach((item,index)=>{
					if(item.roomId == this.conv.conversationID){
						this.rooms[index].lastMessage = {
							_id: message.messageID,
							content: message.message,
							timestamp: this.$m.formatDate(message.timestamp),
							timestampOri: message.timestamp
						}
					}
				})

			}).catch((error) => {
				if(error.code==6000231){
					this.$m.popupSingleErrorMessage(this.$t('mix.table_you_have_been_ban_chat'),this)
				}else{
					this.$m.popupSingleErrorMessage(this.$t('mix.table_send_msg_error')+', ['+error.code+'] '+error.message,this)
				}
			})
		},
		sendMediaMessage(content,files,replyMessage){
			if(files.length>1){
				this.$m.popupSingleErrorMessage(this.$t('mix.table_error_file_multiple'),this)
			}else{
				var error = ''
				var fileUIDS = this.$m.genRandomCode(10)
				// Type 11->Image / 12->File / 13->Audio / 14->Video
				var notification = {
					onMessageAttached:(message) => {
						message.fileName = message.fileLocalPath.name
						message.fileSize = message.fileLocalPath.size
						message.fileDownloadUrl = ''
						message.fileProgress = 0
						message.fileUIDS = fileUIDS
						this.messageSendingID = ''
						this.messages = [...this.messages,...this.addNewMessage([message])]
					},
					onMediaUploadingProgress:(message, currentFileSize, totalFileSize) => {
						this.messageSendingID = message.messageID
						this.messages.forEach((element) => {
							if(element.localMessageID == message.localMessageID){
								element.fileProgress = (currentFileSize/totalFileSize)*100
								element.files[0].progress = ((currentFileSize/totalFileSize)*100).toFixed()
							}
						})
					}
				}
				var messageData = {
					type:0,
					message:content,
					// fileLocalPath: files[0].blob,
					fileLocalPath: new File([files[0].blob],(files[0].extension==undefined)?files[0].name:(files[0].name+'.'+files[0].extension)),
					fileUIDS:fileUIDS,
					extendedData: {
						'message':{'content':content},
					}
				}
				const config = {priority: 1, hasReceipt: true}

				if(files[0].type.includes('image')){
					messageData.type = 11
					if(files[0].size/(1024 ** 2)>10){
						error = 'table_image_size_over'
					}
				}else if(files[0].type.includes('audio')){
					messageData.type = 13
					messageData.audioDuration = 10
					if(files[0].size/(1024 ** 2)>6){
						error = 'table_audio_size_over'
					}
				}else if(files[0].type.includes('video')){
					messageData.type = 14
					messageData.videoDuration = 10
					if(files[0].size/(1024 ** 2)>100){
						error = 'table_video_size_over'
					}
				}else{
					messageData.type = 12
					if(files[0].size/(1024 ** 2)>10){
						error = 'table_image_size_over'
					}
				}

				if(replyMessage){
					this.sendReplyMessage(messageData,replyMessage)
				}

				if(error == ''){
					messageData.extendedData = JSON.stringify(messageData.extendedData)
					ZIM.getInstance().sendMediaMessage(messageData,this.conv.conversationID,this.conv.type,config,notification).then(({ message }) => {
						this.messages.forEach((element) => {
							if(element.fileUIDS == message.fileUIDS){
								element.clientSeq = message.clientSeq
								element.conversationSeq = message.conversationSeq
								element.fileUID = message.fileUID
								element.message = message.message
								element.fileLocalPath = message.fileLocalPath
								element.fileDownloadUrl = message.fileDownloadUrl
								element.videoFirstFrameDownloadUrl = message.videoFirstFrameDownloadUrl
								element.messageID = message.messageID
								element.orderKey = message.orderKey
								element.sentStatus = message.sentStatus
								
								element.fileProgress = undefined
								element.id = message.conversationType+'_'+message.localMessageID+'_'+message.messageID
								element._id = message.messageID
								element.files[0].progress = undefined
								element.files[0].url = message.fileDownloadUrl
							}
						})

						this.rooms.forEach((item,index)=>{
							if(item.roomId == this.conv.conversationID){
								this.rooms[index].lastMessage = {
									_id: message.messageID,
									content: this.$t('mix.table_media_file'),
									timestamp: this.$m.formatDate(message.timestamp),
									timestampOri: message.timestamp
								}
							}
						})
					}).catch((error) => {
						this.$m.popupSingleErrorMessage(this.$t('mix.table_send_media_error')+', ['+error.code+'] '+error.message+',type:'+messageData.type,this)
					})
				}else{
					this.$m.popupSingleErrorMessage(this.$t('mix.'+error+''),this)
				}
			}
		},
		sendReplyMessage(messageData,replyMessage){
			messageData.extendedData.replyMessage = {
				_id: replyMessage._id,
				content: replyMessage.content,
				senderId: replyMessage.senderId,
				username: replyMessage.username,
			}

			if (replyMessage.files) {
				messageData.extendedData.replyMessage.files = []
				messageData.extendedData.replyMessage.files = structuredClone(toRaw(replyMessage.files))
			} 

			return messageData
		},
		messageActionHandler({ roomId, action, message }){
			if(action.name=='recallMessage'){
				this.recallMessage(message)
			}else if(action.name=='copyMessage'){
				this.copyMessage(message)
			}
		},
		copyMessage(message){
			if(message.type == 1){
				copy(message.message)
			}else{
				copy(message.fileDownloadUrl)
			}
			this.copyInput()
		},
		roomActionHandler({ roomId, action }){
			if(action.name=='leaveGroup'){
				this.leaveGroup(roomId)
			}
		},
		menuActionHandler({ roomId, action }){
			if(action.name=='leaveGroup'){
				this.leaveGroup(roomId)
			}

			if(action.name=='checkGroupMember'){
				this.modalList.groupMemberList = true
			}

			if(action.name=='inviteGroupMember'){
				this.getMemberList()
			}

			if(action.name=='requestJoinGroup'){
				this.getRequestJoinGroupList()
			}
		},
		checkMenuAction(){
			if (this.conv.type == 0) {
				this.menuAction = []
			} else if (this.conv.type == 2) {
				this.oriAction = [
					{ name: 'checkGroupMember', title: this.$t('mix.table_check_group_member') },
					{ name: 'leaveGroup', title: this.$t('mix.table_leave_group') },
				]
				this.menuAction = this.oriAction

				if(this.currentMemberRole == 1 || this.currentMemberRole == 2){
					var adminAction = [
						{name: 'inviteGroupMember', title: this.$t('mix.table_invite_group_member')},
						{name: 'requestJoinGroup', title: this.$t('mix.table_view_application_join')},
					]
					this.menuAction = [...adminAction,...this.menuAction]
				}else{
					this.menuAction = this.oriAction
				}
			}
		},
		searchGroupMemberList(){
			this.groupMemberResultList = this.conv.users.filter((item) => {
				return item.username.toLowerCase().includes(this.submitForm.searchGroupMemberText.toLowerCase())
			})
			this.pageNumber = 1
			this.groupMemberDisplayList = this.pagination(this.groupMemberResultList,this.pageSize,this.pageNumber)
		},
		getInfo(){
			this.isOnline = false
			this.loading = true
			var form = {}
			form.system_id = this.conv.conversationID
			this.postData.data = JSON.stringify(form)
			var result = this.$m.postMethod('chat/manage/lists/member',this.postData)
			result.then((value)=>{
				var data = value.data
				if(value.valid){
					this.isOnline = data.isOnline
					this.memberInfo = data.thisDetail
					this.postFormBan.system_id = data.thisDetail.system_id
					this.postFormBan.is_ban_chat = data.thisDetail.is_ban_chat
				}
				this.loading = false
			})

			this.rooms.forEach((item,index)=>{
				if(item.roomId == this.conv.conversationID){
					this.rooms[index].unreadCount = 0
				}
			})
		},
		getOnlineStatus(){
			var queryParams = generateSignature()
			var result = this.$m.customGetMethod('https://zim-api.zego.im/?Action=QueryUserOnlineState&UserId[]='+this.conv.conversationID+'&'+queryParams)
			result.then((value)=>{
				var data = value.data
				if(data != undefined && data.Result != null){
					this.isOnline = (data.Result[0].Status == 'online') ? true : false
				}
			})
		},
		getGroupList(){
			this.preloader(true)
			this.postData.data = JSON.stringify(this.submitForm)
			var result = this.$m.postMethod('app/chat/group/ajaxTable',this.postData)
			result.then((value)=>{
				var data = value.data
				this.preloader(false)
				if(value.valid){
					this.modalList.groupList = true
					this.groupList = data.dataList
				}
			})
		},
		joinGroup(){
			this.$confirm(this.$t('mix.table_request_join_group_confirm'), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/pending/DBadd',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.groupList = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		getMemberList(){
			this.preloader(true)
			this.postData.data = JSON.stringify(this.submitForm)
			var result = this.$m.postMethod('app/chat/group/invite',this.postData)
			result.then((value)=>{
				var data = value.data
				this.preloader(false)
				if(value.valid){
					this.modalList.inviteGroupMember = true
					this.memberList = data.userList
				}
			})
		},
		inviteGroupMember(){
			this.$confirm(this.$t('mix.table_msg_confirm'), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.group_id = this.conv.conversationID
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/group/DBinvite',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.inviteGroupMember = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		getRequestJoinGroupList(){
			this.preloader(true)
			this.postForm.group_id = this.conv.conversationID
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('app/chat/pending/ajaxTable',this.postData)
			result.then((value)=>{
				var data = value.data
				this.preloader(false)
				if(value.valid){
					this.modalList.requestJoinGroup = true
					this.requestJoinGroupList = data.dataList
					this.requestJoinGroupLastID = data.lastID
					this.requestJoinGroupLoadMore = data.loadMore
				}
			})
		},
		getRequestJoinGroupListLoadMore(){
			this.preloader(true)
            this.requestJoinGroupLoadMore = false
			this.postForm.group_id = this.conv.conversationID
			this.postForm.lastID = this.requestJoinGroupLastID
			this.postForm.loadMore = this.requestJoinGroupLoadMore
			this.postData.data = JSON.stringify(this.postForm)
			var result = this.$m.postMethod('app/chat/pending/loadMore',this.postData)
			result.then((value)=>{
				var data = value.data
				this.preloader(false)
				if(value.valid){
                    data.dataList.forEach(value=>{
                        this.requestJoinGroupList.push(value)
                    })
                    this.requestJoinGroupLastID = data.lastID
                    this.requestJoinGroupLoadMore = data.loadMore
				}
			})
		},
		approveRequestJoinGroup(dataDetail){
			this.$confirm(this.$t('mix.table_confirm_approve_user_join_group',{username:dataDetail.name}), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.id = dataDetail.id
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/pending/DBapprove',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.requestJoinGroup = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		rejectRequestJoinGroup(dataDetail){
			this.$confirm(this.$t('mix.table_confirm_reject_user_join_group',{username:dataDetail.name}), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.id = dataDetail.id
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/pending/DBcancel',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.requestJoinGroup = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		leaveGroup(roomId){
			this.$confirm(this.$t('mix.table_leave_group_confirm'), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.group_id = roomId
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/group/DBleaveGroup',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		kickGroupMember(dataDetail){
			this.$confirm(this.$t('mix.table_msg_confirm'), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.user_id = dataDetail._id
				this.postForm.group_id = this.conv.conversationID
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/group/DBkickUser',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.groupMemberList = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		transferGroupOwner(dataDetail){
			this.$confirm(this.$t('mix.table_confirm_transfer_owner',{username:dataDetail.username}), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.group_id = this.conv.conversationID
				this.postForm.to_user_id = dataDetail._id
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/group/DBowner',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.groupMemberList = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		roleMember(dataDetail){
			this.postForm.user_id = dataDetail._id
			this.postForm.username = dataDetail.username
			this.postForm.role_id = dataDetail.memberRole
			this.modalList.roleMember = true
		},
		roleMemberSubmit(){
			this.$confirm(this.$t('mix.table_msg_confirm'), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				this.preloader(true)
				this.postForm.group_id = this.conv.conversationID
				this.postData.data = JSON.stringify(this.postForm)
				var result = this.$m.postMethod('app/chat/group/DBsetRole',this.postData)
				result.then((value)=>{
					var data = value.data
					this.preloader(false)
					if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success',
                            duration: 1500
                        })
						this.modalList.roleMember = false
						this.clearPostForm()
					}else{
						this.$m.popupErrorMessage(data.returnMsg,this)
					}
				})
			})
		},
		getEditUserName(){
			if(this.$p.permissionChecker('chatManageRename') && this.loading == false){
				this.postForm.name = this.currentUserName
				this.modalList.editUserName = true
			}
		},
		editUserName(){
			if(this.$p.permissionChecker('chatManageRename') && this.loading == false){
				this.loading = true
				this.$confirm(this.$t('msg.msg_action'), this.$t('msg.prompt'), {
					confirmButtonText: this.$t('button.confirm'),
					cancelButtonText: this.$t('button.cancel'),
					type: 'warning'
				}).then(({ value }) => {
					this.preloader(true)
					this.postData.data = JSON.stringify(this.postForm)
					var result = this.$m.postMethod('chat/manage/lists/DBrename',this.postData)
					result.then((value)=>{
						var data = value.data
						this.preloader(false)
						this.loading = false
						if(value.valid){
							this.$message({
								message: data.returnMsg,
								type: 'success',
								duration: 1500
							})
							this.modalList.editUserName = false
							this.currentUserName = data.zegoUserName
							this.$m.setItem('zegoUserID',data.zegoUserID)
							this.$m.setItem('zegoUserName',data.zegoUserName)
						}else{
							this.$m.popupErrorMessage(data.returnMsg,this)
						}
					}).catch(() => {
                        this.loading = false;
                    });
				})
			}
		},
		recallMessage(messageItem){
			if(this.messageSendingID == messageItem.messageID){
				this.$m.popupSingleErrorMessage(this.$t('mix.table_message_sending'),this)
			}else{
				var messageDetail = structuredClone(toRaw(messageItem))
				messageDetail.timestamp = messageDetail.timestampOri
				var config = {revokeExtendedData: JSON.stringify({username:messageDetail.username})}
				ZIM.getInstance().revokeMessage(messageDetail, config).then(({ message }) => {
					var getIndex = this.messages.findIndex(x => x.messageID == message.messageID)
					if(getIndex != -1){
						this.messages[getIndex].type = message.type
						this.messages[getIndex].system = 'true'
						this.messages[getIndex].content = this.$t('mix.table_massage_has_recall',{user:messageDetail.username})
						this.messages = [...this.messages]
					}
				}).catch((error) => {
					if(error.code == 6000278){
						this.$m.popupSingleErrorMessage(this.$t('mix.table_recall_message_overtime'),this)
					}else{
						this.$m.popupSingleErrorMessage(this.$t('mix.table_recall_message_fail')+', ['+error.code+'] '+error.message,this)
					}
				})
			}
		},
		banChatMember(dataDetail){
			this.postFormZego.userID = dataDetail._id
			this.postFormZego.userName = dataDetail.username
			this.postFormZego.userMuteTime = dataDetail.muteExpiredTime
			this.modalList.banChatMember = true
		},
		banChatMemberSubmit(){
			this.$confirm(this.$t('mix.table_msg_confirm'), this.$t('msg.msg_confirm_title'), {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel'),
				type: 'warning'
            }).then(({ value }) => {
				// Duration Second
				var config = {duration: this.postFormZego.muteDuration}

				ZIM.getInstance().muteGroupMembers((this.postFormZego.muteDuration == 0)?false:true,[this.postFormZego.userID],this.conv.conversationID,config).then(({ groupID, isMute, duration, mutedUserIDs, errorUserList }) => {
					this.modalList.banChatMember = false

					this.$message({
						message: this.$t('mix.table_action_success'),
						type: 'success',
						duration: 1500
					})
				}).catch((error) => {
					this.$m.popupSingleErrorMessage(this.$t('mix.table_ban_chat_fail')+', ['+error.code+'] '+error.message,this)
				})
			})
		},
		passwordRow(){
			if(this.$p.permissionChecker('accountPassword')){
				this.loading = true
                this.preloader(true)

                this.postData.data = JSON.stringify(this.postForm)

                var result = this.$m.postMethod('common/account/DBpassword',this.postData)

                result.then((value) => {
                    var data = value.data

                    if(value.valid){
                        this.$message({
                            message: data.returnMsg,
                            type: 'success'
                        })

                        this.modalList.passwordRow = false
                        this.clearPostForm()
                    }else{
                        this.$m.popupErrorMessage(data.returnMsg,this)
                    }

                    this.loading = false
                    this.preloader(false)
                })
			}
		},
		logout(){
			this.postData.data = JSON.stringify(this.postForm);
			var result = this.$m.postMethod('common/progress/logout',this.postData)

			result.then((value)=>{
				this.$m.removeItem('zegoToken');
				this.$m.removeItem('authSignToken');
				this.$m.removeItem('languageList');
				this.$m.removeItem('adminLanguageList');
				this.$m.removeItem('permissionList');
				this.$m.removeItem('shortcut');
				this.$m.removeItem('popupNews');
				this.$m.removeItem('error_msg');
				this.$m.removeItem('unreadNotification');
				this.$router.push('/');
			});
		},
		uploadLog(){
			ZIM.getInstance().uploadLog()
		},
		openFile({ file }) {
			window.open(file.file.url, '_blank')
		},copyInput(){
            try {
                this.$message({showClose: true,message: this.$t('msg.msg_copy_success'),type: 'success'});
            } catch (err) {
                // alert('Oops, unable to copy');
            }
		}
    },created(){
		this.postData.language = this.$m.getItem('currentLang')??'en'
		this.initial()
    }
}
</script>