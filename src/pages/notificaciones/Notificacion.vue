<template>
  <div>
    <h3>Notificacion</h3>
    <NotificacionT />
  </div>
</template>

<script setup lang="ts">
import NotificacionT from 'src/modules/notificaciones/components/Notificacion.vue';

defineOptions({
  name: 'NotificacionPage',
});
</script>

<style lang="scss" scoped></style>
