<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="localAlert" persistent>
      <q-card style="min-width: 700px">
        <q-card-section>
          <div class="text-h6">Registrar Persona</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md">
            <div class="col-3">
              <q-input
                outlined
                v-model="persona.carnetIdentidad"
                label="Carnet de Identidad"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="persona.nombre"
                label="Nombres"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="persona.apellidoPaterno"
                label="Primer Apellido"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                outlined
                v-model="persona.apellidoMaterno"
                label="Segundo Apellido"
                dense
              />
            </div>
            <div class="col-4">
              <q-input
                outlined
                v-model="persona.fechaNacimiento"
                mask="date"
                :rules="['date']"
                dense
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="persona.fechaNacimiento"
                        @update:model-value="onDateChange"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-4">
              <q-input outlined v-model="persona.edad" label="Edad" dense />
            </div>
            <div class="col-4">
              <q-select
                outlined
                v-model="persona.genero"
                :options="options"
                label="Genero"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="persona.estadoCivil"
                label="Estado Civil"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="persona.profesion"
                label="Profesión"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="persona.celular"
                label="Celular"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="persona.telefono"
                label="Telefono"
                dense
              />
            </div>
            <div class="col-12">
              <q-input
                outlined
                v-model="persona.direccion"
                label="Dirección"
                dense
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="closedAlert" />
          <q-btn flat label="Registrar" @click="crearPersona" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, watch } from 'vue';
import {
  post,
  enviarMensaje,
  usePersonaSocket,
} from '../services/persona.service';
import { useQuasar } from 'quasar';
import { PersonaInterface } from '../interfaces/persona.interface';

const $q = useQuasar();
const localAlert = ref(false);
const options = ['Masculino', 'Femenino'];
const { personaNueva } = usePersonaSocket();

const persona: PersonaInterface = reactive({
  id: null as number | null,
  carnetIdentidad: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  celular: '',
  telefono: '',
  direccion: '',
  edad: null as number | null,
  estadoCivil: '',
  profesion: '',
  genero: '',
  estado: undefined,
});

const calcularEdad = (dateString: Date): number => {
  let hoy = new Date();
  let fechaNacimiento = new Date(dateString);
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
  if (
    diferenciaMeses < 0 ||
    (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    edad--;
  }
  return edad;
};

watch(
  () => persona.fechaNacimiento,
  (newFecha) => {
    if (newFecha) {
      persona.edad = calcularEdad(new Date(newFecha)); // Actualiza la edad automáticamente
    }
  }
);

watch(personaNueva, (nuevoMensajeRecibido) => {
  if (nuevoMensajeRecibido) {
    console.log('Nuevo mensaje recibido:', nuevoMensajeRecibido);
  }
});

const onDateChange = (newFecha: string) => {
  persona.edad = calcularEdad(new Date(newFecha)); // Actualiza la edad al seleccionar una nueva fecha
};

const props = defineProps({
  alert: { type: Boolean, default: false, required: true },
});
const emit = defineEmits<{
  'update:alert': [value: boolean];
}>();

watchEffect(() => {
  localAlert.value = props.alert; // Sincroniza el valor inicial de la prop
});

const crearPersona = async () => {
  const response = await post(persona);
  enviarMensaje(persona);
  if (response.statusCode === 409) {
    let seconds = 2;
    const dialog = $q
      .dialog({
        title: 'Error!',
        message: response.message,
        ok: false,
        color: 'primary',
        position: 'bottom',
      })
      .onDismiss(() => {
        clearTimeout(timer);
      });

    const timer = setInterval(() => {
      seconds--;
      if (!(seconds > 0)) {
        clearInterval(timer);
        dialog.hide();
      }
    }, 1000);
    closedAlert();
  } else {
    let seconds = 2;
    const dialog = $q
      .dialog({
        title: 'Registrado!',
        message: 'Se Registro una nueva Persona.',
        ok: false,
        color: 'primary',
        position: 'bottom',
      })
      .onDismiss(() => {
        clearTimeout(timer);
      });

    const timer = setInterval(() => {
      seconds--;
      if (!(seconds > 0)) {
        clearInterval(timer);
        dialog.hide();
      }
    }, 1000);
    closedAlert();
  }
};

const closedAlert = async () => {
  persona.id = null;
  persona.carnetIdentidad = '';
  persona.nombre = '';
  persona.apellidoPaterno = '';
  persona.apellidoMaterno = '';
  persona.fechaNacimiento = '';
  persona.celular = '';
  persona.telefono = '';
  persona.direccion = '';
  persona.edad = null;
  persona.estadoCivil = '';
  persona.profesion = '';
  persona.genero = '';
  emit('update:alert', false); // Emite evento al componente padre
};
</script>

<style scoped></style>
