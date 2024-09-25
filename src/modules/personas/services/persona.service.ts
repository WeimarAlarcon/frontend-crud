import { api } from 'src/boot/axios';
import { PersonaInterface } from '../interfaces/persona.interface';
import io from 'socket.io-client';
import { onMounted, onUnmounted, ref } from 'vue';

const socket = io('http://localhost:3000'); // Reemplaza con la URL de tu servidor

export const getPersonas = async () => {
  return await api.get('/personas');
};

export const post = async (persona: PersonaInterface) => {
  try {
    const { data } = await api.post('/personas', persona);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getIdPersona = async (id: number) => {
  const persona = await api.get(`/personas/${id}`);
  return persona;
};

export const update = async (id: number, persona: PersonaInterface) => {
  try {
    const { data } = await api.patch(`/personas/${id}`, persona);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (id: number) => {
  try {
    const { data } = await api.delete(`/personas/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export function usePersonaSocket() {
  const personaNueva = ref('');
  const notificaciones = ref(0);

  onMounted(() => {
    socket.on('personaNueva', (data) => {
      personaNueva.value = data;
      notificaciones.value += 1;
      // console.log(data);
    });
  });

  onUnmounted(() => {
    socket.off('personaNueva');
  });
  return {
    personaNueva,
    notificaciones,
  };
}

export const enviarMensaje = (persona: PersonaInterface) => {
  socket.emit('enviarMensaje', persona);
};
