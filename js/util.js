var gameDB = gameDB || {};
(function(db_) {
    // set indexedDB for various browsers
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB ||
        window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
        widow.OIDBTransaction || window.msIDBTransaction,
    dbVersion = 1;
    var db;

    var init = function() {
        return new Promise((res, rej) => {
            // DB 생성
            request = indexedDB.open("DOSBOX", dbVersion);
            // DB 생성 성공
            request.onsuccess = async function(e) {
                db = this.result;
                res();
            }
            // DB 생성 실패
            request.onerror = function(e) {
                rej(`indexedDB: ${e.target.errorCode}`);
            }
            // DB가 없으면 생성
            request.onupgradeneeded = function(e) {
                db = e.target.result;
                var store = db.createObjectStore("games", {keyPath: "name"});
            }
        });
    }

    var checkGameFile = function(name) {
        return new Promise((res, rej) => {
            let store = getObjectStore("games", "readonly");
            let req = store.get(name);
            req.onsuccess = async (e) => {
                let data = e.target.result;
                if(!data) {
                    res(false);
                } else {
                    res(true);
                }
            }
        });
    }

    var getObjectStore = (name, mode) => {
        return db.transaction(name, mode).objectStore(name);
    }

    var addFileToDB = function(name, blob) {
        return new Promise((res, rej) => {
            let store = getObjectStore("games", "readwrite");
            let req = store.add({name: name, value: 1, file: blob});
            req.onsuccess = (e) => {
                res(true);
            }
            req.onerror = (e) => {
                rej(`couldn't add file blob to the database: blob ${blob}`);
            }
        })
    }

    var downloadGame = function(url) {
        return new Promise((res, rej) => {
            var xhr = new XMLHttpRequest(),
            blob;
            console.log(`in downloadGame, url: ${url}`)
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                if(xhr.status === 200) {
                    blob = xhr.response;
                    res(blob);
                } else {
                    rej(`download error: ${xhr.status}`);
                }
            }
            xhr.send();
        })
    }

    var getFileURL = function(name) {
        return new Promise((res, rej) => {
            let url;
            let store = getObjectStore("games", "readwrite");
            let data = store.get(name);

            data.onsuccess = (e) => {
                let file = e.target.result;
                var URL = window.URL || window.webkitURL;
                var result = URL.createObjectURL(file.file);
                if(!result) {
                    rej("error: no file")
                } else {
                    res(result);
                }
            }
        })
        
        return url;
    }

    var run = async function(name, fileURL) {
        try {
            await init();
            let is_game_file = await checkGameFile(name),
                url;
            if(!is_game_file) {
                console.log(`there is no such file, downloading the file`)
                let blob = await downloadGame(fileURL);
                await addFileToDB(name, blob);
            }
            console.log(`creating the url for the file`)
            url = await getFileURL(name);
            return url;
        } catch(e) {
            console.error(e);
        }
    }

    db_.run = run;
}
)(gameDB);