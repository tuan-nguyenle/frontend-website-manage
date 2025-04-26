<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <AccessPageComponents />
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AccessPageComponents from '@/components/setting/AccessManagementPage/AccessPageComponents.vue'

const currentPageTitle = ref('Settings')
</script>
