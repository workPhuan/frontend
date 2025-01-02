import { createRouter, createWebHistory } from 'vue-router'
import part from '@/views/part/index.vue';
import * as NProgress from 'nprogress'
import { component } from 'v-viewer';

export const mainRoutes = [
    {
		path: '/',
		name: 'Login',
		component: ()=> import('@/views/common/login.vue'),
		hidden: true
	},{
		path: '/authenticate',
		name: 'Authenticate',
		component: ()=> import('@/views/common/authenticate.vue'),
		hidden: true
	},
	{
        path: '/dashboard',
		component: part,
		redirect: '/dashboard/index',
        meta: {title:'menu.home',icon:'house-user',permission: 'RZYSSQ', parents:'dashboard'},
        children: [
            {
                path: '/dashboard/index',
                meta: {title:'menu.home',permission: 'RZYSSQ'},
                component: () => import('@/views/dashboard/index.vue'),
            }
        ],
    },{
		path: '/app',
		component: part,
		redirect: '',
        meta: {title:'menu.app',icon:'grid-2',permission: '1D13C2', parents:'app'},
        children: [{
			path: '/app/developer',
			redirect: '/app/developer/password',
			meta: {title:'menu.app_developer',permission: 'DU8NC5', parents:'app'},
			children: [{
				path: '/app/developer/password',
				meta: {title:'menu.app_developer_password',icon:'key',permission: 'X1JD54', parents:'app'},
				component: () => import('@/views/app/developer/password.vue'),
			},{
				path: '/app/developer/permission',
				meta: {title:'menu.app_developer_permission',icon:'fingerprint',permission: '2WI71E', parents:'app'},
				component: () => import('@/views/app/developer/permission.vue'),
			},{
				path: '/app/developer/permissionagent',
				meta: {title:'menu.app_developer_permissionagent',icon:'camera-cctv',permission: '2WI71E', parents:'app'},
				component: () => import('@/views/app/developer/permissionagent.vue'),
			},{
				path: '/app/developer/restore',
				meta: {title:'menu.app_developer_restore',icon:'window-restore',permission: 'VWC8C6', parents:'app'},
				component: () => import('@/views/app/developer/restore.vue'),
			},{
				path: '/app/developer/redis2',
				meta: {title:'menu.app_developer_redis2',icon:'window-restore',permission: 'RZYSSQ', parents:'app'},
				component: () => import('@/views/app/developer/redis2.vue'),
			}],
		},{
			path: '/app/tools',
			redirect: '/app/tools/system',
			meta: {title:'menu.app_tools',permission: 'PEJOJ5', parents:'app'},
			children: [{
				path: '/app/tools/system',
				meta: {title:'menu.app_tools_system',icon:'gear',permission: 'Q8UGQK', parents:'app'},
				component: () => import('@/views/app/tools/system.vue'),
			},{
				path: '/app/tools/setting',
				meta: {title:'menu.app_tools_setting',icon:'gear',permission: 'QO6F3M', parents:'app'},
				component: () => import('@/views/app/tools/setting.vue'),
			},{
				path: '/app/tools/status',
				meta: {title:'menu.app_tools_status',icon:'battery',permission: 'BXJNYH', parents:'app'},
				component: () => import('@/views/app/tools/status.vue'),
			},{
				path: '/app/tools/attribute',
				meta: {title:'menu.app_tools_attribute',icon:'flag',permission: 'DSC81L', parents:'app'},
				component: () => import('@/views/app/tools/attribute.vue'),
			},{
				path: '/app/tools/country',
				meta: {title:'menu.app_tools_country',icon:'earth-asia',permission: 'RZYSSQ', parents:'app'},
				component: () => import('@/views/app/tools/country.vue'),
			},{
				path: '/app/tools/role',
				meta: {title:'menu.app_tools_role',icon:'user',permission: '4JNCD4', parents:'app'},
				component: () => import('@/views/app/tools/role.vue'),
			},{
				path: '/app/tools/page',
				meta: {title:'menu.app_tools_page',icon:'passport',permission: '6SRJXJ', parents:'app'},
				component: () => import('@/views/app/tools/page.vue'),
			},{
				path: '/app/tools/language',
				meta: {title:'menu.app_tools_language',icon:'globe',permission: 'ZUADWD', parents:'app'},
				component: () => import('@/views/app/tools/language.vue'),
			},{
				path: '/app/tools/event',
				meta: {title:'menu.app_tools_event',icon:'globe',permission: 'RZYSSQ', parents:'app'},
				component: () => import('@/views/app/tools/event.vue'),
			},{
				path: '/app/tools/memberpackage',
				meta: {title:'menu.app_tools_memberpackage',icon:'user',permission: 'VPO4SN', parents:'app'},
				component: () => import('@/views/app/tools/memberpackage.vue'),
			},{
				path: '/app/tools/wallet',
				meta: {title:'menu.app_tools_wallet',icon:'wallet',permission: '3LB362', parents:'app'},
				component: () => import('@/views/app/tools/wallet.vue'),
			},{
				path: '/app/tools/bonuspayment',
				meta: {title:'menu.app_tools_bonuspayment',icon:'gift',permission: 'A6145C', parents:'app'},
				component: () => import('@/views/app/tools/bonuspayment.vue'),
			}],
		}],
	},{
		path: '/management',
		component: part,
		redirect: '',
        meta: {title:'menu.management',icon:'grid-2',permission: 'N4AUT5', parents:'management'},
        children: [{
			path: '/management/admin',
			redirect: '/management/admin/admin',
			meta: {title:'menu.management_admin',permission: 'TFRGTT', parents:'management'},
			children: [{
				path: '/management/admin/admin',
				meta: {title:'menu.management_admin_admin',icon:'user-secret',permission: 'OHCVNC', parents:'management'},
				component: () => import('@/views/management/admin/admin.vue'),
			},{
				path: '/management/admin/agent',
				meta: {title:'menu.management_admin_agent',icon:'user-tie',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/agent.vue'),
			},{
				path: '/management/admin/user',
				meta: {title:'menu.management',icon:'user-secret',permission: 'OHCVNC', parents:'management'},
				component: () => import('@/views/management/admin/user.vue'),
			},{
				path: '/management/admin/agentinfo',
				meta: {title:'menu.management_admin_agent',icon:'user-tie',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/agentinfo.vue'),
				hidden: true
			},{
				path: '/management/admin/clientinfo',
				meta: {title:'menu.management_admin_agent',icon:'user-tie',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/clientinfo.vue'),
				hidden: true
			},{
				path: '/management/admin/orderinfo',
				meta: {title:'menu.management_client_client',icon:'users',permission: 'UH1QB6', parents:'management'},
				component: () => import('@/views/management/admin/orderinfo.vue'),
				hidden: true
			},{
				path: '/management/admin/assistant',
				meta: {title:'menu.management_admin_assistant',icon:'user-visor',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/assistant.vue'),
			},{
				path: '/management/admin/agentnetwork',
				meta: {title:'menu.management_admin_agentnetwork',icon:'chart-network',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/agentnetwork.vue'),
			},{
				path: '/management/admin/trace',
				meta: {title:'menu.management_admin_trace',icon:'circle-t',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/trace.vue'),
			},{
				path: '/management/admin/traceview',
				meta: {title:'menu.management_admin_traceview',icon:'circle-t',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/traceview.vue'),
			},{
				path: '/management/admin/login',
				meta: {title:'menu.management_admin_login',icon:'table',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/admin/login.vue'),
			}],
		},{
			path: '/management/user',
			redirect: '/management/user/member',
			meta: {title:'menu.management_user',permission: 'TKK2JB', parents:'management'},
			children: [{
				path: '/management/user/member',
				meta: {title:'menu.management_user_member',icon:'users',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/user/member.vue'),
			},{
				path: '/management/user/contact',
				meta: {title:'menu.management_user_contact',icon:'table',permission: 'IV5KP6', parents:'management'},
				component: () => import('@/views/management/user/contact.vue'),
			},{
				path: '/management/user/special',
				meta: {title:'menu.management_user_special',icon:'crown',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/user/special.vue'),
			},{
				path: '/management/user/trace',
				meta: {title:'menu.management_user_trace',icon:'circle-t',permission: 'RZYSSQ', parents:'management'},
				component: () => import('@/views/management/user/trace.vue'),
			}],
		},{
			path: '/management/merchant',
			redirect: '/management/merchant/merchant',
			meta: {title:'menu.management_merchant',permission: 'XJPNNO', parents:'management'},
			children: [{
				path: '/management/merchant/merchant',
				meta: {title:'mix.table_merchant',icon:'users',permission: 'AWGXXE', parents:'management'},
				component: () => import('@/views/management/merchant/merchant.vue'),
			}],
		},{
			path: '/management/chat',
			redirect: '/management/chat/role',
			meta: {title:'menu.management_chat',permission: 'G6Q9SH', parents:'management'},
			children: [{
				path: '/management/chat/role',
				meta: {title:'menu.management_chat_role',icon:'briefcase',permission: 'XZHCG9', parents:'management'},
				component: () => import('@/views/management/chat/role.vue'),
			},{
				path: '/management/chat/log',
				meta: {title:'menu.management_chat_log',icon:'book',permission: 'NPJW2E', parents:'management'},
				component: () => import('@/views/management/chat/log.vue'),
			},{
				path: '/management/chat/group',
				meta: {title:'menu.management_chat_group',icon:'users',permission: 'IESJ42', parents:'management'},
				component: () => import('@/views/management/chat/group.vue'),
			},{
				path: '/management/chat/member',
				meta: {title:'menu.management_chat_member',icon:'users',permission: 'IESJ42', parents:'management'},
				component: () => import('@/views/management/chat/member.vue'),
			}],
		},{
			path: '/management/sticker',
			redirect: '/management/sticker/group',
			meta: {title:'menu.management_sticker',permission: '7L4BR7', parents:'management'},
			children: [{
				path: '/management/sticker/list',
				meta: {title:'menu.management_sticker_list',icon:'users',permission: 'UH1QB6', parents:'management'},
				component: () => import('@/views/management/sticker/sticker.vue'),
			},{
				path: '/management/sticker/group',
				meta: {title:'menu.management_sticker_group',icon:'users',permission: '1C541H', parents:'management'},
				component: () => import('@/views/management/sticker/group.vue'),
			}],
		},{
			path: '/management/client',
			redirect: '/management/client/client',
			meta: {title:'menu.management_client',permission: '7L4BR7', parents:'management'},
			children: [{
				path: '/management/client/client',
				meta: {title:'menu.management_client_client',icon:'users',permission: 'UH1QB6', parents:'management'},
				component: () => import('@/views/management/client/client.vue'),
			},{
				path: '/management/client/client/info',
				meta: {title:'menu.management_client_client',icon:'users',permission: 'UH1QB6', parents:'management'},
				component: () => import('@/views/management/client/info.vue'),
				hidden: true
			},{
				path: '/management/client/client/agentinfo',
				meta: {title:'menu.management_client_client',icon:'users',permission: 'UH1QB6', parents:'management'},
				component: () => import('@/views/management/client/agentinfo.vue'),
				hidden: true
			}],
		}],
	},{
		path: '/site',
		component: part,
		redirect: '',
        meta: {title:'menu.site',icon:'grid-2',permission: '3CE9YW', parents:'site'},
        children: [{
			path: '/site/gallery',
			redirect: '/site/gallery/lists',
			meta: {title:'menu.site_gallery',permission: 'RZYSSQ', parents:'site'},
			children: [{
				path: '/site/gallery/lists',
				meta: {title:'menu.site_gallery_lists',icon:'photo-film-music',permission: 'RZYSSQ', parents:'site'},
				component: () => import('@/views/site/gallery/lists.vue'),
			},{
				path: '/site/gallery/center', 
				meta: {title: 'menu.site_gallery_center', icon: 'photo-film-music', permission: 'RZYSSQ', parents: 'site' },
				component: () => import('@/views/site/gallery/center.vue'),
			}],
		},{
			path: '/site/content',
			redirect: '/site/content/news',
			meta: {title:'menu.site_content',permission: 'ASTCJU', parents:'site'},
			children: [{
				path: '/site/content/news',
				meta: {title:'menu.site_content_news',icon:'passport',permission: 'I5L2N3', parents:'site'},
				component: () => import('@/views/site/content/news.vue'),
			},{
				path: '/site/content/carousel',
				meta: {title:'menu.site_content_carousel',icon:'table',permission: 'SSK3ED', parents:'site'},
				component: () => import('@/views/site/content/carousel.vue'),
			}],
		}]
		,
	},{
		path: '/package',
		component: part,
		redirect: '',
        meta: {title:'menu.package_management',icon:'grid-2',permission: 'S7ACRO', parents:'package'},
        children: [{
			path: '/package/order',
			redirect: '/package/order/setting',
			meta: {title:'menu.package_order',permission: 'S7ACRO', parents:'package'},
			children: [{
				path: '/package/order/setting',
				meta: {title:'menu.package_order_setting',icon:'box',permission: 'S7ACRO', parents:'package'},
				component: () => import('@/views/package/order/setting.vue'),
			},{
				path: '/package/order/assign',
				meta: {title:'menu.package_order_assign',icon:'box',permission: 'S7ACRO', parents:'package'},
				component: () => import('@/views/package/order/assign.vue'),
			},{
				path: '/package/order/summary',
				meta: {title:'menu.package_order_summary',icon:'box',permission: 'S7ACRO', parents:'package'},
				component: () => import('@/views/package/order/summary.vue'),
			},{
				path: '/package/order/detail',
				meta: {title:'menu.package_order_summary',icon:'box',permission: 'S7ACRO', parents:'package'},
				component: () => import('@/views/package/order/detail.vue'),
				hidden: true
			}],
		},{
			path: '/package/product',
			redirect: '/package/product/',
			meta: {title:'menu.product_management',permission: 'ASTCJU', parents:'package'},
			children: [{
				path: '/package/product/item',
				meta: {title:'menu.product_item_list',icon:'passport',permission: 'I5L2N3', parents:'package'},
				component: () => import('@/views/package/product/item.vue'),
			}],
		}]
		,
	},{
		path: '/chat',
		name: 'chat',
		meta: {permission: 'MDSCXC'},
		component: () => import('@/views/chat/index.vue'),
		hidden: true
	},{
		path: '/nofound',
		name: 'nofound',
		component: () => import('@/views/error/nofound.vue'),
		hidden: true
	},{
		path: '/invaliduser',
		name: 'invaliduser',
		component: () => import('@/views/error/invaliduser.vue'),
		hidden: true
	},{
		path: '/maintenance',
		name: 'maintenance',
		component: ()=> import('@/views/error/maintenance.vue'),
		hidden: true
	},{
		path: '/:catchAll(.*)',
		redirect: '/nofound',
		hidden: true
	}
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve({ left: 0, top: 0 })
            }, 50)
        })
    },
    routes: mainRoutes,
})

router.beforeEach(() => {
    NProgress.start()
})
router.afterEach(() => {
    NProgress.done()
})

export default router
