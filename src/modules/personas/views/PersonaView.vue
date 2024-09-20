<template>
  <q-dialog v-model="localAlert" persistent>
    <q-card style="width: 600px" class="q-pa-md">
      <q-bar class="bg-white q-my-auto">
        <q-item-label><strong>DATOS PERSONALES:</strong></q-item-label>
      </q-bar>
      <q-card-section>
        <div class="row">
          <div class="col-12 q-pl-md">
            <q-list dense padding>
              <q-item>
                <q-item-section
                  ><strong>Documento de Identidad:</strong></q-item-section
                >
                <q-item-section>
                  {{ persona.carnetIdentidad }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Nombre:</strong></q-item-section>
                <q-item-section>
                  {{ persona.nombre }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section
                  ><strong>Apellido Paterno:</strong></q-item-section
                >
                <q-item-section>
                  {{ persona.apellidoPaterno }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section
                  ><strong>Apellido Materno:</strong></q-item-section
                >
                <q-item-section>
                  {{ persona.apellidoMaterno }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Profesión:</strong></q-item-section>
                <q-item-section>
                  {{ persona.profesion }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Estado Civil:</strong></q-item-section>
                <q-item-section>
                  {{ persona.estadoCivil }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Domicilio:</strong></q-item-section>
                <q-item-section>
                  {{ persona.direccion }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section
                  ><strong>Fecha Nacimiento:</strong></q-item-section
                >
                <q-item-section>
                  {{ persona.fechaNacimiento.split('T')[0] }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Edad:</strong></q-item-section>
                <q-item-section>
                  {{ persona.edad }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Celular:</strong></q-item-section>
                <q-item-section>
                  {{ persona.celular }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section><strong>Telefono:</strong></q-item-section>
                <q-item-section>
                  {{ persona.telefono }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn color="negative" label="Cerrar" @click="closedAlert" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { getIdPersona } from '../services/persona.service';

const props = defineProps({
  view: { type: Boolean, default: false, required: true },
  id: { type: Number, default: null, required: true },
});
const emit = defineEmits<{
  'update:view': [value: boolean];
}>();

// const id = ref<number | null>(null);
const persona = reactive({
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
});

const localAlert = ref(false);
const idperson = ref<number | null>(null);

watch([() => props.view, () => props.id], async ([newView, newId]) => {
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

const closedAlert = async () => {
  persona.id = null;
  emit('update:view', false); // Emite evento al componente padre
};
</script>

<style scoped></style>
