<template>
  <div class="q-pa-md">
    <q-table
      title="Personas"
      :rows="personas"
      :columns="columns"
      v-model:selected="selection"
      @row-click="selectRow"
      row-key="id"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="person_add"
          label="Nueva Persona"
          no-caps
          @click="alert = true"
        />
      </template>
      <template v-slot:body-cell-actions="props">
        <td>
          <q-btn
            flat
            round
            color="blue"
            icon="visibility"
            @click="getIdPersona(props.row.id)"
            ><q-tooltip>Ver</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="green"
            icon="edit"
            @click="updatePersona(props.row.id)"
            ><q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="deletePersona(props.row.id)"
            ><q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </td>
      </template>
    </q-table>
    <PersonaForm :alert="alert" @update:alert="cerrarDialogos" />
    <PersonaView
      :view="view"
      :id="idPersona ?? 0"
      @update:view="cerrarDialogos"
    />
    <PersonaEdit
      :edit="edit"
      :id="idPersona ?? 0"
      @update:edit="cerrarDialogos"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PersonaForm from './PersonaForm.vue';
import PersonaView from '../views/PersonaView.vue';
import { useQuasar } from 'quasar';
import PersonaEdit from './PersonaEdit.vue';
import {
  getPersonas,
  remove,
} from 'src/modules/personas/services/personaService';

defineOptions({
  name: 'PersonaTablePage',
});

const $q = useQuasar();
const idPersona = ref<number | undefined>(undefined);
const alert = ref(false);
const view = ref(false);
const edit = ref(false);

const cerrarDialogos = async (newValue: boolean) => {
  alert.value = newValue;
  view.value = newValue;
  edit.value = newValue;
  await listaPersonas();
};

let selection = ref<RowData[]>([]);
const personas = ref([]);

const listaPersonas = async () => {
  const response = await getPersonas();
  personas.value = response.data;
};

const selectRow = (ev: Event, row: RowData) => {
  selection.value = [row];
};

const getIdPersona = async (id: number) => {
  idPersona.value = id;
  view.value = true;
};

const updatePersona = async (id: number) => {
  idPersona.value = id;
  edit.value = true;
};

const deletePersona = async (id: number) => {
  try {
    $q.dialog({
      title: 'Confirmar!',
      message: '¿Desea eliminar a esta persona?',
      ok: {
        label: 'Aceptar',
        color: 'primary',
      },
      cancel: {
        label: 'Cancelar',
        color: 'negative',
      },
      persistent: true,
    }).onOk(async () => {
      await remove(id);
      let seconds = 2;
      const dialog = $q
        .dialog({
          title: 'Eliminado!',
          message: 'Se Elimino datos de Persona.',
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

      await listaPersonas();
    });
  } catch (error) {
    console.log(error);
  }
};

type RowData = {
  id: number;
  carnet_identidad: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  celular: string;
  telefono: string;
  direccion: string;
  edad: number;
  estado_civil: string;
  profesion: string;
  genero: string;
  action: string;
};

const columns: Array<{
  name: string;
  label: string;
  required?: boolean;
  align?: 'center';
  field: string | ((row: RowData) => string | number); // Especifica el tipo de retorno
  format?: (val: string | number | boolean) => string; // Restringe el formato a tipos específicos
  sortable?: boolean;
  sort?: (a: string | number, b: string | number) => number; // Tipos específicos para la comparación
}> = [
  // {
  //   name: 'index',
  //   label: '#',
  //   field: 'index',
  //   sortable: true,
  // },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'center',
    sortable: true,
    format: (val): string => {
      if (val === true) {
        return 'Activo';
      } else if (val === false) {
        return 'Inactivo';
      }
      return '';
    },
  },
  {
    name: 'carnetIdentidad',
    label: 'Nro. de Carnet',
    field: 'carnetIdentidad',
    align: 'center',
    sortable: true,
  },
  {
    name: 'nombre',
    label: 'Nombres',
    field: 'nombre',
    align: 'center',
    sortable: true,
  },
  {
    name: 'apellidoPaterno',
    label: 'Apellido Paterno',
    field: 'apellidoPaterno',
    align: 'center',
    sortable: true,
  },
  {
    name: 'apellidoMaterno',
    label: 'Apellido Materno',
    field: 'apellidoMaterno',
    align: 'center',
    sortable: true,
  },
  {
    name: 'fechaNacimiento',
    label: 'Fecha Nacimiento',
    field: 'fechaNacimiento',
    align: 'center',
    sortable: true,
    format: (val) => {
      const date = new Date(val as string | number);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
  },
  {
    name: 'genero',
    label: 'Genero',
    field: 'genero',
    align: 'center',
    sortable: true,
  },
  {
    name: 'edad',
    label: 'Edad',
    field: 'edad',
    align: 'center',
    sortable: true,
  },
  {
    name: 'profesion',
    label: 'Profesion',
    field: 'profesion',
    align: 'center',
    sortable: true,
  },
  {
    name: 'estadoCivil',
    label: 'Estado Civil',
    field: 'estadoCivil',
    align: 'center',
    sortable: true,
  },
  {
    name: 'direccion',
    label: 'Domicilio',
    field: 'direccion',
    sortable: true,
  },
  {
    name: 'celular',
    label: 'Celular',
    field: 'celular',
    sortable: true,
  },
  {
    name: 'telefono',
    label: 'Telefono',
    field: 'telefono',
    sortable: true,
  },
];

onMounted(async () => {
  await listaPersonas();
});
</script>

<style scoped></style>
