<template>
  <v-app-bar dark app class="header" :extension-height="20" :dense="true">
    <v-btn data-cy="btn-menu" icon v-if="$root.exibirNavBar" @click.stop="$root.drawer = !$root.drawer"><v-icon>fa-bars</v-icon></v-btn>
    <v-toolbar-title class="headername">TRIPZONE</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  .header {
    background: linear-gradient(to right, #0c0f66, #8185e8);
    color: #F9E4D5;
    font-family: 'Roboto';
  }
  .headername {
    color: #F9E4D5;
    font-family: 'Roboto';
  }
  .image {
    display: flex;
    justify-content: flex-end;
    padding-left: 30px;
    margin: 5px;
}
</style>
