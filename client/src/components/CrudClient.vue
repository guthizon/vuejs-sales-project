<template>
  <div>
    <v-layout row wrap justify-center :style="{'background-color': 'white', 'border-bottom': '2px solid rgba(0,0,0,.12)', 'margin-left':'0px', 'margin-right':'0px'}" >
      <div style="font-size:20px; align-self:center; margin-left:10px">Clientes</div>
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
      <div :style="{'padding-bottom': '10px', 'padding-right': '10px', 'padding-left': '20px'}">
        <v-checkbox
          v-model="checkboxInativos"
          @change="listarUsuariosInativos()"
          label="Listar Inativos"
          color="primary"
          :value="checkboxInativos"
          hide-details
          data-cy="listar-inativos"
        ></v-checkbox>
      </div>
      <v-dialog v-model='dialog' max-width="1000px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn data-cy="btn-cliente" raised color="#464AA7" v-bind="attrs" v-on="on" style="margin-top: 10px; color: white" @click="focusName">Novo cliente</v-btn>
        </template>
        <v-card>
          <v-form ref="form">
          <v-card-title>
            <span :style="{'font-size':'24px', 'font-weight':'500'}">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
              <v-alert
                :value="cepInvalido"
                class="multi-line"
                type="warning"
                transition="scale-transition"
                color="warning"
                outlined
              >Cep não localizado. Verifique e informe novamente um Cep válido.
              </v-alert>
                <v-flex xs12 sm6 md8>
                  <v-text-field data-cy="nome" ref="nomeCliente" v-model='editedItem.name' label="Nome" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 md2>
                  <v-select
                    v-model="editedItem.status"
                    :items="statusOptions"
                    label="Situação"
                    data-cy="situacao"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-select
                    v-model="editedItem.profile"
                    :items="profileOptions"
                    label="Perfis"
                    :rules="[rules.required]"
                    data-cy="profile"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <v-text-field data-cy="cpf" ref="cpf" v-model='editedItem.cpfCnpj' label="CPF/CNPJ" :rules="[rules.required]" @blur="validateOnlyDigit(editedItem.cpfCnpj)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <v-text-field data-cy="rg" ref="rg" v-model='editedItem.rgInsc' label="RG/Ins.Est"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field data-cy="telefones" v-model='editedItem.phone' label="Telefones"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field data-cy="email" v-model='editedItem.email' label="E-mail" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="nomeSocial" v-model='editedItem.nickName' label="Nome Social/Fantasia"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <v-select
                    v-model="editedItem.gender"
                    :items="genderOptions"
                    label="Gênero"
                    data-cy="genero"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <v-text-field data-cy="data-nasc" :return-masked-value="true" :value="editedItem.birthDate && formatToShow(editedItem.birthDate)" @change="editedItem.birthDate = formatDate($event)" :mask="'##/##/####'" label="Data Nascimento"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <v-text-field data-cy="cep" v-model='editedItem.cep' v-on:keydown.tab="preencherEnderecoPeloCep(editedItem.cep)" label="CEP"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md1 :style="{'align-self': 'center'}">
                    <v-progress-circular
                    :size="20"
                    :width="3"
                    v-if="loading"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <v-btn v-else icon @click="preencherEnderecoPeloCep(editedItem.cep)">
                    <v-icon color="blue darken-1">fa-search</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field data-cy="rua" ref='street' v-model='editedItem.street' label="Endereço"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="numero" ref='number' v-model='editedItem.number' label="Número"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="bairro" ref= 'neighborhood' v-model='editedItem.neighborhood' label="Bairro"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md2>
                  <v-text-field data-cy="cidade" ref='city' v-model='editedItem.city' label="Cidade"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md1>
                  <v-select
                    v-model="editedItem.state"
                    :items="states"
                    label="UF"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md7>
                  <v-text-field data-cy="complemento" v-model='editedItem.complement' label="Complemento"></v-text-field>
                </v-flex>
                <v-card width="450px" style="margin:32px 0px 35px 0">
                  <v-card-title>
                    Fidelidade Cliente
                  </v-card-title>
                  <v-layout row v-for="(f, index) in fidelity" :key="index">
                    <v-flex xs12 sm6 md4>
                      <v-text-field style="margin-left:10px" data-cy="companiaAerea" v-model='f.companyName' label="Cia. Aérea"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md5>
                      <v-text-field data-cy="codigoFidelidade" v-model='f.fidelityCode' label="Cód. Fidelidade"></v-text-field>
                    </v-flex>
                      <v-btn 
                        elevation="2"
                        icon
                        medium
                        tile
                        title="Adicionar fidelidade" 
                        style="margin: 16px 0 0 5px; min-width:0px"
                        color="green"
                        @click="addFidelityItem"
                      >
                        <v-icon style="font-size: 12px">fa-plus</v-icon>
                      </v-btn>
                      <v-btn 
                        elevation="2"
                        icon
                        medium
                        tile
                        @click="removeFidelityItem(index)"
                        color="red"
                        title="Remover fidelidade" 
                        style="margin: 16px 0 0 5px; min-width:0px">
                        <v-icon style="font-size: 12px">far fa-trash-alt</v-icon>
                      </v-btn>
                  </v-layout>
                </v-card>
                <v-spacer></v-spacer>
                  <v-flex xs12 sm12 md6>
                    <v-textarea outlined style="margin-top:30px" data-cy="observacoes" ref='city' v-model='editedItem.informations' label="Outras Informações"></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn data-cy="btn-salvar" color="green darken-1" text @click.native="save">Salvar</v-btn>
            <v-btn data-cy="btn-cancelar" color="red darken-1" text @click.native="dialog = false">Cancelar</v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarType"
      :top="true"
      :vertical="true"
      >
      {{snackbarMessage}}
    </v-snackbar>
    <v-data-table
      :headers='headers'
      :items='users'
      :search='search'
      class="elevation-1"
      :options.sync="pagination"
      :footer-props="{
        'items-per-page-text': 'Registros por página'
      }"
    >
      <template v-slot:item.status="{ item }">
        <v-icon :style="{ 'fontSize': '14px', 'color': item.status === 'ACTIVE' ? 'green' : 'red' }">fa-circle</v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <td class="justify-center layout px-0">
          <v-btn 
            elevation="2"
            icon
            small
            tile
            class="mr-2"
            title="Nova venda"
            data-cy="novaVenda"
            @click="abrirVendas(item)"
            style="min-width:0px; color:cadetblue">
          <v-icon style="font-size: 14px">fa-handshake</v-icon>
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
import UserService from '@/services/UserService';
const moment = require('moment');
export default {
  data: () => ({
    classTextField: 'textfield',
    search: '',
    checkboxInativos: false,
    cepInvalido: false,
    loading: false,
    usuariosAtivosEInativos: [],
    users: [],
    dialog: false,
    snackbarMessage: '',
    snackbar: false,
    snackbarType: '',
    selectedProfiles: '',
    error: '',
    fidelity: [],
    profileOptions: [
      {
        text: 'Cliente',
        value: 'USER'
      },
      {
        text: 'Administrador',
        value: 'ADMIN'
      }
    ],
    statusOptions: [
      {
        text: 'Ativo',
        value: 'ACTIVE'
      },
      {
        text: 'Inativo',
        value: 'INACTIVE'
      }
    ],
    genderOptions: [
      {
        text: 'Masculino',
        value: 'M'
      },
      {
        text: 'Feminino',
        value: 'F'
      }
    ],
    states: [
      {text: 'AC', value: 'AC'},
      {text: 'AL', value: 'AL'},
      {text: 'AP', value: 'AP'},
      {text: 'AM', value: 'AM'},
      {text: 'BA', value: 'BA'},
      {text: 'CE', value: 'CE'},
      {text: 'DF', value: 'DF'},
      {text: 'ES', value: 'ES'},
      {text: 'GO', value: 'GO'},
      {text: 'MA', value: 'MA'},
      {text: 'MT', value: 'MT'},
      {text: 'MS', value: 'MS'},
      {text: 'MG', value: 'MG'},
      {text: 'PA', value: 'PA'},
      {text: 'PB', value: 'PB'},
      {text: 'PR', value: 'PR'},
      {text: 'PE', value: 'PE'},
      {text: 'PI', value: 'PI'},
      {text: 'RJ', value: 'RJ'},
      {text: 'RN', value: 'RN'},
      {text: 'RS', value: 'RS'},
      {text: 'RO', value: 'RO'},
      {text: 'RR', value: 'RR'},
      {text: 'SC', value: 'SC'},
      {text: 'SP', value: 'SP'},
      {text: 'SE', value: 'SE'},
      {text: 'TO', value: 'TO'}
    ],
    headers: [
      {
        text: 'Código',
        align: 'center',
        value: 'cpfCnpj'
      },
      {
        text: 'Nome',
        align: 'center',
        value: 'name'
      },
      { text: 'E-mail', value: 'email', align: 'center' },
      { text: 'Situação', value: 'status', align: 'center' },
      { text: 'Ações', value: 'action', sortable: false, align: 'center' }
    ],
    editedIndex: -1,
    editedItem: {status: 'ACTIVE', profile: 'USER'},
    defaultItem: {status: 'ACTIVE', profile: 'USER'},
    defaultItemFidelity: {fidelityCode: '', companyName: ''},
    defaultItemBank: {bank: '', branch: '', account: ''},
    rules: {
      required: value => !!value || 'Required.'
    },
    pagination: {
      rowsPerPage: 10
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Cliente' : 'Editar Cliente';
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  async created() {
    await this.initialize();
    this.$root.exibirBarraTopo = true;
    this.listarUsuariosInativos();
  },

  methods: {
    async initialize() {
      let self = this;
      self.fidelity = [];
      await UserService.index().then(function(data) {
        self.users = data.data;
        self.usuariosAtivosEInativos = data.data;
      });
      await self.addFidelityItem();
    },

    async addFidelityItem() {
      if (!this.fidelity || this.fidelity.length === 0) {
        this.fidelity = [];
      }
      this.fidelity.push(
        Object.assign({}, this.defaultItemFidelity)
      );
    },
     removeFidelityItem(index) {
      this.fidelity.splice(index, 1);
    },
    listarUsuariosInativos() {
      let self = this;
      let usuariosAtivos = [];
      if (!self.checkboxInativos) {
        self.users.forEach(function (usuario) {
          if (usuario.status === 'ACTIVE') {
            usuariosAtivos.push(usuario);
          }
        });
        self.users = usuariosAtivos;
      } else {
        self.users = self.usuariosAtivosEInativos;
      }
    },

    editItem(item) {
      this.fidelity = [];
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.selectedProfiles = this.editedItem.profile;
      if (this.editedItem.fidelity.length > 0) {
        this.editedItem.fidelity.forEach(f => {
          this.fidelity.push(f);
        });
      } else {
        this.fidelity.push(Object.assign({}, this.defaultItemFidelity));
      }
      this.dialog = true;
    },

    abrirVendas(user) {
      this.$router.push({ path: '/sales', query: { passengerId: user._id } });
    },

    close() {
      setTimeout(() => {
        this.resetValidation();
      }, 1000);
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.initialize();
      }, 300);
    },

    validateOnlyDigit(value) {
      if (value !== undefined) {
        let isnum = /^\d+$/.test(value);
        if (!isnum) {
          this.snackbar = true;
          this.snackbarMessage = 'Informe apenas dígitos no campo Código/RG/CPF/!';
          this.snackbarType = 'warning';
          this.$refs.cpf.focus();
          return false;
        }
        return true;
      }
      return true;
    },
    async save() {
      if (this.validateOnlyDigit(this.editedItem.cpfCnpj)) {
        let self = this;
        self.snackbarMessage = '';
        self.snackbarType = '';
        self.editedItem.fidelity = self.fidelity;
        if (this.editedIndex > -1) {
          self.snackbar = true;
          try {
            await UserService.update(self.editedItem).then(function() {
              Object.assign(self.users[self.editedIndex], self.editedItem);
              self.dialog = false;
              self.snackbarMessage = `Usuário ${self.editedItem.name} alterado com sucesso!`;
              self.snackbarType = 'success';
            });
          } catch (error) {
            self.error = error.response.data.error.errmsg;
            if (self.error !== undefined && self.error.includes('duplicate key')) {
              self.snackbarMessage = `O CPF informado já existe!`;
              self.snackbarType = 'warning';
            } else {
              self.snackbarMessage = `Informe todos os campos obrigatórios!`;
              self.snackbarType = 'info';
            }
          }
        } else {
          self.snackbar = true;
          try {
            await UserService.create(self.editedItem).then(function(data) {
              self.users.push(data.data);
              self.snackbarMessage = `Usuário ${self.editedItem.name} cadastrado com sucesso!`;
              self.snackbarType = 'success';
              self.dialog = false;
            });
          } catch (error) {
            self.error = error.response.data.error.errmsg;
            console.log(error.response.data.error);
            if (self.error !== undefined && self.error.includes('duplicate key')) {
              self.snackbarMessage = `O CPF informado já existe!`;
              self.snackbarType = 'warning';
            } else {
              self.snackbarMessage = `Informe todos os campos obrigatórios!`;
              self.snackbarType = 'info';
            }
          }
        }
      }
    },

    formatDate: function(dateStr) {
      return moment(dateStr, 'DD/MM/YYYY');
    },

    formatToShow: function(date) {
      return moment(date).format('DD/MM/YYYY');
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },
    focusName() {
      setTimeout(() => {
        this.$refs.nomeCliente.focus();
      }, 100);
    },
    preencherEnderecoPeloCep: function(cep) {
      this.loading = true;
      var endereco = this.buscarEnderecoPeloCep('https://viacep.com.br/ws/' + cep + '/json/');
      if (endereco !== null && !endereco.erro) {
        setTimeout(() => {
          this.cepInvalido = false;
          this.editedItem.street = endereco.logradouro;
          this.editedItem.neighborhood = endereco.bairro;
          this.editedItem.city = endereco.localidade;
          this.editedItem.state = endereco.uf;
          this.editedItem = JSON.parse(JSON.stringify(this.editedItem));
          this.$nextTick(function () {
            this.$refs.number.focus();
            this.loading = false;
          });
        }, 500);
      } else {
        this.cepInvalido = true;
        this.editedItem.street = undefined;
        this.editedItem.neighborhood = undefined;
        this.editedItem.city = undefined;
        this.editedItem = JSON.parse(JSON.stringify(this.editedItem));
        this.loading = false;
      }
    },
    buscarEnderecoPeloCep(url) {
      try {
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);
        var json = JSON.parse(req.responseText);
        return json;
      } catch (err) {
        console.log(`O cep informado é invalido: ${err}`);
      }
      return null;
    }
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

</style>
