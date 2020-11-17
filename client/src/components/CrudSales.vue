<template>
  <div>
    <v-layout row wrap justify-center :style="{'background-color': 'white', 'border-bottom': '2px solid rgba(0,0,0,.12)', 'margin-left':'0px', 'margin-right':'0px'}" >
      <div style="font-size:20px; align-self:center; margin-left:10px">Vendas</div>
      <v-divider
        class="mx-2 divider"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field
        :class="classTextField"
        v-model="search"
        append-icon="fa-search"
        label="Localizar"
        hide-details
        data-cy="input-localizar"
      ></v-text-field>
      <v-dialog v-model='dialog' max-width="1200px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn data-cy="btn-venda" raised color="#464AA7" v-bind="attrs" v-on="on" style="margin-top: 10px; color: white">Nova Venda</v-btn>
        </template>
        <v-card>
          <v-form ref="form">
          <v-card-title>
            <span :style="{'font-size':'24px', 'font-weight':'500'}">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm8 md3>
                  <v-select
                    v-model="editedItem.seller"
                    :items="sellers"
                    label="Vendedor(a)"
                    data-cy="vendendor"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="dataVenda" :return-masked-value="true" :value="editedItem.saleDate && formatToShow(editedItem.saleDate)" @change="editedItem.saleDate = formatDate($event)" :mask="'##/##/####'" label="Data Venda"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field append-icon="fa-search" @click:append="searchClient" data-cy="cpf" ref="cpf" v-model='codePassenger' label="CPF Cliente" :rules="[rules.required]" @blur="setPassengerData(codePassenger)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md5>
                  <v-text-field data-cy="cliente" ref="nomeCliente" v-model='passengerNameCrud' label="Nome Cliente"  :style="{'margin':'-8px 0px 0px 0px'}" filled disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="ciaOper" v-model='editedItem.ciaOper' label="CIA Aérea"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="ticket" v-model='editedItem.ticketNumber' label="Nº Bilhete"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="loc" v-model='editedItem.locale' label="LOC"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="destiny" v-model='editedItem.destination' label="Destino"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field data-cy="conexoes" v-model='editedItem.connections' label="Conexões"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="dataPartida" :return-masked-value="true" :value="editedItem.departureDate && formatToShow(editedItem.departureDate)" @change="editedItem.departureDate = formatDate($event)" label="Data Partida"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="dataChegada" :return-masked-value="true" :value="editedItem.arrivalDate && formatToShow(editedItem.arrivalDate)" @change="editedItem.arrivalDate = formatDate($event)" label="Data Retorno"></v-text-field>
                </v-flex>
                 <v-flex xs12 sm4 md1>
                  <v-select
                    v-model="editedItem.currency"
                    :items="moeda"
                    label="Moeda"
                    data-cy="moeda"
                    @change="setExchange(), calculateTariffBrl(), calculateTotalValue()"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md1>
                  <currency-input
                    :value="editedItem.exchange" 
                    @input="editedItem.exchange = $event, calculateTariffBrl(), calculateTotalValue()"
                    data-cy="exchange"
                    label="Valor Cambial" 
                    :disabled="editedItem.currency === 'real'"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md2>
                   <currency-input
                    :value="editedItem.tariff" 
                    @input="editedItem.tariff = $event, calculateTariffBrl(), calculateTotalValue()"
                    label="Tarifa"
                    data-cy="tariff"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md2>
                   <currency-input
                    :value="editedItem.tariffBrl" 
                    @input="editedItem.tariffBrl = $event, calculateTotalValue()"
                    label="Tarifa BRL"
                    data-cy="tariffBrl"
                    :style="{'color':'grey'}" 
                    disabled
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md1>
                  <currency-input
                    :value="editedItem.shippingFee" 
                    @input="editedItem.shippingFee = $event, calculateTotalValue()"
                    label="Taxa Embarque"
                    data-cy="shippingFee"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md1>
                  <currency-input
                    :value="editedItem.feeRc" 
                    @input="editedItem.feeRc = $event, calculateTotalValue()"
                    label="FEE-RC"
                    data-cy="feeRc"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm4 md2>
                  <v-select
                    v-model="editedItem.operator"
                    :items="consolidadora"
                    label="Consolid./Operadora"
                    data-cy="consolidadora"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <currency-input
                    :value="editedItem.ravCom" 
                    @input="editedItem.ravCom = $event, calculateTotalValue()"
                    label="RAV-Com."
                    data-cy="ravCom"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <currency-input
                    :value="editedItem.inc" 
                    @input="editedItem.inc = $event, calculateTotalValue()"
                    label="INC."
                    data-cy="inc"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <currency-input
                    :value="editedItem.adCom" 
                    @input="editedItem.adCom = $event, calculateTotalValue()"
                    label="ADC. Com."
                    data-cy="addCon"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <currency-input
                    :value="editedItem.totalValue" 
                    @input="editedItem.totalValue = $event"
                    label="Valor Total"
                    data-cy="totalValue"
                    disabled
                    :style="{'font-size':'30px', 'font-weight': 'bold'}"
                  ></currency-input>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    outlined rows="2" auto-grow style="margin-top:10px" data-cy="descVenda" v-model='editedItem.saleDescription' label="Descrição da Venda"
                  >
                  </v-textarea>
                </v-flex>
                <v-card outlined elevation="0">
                  <v-card-title style="color:cadetblue">
                    Formas de Pagamento
                  </v-card-title>
                  <v-layout style="width:1160px" row v-for="(payment, index) in paymentMethod" :key="payment._id">
                    <v-flex xs12 sm6 md3>
                    <v-select
                        style="margin-left:15px"
                        v-model="payment.method"
                        :items="formaPgto"
                        label="Forma de pagamento"
                        data-cy="formaPgto"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                    <v-select
                        v-model="payment.account"
                        :items="accountsList"
                        label="Conta de Recebimento"
                        data-cy="contaRecebimento"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md2>
                      <currency-input
                        :value="payment.paymentMethodValue" 
                        @input="payment.paymentMethodValue = $event"
                        label="Valor"
                        data-cy="paymentInstallmentsValue"
                        @change="toChangeValueInstallments = true"
                      ></currency-input>
                    </v-flex>
                    <v-flex xs12 sm6 md2>
                      <v-text-field
                        v-model="payment.paymentInstallments"
                        label="Parcelas"
                        @change="toChangeValueInstallments = true"
                        data-cy="paymentInstallments"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md2 >
                      <v-btn 
                        elevation="2"
                        icon
                        medium
                        tile
                        title="Abrir parcelas" 
                        style="margin: 10px 0 0 5px; min-width:0px; color:indigo"
                        @click="editInstallments(payment)"
                      >
                        <v-icon style="font-size: 12px">fa-coins</v-icon>
                      </v-btn>
                      <v-btn 
                        elevation="2"
                        icon
                        medium
                        tile
                        @click="addPaymentMethod"
                        title="Adicionar forma de pagamento" 
                        style="margin: 10px 0 0 5px; min-width:0px; color:green">
                        <v-icon style="font-size: 12px">fa-plus</v-icon>
                      </v-btn>
                      <v-btn 
                        elevation="2"
                        icon
                        medium
                        tile
                        title="Excluir forma de pagamento" 
                        style="margin: 10px 0 0 5px; min-width:0px; color:red"
                        @click="removePaymentMethod(index)">
                        <v-icon style="font-size: 12px">far fa-trash-alt</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card>
                <installment-modal 
                  :openDialog="dialogInstallments"
                  :payment="paymentEdit"
                  @save="saveInstallment"
                  @cancel="dialogInstallments = false, cancelChange = true, calculateInstallments(paymentEdit), paymentEdit = {}"
                >
                </installment-modal>
                <invoice-modal 
                  :openDialog="dialogInvoice"
                  :invoice="invoiceEdit"
                  @save="saveInvoice"
                  @cancel="dialogInvoice = false"
                  v-if="dialogInvoice"
                >
                </invoice-modal>
                </v-layout>
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
                    <v-btn :style="{'margin-bottom':'20px'}" data-cy="btn-cancelar" color="blue darken-1" text @click.native="selectUserLov(userSelected)">Selecionar</v-btn>
                    <v-btn data-cy="btn-salvar" :style="{'margin-bottom':'20px'}" color="red darken-1" text @click.native="lovUsers=false">Cancelar</v-btn>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions style="justify-content:flex-end">
            <v-btn data-cy="btn-salvar" color="green darken-1" style="justify-content:flex-end" text @click.native="save">Salvar</v-btn>
            <v-btn data-cy="btn-invoice" color="indigo darken-1" text @click.native="openDialogInvoice(editedItem)">Gerar Fatura</v-btn>
            <v-btn data-cy="btn-cancelar" color="red darken-1" text @click.native="dialog=false">Cancelar</v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>
    <invoice
      :invoiceReport="invoiceReport"
      :invoice="invoiceData"
      v-if="invoiceReport"
      @cancel="invoiceReport = false"
    >
    </invoice>
    <v-snackbar
      v-model="snackbar"
      :timeout="snackBarTime"
      :color="snackbarType"
      :top="true"
      :vertical="true"
      >
      {{snackbarMessage}}
    </v-snackbar>
    <v-data-table
      :headers='headers'
      :items='sales'
      sortBy="_id"
      :search='search'
      class="elevation-1"
      :options.sync="pagination"
      :footer-props="{
        'items-per-page-text': 'Registros por página'
      }"
    >
      <template v-slot:item.tariff="{ item }">
        {{ currencyFormat(item.tariff.toFixed(2)) }}
      </template>
      <template v-slot:item.exchange="{ item }">
        {{ currencyFormat(item.exchange.toFixed(2)) }}
      </template>
      <template v-slot:item.tariffBrl="{ item }">
        {{ currencyFormat(item.tariffBrl.toFixed(2)) }}
      </template>
      <template v-slot:item.totalValue="{ item }">
        {{ currencyFormat(item.totalValue.toFixed(2)) }}
      </template>
      <template v-slot:item.action="{ item }">
        <td class="justify-center layout px-0">
           <v-btn 
            :disabled="!isPaymentMethodInvoice(item)"
            elevation="2"
            icon
            small
            tile
            class="mr-2"
            title="Emitir fatura de venda"
            @click="emitInvoice(item)"
            data-cy="emitirRecibo"
            style="min-width:0px; color:#e1792e">
            <v-icon style="font-size: 14px">fa-file-invoice-dollar</v-icon>
          </v-btn>
          <v-btn 
            elevation="2"
            icon
            small
            tile
            class="mr-2"
            @click="editItem(item)"
            title="Editar"
            data-cy="edtarCliente"
            style="min-width:0px; color:indigo">
            <v-icon style="font-size: 14px">fa-edit</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="#464AA7" style="color: white" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import SalesService from '@/services/SalesService';
