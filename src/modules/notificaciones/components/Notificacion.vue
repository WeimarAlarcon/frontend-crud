<template>
  <div>
    <div class="row">
      <q-input
        v-model="nuevoMensaje"
        placeholder="Escribe un mensaje"
        outlined
        dense
        width="100px"
        style="width: 300px"
      />
      <q-btn @click="enviarMensaje" label="Enviar" />
    </div>
    <div class="row">
      <h5>listas</h5>
      <q-item>
        <q-item-section>
          <!-- <q-item-label>Mensaje recibido: {{ mensajeRecibido }}</q-item-label> -->
          <ul>
            <li v-for="(notificacion, index) in notificaciones" :key="index">
              {{ notificacion }}
            </li>
          </ul>
        </q-item-section>
      </q-item>
    </div>
    <div class="row">
      <h5>Notificaciones de registro</h5>
      <q-item>
        <q-item-section>
          <ul>
            <li v-for="(persona, index) in notificacionesPersonas" :key="index">
              {{ persona }}
            </li>
          </ul>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWebSocket } from '../services/websocket';
defineOptions({
  name: 'NotificacionTPage',
});

const notificaciones = ref<string[]>([]);
const notificacionesPersonas = ref<string[]>([]);

const { mensaje, sendMessage, personas } = useWebSocket();

const nuevoMensaje = ref('');

watch(mensaje, (nuevoMensajeRecibido) => {
  if (nuevoMensajeRecibido) {
    console.log('Nuevo mensaje recibido:', nuevoMensajeRecibido);
    notificaciones.value.push(nuevoMensajeRecibido); // Agrega al array
  }
});

watch(personas, (nuevoMensajeRecibido) => {
  if (nuevoMensajeRecibido) {
    // console.log('Nuevo mensaje recibido:', nuevoMensajeRecibido);
    notificacionesPersonas.value.push(nuevoMensajeRecibido); // Agrega al array
  }
});

const enviarMensaje = () => {
  sendMessage(nuevoMensaje.value);
  nuevoMensaje.value = '';
};
</script>

<style scoped></style>
