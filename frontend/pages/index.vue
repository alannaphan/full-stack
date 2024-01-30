<script setup lang="ts">

const route = useRoute()
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Define a reactive variable to store the fetched patient data
const patients = ref([]);

// Function to fetch patient data from the backend
const fetchPatients = async () => {
  try {
    const response = await axios.post(
      "http://localhost:4000", // GraphQL API endpoint URL
      {
        query: `
          query {
            patients {
              id
              name
              dob
              files {
                id
                filename              
              }
            }
          }
        `
      }
    );
    patients.value = response.data.data.patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};

// Call the fetchPatients function when the component is mounted
onMounted(fetchPatients);
</script>

<template>
  <div>
    <AppHeader />
    <p>Current route: {{ route.path }}</p>
    <h1>Patients List</h1>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        <!-- Render patient details here -->
        <span>{{ patient.name }}</span>
        <span>{{ patient.dob }}</span>
        <span>{{ patient.id }}</span>
        <!-- Add more patient details as needed -->
      </li>
    </ul>
  </div>
</template>
