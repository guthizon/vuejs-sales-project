<template>
    <v-footer relative inset app :style="{ 'height': '48px', 'background-color': '#ffffff', 'box-shadow': '1px 1px 3px 2px  #aaaaaa'}" class="footer">
        <div>
            <v-img class="margin-logo" :src="require('@/assets/logo-nome.png')" height="auto" width="110px"/>
        </div>
        <div :style="{'padding-bottom':'7px', 'font-size': '14px'}">
            <span >Versão 0.2.0 | Copyright © 2020</span>
        </div>
    </v-footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style>
.footer {
    display: flex;
    align-items: top;
    justify-content: flex-end;
    padding-right: 30px;
}
.margin-logo {
    margin-bottom: 3px;
}
</style>
