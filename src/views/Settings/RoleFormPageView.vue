<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <RoleFormComponent />
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import RoleFormComponent from '@/components/setting/RoleManagementPage/components/RoleFormComponent.vue'

const currentPageTitle = ref('Role Management')
</script>
