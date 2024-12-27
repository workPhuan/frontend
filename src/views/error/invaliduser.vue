
<style lang="scss">
@import '@/assets/scss/abstracts/_variables.scss';
@import '@/assets/scss/abstracts/_mixins.scss';
@import '@/assets/scss/pages/_utility.scss';
</style>
<template>
	<div class="error-container">
		<div class="error-wrapper">
			<div class="error-inner has-text-centered text-center">
				<div class="bg-number dark-inverted">000</div>
				<img class="light-image" src="@/assets/img/common/search-4.svg"/>
				<h3 class="dark-inverted">Invalid Session</h3>
				<p>
					Invalid account session token, please login again
				</p>
				<div class="button-wrap">
    				<el-button type="success" @click="$router.push('/');">Take me Back</el-button>
				</div>
			</div>
		</div>
	</div>
</template>