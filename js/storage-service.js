'use strict';

function saveToStorage(key , value){
    var json = JSON.stringify(value);
    localStorage.setItem(key , json);
}

function loadFromStorage(key){
    var value = localStorage.getItem(key);
    var json = JSON.parse(value);
    return json 
}