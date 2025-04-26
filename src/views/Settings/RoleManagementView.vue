<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <RoleManagementComponent />
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import RoleManagementComponent from '@/components/setting/RoleManagementPage/RoleManagementComponent.vue'

const currentPageTitle = ref('Settings')
</script>
