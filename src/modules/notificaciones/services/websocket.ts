import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Reemplaza con la URL de tu servidor

export function useWebSocket() {
  const mensaje = ref('');

  const personas = ref('');

  onMounted(() => {
    socket.on('notificacion', (data) => {
      mensaje.value = data;
      console.log(data);
    });

    socket.on('nuevaPersona', (data) => {
      personas.value = data;
      console.log(data);
    });
  });

  onUnmounted(() => {
    socket.off('notificacion');
    socket.off('nuevaPersona');
  });

  const sendMessage = (msg: string) => {
    socket.emit('sendMessage', msg);
  };

  return {
    mensaje,
    personas,
    sendMessage,
  };
}
