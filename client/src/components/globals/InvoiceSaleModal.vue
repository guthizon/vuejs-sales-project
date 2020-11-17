<template>
  <v-dialog
    max-width="700px"
    :value="openDialog"
    @keydown.esc="$emit('cancel')"
  >
   <v-card>
    <v-card-title>
        Faturamento
    </v-card-title>
      <v-card-text >
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md3>
              <v-text-field v-model="clientCpfCnpj" @click:append="searchClient" label="CPF/CNPJ" append-icon="fa-search" :rules="[rules.required]" @blur="setUserName(clientCpfCnpj)" ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md9>
              <v-text-field data-cy="cliente" v-model="clientName" ref="nomeCliente" label="Nome Cliente"  :style="{'margin':'-8px 0px 0px 0px'}" filled disabled></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field :value="emissionDateInvoice && formatToShow(emissionDateInvoice)" data-cy="dataEmissao"  @change="emissionDateInvoice = formatDate($event)"  label="Data Emissão"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field :value="dueDateInvoice && formatToShow(dueDateInvoice)" data-cy="dataVcto" @change="dueDateInvoice = formatDate($event)" label="Data Vencimento"></v-text-field>
            </v-flex>
            <v-card outlined elevation="0">
              <v-card-title style="color:cadetblue">
                Histórico dos Serviços
              </v-card-title>
              <v-layout row v-for="(service, index) in servicesHistory" :key="service._id" >
                <v-flex xs12 sm6 md3>
                  <v-text-field
                    :value="service.emissionDateService && formatToShow(service.emissionDateService)"
                    @change="service.emissionDateService = formatDate($event)" 
                    style="margin-left:5px"
                    label="Emissão"
                    data-cy="dataServico"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md5>
                  <v-textarea
                    v-model="service.descriptionServce"
                    rows="1"
                    auto-grow
                    label="Descrição"
                    data-cy="descServico"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <currency-input
                    v-model="service.valueService"
                    label="Valor"
                    data-cy="paymentInstallmentsValue"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm4 md2 >
                  <v-btn 
                    elevation="2"
                    icon
                    medium
                    tile
                    title="Adicionar Histórico" 
                    @click="addServiceHistory()"
                    style="margin: 10px 0 0 5px; min-width:0px; color:green">
                    <v-icon style="font-size: 12px">fa-plus</v-icon>
                  </v-btn>
                  <v-btn 
                    elevation="2"
                    icon
                    medium
                    tile
                    title="Excluir Histórico" 
                    @click="removeHistoryService(index)"
                    style="margin: 10px 0 0 5px; min-width:0px; color:red"
                  >
                    <v-icon style="font-size: 12px">far fa-trash-alt</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
          </v-layout>
          <v-snackbar
            v-model="snackbar"
            :timeout="snackBarTime"
            :color="snackbarType"
            :top="true"
            :vertical="true"
          >
            {{snackbarMessage}}
          </v-snackbar>
          <lov-users
            :lovUsers="lovUsers"
            @save="setUserData"
            @cancel="lovUsers = false"
            v-if="lovUsers"
          >
          </lov-users>
        </v-container>
      </v-card-text>
      <v-card-actions style="justify-content:flex-end">
        <v-btn
         color="green"
         text
         @click="validateItem"
        > 
         Confirmar
        </v-btn>
        <v-btn
         color="warning"
         text
        > 
         Excluir
        </v-btn>
        <v-btn
          color="red"
          text
          @click="$emit('cancel')"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import currencyInput from './CurrencyInputField'
import lovUsers from './LovUsers'
import UserService from '@/services/UserService';
const moment = require('moment');

