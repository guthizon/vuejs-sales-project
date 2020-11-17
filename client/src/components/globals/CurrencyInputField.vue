<template>
  <v-text-field
    @input="setValue"
    :value="formattedValue"
    :label="label"
    data-cy="paymentInstallmentsValue"
    :style="estilo"
    :disabled="disabled"
    @change="$emit('change', value)"
  ></v-text-field>
</template>

<script>
export default {
    data: () => ({
        localValue: ''
    }),
  props: ['value', 'label', 'estilo', 'disabled', 'change'],
  computed: {
    formattedValue: {
      get: function() {
        return this.currencyFormat(this.value ? this.value.toFixed(2) : 0);
      },
      set: function(newValue) {
        let value = this.currencyFormat(newValue);
        this.localValue = value;
        value = value.replaceAll(".","");
        value = value.replaceAll(",",".");
        this.$emit('input', Number(value));
      }
    }
  },
  methods: {
    setValue(v) {
      this.formattedValue = v;
    },
    currencyFormat(i, event) {
      if (i !== undefined && !i.length) {
        i = 0;
      }
      i = i + '';
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
    }
  }
}
</script>