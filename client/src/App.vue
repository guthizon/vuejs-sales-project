<template>
  <div id='app' :class="{'ocultarBarraTopo': $root.exibirBarraTopo === false}">
    <v-app>
      <Menu />
      <Toolbar v-if="$root.exibirBarraTopo" class="fitzone-toolbar" />
      <v-main class="pt-1">
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
      <Footer v-if="$root.exibirFooter"/>
    </v-app>
  </div>
</template>

<script>
import Menu from '@/components/globals/Menu.vue';
import Toolbar from '@/components/globals/Toolbar.vue';
import Footer from '@/components/globals/Footer.vue';

export default {
  name: 'app',
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        document.title = `TripZone - ${to.name}` || 'TripZone';
      }
    }
  },
  components: {
    Menu,
    Toolbar,
    Footer
  }
};
</script>

<style >

@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"), url('../src/assets/fonts/Montserrat-Medium.ttf') format("truetype");
}

#app {
  font-family: "Montserrat", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app.ocultarBarraTopo {
  margin-top: -60px !important;
}

.danger-alert {
  color: red;
}

@media print {
   .fitzone-toolbar {
      visibility: hidden;
   }
}
</style>
