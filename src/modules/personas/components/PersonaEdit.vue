<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="localAlert" persistent>
      <q-card style="min-width: 700px">
        <q-card-section>
          <div class="text-h6">Editar Persona</div>
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
          <q-btn flat label="Actualizar" @click="editarPersona" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { getIdPersona, update } from '../services/persona.service';
import { useQuasar } from 'quasar';
import { PersonaInterface } from '../interfaces/persona.interface';

getIdPersona;
const localAlert = ref(false);
const options = ['Masculino', 'Femenino'];
const idperson = ref<number | null>(null);
const $q = useQuasar();

const persona: PersonaInterface = reactive({
  id: null,
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

const onDateChange = (newFecha: string) => {
  persona.edad = calcularEdad(new Date(newFecha)); // Actualiza la edad al seleccionar una nueva fecha
};

const props = defineProps({
  edit: { type: Boolean, default: false, required: true },
  id: { type: Number, default: null, required: true },
});
const emit = defineEmits<{
  'update:edit': [value: boolean];
}>();

watch([() => props.edit, () => props.id], async ([newView, newId]) => {
  localAlert.value = newView;
  idperson.value = newId;

  if (idperson.value === undefined) {
    return; // Si el id es undefined, salimos de la función
  }

  try {
    const response = await getIdPersona(idperson.value);
    const { data } = response;

    // Asignamos los valores del objeto recibido a 'persona'
    persona.id = data.id;
    persona.carnetIdentidad = data.carnetIdentidad;
    persona.nombre = data.nombre;
    persona.apellidoPaterno = data.apellidoPaterno;
    persona.apellidoMaterno = data.apellidoMaterno;
    persona.fechaNacimiento = data.fechaNacimiento;
    persona.celular = data.celular;
    persona.telefono = data.telefono;
    persona.direccion = data.direccion;
    persona.edad = data.edad;
    persona.estadoCivil = data.estadoCivil;
    persona.profesion = data.profesion;
    persona.genero = data.genero;
  } catch (error) {
    console.error('Error al obtener los datos de la persona:', error);
  }
});

const editarPersona = async () => {
  if (idperson.value !== null) {
    await update(idperson.value, persona);

    let seconds = 2;
    const dialog = $q
      .dialog({
        title: 'Editado!',
        message: 'Datos de persona fueron editados',
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
    console.error('ID de persona es null');
  }
};

const closedAlert = async () => {
  emit('update:edit', false); // Emite evento al componente padre
};
</script>

<style scoped></style>
