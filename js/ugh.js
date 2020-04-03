window.onload = async function() {
    this.init();
    this.gameStart();
    let rank = await this.getRank();
    this.showRank(rank);
}

window.onkeyup = function(e) {
    let keycode = e.keyCode;
    if(keycode === 81) {
        ci.listenStdout(async (message) => {
            if(message === ">") {
                let trial = 0;
                this.console.log(`end of line`);
                let contents;
                while(trial < 3) {
                    contents = await mon.getRecord();
                    if(contents.length > 0) {
                        break;
                    }
                    trial++;
                }
                let scores = this.parser(contents);
                let topscore = this.getTopscore(scores);
                this.setHighScore(topscore, contents);
                ci.exit();
            }
        });
    }
    if(keycode === 83) {
        
    }
}

var gameStart = async function() {
    let isLogin = auth.currentUser;
    if(isLogin) {
        console.log('login checked')

        Dos(document.getElementById("jsdos")).ready(async (fs, main) => {
            fs.createFile("dosbox.conf", `
                [joystick]
                joysticktype=none
            `);
            fs.extract("game/UGH.zip", "/UGH2").then(() => {
                main(["-conf", "dosbox.conf", "-c", "cd UGH2", "-c", "UGH.EXE"]).then(async (ci) => {
                    window.ci = ci;
                    contents = await this.mon.getRecord();
                    let scores = this.parser(contents);
                    let topscore = this.getTopscore(scores);
                    this.setHighScore(topscore, null);
                });
            });
        });
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

var initial = new Uint8Array(107);
initial = [
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223, 242,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223, 242,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223, 242,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223, 242,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223,
    223, 223, 223, 223, 223, 242,
    255, 0
];

var parser = function(contents) {
    let len = contents.length;
    let container = [];
    for(let i=0; i<len; i++) {
        container.push(table[contents[i]]);
    }
    let containers = container.join("").split("\n");
    return containers;
    
}

var getTopscore = function(containers) {
    let top = containers[0];
    let score = parseInt(top.replace(/[^0-9]/g, ""));
    return score;
}

var setHighScore = function(score, contents) {
    let hiscoreElem = document.getElementById("hiscore");
    if(score) {
        hiscoreElem.innerHTML = score;
        if(auth.currentUser && contents) {
            addRecord(score, contents);
        }
    }
}

var showRank = function(rank) {
    let board = document.getElementById("ranking");
    let num = 1;
    rank.forEach(e => {
        let str = `${num}등 ${e.name}님 ${e.score}점<br>`
        board.innerHTML += str;
        num++;
    });
}