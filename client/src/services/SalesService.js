import Api from '@/services/Api';
const moment = require('moment');
export default {
  index (search) {
    return Api().get('sales', {
      params: {
        search: search
      }
    });
  },
  create(sale) {
    return Api().post('sales', sale);
  },
  update(sale) {
    return Api().put('sales', sale);
  },
  async getSalesByDate(startDate, endDate) {
    if(startDate === undefined || startDate === '') {
      startDate = '1900-01-01';
    }
    if(endDate === undefined || endDate === '') {
      let date = new Date();
      endDate = moment(date).format('YYYY-MM-DD');
    }
    return Api().get(`getSalesByDate/${startDate}/${endDate}`);
  },
};
