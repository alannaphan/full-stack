<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import AppHeader from '../components/AppHeader.vue'
  import PatientTable from '../components/PatientTable.vue'
  const route = useRoute()
</script>

<template>
  <div>
    <AppHeader />
    <PatientTable />
    <p>
      Frontend is unfinished but I would implement a login function for admin and doctors before accessing patient data.
    </p>
  </div>
</template>

<style>
  p {
    text-align: center;
  }
</style>