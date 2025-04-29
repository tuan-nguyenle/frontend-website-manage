<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <CreateRoleComponent />
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import CreateRoleComponent from '@/components/setting/RoleManagementPage/components/CreateRoleComponent.vue'

const currentPageTitle = ref('Create Role')
</script>
