import Api from '@/services/Api';

export default {
  index (search) {
    return Api().get('user', {
      params: {
        search: search
      }
    });
  },
  create(user) {
    return Api().post('user', user);
  },
  update(user) {
    return Api().put('user', user);
  },
  getBirthdays(showcase) {
    return Api().get('user/birthdays/' + showcase);
  }
};
