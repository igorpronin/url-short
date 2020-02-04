const vm = new Vue({
  el: '#app',
  data: {
    submitted: false,
    URLInputValue: '',
    showErr: false,
    showRes: false,
    res: {
      URL: '',
      shortURL: ''
    }
  },
  methods: {
    submit() {
      if (!this.URLInputValue.length) {
        this.showErr = true;
      } else {
        this.showErr = false;
        this.submitted = true;

        axios.post('/link/create', {
          link: this.URLInputValue,
        })
        .then(function (response) {
          vm.URLInputValue = '';
          vm.showRes = true;
          console.log(response);
          vm.res.URL = response.data.URL;
          vm.res.shortURL = response.data.shortURL;
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
  }
});