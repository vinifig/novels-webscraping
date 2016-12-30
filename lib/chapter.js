'use strict';
const request = require('request-promise');
const cheerio = require('cheerio');


const defaultTransformer = function(body){
  let $ = cheerio.load(body);
  $('article').append(`<link rel="stylesheet" type="text/css" href="chapter.css"></link>`)
  return $('article').html();
}

const defaultUrl = 'http://novelmania.com.br/chinesa/atg-indice/atg-capitulo-'
const defaultFileName = 'chapters/atg-capitulo-'

class Chapter{

  constructor(id, baseUrl = defaultUrl, baseFileName = defaultFileName){
    this.id = id;
    this.baseUrl = baseUrl;
    this.baseFileName = baseFileName;
  }

  download(transform = defaultTransformer){
    return new Promise((resolve, reject)=>{
      let options =  {
        method: 'GET',
        uri: `${this.baseUrl}${this.id}`,
        transform: transform
      }
      request(options)
        .then(resolve)
        .catch(reject);
    })
  }

  get fileName () { return `${this.baseFileName}${this.id}.html`}
}

module.exports = Chapter;
