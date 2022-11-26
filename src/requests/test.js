import axios from 'axios';

const options = {
  method: 'GET',
  url: 'http://localhost:8080/testSecure',
  headers: {
    cookie:
      'connect.sid=s%3AvxvQMiNI2I06GrttLCnyH2OOOxwfsGbh.slZCZ%2B%2Bs671Bq3ds%2FLHPXpDsV%2F2Z1T%2FxNKFXfWBgK%2B8',
    'user-agent': 'vscode-restclient',
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
