<template>
  <v-layout>
    <v-dialog
      :value="lovUsers"
      max-width="500px"
    >
      <v-card
        class="mx-auto"
        max-width="500px"
      >
        <v-text-field
          :style="{'padding':'30px 20px 0px 20px'}"
          v-model="searchUsers"
          append-icon="fa-search"
          label="Localizar"
          hide-details
          data-cy="localizarUsers"
        ></v-text-field>
        <v-data-table
          :headers='headersUsers'
          :items='users'
          :search='searchUsers'
          :single-select="true"
          item-key="cpfCnpj"
          v-model="userSelected"
          class="elevation-1"
          show-select
          :options.sync="pagination"
          :footer-props="{
            'items-per-page-text': 'Registros por página'
          }"
            :style="{'margin':'30px 20px 20px 20px'}"
        >
        </v-data-table>
        <v-btn :style="{'margin-bottom':'20px'}" data-cy="btn-cancelar" color="blue darken-1" text @click.native="$emit('save', selectUserLov(userSelected))">Selecionar</v-btn>
        <v-btn data-cy="btn-salvar" :style="{'margin-bottom':'20px'}" color="red darken-1" text @click.native="lovUsers=false">Cancelar</v-btn>
      </v-card>
      <v-snackbar
        v-model="snackbar"
        :timeout="snackBarTime"
        :color="snackbarType"
        :top="true"
        :vertical="true"
        >
        {{snackbarMessage}}
      </v-snackbar>
    </v-dialog>
  </v-layout>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  props: ['lovUsers'],
  data() {
    return {
      userSelected: undefined,
      searchUsers: '',
      users: [],
      snackbarMessage: '',
      snackbar: false,
      snackbarType: '',
      snackBarTime: 3000,
      headersUsers: [
        {text: 'CPF', align: 'center', value: 'cpfCnpj'},
        {text: 'Nome', align: 'center', value: 'name'}
      ],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  async created(){
    await this.getUsers();
  },
  methods: {
    selectUserLov(user) {
      if (user && user.length > 0) {
        return user;
      } else {
        this.snackbar = true;
        this.snackbarType = 'info';
        this.snackBarTime = 5000;
        this.snackbarMessage = 'Selecione um cliente!'
        return undefined;
      }
      this.userSelected = undefined; 
    },
    async getUsers() {
      let self = this;
      await UserService.index().then(function(data) {
        self.users = data.data;
      });
    }
  }
}
</script>

<style>

</style>