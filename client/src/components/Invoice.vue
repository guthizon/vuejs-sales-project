<template>
  <v-dialog
    :value="invoiceReport"
    @keydown.esc="$emit('cancel')"
  >
    <v-card>
      <div id="invoicePrint" class="invoice-box">
        <div class="flex-space-between">
          <div class="company-logo">
            <img
              src="@/assets/invoice-logo.png"
              style="max-width:300px; max-height: 50px; margin-right: 20px"
            />
            <h2>TripZone Management</h2>
          </div>
          <div style="display: flex; align-content: center;">
            <h3 style="display: flex; align-self: center; font-size: 18px">
              FATURA DE VENDA
            </h3>
          </div>
        </div>
        <div class="flex-space-between">
          <div>
            <p style="font-size: 14px; text-align: left">
              Rua: Sem Nome, 00<br />
              Cep: 888888-888 Cidade/SC<br />
              Fone: (00) 900000 0000<br />
              Email: teste@teste.com <br />
              CNPJ: 11.111.111/1111-11
            </p>
          </div>
          <div style="align-self: flex-end;">
            <table>
              <tr>
                <th class="center">FATURA Nº</th>
                <th class="center">EMISSÃO</th>
              </tr>
              <tr>
                <td class="center">{{invoice.invoiceQuery._id}}</td>
                <td class="center">{{formatToShow(invoice.invoiceQuery.emissionDateInvoice)}}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="flex-space-between">
          <div>
            <table style="margin-top: 20px">
              <tr>
                <th>COBRANÇA PARA</th>
              </tr>
              <tr>
                <td>
                  {{invoice.userInvoiceQuery.name}} <br />
                  {{invoice.userInvoiceQuery.street}}, {{invoice.userInvoiceQuery.number}} <br />
                  {{invoice.userInvoiceQuery.neighborhood}} - {{invoice.userInvoiceQuery.city}}/{{invoice.userInvoiceQuery.state}} <br />
                  CNPJ: {{invoice.userInvoiceQuery.cpfCnpj}} Fone: {{invoice.userInvoiceQuery.phone}}
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 20px; border: 1px solid #ccc; align-self: stretch">
            <!-- <table style="margin-top: 20px">
              <tr>
                <th class="center">ID DO CLIENTE</th>
                <th class="center">TERMOS</th>
              </tr>
              <tr>
                <td class="center">322</td>
                <td>Pagar ao receber</td>
              </tr>
            </table> -->

            <table>
              <tr>
                <th class="center">P/ USO DA INSTITUIÇÃO FINANCEIRA</th>
              </tr>
            </table>
            <!-- <table style="margin-top: 20px">
              <tr>
                <th class="center">VENCIMENTO</th>
                <th class="right">VALOR</th>
              </tr>
              <tr>
                <td class="center">01/12/2020</td>
                <td class="right">899,00</td>
              </tr>
            </table> -->
          </div>
        </div>

        <div>
          <table style="margin-top: 20px">
            <tr>
              <th class="center">VENCIMENTO</th>
              <th class="center">VALOR</th>
              <th class="center">VALOR POR EXTENSO</th>
            </tr>
            <tr>
              <td class="center">{{formatToShow(invoice.invoiceQuery.dueDateInvoice)}}</td>
              <td class="center">{{invoice.invoiceQuery.totalValueInvoice}}</td>
              <td class="center">{{valueInWords()}}</td>
            </tr>
          </table>
        </div>

        <div class="obs">
          <label>OBSERVAÇÕES</label>
          <p>MULTA DE <strong>3%</strong> MAIS JUROS DE R$2,00 POR DIA DE ATRASO.</p>
        </div>

        <div class="footer flex-space-between">
          <div style="text-align: center;">
            <p>____ /____ /____</p>
            <p>DATA</p>
          </div>
          <div style="text-align: center;">
            <p>___________________________</p>
            <p>ASSINATURA CLIENTE</p>
          </div>
        </div>

        <div class="items">
          <table style="margin-top: 20px">
            <tr>
              <th class="center">
                DATA EMISSÃO
              </th>
              <th class="center">
                DESCRIÇÃO DOS SERVIÇOS
              </th>
              <th class="right">
                VALOR
              </th>
            </tr>
            <tr v-for="(service, index) in invoice.invoiceQuery.servicesHistory" :key="index">
              <td class="center">{{formatToShow(service.emissionDateService)}}</td>
              <td class="center">{{service.descriptionServce}}</td>
              <td class="right">{{service.valueService}}</td>
            </tr>
            <tr class="total-row">
              <td></td>
              <td class="right">
                RESUMO TOTAL DA FATURA Nº {{invoice.invoiceQuery._id}} 
              </td>
              
              <td class="right invoice-total">{{invoice.invoiceQuery.totalValueInvoice}}</td>
            </tr>
            <br/>
            <br/>
          </table>
        </div>
      </div>
      <v-card-actions style="justify-content:center; padding-bottom:30px">
        <v-btn
          color="green"
          style="color: white"
          v-print="'#invoicePrint'"
        >
          Imprimir
        </v-btn>
        <v-btn
          color="red"
          style="color: white"
          @click="$emit('cancel')"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const moment = require('moment');
const extenso = require('extenso');


export default {
  props: ['invoiceReport', 'invoice'],
  methods: {
     formatToShow: function(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    valueInWords() {
      return extenso(this.invoice.invoiceQuery.totalValueInvoice, {mode: 'currency'}).charAt(0).toUpperCase() + 
        extenso(this.invoice.invoiceQuery.totalValueInvoice, {mode: 'currency'}).slice(1);
    }
  }
};
</script>

<style>
.invoice-box {
  max-width: 800px;
  margin: auto;
  /* padding: 30px; */
  /* border: 1px solid #eee; */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); */
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box .flex-space-between {
  display: flex;
  justify-content: space-between;
}

.invoice-box table tr th {
  font-size: 14px;
  background-color: #2e74b4;
  color: white;
  padding: 2px 10px;
  margin: 0;
  line-height: normal;
}

.invoice-box table tr td {
  padding-left: 5px;
  padding-right: 10px;
}

.invoice-box table tr th.center,
.invoice-box table tr td.center {
  text-align: center;
}

.invoice-box table tr th.left,
.invoice-box table tr td.left {
  text-align: left;
}

.invoice-box table tr th.right,
.invoice-box table tr td.right {
  text-align: right;
}

.company-logo {
  display: flex;
  align-items: center;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
  border-spacing: 0;
  font-size: 14px;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

.invoice-box .invoice-total {
  font-weight: bold;
  font-size: 16px;
}

.invoice-box .total-row td {
  border-top: 1px solid;
}

.invoice-box .obs label {
  font-weight: bold;
}

.invoice-box .obs {
  border: 1px solid;
  padding: 5px;
  margin-top: 30px;
  font-size: 14px;
}

.invoice-box .footer {
  margin-top: 50px;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}
</style>
