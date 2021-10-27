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
    createCanvas();
    resizeCanvas();
}
function showGallery() {
    document.querySelector('.gallery-page').classList.remove('hide');
    document.querySelector('.edit-page').classList.add('hide');
    document.querySelector('.memes-page').classList.add('hide');
    document.querySelector('.bg-screen').classList.remove('show');
    document.querySelector('.nav-bar').classList.remove('show');
    document.querySelector('body').classList.add('hiden');
    gIsUpdating = false;
    renderImgGallery(gImgs);
}

function renderImgGallery(imgs) {
    var strHTML = imgs.map((img) => {
        return `<div class="img-container">
        <img src="${img.url}" onclick="onSetMemeImg(${img.id})">
        </div>`
    }).join('');

    document.querySelector('.gallery').innerHTML = strHTML;
}
function createCanvas() {
    gElCanvas = document.getElementById('edit-canvas');
    gCtx = gElCanvas.getContext('2d');
}
function resizeCanvas() {
    if (document.querySelector('.edit-page').classList.contains('hide')) return;
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    drawMeme(gCurrImgUrl, true);
}
function drawLines() {
    gMeme.lines.forEach((line) => {
        drawText(line);
    })
}
function drawMeme(imgUrl, isFocus) {
    var img = new Image()
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawLines();
        if (isFocus) showFocus();
    }
}
function onSetMemeImg(imgId) {
    var imgUrl = setMemeImg(imgId);
    gCurrImgUrl = imgUrl;
    gMeme.lines = [];
    gMeme.selectedLineIdx = 0;
    document.querySelector('.gallery-page').classList.add('hide');
    document.querySelector('.edit-page').classList.remove('hide');
    document.querySelector('body').classList.remove('hide');
    resizeCanvas();
    drawMeme(gCurrImgUrl, false)
}
function showFocus() {
    var currText = gMeme.lines[gMeme.selectedLineIdx];
    if (!currText) return;
    gCtx.beginPath()
    var startX = (currText.posX - 5);
    var startY = (currText.posY - currText.size - 5);
    var width = (currText.width + 10);
    var height = (currText.size + 15);
    switch (currText.align) {
        case 'left':
            startX += currText.width / 2;
            break;
        case 'right':
            startX -= currText.width / 2;
            break;
    }
    gCtx.rect(startX, startY, width, height)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}