export default {
  components: {
    'currency-input': currencyInput,
    'lov-users': lovUsers
  },
  props: ['openDialog', 'invoice'],
  data() {
    return { 
      lovUsers: false,
      clientInvoice: '',
      clientName: '',
      clientCpfCnpj: '',
      emissionDateInvoice: undefined,
      dueDateInvoice: undefined,
      _id: undefined,
      servicesHistory: [],
      defaultItemService: {
        emissionDateService: '',
        descriptionServce: '',
        valueService: 0
      },
      defaultItem: {
        clientInvoice: '',
        emissionDateInvoice: '',
        dueDateInvoice: '',
      },
      editedItem: {},
      snackbar: false,
      snackbarMessage: '',
      snackBarTime: 5000,
      snackbarType: '',
      rules: {
        required: value => !!value || 'Required.'
      },
      error: false
    };
  },
  async created() {
    if (this.invoice && this.invoice._id !== undefined) {
      this.clientInvoice = this.invoice.clientInvoice;
      this.clientName = this.invoice.userName;
      this.clientCpfCnpj = this.invoice.userCpfCnpj;
      this.emissionDateInvoice = this.invoice.emissionDateInvoice;
      this.dueDateInvoice = this.invoice.dueDateInvoice;
      this.servicesHistory = this.invoice.servicesHistory;
      this._id = this.invoice._id;
    } else {
      this.initialize();
    }
  },
  methods: {
    initialize() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.clientInvoice = '';
      this.emissionDateInvoice = this.invoice.emissionDateInvoice;
      this.dueDateInvoice = '';
      this.addServiceHistory();
      this.$nextTick(function() {
        this.servicesHistory[0].descriptionServce = this.invoice.saleDescription;
        this.servicesHistory[0].emissionDateService = this.invoice.emissionDateInvoice;
        this.servicesHistory[0].valueService = this.invoice.totalValue;
      });
    },
    addServiceHistory() {
      if (!this.servicesHistory || this.servicesHistory.length === 0) {
        this.servicesHistory = [];
      }
      this.servicesHistory.push(
        Object.assign({}, this.defaultItemService)
      );
    },
    removeHistoryService(index) {
       if (this.servicesHistory.length > 1) {
        this.servicesHistory.splice(index, 1);
      } else {
        this.snackbar = true;
        this.snackbarMessage = `É necessário ao menos um histórico de serviço cadastrado!`;
        this.snackbarType = 'warning';
      }
    },
    createInvoice() {
      this.editedItem.clientInvoice = this.clientInvoice;
      this.editedItem.dueDateInvoice = this.dueDateInvoice;
      this.editedItem.emissionDateInvoice = this.emissionDateInvoice;
      this.editedItem.servicesHistory = this.servicesHistory;
      this.editedItem._id = this._id;
      return this.editedItem;
    },
    formatDate: function(dateStr) {
      return moment(dateStr, 'DD/MM/YYYY');
    },
    formatToShow: function(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    setUserData(data) {
      if (data !== undefined) {
        let user = data[0];
        this.clientName = '';
        this.clientCpfCnpj = '';
        this.clientName = user.name;
        this.clientCpfCnpj = user.cpfCnpj;
        this.clientInvoice = user._id;
        this.lovUsers = false;
      }
    },
    searchClient() {
      this.lovUsers = true;
    },
    async setUserName(id) {
      let self = this;
      self.clientName = '';
      self.clientCpfCnpj = '';
      self.clientInvoice = '';
      await UserService.index({cpfCnpj: id}).then(function(data) {
        self.clientName = data.data[0].name;
        self.clientCpfCnpj = data.data[0].cpfCnpj;
        self.clientInvoice = data.data[0]._id;
      });
    },
    validateItem() {
      this.error = false;
      if (!this.clientCpfCnpj || !this.dueDateInvoice || !this.emissionDateInvoice) {
        this.snackbar = true;
        this.snackbarMessage = `Todos os campos devem estar preenchidos!`;
        this.snackbarType = 'warning';
        this.error = true;

      } else {
        for (let i = 0; i < this.servicesHistory.length; i++) {
          if(!this.servicesHistory[i].descriptionServce || !this.servicesHistory[i].emissionDateService) {
            this.snackbar = true;
            this.snackbarMessage = `Todos os campos do histórico de serviços devem estar preenchidos!`;
            this.snackbarType = 'warning';
            this.error = true;
            break;
          }
        }
      }
      if (!this.error) {
        this.$emit('save', this.createInvoice());
      }
    }
  }
};
</script>

<style>

</style>