import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login';
import CrudClient from '@/components/CrudClient';
import CrudSales from '@/components/CrudSales';
import Invoice from '@/components/Invoice';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/client',
      name: 'Clientes',
      component: CrudClient
    },
    {
      path: '/sales',
      name: 'Vendas',
      component: CrudSales
    },
    {
      path: '/invoice',
      name: 'Faturamento',
      component: Invoice
    },
  ]
})
