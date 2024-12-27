var projectName = "umiszecs_admin_app_";

export function getItem(name){
	return localStorage.getItem(projectName+name);
}

export function setItem(name, value){
	return localStorage.setItem(projectName+name, value);
}

export function removeItem(name){
	return localStorage.removeItem(projectName+name);
}
