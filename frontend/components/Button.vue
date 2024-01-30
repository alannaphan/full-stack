
import type { NuxtLink } from '#build/components';
<script setup>
  const props = defineProps({
    label: String,
    path: String
  })

</script>

<template>
  <div>
    <NuxtLink :to="path">
      <button>{{ label || 'Click me' }}</button>
    </NuxtLink>
  </div>
</template>