window.onload = async function() {
    Dos(document.getElementById("jsdos")).ready((fs, main) => {
        fs.createFile("dosbox.conf", `
            [joystick]
            joysticktype=none
        `);
        fs.extract("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1u0zNOPifzjVfz18XGeL9v7T8XDKe3owp", "/UGH").then(() => {
            main(["-conf", "dosbox.conf", "-c", "cd UGH", "-c", "UGH.EXE"]).then(async (ci) => {                        
                window.ci = ci;
                let contents = await this.mon.getRecord();
                let scores = this.parser(contents);
                let topscore = this.getTopscore(scores);
                this.setHighScore(topscore);
            });
        });
    });
}

window.onkeyup = async function(e) {
    let keycode = e.keyCode;
    if(keycode === 81) {
        let contents = await mon.getRecord();
        let scores = this.parser(contents);
        let topscore = this.getTopscore(scores);
    }
}

var table = {
    255: ".",
    242: "\n",
    223: " ",
    207: 0, 206: 1, 205: 2, 204: 3, 203: 4, 202: 5, 201: 6, 200: 7, 199: 8, 198: 9,
    190: "A", 189: "B", 188: "C", 187: "D", 186: "E", 185: "F", 184: "G", 183: "H",
    182: "I", 181: "J", 180: "K", 179: "L", 178: "M", 177: "N", 176: "O", 175: "P",
    174: "Q", 173: "R", 172: "S", 171: "T", 170: "U", 169: "V", 168: "W", 167: "X",
    166: "Y", 165: "Z",
    0: "."
}

var parser = function(contents) {
    let len = contents.length;
    let container = [];
    for(let i=0; i<len; i++) {
        container.push(table[contents[i]]);
    }
    console.log(container);
    let containers = container.join("").split("\n");
    return containers;
    
}

var getTopscore = function(containers) {
    let top = containers[0];
    let score = parseInt(top.replace(/[^0-9]/g, ""));
    return score;
}

var setHighScore = function(score) {
    let hiscoreElem = document.getElementById("hiscore");
    if(score) {
        hiscoreElem.innerHTML = score;
    }
}