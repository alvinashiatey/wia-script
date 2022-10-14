// search for vowels "aeiou" within the chapter headings and artists page and implement angles
// angels must be implemented on page numbers as well
Array.prototype.filter = function (callBackFn, thisArg) {
    if (this === void 0 || this === null) {
        throw Error;
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof callBackFn !== 'function') {
        throw Error;
    }
    var res = [];
    var theArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
        if (i in t) {
            var val = t[i];
            if (callBackFn.call(theArg, val, i, t)) {
                res.push(val);
            }
        }
    }
    return res;
};
function main() {
    var doc = setUpDoc();
    if (doc === null)
        return;
    var slantStyles = getSlantCharacterStyles(doc);
    handleApplyingStyles(slantStyles, doc);
}
function handleApplyingStyles(styles, doc) {
    for (var i = 0; i < styles.length; i++) {
        var allFrames = textFrameToArray(doc.textFrames, styles[i]);
        handleCharacterStyle(allFrames, styles[i]);
    }
}
function getSlantCharacterStyles(doc) {
    var tilts = [];
    var allCharacterStyles = doc.allCharacterStyles;
    for (var i = 0; i < allCharacterStyles.length; i++) {
        var chkIfSlant = allCharacterStyles[i].name.split(" ");
        if (chkIfSlant[chkIfSlant.length - 1] === "Slant") {
            tilts.push(allCharacterStyles[i].name);
        }
    }
    return tilts;
}
function handleCharacterStyle(texts, charStyleName) {
    for (var i = 0; i < texts.length; i++) {
        applyCharacterStyle(texts[i], charStyleName);
    }
}
function applyCharacterStyle(text, cStyleName) {
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.NOTHING;
    if (app.findChangeGrepOptions.hasOwnProperty("searchBackwards")) {
        app.findChangeGrepOptions["searchBackwards"] = false;
    }
    app.findGrepPreferences["findWhat"] = "(?<!\\b[\\u])[AEIOU]";
    var find = text.findGrep(true);
    app.changeGrepPreferences["appliedCharacterStyle"] = getCharacterStyles(cStyleName);
    for (var i = 0; i < find.length; i++) {
        if (find[i].index !== 0)
            find[i].changeGrep(true);
    }
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.NOTHING;
}
function getCharacterStyles(name) {
    var doc = app.activeDocument;
    for (var i = 0; i < doc.allCharacterStyles.length; i++) {
        if (doc.allCharacterStyles[i].name == name)
            return doc.allCharacterStyles[i];
    }
    var tiltAxis = name.split(" ")[0];
    return doc.characterStyles.add({
        name: name,
        skew: tiltAxis
    });
}
function textFrameToArray(obj, objStyle) {
    var i = obj.length;
    var array = [];
    while (i--) {
        if (obj[i].appliedObjectStyle.name === objStyle)
            array.push(obj[i]);
    }
    return array;
}
function setUpDoc() {
    try {
        if (app.activeDocument) {
            return app.activeDocument;
        }
        else {
            alert("Open WIA document");
            return null;
        }
    }
    catch (e) {
        alert(e);
    }
}
main();
// script by Alvin Ashiatey
// written for Nontsikelelo Mutit for her WIA project 2022
