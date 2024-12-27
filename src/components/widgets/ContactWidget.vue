<script setup>
import { defineProps } from 'vue'

defineProps({
    picture: {
        type: String,
        required: true,
        default: 'https://via.placeholder.com/150x150',
    },
    username: {
        type: String,
        required: true,
        default: '-',
    },
    email: {
        type: String,
        required: true,
        default: '-@.com',
    },
    company: {
        type: String,
        required: true,
        default: '-.',
    },
    position: {
        type: String,
        required: true,
        default: '-',
    },
    location: {
        type: String,
        required: true,
        default: '-, -',
    },
    phone: {
        type: String,
        required: true,
        default: '-',
    },
    straight: {
        type: Boolean,
        default: false,
    },
    reversed: {
        type: Boolean,
        default: false,
    },
    squared: {
        type: Boolean,
        default: false,
    },
})
</script>

<template>
    <div class="widget contact-widget" :class="[straight && 'is-straight', reversed && 'is-reversed']">
        <div class="widget-content">
            <div class="left">
                <div class="avatar">
                    <img :src="picture" class='img-fluid'/>
                </div>
            </div>
            <div class="right">
                <h3>{{ username }}</h3>
                <div class="company">
                    <span>{{ company }}</span>
                    <p>{{ position }}</p>
                </div>
                <div class="contact-info">
                    <span>
                        <i class="fa-light fa-location-dot"></i>
                        <span>{{ location }}</span>
                    </span>
                    <span>
                        <i class="fa-light fa-phone"></i>
                        <span>{{ phone }}</span>
                    </span>
                </div>
            </div>
        </div>

        <p class="email">{{ email }}</p>
    </div>
</template>