import UserService from '@/services/UserService';
import InvoiceService from '@/services/InvoiceService';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import currencyInput from './globals/CurrencyInputField';
import installmentModal from './globals/InstallmentEditModal';
import invoiceModal from './globals/InvoiceSaleModal';
import invoice from './Invoice';
const moment = require('moment');

export default {
  components: {
    'currency-input': currencyInput,
    'installment-modal': installmentModal,
    'invoice-modal': invoiceModal,
    'invoice': invoice
  },
  data: () => ({
    classTextField: 'textfield',
    inputDisabled: 'input-disabled',
    search: '',
    searchUsers: '',
    codePassenger: undefined,
    passengerName: '',
    passengerNameCrud: '',
    sellerName: '',
    users: [],
    sales: [],
    dialog: false,
    dialogInstallments: false,
    dialogInvoice: false,
    snackbarMessage: '',
    snackbar: false,
    snackbarType: '',
    snackBarTime: 3000,
    error: '',
    sellers: [],
    saleDateFormated: undefined,
    paymentMethod: [],
    toChangeValueInstallments: false,
    paymentEdit: {},
    invoice: {},
    accounts: [],
    accountsList: [],
    lovUsers: false,
    userSelected: undefined,
    invoiceEdit: {},
    invoiceReport: false,
    invoiceData: {},
    consolidadora: [
      {
        text: 'Confiança',
        value: 'confianca'
      },
      {
        text: 'BRT',
        value: 'brt'
      },
      {
        text: 'Orinter',
        value: 'orinter'
      },
      {
        text: 'Rextur',
        value: 'rextur'
      }
    ],
    
    moeda: [
      {
        text: 'R$',
        value: 'real'
      },
      {
        text: '$',
        value: 'dolar'
      },
      {
        text: '€',
        value: 'euro'
      }
    ],
    formaPgto: [
      { text: 'Cartão de crédito',
        value: 'credito'
      },
      { text: 'Cartão de débito',
        value: 'debito'
      },
      { text: 'Transferência',
        value: 'transferencia'
      },
      { text: 'Depósito em conta',
        value: 'depositoConta'
      },
      { text: 'Faturamento',
        value: 'fatura'
      },
      { text: 'Boleto bancário',
        value: 'boleto'
      },
      { text: 'Dinheiro',
        value: 'dinheiro'
      }
    ],
    receivingAccount: [
      { text: 'accountDescription',
        value: 'account'
      }
    ],
    headers: [
      {text: 'Venda', align: 'center', value: '_id'},
      {text: 'Vendedor(a)', align: 'center', value: 'sellerName'},
      { text: 'Data', value: 'saleDateFormated', align: 'center' },
      { text: 'Passageiro', value: 'passengerName', align: 'center' },
      { text: 'Descrição da Venda', value: 'saleDescription', align: 'center', width: 400 },
      { text: 'Tarifa', value: 'tariff', align: 'center' },
      { text: 'Valor Cambial', value: 'exchange', align: 'center' },
      { text: 'Tarifa BRL', value: 'tariffBrl', align: 'center' },
      { text: 'Total', value: 'totalValue', align: 'center' },
      { text: 'Ações', value: 'action', sortable: false, align: 'center' }
    ],
    headersUsers: [
      {text: 'CPF', align: 'center', value: 'cpfCnpj'},
      {text: 'Nome', align: 'center', value: 'name'}
    ],
    editedIndex: -1,
    editedItem: {currency: 'real', saleDate: new Date(), tariff: 0, exchange: 1, tariffBrl: 0, shippingFee: 0, feeRc: 0, ravCom: 0, inc: 0, adCom: 0, totalValue: 0},
    defaultItem: {currency: 'real', saleDate: new Date(), tariff: 0, exchange: 1, tariffBrl: 0, shippingFee: 0, feeRc: 0, ravCom: 0, inc: 0, adCom: 0, totalValue: 0},
     defaultItemPayment: {
        method: '',
        paymentMethodValue: 0,
        paymentInstallments: '',
        installmentValues: []
      },
    rules: {
      required: value => !!value || 'Required.'
    },
    pagination: {
      rowsPerPage: 10
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nova Venda' : 'Editar Venda';
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogInstallments(val) {
     val || this.closeModal();
    }
  },

  async created() {
    this.$root.exibirBarraTopo = true;
    if (this.$route.query.passengerId) {
      await this.initialize();
      let code = this.getUserCode(this.$route.query.passengerId);
      this.setPassengerData(code);
      this.dialog = true;
    } else {
      await this.initialize();
    }
  },

  methods: {
    async initialize() {
      let self = this;
      self.passengerName = '';
      self.sellerName = '';
      self.passengerNameCrud = '';
      self.codePassenger = '';
      self.paymentMethod = [];
      self.toChangeValueInstallments = false;
      self.editedItem.seller = self.$store.state.user._id;
      self.paymentEdit = {};
      self.invoiceEdit = {};
      await self.getUsers();
      await SalesService.index().then(function(data) {
        self.sales = data.data;
        self.sales.forEach(sale => {
          let passengerName = '';
          let sellerName = '';
          let passengerNameCrud = '';
          let codePassenger = '';
          let paymentMethod = '';
          let saleDateFormated = new Date();
          passengerName = self.getUserName(sale.passengerId);
          codePassenger = self.getUserCode(sale.passengerId);
          sellerName = self.getUserName(sale.seller);
          saleDateFormated = self.formatToShow(sale.saleDate);
          self.formaPgto.forEach(pgto => {
            if (sale.paymentMethod.method !== undefined && pgto.value === sale.paymentMethod.method) {
              paymentMethod = pgto.text;
            }
          });
          Object.assign(sale, {passengerName: passengerName});
          Object.assign(sale, {sellerName: sellerName});
          Object.assign(sale, {codePassenger: codePassenger});
          Object.assign(sale, {saleDateFormated: saleDateFormated});
        });
      });
      self.addPaymentMethod();
    },
    async emitInvoice(item) {
      let invoiceQuery = undefined;
      let userInvoiceQuery = undefined;
      let totalValueInvoice = 0;
      let invoiceData = {};
      let self = this;
      await InvoiceService.index({sale: item._id}).then(function(data) {
        invoiceQuery = data.data[0];
        if (invoiceQuery) {
          invoiceQuery.servicesHistory.forEach(service => {
            totalValueInvoice += service.valueService;
            service.valueService = self.currencyFormat(service.valueService.toFixed(2));
          });
          Object.assign(invoiceQuery, {totalValueInvoice: self.currencyFormat(totalValueInvoice.toFixed(2))});
        }
      });
        await UserService.index({_id: invoiceQuery.clientInvoice}).then(function(data) {
          userInvoiceQuery = data.data[0];
        });
        if (invoiceQuery) {
          Object.assign(invoiceData, {invoiceQuery});
          Object.assign(invoiceData, {userInvoiceQuery});
          this.invoiceData = invoiceData;
          this.invoiceReport = true;
      } else {
        this.snackbar = true;
        this.snackbarType = 'warning';
        this.snackBarTime = 7000;
        this.snackbarMessage = `A venda ${item._id} não possui dados para geração da fatura. Acesse o cadastro da venda, clique em Gerar Fatura e informe os dados da fatura.`
      }
    },
    editInstallments(payment) {
      let values = payment.installmentValues;
      this.paymentValuesState = values;
      this.calculateInstallments(payment);
      this.dialogInstallments = true;
      this.paymentEdit = payment;
    },
    saveInstallment(paymentInstallmentValue) {
      this.paymentEdit.installmentValues = paymentInstallmentValue;
      this.toChangeValueInstallments = false;
      this.dialogInstallments = false;
      this.paymentEdit = {};
    },
    calculateInstallments(payment) {
      if (this.toChangeValueInstallments) {
        payment.installmentValues = [];
        let valorFormaPgto = payment.paymentMethodValue
        let valorParcelas = valorFormaPgto / payment.paymentInstallments;
        for(let i = 1; i <= payment.paymentInstallments; i++) {
          payment.installmentValues.push(valorParcelas);
        }
      }
    },
    calculateTariffBrl() {
      let total = +this.editedItem.tariff * +this.editedItem.exchange;
      this.editedItem.tariffBrl = total;
      return this.editedItem.tariffBrl;
    },
    calculateTotalValue() {
      let total = this.editedItem.tariffBrl
                  + this.editedItem.shippingFee
                  + this.editedItem.ravCom
                  + this.editedItem.inc
                  + this.editedItem.feeRc
                  + this.editedItem.adCom
      this.editedItem.totalValue = (total * 100)/100;
      return this.editedItem.totalValue.toFixed(2);
    },
    setExchange() {
      if (this.editedItem.currency === 'real') {
        this.editedItem.exchange = 1;
      }
      if(this.editedItem.currency !== 'real') {
        this.editedItem.exchange = null;
      }
    },
    async getUsers() {
      let self = this;
      await UserService.index().then(function(data) {
        self.users = data.data;
        for (let user of self.users) {
          if(user.profile === 'ADMIN') {
            let itemComboBox = {
              text: user.name,
              value: user._id
            };
            self.sellers.push(itemComboBox);
          }
        }
      });
    },
    setPassengerData(id) {
      this.codePassenger = '';
      this.passengerNameCrud = '';
      this.users.forEach(user => {
        if (user.cpfCnpj === id) {
          this.passengerNameCrud = user.name;
          this.editedItem.passengerId = user._id;
          this.codePassenger = user.cpfCnpj;
        }
      });
    },
    getUserName(id) {
      let userName = '';
      this.users.forEach(user => {
        if (user._id === id) {
          userName = user.name;
        }
      });
      return userName;
    },
    selectUserLov(user) {
      if (user && user.length > 0) {
        this.lovUsers = false;
        this.$nextTick(function() {
          this.codePassenger = user[0].cpfCnpj;
          this.setPassengerData(this.codePassenger);
        });
      } else {
        this.snackbar = true;
        this.snackbarType = 'info';
        this.snackBarTime = 5000;
        this.snackbarMessage = 'Selecione um cliente!'
      }
      this.userSelected = undefined; 
    },
    getUserAccountName(id) {
      let userName = '';
      this.users.forEach(user => {
        if (user._id === id) {
          userName = user.name;
        }
      });
      return userName;
    },
    getUserCode(id) {
      let userCode = '';
      this.users.forEach(user => {
        if (user._id === id) {
          userCode = user.cpfCnpj;
        }
      });
      return userCode;
    },
    validateItem() {
      this.snackbar = false;
      this.snackbarType = '';
      this.snackbarMessage = '';
      let totalValuePayments = 0;
      let totalValuesInstallments = 0;
      let formaPgto = 0;
      let totalFormaPgtoNormalizado = undefined;
      for (let i = 0; i < this.editedItem.paymentMethod.length; i++) {
        formaPgto ++;
        totalValuePayments += this.editedItem.paymentMethod[i].paymentMethodValue;
        this.editedItem.paymentMethod[i].installmentValues.forEach(values => {
          totalValuesInstallments += +this.normalizeNumericValue(values);
        });
        totalValuesInstallments = this.normalizeNumericValue(totalValuesInstallments);
        totalFormaPgtoNormalizado = this.normalizeNumericValue(this.editedItem.paymentMethod[i].paymentMethodValue);
        if (+totalValuesInstallments !== +totalFormaPgtoNormalizado) {
          this.snackbar = true;
          this.snackbarType = 'warning';
          this.snackBarTime = 10000;
          this.snackbarMessage = `A soma das parcelas da forma de pagamento ${formaPgto} está diferente do valor total da forma de pagamento.
                                        Total parcelas: ${this.currencyFormat(totalValuesInstallments)}
                                        Total forma de pgto: ${this.currencyFormat(totalFormaPgtoNormalizado)}`;
          return true;
          break;
        }
        totalValuesInstallments = 0;
        if (this.editedItem.paymentMethod[i].method === "") {
          this.snackbar = true;
          this.snackbarType = 'warning';
          this.snackBarTime = 5000;
          this.snackbarMessage = 'Selecione a forma de pagamento!'
          return true;
          break;
        }
      }
      totalValuePayments = this.normalizeNumericValue(totalValuePayments);
      let totalvalue = this.normalizeNumericValue(this.editedItem.totalValue);
      if (+totalValuePayments !== +totalvalue) {
        this.snackbar = true;
        this.snackbarType = 'warning';
        this.snackBarTime = 10000;
        this.snackbarMessage = `A soma das formas de pagamento está diferente do valor total da venda. 
                                  Total da venda: ${this.currencyFormat(this.editedItem.totalValue.toFixed(2))}
                                  Total das formas de pgto: ${this.currencyFormat(totalValuePayments)}`;
        return true;
      }
      return false;
    },
    normalizeNumericValue(value) {
      let newvalue = (value * 100)/100;
      return newvalue.toFixed(2);
    },
    totalRemainingValue() {
      let totalValuePayments = 0;
      this.paymentMethod.forEach(payment => {
        totalValuePayments += payment.paymentMethodValue;
      });
      let remainingValue = this.editedItem.totalValue - totalValuePayments;
      return remainingValue;
    },
    totalComissionCalc(){
      let total = +this.normalizeNumericValue(this.editedItem.ravCom) + +this.normalizeNumericValue(this.editedItem.adCom) + +this.normalizeNumericValue(this.editedItem.inc);
      this.editedItem.totalComission = total;
    },
    async save() {
      let self = this;
      let saleSalved = undefined;
      self.totalComissionCalc();
      self.editedItem.user = this.$store.state.user._id;
      self.paymentMethod.forEach(payment => {
        if (payment.installmentValues === undefined || self.toChangeValueInstallments) {
          self.calculateInstallments(payment);
        }
      });
      self.editedItem.paymentMethod = self.paymentMethod;
      if (!self.validateItem()) {
        if (this.editedIndex > -1) {
          self.snackbar = true;
          try {
            await SalesService.update(this.editedItem).then(function() {
              saleSalved = self.editedItem._id;
              Object.assign(self.sales[self.editedIndex], self.editedItem);
              self.snackbarMessage = `Venda alterada com sucesso!`;
              self.snackbarType = 'success';
              self.dialog = false;
            });
          } catch (error) {
            self.error = error.response.data.error.errmsg;
              self.snackbarMessage = self.error;
              self.snackbarType = 'warning';
            }
        } else {
          try {
            await SalesService.create(this.editedItem).then(function(data) {
              saleSalved = data.data._id;
              self.sales.push(data.data);
              self.snackbar = true;
              self.snackbarMessage = `Venda cadastrada com sucesso!`;
              self.snackbarType = 'success';
              self.dialog = false;
            });
          } catch (error) {
            self.error = error.response.data.error.errmsg;
            console.log(error.response.data.error);
          }
        }
        if (self.invoiceEdit.clientInvoice) {
          self.invoiceEdit.sale = saleSalved;
          if (self.invoiceEdit._id === undefined) {
            await InvoiceService.create(self.invoiceEdit).then(function(data) {
              self.invoiceEdit = {};
              self.dialogInvoice = false;
            });
          } else {
            await InvoiceService.update(self.invoiceEdit).then(function(data) {
              self.invoiceEdit = {};
              self.dialogInvoice = false;
            });
          }
        }
      }
    },
    async openDialogInvoice(editedItem) {
      this.invoiceEdit.emissionDateInvoice = editedItem.saleDate;
      Object.assign(this.invoiceEdit, {saleDescription: editedItem.saleDescription});
      Object.assign(this.invoiceEdit, {totalValue: editedItem.totalValue});
      this.dialogInvoice = true;
    },
    saveInvoice(invoice) {
      this.invoiceEdit = invoice;
      this.dialogInvoice = false;
    },
    searchClient() {
      this.userSelected = undefined;
      this.lovUsers = true;
    },
    async editItem(item) {
      this.codePassenger = '';
      this.editedIndex = this.sales.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.passengerNameCrud = item.passengerName;
      this.codePassenger = item.codePassenger;
      this.paymentMethod = item.paymentMethod;
      let invoice = undefined;
      let self = this;
      await InvoiceService.index({sale: item._id}).then(function(data) {
         invoice = data.data[0];
        if (invoice) {
          let userName = self.getUserName(invoice.clientInvoice);
          let userCpfCnpj = self.getUserCode(invoice.clientInvoice);
          invoice = Object.assign(invoice, {userName: userName});
          invoice = Object.assign(invoice, {userCpfCnpj: userCpfCnpj});
          self.invoiceEdit = invoice;
        }
      });
      this.dialog = true;
    },
    close() {
      setTimeout(() => {
        this.resetValidation();
      }, 1000);
      setTimeout(() => {
        this.initialize();
        this.invoiceEdit = {};
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem.seller = this.$store.state.user._id;
        this.editedIndex = -1;
        this.$route.query.passengerId = undefined;
        this.$router.push({ path: '/sales' });
      }, 300);
    },
    closeModal() {
      setTimeout(() => {
        this.resetValidation();
      }, 1000);
      this.dialogInstallments = false;
      this.paymentEdit = {};
    },
    formatDate: function(dateStr) {
      return moment(dateStr, 'DD/MM/YYYY');
    },
    formatToShow: function(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    currencyFormat(i, event) {
      let v = i.replace(/\D/g,'');
      v = (v/100).toFixed(2) + '';
      v = v.replace(".", ",");
      v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
      v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
      i = v;
      if (event !== undefined ) {
          event.target.value = i;
        return event.target.value; 
      } else {
        return i;
      }
    },
    isPaymentMethodInvoice(item) {
      let isInvoice = false;
      item.paymentMethod.forEach(payment => {
        if(payment.method === 'fatura'){
          isInvoice = true;
        }
      });
      return isInvoice;
    },
     addPaymentMethod() {
      if (!this.paymentMethod || this.paymentMethod.length === 0) {
        this.paymentMethod = [];
      }
      this.paymentMethod.push(
        Object.assign({}, this.defaultItemPayment)
      );
      let arrLength = this.paymentMethod.length;
      let posicao = this.paymentMethod.length - 1;
      this.$nextTick(function() {
        this.paymentMethod[posicao].paymentMethodValue = this.totalRemainingValue();
      });
    },
     removePaymentMethod(index) {
      if (this.paymentMethod.length > 1) {
        this.paymentMethod.splice(index, 1);
      } else {
        this.snackbar = true;
        this.snackbarMessage = `É necessário ao menos uma forma de pagamento cadastrada!`;
        this.snackbarType = 'warning';
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  }
};
</script>
<style>
  .textfield {
    padding-right: 30px;
    padding-bottom: 5px;
  }
  @media (max-width: 600px) {
    .textfield {
      padding-right: 0px;
      padding-bottom: 5px;
    }
  }
  @media (max-width: 600px) {
    .divider {
      padding-right: 50px;
    }
  }
  .input-disabled {
    background-color:#ddd9d9;
}

</style>
