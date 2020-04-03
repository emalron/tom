window.onload = async function() {
    await init();
}

window.onkeyup = async function(e) {
    let keycode = e.keyCode;
    if(keycode === 83) {
        let contents = await mon.getRecord();
        this.console.log(contents);
    }
}

var init = async function() {
    let url = await gameDB.run("tom", "https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1BaMqdybA44wwzjr6h2S2m7Pe47Redtr2");
    Dos(document.getElementById("jsdos")).ready((fs, main) => {
        fs.extract(url).then(() => {
            main(["-c", "TOM.EXE"])
        });
    });
}

var table = {
    242: "\n",
    223: " ",
    207: 0, 206: 1, 205: 2, 204: 3, 203: 4, 202: 5, 201: 6, 200: 7, 199: 8, 198: 9,
    190: "A", 189: "B", 188: "C", 187: "D", 186: "E", 185: "F", 184: "G", 183: "H",
    182: "I", 181: "J", 180: "K", 179: "L", 178: "M", 177: "N", 176: "O", 175: "P",
    174: "Q", 173: "R", 172: "S", 171: "T", 170: "U", 169: "V", 168: "W", 167: "X",
    166: "Y", 165: "Z"
}

var parser = function(contents) {

}