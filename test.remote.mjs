#!/usr/bin/env -S node --experimental-modules
import axios from 'axios';

async function main(){

  axios.get('http://127.1:3001/', {
      params: {
        type:'dump',
        path:'/',
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });

}

main();
