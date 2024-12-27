<template>
    <transition name="slide-x">
        <div class="main-sidebar" v-if="sidebarPanel == 'open'">
            <div class="sidebar-inner d-flex flex-column">
                <el-scrollbar wrap-class="scrollbar-wrapper" always>
                    <el-menu :router="true" :default-active="$route.path" :default-openeds="defaultOpeneds">
                        <div v-for="item in routes" :key="item.path" :item="item" :base-path="item.path">
                            <div v-if="!item.hidden && permissionList.includes(item.meta.permission) && item.meta.parents == $route.meta.parents">
								<template v-for="subItem in item.children" :key="subItem.path" :item="subItem">
									<template v-if="hasOneShowingChild(subItem.children,subItem) && permissionList.includes(subItem.meta.permission)">
										<el-menu-item :index="subItem.path" :route="subItem.path" @click="closeSidebar()">
											<i :class="'fa-regular fa-'+subItem.meta.icon"></i> <span class="main-title">{{$t(subItem.meta.title)}}</span>
										</el-menu-item>
									</template>

									<template v-else>
										<el-sub-menu :index='subItem.path' v-if="permissionList.includes(subItem.meta.permission)">
											<template #title>
												<span class="main-title">{{$t(subItem.meta.title)}}</span>
											</template>
											<el-menu-item v-for="child in subItem.children" :key="child.path" :index="child.path" :route="child.path" :class="($route.path == child.path) ? 'is-active' : ''" v-show="!child.hidden && permissionList.includes(child.meta.permission)" @click="closeSidebar()">
												<i :class="'fa-regular fa-'+child.meta.icon"></i> <span>{{$t(child.meta.title)}}</span>
											</el-menu-item>
										</el-sub-menu>
									</template>
                                </template>
                            </div>
                        </div>
                    </el-menu>
                </el-scrollbar>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { sidebarPanel } from '@/system/store/state.js'
import { mainRoutes } from '@/system/engine/router.js';

if(window.innerWidth < 665){
    sidebarPanel.value = 'close'
}else{
    sidebarPanel.value = 'open'
}
</script>

<script>
export default{
    data(){
        return{
            postData: {
                data: '',
                language: ''
            },
            postForm: {
                security: ''
            },
            routes: mainRoutes,
            permissionList: [],
        }
    },
	computed: {
		defaultOpeneds() {
			return this.routes.reduce((acc, subItem) => {
				return [
				...acc,
				...(subItem.children || [])
				.map((child) => child.path)
				.filter((path) => this.$route.path.startsWith(path)),
			];
		  }, []);
		},
	},
    methods:{
        hasOneShowingChild(children = [],parent) {
            if (children.length < 1 || parent.path == '/dashboard' || parent.path == '/leaderboard') {
                return true;
            }else{
                return false;
            }
        },closeSidebar(){
            if(window.innerWidth < 665){
                sidebarPanel.value = 'close'
            }
        }
    },
    created(){
        this.permissionList = JSON.parse(this.$m.getItem('permissionList'))
    }
}
</script>
