var database,
    auth;

async function init() {
    auth = firebase.auth();
    auth.onAuthStateChanged(auth_change_event);
    database = firebase.database();
}

function login_event() {
    let provider = new firebase.auth.GoogleAuthProvider();
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

    auth.signInWithPopup(provider).then(result => {
        database.goOnline();
        console.log('login success');
    })
    .catch(error => {
        console.log(`[${error.code}] ${error.message}`)
    })
}

function logout_event() {
    if(database) {
        database.goOffline();
    }
    auth.signOut();
}

function auth_change_event(user) {
    let login = document.getElementById("login");
    let logout = document.getElementById("logout");
    let lobby = document.getElementById("lobby");
    let game = document.getElementById("game");

    if(user) {
        login.style.display = "none";
        logout.style.display = "block";
        lobby.style.display = "none";
        game.style.display = "block";
        gameStart();

    } else {
        login.style.display = "block";
        logout.style.display = "none";
        lobby.style.display = "block";
        game.style.display = "none";
    }
}

function addRecord(score, contents) {
    let uid = auth.currentUser.uid;
    let name = auth.currentUser.displayName;
    let mainref = database.ref().child(uid);

    let output = {name: name, score: score, contents: contents};
    let current = 0;
    mainref.once("value").then((snapshot) => {
        current = snapshot.val();
        if(!current || output.score > current.score) {
            mainref.set(output);
        }
    })
}

function getContents() {
    return new Promise((res, rej) => {
        let uid = auth.currentUser.uid;
        let mainref = database.ref().child(uid);
        mainref.once("value").then((snapshot) => {
            current = snapshot.val();
            if(current) {
                res(current.contents);
            }
            res(null);
        })
    })
}

async function getRank() {
    return new Promise((res, rej) => {
        let ranking = [];
        let mainref = database.ref();
        let output = mainref.orderByChild(`score`).once("value", snapshot => {
            snapshot.forEach(data => {
                ranking.push({name: data.val().name, score: data.val().score});
            })
            let rank = ranking.sort((a,b) => b.score - a.score)
            res(rank);
        })
    })
}