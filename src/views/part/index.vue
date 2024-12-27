<template>
	<div class="main-container" id="main-container">
		<HeaderBar />
		<SideBar v-if="$route.path != '/dashboard/index'" />
		<div class="view-wrapper" :class="[(sidebarPanel == 'open' && $route.path != '/dashboard/index') ? 'is-pushed-full' : '']">
			<div class="page-content-wrapper">
				<div class="page-content is-relative">
					<RouterView v-slot="{ Component }">
						<transition name="fade-slow" mode="out-in">
							<component :is="Component" />
						</transition>
					</RouterView>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import SideBar from '@/views/part/sidebar/index.vue';
import HeaderBar from '@/views/part/header/index.vue';
import { sidebarPanel } from '@/system/store/state.js'
</script>

<script>

</script>
