'use strict'
var gImgs;
var gSavedMemes;
var gFilter = '';

var gMeme = {
    imgId: 0,
    lineIdx: 0,
    stickerIdx: 0,
    // OutlineColor: 'black',
    // fillColor: 'white',
    textLines: []
}

function loadImgs() {
    gImgs = loadFromStorage('ImgsDB');
    if (!gImgs) gImgs = [
        { id: 1, url: 'meme-imgs (square)/1.jpg', keywords: ['ugly', 'trump', 'president'] },
        { id: 2, url: 'meme-imgs (square)/2.jpg', keywords: [, 'animal', 'love'] },
        { id: 3, url: 'meme-imgs (square)/3.jpg', keywords: ['kids', 'animal', 'cute'] },
        { id: 4, url: 'meme-imgs (square)/4.jpg', keywords: ['animal', 'sleep'] },
        { id: 5, url: 'meme-imgs (square)/5.jpg', keywords: ['kids'] },
        { id: 6, url: 'meme-imgs (square)/6.jpg', keywords: ['funny'] },
        { id: 7, url: 'meme-imgs (square)/7.jpg', keywords: ['kids', 'funny'] },
        { id: 8, url: 'meme-imgs (square)/8.jpg', keywords: ['happy', 'men'] },
        { id: 9, url: 'meme-imgs (square)/9.jpg', keywords: ['happy', 'kids', 'funny'] },
        { id: 10, url: 'meme-imgs (square)/10.jpg', keywords: ['happy', 'obama', 'president'] },
        { id: 11, url: 'meme-imgs (square)/11.jpg', keywords: ['happy', 'men', 'sport'] },
        { id: 12, url: 'meme-imgs (square)/12.jpg', keywords: ['men'] },
        { id: 13, url: 'meme-imgs (square)/13.jpg', keywords: ['men', 'funny'] },
        { id: 14, url: 'meme-imgs (square)/14.jpg', keywords: ['men', 'scary'] },
        { id: 15, url: 'meme-imgs (square)/15.jpg', keywords: ['men'] },
        { id: 16, url: 'meme-imgs (square)/16.jpg', keywords: ['happy', 'funny', 'men'] },
        { id: 17, url: 'meme-imgs (square)/17.jpg', keywords: ['happy', 'putin', 'president'] },
        { id: 18, url: 'meme-imgs (square)/18.jpg', keywords: ['kids', 'toys'] },
    ]
    return gImgs;
}
function createLine(txt, font = 'impact', align = 'center', color = 'white', width, posX, posY) {
    var line = {
        txt,
        size: 40,
        font: 'impact',
        align,
        color,
        width,
        posX,
        posY,
        isGrab: false
    }
    gMeme.textLines.push(line);
    gMeme.lineIdx = gMeme.textLines.length - 1;
}
function setMemeImg(imgId) {
    var img = gImgs.find((img) => img.id === imgId);
    gMeme.imgId = img.id;
    return img.url;
}
function createNewImg(img) {
    var newImg = {
        id: gImgs.length + 1,
        url: img.src,
        keywords: ['']
    }
    gImgs.push(newImg);
    saveToStorage('ImgsDB', gImgs)
}
function textMove(diff) {
    if (!gCurrHeight) {
        gCurrHeight = gMeme.textLines[gMeme.lineIdx].height;
    }
    gCurrHeight += (diff * 10);
    gMeme.textLines[gMeme.lineIdx].height = gCurrHeight;
}
function textDelete() {
    gMeme.textLines.splice(gMeme.lineIdx, 1);
    if (gMeme.lineIdx > 0) gMeme.lineIdx--;
}
function fontChange(diff) {
    gMeme.textLines[gMeme.lineIdx].size += (diff * 2);
}
function alignText(align) {
    gMeme.textLines[gMeme.lineIdx].align = align;
}
function setTextGrab(isGrab) {
    gMeme.textLines[gMeme.lineIdx].isGrab = isGrab;
}
function onMoveText(dx, dy) {
    gMeme.textLines[gMeme.lineIdx].posX += dx
    gMeme.textLines[gMeme.lineIdx].posY += dy
}
function saveMemes() {
    saveToStorage('SavedMemes', gSavedMemes);
}
function loadMemes() {
    gSavedMemes = loadFromStorage('SavedMemes');
    if (!gSavedMemes) gSavedMemes = [];
}
function onSetFilter(filterBy) {
    gFilter = filterBy.toLowerCase();
}
function getImgsForDisplay() {
    var imgs = gImgs.filter((img) => {
        return img.keywords.some((word) => {
            return word.includes(gFilter);
        });
    })
    return imgs
}
function familyChange() {
    gMeme.textLines[gMeme.lineIdx].font = gCurrFont;
}
function colorChange(color){
    gMeme.textLines[gMeme.lineIdx].color = color;
}
