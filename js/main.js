'use strict'
var gElCanvas;
var gCtx;
var gIsUpdating = false;
var gDontGrab = false;
var gCurrImgUrl;
var gCurrHeight;
var gCurrFont;
var gStartPos;
const gTouchEvents = ['touchstart', 'touchmove', 'touchend']

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
    document.querySelector('.share-container').style.visibility = 'hidden';
    document.querySelector('.bg-screen').classList.remove('show');
    document.querySelector('.nav-bar').classList.remove('show');
    document.querySelector('body').classList.add('overflow-hidden');
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
    gMeme.textLines.forEach((line) => {
        drawText(line);
    })
}
function drawText(line) {
    var txt = line.txt;
    gCtx.lineWidth = 2
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align;
    line.width = gCtx.measureText(txt).width;

    if (line.posX && line.posY) {
        if (line.isGrab) {
            line.height = line.posY;
        } else {
            line.posY = line.height;
        }
        gCtx.fillText(txt, line.posX + line.width / 2, line.posY)
        gCtx.strokeText(txt, line.posX + line.width / 2, line.posY)
    } else {
        var y = line.height;
        if (!y) {
            switch (gMeme.lineIdx) {
                case 0:
                    var y = gElCanvas.height - (gElCanvas.height - 50);
                    break;
                case 1:
                    var y = gElCanvas.height - 50;
                    break;
                default:
                    var y = gElCanvas.height / 2;
            }
        }
        gCtx.fillText(txt, gElCanvas.width / 2, y)
        gCtx.strokeText(txt, gElCanvas.width / 2, y)
        line.posY = y;
        line.posX = gElCanvas.width / 2 - line.width / 2;
        line.height = y;
    }
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
function onAddText() {
    var elTextInput = document.querySelector('.add-text-input');
    if (gIsUpdating) {
        if (!elTextInput.value) return;
        gMeme.textLines[gMeme.lineIdx].txt = elTextInput.value;
        drawText(gMeme.textLines[gMeme.LineIdx]);
        gIsUpdating = false;
        document.querySelector('.add-btn').innerHTML = `<img src="icons/add.png" alt="">`;
        drawMeme(gCurrImgUrl, false);
    } else {
        var txt = elTextInput.value;
        if (!txt) return;
        var font = document.querySelector('.font-family').value;
        var color = document.querySelector('.color-input').value;
        if (!color) color = 'white'
        createLine(txt, font, 'center', color);
        drawText(gMeme.textLines[gMeme.lineIdx]);
    }
    elTextInput.value = '';
    document.querySelector('.color-input').value = '#ffffff'
    gCurrHeight = null;
    textDrop();
}
function selectText(ev) {
    ev.stopPropagation()
    if (gDontGrab) return;
    const pos = getEventPos(ev);
    var x = pos.x;
    var y = pos.y;
    var lineIdx = gMeme.textLines.findIndex((line) => {
        return (x > line.posX && x < line.posX + line.width && y < line.posY && y > line.posY - line.size)
    })
    if (lineIdx >= 0) gMeme.lineIdx = lineIdx;
    else {
        drawMeme(gCurrImgUrl, false);
        return;
    }
    setTextGrab(true);

    gStartPos = pos;
    gCurrHeight = null
    gIsUpdating = true;
    document.querySelector('.add-btn').innerHTML = `<img src="icons/ok.png">`
    document.querySelector('.add-text-input').value = gMeme.textLines[gMeme.lineIdx].txt;
    if (window.screen.width > 540) {
        document.querySelector('.add-text-input').focus();
    }
    drawMeme(gCurrImgUrl, true);
}
function updateText() {
    if (!gIsUpdating) return;
    gMeme.textLines[gMeme.lineIdx].txt = document.querySelector('.add-text-input').value
    drawMeme(gCurrImgUrl, true);
}
function moveText(diff) {
    if (!gIsUpdating) return;
    onMoveText(diff);
    drawMeme(gCurrImgUrl, true)
}
function deleteText() {
    if (!gIsUpdating) return;
    textDelete();
    drawMeme(gCurrImgUrl, false);
    gIsUpdating = false;
    document.querySelector('.add-btn').innerHTML = `<img src="icons/add.png">`;
    document.querySelector('.add-text-input').value = '';
}
function switchFocus() {
    if (!gMeme.textLines.length) return;
    gMeme.lineIdx++;
    gCurrHeight = null;
    if (gMeme.lineIdx > (gMeme.textLines.length - 1)) {
        gMeme.lineIdx = 0;
    };
    gIsUpdating = true;
    document.querySelector('.add-btn').innerHTML = `<img src="icons/ok.png">`;
    document.querySelector('.add-text-input').value = gMeme.textLines[gMeme.lineIdx].txt;
    document.querySelector('.add-text-input').focus();
    drawMeme(gCurrImgUrl, true)
}
function textDrop() {
    if (!gMeme.textLines.length) return;
    if (!gMeme.textLines[gMeme.lineIdx].isGrab) {
        onAddText();
        return;
    }
    setTextGrab(false);
    gDontGrab = true;
    setTimeout(() => {
        gDontGrab = false;
    }, 3)
    document.querySelector('.add-text-input').focus();
}
function getEventPos(ev) {

    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvents.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
function onSetMemeImg(imgId) {
    var imgUrl = setMemeImg(imgId);
    gCurrImgUrl = imgUrl;
    gMeme.textLines = [];
    gMeme.lineIdx = 0;
    document.querySelector('.gallery-page').classList.add('hide');
    document.querySelector('.edit-page').classList.remove('hide');
    document.querySelector('body').classList.remove('hide');
    resizeCanvas();
    drawMeme(gCurrImgUrl, false)
}
function showFocus() {
    var currText = gMeme.textLines[gMeme.lineIdx];
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
function onSetLang() {
    setLang();
    document.querySelector('.bg-screen').classList.remove('show')
    document.querySelector('.nav-bar').classList.remove('show')
    if (gCurrLang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    document.querySelector('#nav-icon1').classList.remove('open');
    startTrans();
}
function onImgInput(ev) {
    loadImgFromInput(ev, renderImg)
}
function loadImgFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function (event) {
        console.log('event:', event)
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}
function renderImg(img) {
    createNewImg(img);
    gCurrImgUrl = img.src;
    document.querySelector('.gallery-page').classList.add('hide');
    document.querySelector('.edit-page').classList.remove('hide');
    resizeCanvas();
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}
function startTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(function (el) {
        var txt = getTrans(el.dataset.trans)
        if (el.nodeName === 'INPUT') el.placeholder = txt;
        else el.innerText = txt
    })
}
function toggleMenu() {
    document.querySelector('.nav-bar').classList.toggle('show');
    document.querySelector('.bg-screen').classList.toggle('show');
}
function toggleBtn() {
    document.querySelector('#nav-icon1').classList.toggle('open');
}
