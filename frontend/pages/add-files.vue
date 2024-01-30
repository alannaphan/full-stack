<script setup>
</script>

<template>
  <h1>Add File Page</h1>
  <div class="button">

    <button @upload="uploadFile">Upload File</button>
    <button @submit="submitFile">Submit File</button>
  </div>
  <p>
    On this page, I would use the upload button to upload patient files. It would submit to the Firebase storage bucket. <br>
    When uploading the file, I was planning on retrieving the downloadUrl or reference link to the file and submitting that to the database via the addFile Mutation. <br>
    After uploading the file, the page would redirect to the detailed file page.
  </p>
</template>

<style>
.button {
  text-align: center;
}
</style>