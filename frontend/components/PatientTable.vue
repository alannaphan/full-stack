
import type { NuxtLink } from '#build/components';
<script setup>
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
    <h1>Patients List</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Date of Birth</th>
          <th>Files</th>
          <th>Add File</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patients" :key="patient.id">
          <td>{{ patient.id }}</td>
          <td>{{ patient.name }}</td>
          <td>{{ patient.dob }}</td>
          <td>
            <ul>
              <li v-for="file in patient.files" :key="file.id">
                <NuxtLink :to="`/detailed-file`">
                  {{ file.filename }}
                </NuxtLink>
              </li>
            </ul>
          </td>
          <td>
            <NuxtLink :to="`/add-files`">
              <button>Add File</button>
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
table,
th,
td {
  border: 1px solid black;
  margin: 0 auto;
}
</style>