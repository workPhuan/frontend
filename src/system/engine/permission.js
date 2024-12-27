import router from '@/system/engine/router';
import {getItem,removeItem} from '@/system/store/localstorage';

const whiteList = ['/','/nofound', '/invaliduser','/maintenance', '/ipay88_receipt','/forgetpassword','/forgetpasswordchange','/authenticate','/videoplay'];

router.beforeEach((to, from, next) => {
	// next();
	if(whiteList.indexOf(to.path) !== -1){
		if(to.path === '/' && getItem('authSignToken')){
			next('/dashboard');
		}else{
			if (location.hostname !== "localhost" && !location.hostname.includes('192.168.')){
				removeItem('authSignToken');
			}
			next();
		}
	}else{
		if(getItem('authSignToken')){
			var permissionList = JSON.parse(getItem('permissionList'));
			if(permissionList.includes(to.meta.permission)){
				next();
			}else{
				next('/nofound');
			}
		}else{
			next('/');
		}
	}
});
