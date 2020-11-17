<template>
    <v-row justify="space-around" :style="{'margin-top': '60px'}">
      <v-col
        cols="12"
        sm="6"
        xs="12"
        md="6"
        lg="3"
      >
    <v-flex xs12 sm12 md12 >
      <panel title="Login">
        <v-text-field
          label="E-mail"
          v-model="email"
          cy-data="email"
        ></v-text-field>
        <br>
        <v-text-field
          v-on:keyup.enter="login"
          label="Senha"
          type="password"
          v-model="password"
          cy-data="password"
        ></v-text-field>
        <br>
        <div class="danger-alert" v-html="error" />
        <br>
        <v-btn
          dark
          color="#464AA7"
          cy-data="btn-login"
          @click="login">
          Login
        </v-btn>
      </panel>
    </v-flex>
    <v-flex xs12 sm12 md12 >
            <v-img :style="{'margin': '20px 0px 0px 0px','width':'250px', 'display': 'inline-flex'}" :src="require('@/assets/logo-nome.png')"/>
    </v-flex>
      </v-col>
    <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="'warning'"
        :top="true"
        :auto-height="true"
        :vertical="true"
      >
        {{snackbarMessage}}
      </v-snackbar>
  </v-row>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null,
      snackbar: false,
      snackbarMessage: ''
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.$root.exibirFooter = true;
      this.$root.exibirNavBar = false;
      if (this.$root.userLogado) {
        this.snackbar = true;
        this.snackbarMessage = 'Sessão expirada. Realize o login novamente.';
      }
    },
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        this.$store.dispatch('setToken', response.data.token);
        this.$store.dispatch('setUser', response.data.user);
        this.$router.push({
          name: 'Clientes'
        });
        this.$root.userLogado = true;
        this.$root.exibirNavBar = true;
        this.$root.exibirFooter = false;
      } catch (error) {
        this.error = error.response.data.error;
        this.$root.exibirNavBar = false;
      }
    },

    enableNavBar() {
      this.$root.exibirNavBar = true;
    }
  }
};
</script>

<style scoped>
</style>
