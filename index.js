'use strict';
const fs = require('fs');
const Chapter = require('./lib/chapter');

const start = 1;
const limit = 500;
let errors = [];
let chapters = [];

function saveFile(fileName, body){
  console.log(`save ${fileName}`);
  return new Promise((resolve, reject)=>{
    fs.writeFile(fileName, body, (err)=>{
      if(err){
        reject(err)
      }else{
        resolve();
      }
    })

  })
}

function end(){
  for(error of errors)
    console.log(error);
}

function processErrorAndDownloadNextChapter(error){
  if(error){
    errors.push(error)
  }
  downloadNextChapter();
}

function downloadNextChapter(){
  let nextChapter = chapters.shift();
  if(!nextChapter)
    return end();
  nextChapter
    .download()
    .then((body)=>{
      saveFile(nextChapter.fileName, body)
        .then(downloadNextChapter)
        .catch(processErrorAndDownloadNextChapter)
    })
    .catch(processErrorAndDownloadNextChapter)    
}
for(let chapter = start; chapter <= limit; chapter++){
  chapters.push(new Chapter(chapter));
}

downloadNextChapter();
