'use strict'
var gElCanvas;
var gCtx;

var gCurrImgUrl;
var gCurrHeight;

var gIsUpdating = false;
var gDontGrab = false;

var gCurrFont;

var gStartPos;
function onInit(){
    console.log('hi');
    var imgs=loadImgs();
    renderImgGallery(imgs);

}
function renderImgGallery(imgs) {
    var strHTML = imgs.map((img) => {
        return `<div class="img-container">
        <img src="${img.url}" alt="">
        </div>`
    }).join('');

    document.querySelector('.gallery').innerHTML = strHTML;
}