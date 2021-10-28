'use strict'
var gTrans = {
    'lang' : {
        en : 'עברית',
        he : 'English' 
    },
    'memes' : {
        en : 'Memes',
        he : 'ממים'
    },
    'gallery' : {
        en : 'Gallery',
        he : 'גלריה'
    },
    'search' : {
        en : 'Search',
        he : 'חיפוש'
    },
    'add-text-here' : {
        en : 'Enter Text Here',
        he : 'הוסף טקסט כאן'
    },
    'share' : {
        en : 'Share',
        he : 'שיתוף'
    },
    'download' : {
        en : 'Download',
        he : 'הורדה'
    },
    'import' : {
        en : 'Import Image',
        he : 'ייבוא תמונה'
    }
}

var gCurrLang = 'en';

function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
    if (!keyTrans) return 'UNKNOWN'
    var txt = keyTrans[gCurrLang];
    if (!txt) return keyTrans.en
    return txt
}
function setLang() {
    if(gCurrLang === 'en'){
        gCurrLang = 'he';
        return;
    } 
    if(gCurrLang === 'he') gCurrLang = 'en';
}