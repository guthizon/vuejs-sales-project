import Api from '@/services/Api';

export default {
  index (search) {
    return Api().get('invoice', {
      params: {
        search: search
      }
    });
  },
  create(invoice) {
    return Api().post('invoice', invoice);
  },
  update(invoice) {
    return Api().put('invoice', invoice);
  },
};
