<template>
	<div class="noresult">
		<div class="noresult-area">
			<img src="@/assets/img/common/empty.png">
			<p class="mt-3 mb-0">{{$t('mix.'+props.text+'')}}</p>
		</div>
	</div>
</template>
    
<script setup>
const props = defineProps({
text: String,
type: String
})
</script>
    