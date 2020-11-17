<template>
  <v-dialog
    max-width="500px"
    :value="openDialog"
    @keydown.esc="$emit('cancel')"
    :key="payment._id"
  >
   <v-card>
    <v-card-title>
        Parcelas
    </v-card-title>
      <v-card-text v-for="(value, index) in values" :key="payment.__id + '-' + index">
         <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md2>
                <v-text-field
                  :value="index+1"
                  regular
                  disabled
                  style="text-align-last:center"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md10>
                <currency-input
                  :value="value"
                  data-cy="paymentInstallmentsValue"
                  @input="updateValue($event, index)"
                ></currency-input>
              </v-flex>
            </v-layout>
          </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
         color="primary"
         text
         @click="$emit('save', values)"
        > 
         Confirmar
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

export default {
  components: {
    'currency-input': currencyInput
  },
  props: ['openDialog','payment'],
  data() {
    return { values: [] };
  },
  methods: {
    updateValue(newValue, index) {
      this.$set(this.values, index, newValue);
      // this.values = [...this.values];
    }
  },
  watch: {
    payment: function() {
      if (this.payment.installmentValues) {
        this.values = [...this.payment.installmentValues];
      }
    }
  }
};
</script>

<style>

</style>