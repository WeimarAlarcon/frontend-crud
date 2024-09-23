<template>
  <div>
    <li v-for="(notificacion, index) in notificaciones" :key="index">
      {{ notificacion }}
    </li>
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'NotificacionTPage',
});

const socket = io('http://localhost:3000');
const notificaciones = ref<string[]>([]);

onMounted(() => {
  socket.on('notificacion', (mensaje: string) => {
    console.log(mensaje);
    notificaciones.value.push(mensaje);
  });
});
</script>

<style scoped></style>
