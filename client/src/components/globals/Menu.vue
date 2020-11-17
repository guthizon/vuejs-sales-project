<template>
  <v-card
  class="mx-auto"
  width="256"
  tile
  >
    <v-navigation-drawer
    app
    v-model="$root.drawer"
    fixed
    temporary
    >
      <v-system-bar></v-system-bar>
      <v-list style="text-align: start" >
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="'https://ui-avatars.com/api/?name=' + $store.state.user.name"></v-img>
          </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title>{{ $store.state.user.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon @click.stop="$root.drawer = false">fa-chevron-left</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list
      nav
      dense
      data-cy="itens-menu"
      >
        <v-list-item-group color="primary">
          <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="alterarMenu(item)"
          >
            <v-list-item-icon>
              <v-icon style="font-size: 20px" v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content style="text-align: start">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      appMounted: false,
      primaryColor: 'blue',
      items: [
        { title: 'Clientes', icon: 'fa-user', route: 'Clientes', exibirBarraTopo: true },
        { title: 'Vendas', icon: 'fa-handshake', route: 'Vendas', exibirBarraTopo: true },
        { title: 'Sair', icon: 'fa-power-off', route: 'Login', exibirBarraTopo: true }
      ],
      right: null
    };
  },
  mounted: function() {
    this.appMounted = true;
  },
  methods: {
    alterarMenu: function(menu) {
      if (menu.exibirBarraTopo === false) {
        this.$root.exibirBarraTopo = false;
      } else {
        this.$root.exibirBarraTopo = true;
      }
      if (this.$router.currentRoute.name !== null && menu.route !== this.$router.currentRoute.name) {
        this.$router.push({name: menu.route});
      } else {
        this.$router.push({name: menu.route});
        this.$router.go();
      }
      if (menu.route === 'Login') {
        this.$store.dispatch('setToken', null);
        this.$store.dispatch('setUser', null);
        this.$root.userLogado = false;
      }
    }
  }
};
</script>
