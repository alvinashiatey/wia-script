// search for vowels "aeiou" within the chapter headings and artists page and implement angles
// angels must be implemented on page numbers as well

interface Array<T>{
    filter<U>(
        callBackFn: (currentValue: T,currentIndex: number,array: T[] ) => U,
        thisArg?: any
    ): U[]
}

Array.prototype.filter = function (
    callBackFn:(currentValue:any, currentIndex: number, array: any[])=>any,
    thisArg?: any
): any[]{
    if (this === void 0 || this === null) {
        throw Error;
    }
    let t = Object(this);
    let len = t.length >>> 0;
    if (typeof callBackFn !== 'function') {
        throw Error;
    }
    let res = [];
    let theArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (let i = 0; i < len; i++) {
        if (i in t) {
            let val = t[i];
            if (callBackFn.call(theArg, val, i, t)) {
                res.push(val);
            }
        }
    }
    return res;
}


function main (): void {
    const doc = setUpDoc()
    if (doc === null) return
    const slantStyles =  getSlantCharacterStyles(doc)
    handleApplyingStyles(slantStyles, doc)
}

function handleApplyingStyles(styles: string[], doc: Document) {
    for (let i = 0; i < styles.length; i++){
        const allFrames = textFrameToArray(doc.textFrames, styles[i]);
        handleCharacterStyle(allFrames, styles[i])
    }
}

function getSlantCharacterStyles(doc: Document): string[]{
    const tilts: string[] = []
    const allCharacterStyles = doc.allCharacterStyles
    for (let i = 0; i < allCharacterStyles.length; i++) {
        const chkIfSlant = allCharacterStyles[i].name.split(" ")
        if (chkIfSlant[chkIfSlant.length -1 ] === "Slant") {
            tilts.push(allCharacterStyles[i].name)
        }
    }
    return tilts
}

function handleCharacterStyle(texts:TextFrame[], charStyleName: string) {
    for (let i = 0; i < texts.length; i++){
        applyCharacterStyle(texts[i], charStyleName)
    }
}

function applyCharacterStyle(text: TextFrame, cStyleName: string) {
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.NOTHING;
    if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
        app.findChangeGrepOptions["searchBackwards"] = false;
    }
    app.findGrepPreferences["findWhat"] = "(?<!\\b[\\u])[AEIOU]"
    const find = text.findGrep(true)
    app.changeGrepPreferences["appliedCharacterStyle"] = getCharacterStyles(cStyleName)
    for (let i = 0; i < find.length; i++) {
        if (find[i].index !== 0 ) find[i].changeGrep(true)
    }
    app.findGrepPreferences = app.changeGrepPreferences = NothingEnum.NOTHING;
}

function getCharacterStyles (name: string): CharacterStyle {
    const doc = app.activeDocument
    for (let i = 0; i < doc.allCharacterStyles.length; i++) {
        if (doc.allCharacterStyles[i].name == name ) return doc.allCharacterStyles[i];
    }
    const tiltAxis = name.split(" ")[0]
    return doc.characterStyles.add({
        name,
        skew: tiltAxis
    })
}

function textFrameToArray (obj: TextFrames, objStyle: string): TextFrame[] {
    let i = obj.length;
    let array = [];
    while(i--){
        if (obj[i].appliedObjectStyle.name === objStyle)
        array.push(obj[i]);
    }
    return array;
}

function setUpDoc(): Document | null {
    try {
        if (app.activeDocument) {
            return app.activeDocument
        } else {
            alert("Open WIA document")
            return null
        }
    } catch (e) {
        alert(e)
    }
}

main()


// script by Alvin Ashiatey
// written for Nontsikelelo Mutit for her WIA project 2022