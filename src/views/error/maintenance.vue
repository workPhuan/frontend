
<style lang="scss">
@import '@/assets/scss/abstracts/_variables.scss';
@import '@/assets/scss/abstracts/_mixins.scss';
@import '@/assets/scss/pages/_utility.scss';
</style>
<template>
	<div class="error-container">
		<div class="error-wrapper">
			<div class="error-inner has-text-centered text-center">
				<div class="bg-number dark-inverted">503</div>
				<img class="light-image" src="@/assets/img/common/error.svg"/>
				<img class="dark-image" src="@/assets/img/common/error-dark.svg"/>
				<h3 class="dark-inverted">Internal Server Maintenance</h3>
				<p>
					Looks like an unexpacted problem occured. Please try again or contact
					the website administrator.
				</p>
				<div class="button-wrap">
    				<el-button type="success" @click="$router.push('/dashboard');">Take me Back</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

