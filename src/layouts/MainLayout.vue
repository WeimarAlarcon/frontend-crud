<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>
        <q-btn-dropdown rounded>
          <template v-slot:label>
            <div class="row items-center no-wrap" v-if="notificaciones >= 0">
              <q-icon name="notifications" />
              <q-badge floating color="red" rounded>
                {{ notificaciones }}
              </q-badge>
            </div>
          </template>
          <!-- <q-badge v-if="notificaciones >= 0" floating color="red" rounded>
            {{ notificaciones }}
          </q-badge> -->
          <!-- Lista de personas en el dropdown -->
          <q-list v-if="personas.length > 0">
            <q-item v-for="(persona, index) in personas" :key="index" clickable>
              <q-item-section>
                <q-item-label>
                  <strong
                    >Fecha y Hora: {{ new Date().toLocaleString() }}</strong
                  ><br />
                  CI: {{ persona.carnetIdentidad }}<br />
                  Nombre:
                  {{
                    `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list v-else>
            <q-item>
              <q-item-section>
                <q-item-label>No hay notificaciones nuevas</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { usePersonaSocket } from '../modules/personas/services/persona.service';
import { PersonaInterface } from 'src/modules/personas/interfaces/persona.interface';

defineOptions({
  name: 'MainLayout',
});

const $q = useQuasar();

const { notificaciones, personaNueva } = usePersonaSocket();
const personas = ref<PersonaInterface[]>([]);
// Mostrar notificación
const mostrarNotificacion = (persona: PersonaInterface) => {
  $q.notify({
    message: 'Nueva persona Regitrada:', // Ajusta según los datos que quieras mostrar
    caption: `CI: ${persona.carnetIdentidad} <br> 
      Nombre: ${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno} <br>
      Fecha de nacimiento: ${persona.fechaNacimiento} <br>
    `,
    timeout: 3000, // Duración de la notificación
    type: 'info',
    color: 'primary',
    position: 'top-right',
    html: true,
  });
};

// Escuchar cambios en las personas registradas
watch(personaNueva, (nuevaPersona) => {
  if (nuevaPersona) {
    mostrarNotificacion(nuevaPersona as unknown as PersonaInterface); // Mostrar la notificación si llega una nueva persona
    personas.value.push(nuevaPersona as unknown as PersonaInterface); // Agrega la nueva persona a la lista
  }
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Personas',
    caption: 'Datos de personas',
    icon: 'person',
    link: 'persona',
  },
  {
    title: 'Notificaciones',
    caption: 'Notificaciones Push',
    icon: 'notifications',
    link: 'notificacion',
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
