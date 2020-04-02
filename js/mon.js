var mon = mon || {};
((mon_) => {
    var request,
        db;

    var conn = function() {
        return new Promise((res, rej) => {
            request = indexedDB.open("/UGH", 21);
            request.onsuccess = function(e) {
                db = this.result;
                res();
            }
            request.onupgradeneeded = function(e) {
                db = e.target.result;
                var store = db.createObjectStore("FILE_DATA", {keyPath: "timestamp"});
                res();
            }
            request.onerror = function(e) {
                rej(`error: ${e}`);
            }
        })
    }
    
    var getValue = function() {
        return new Promise((res, rej) => {
            let store = db.transaction("FILE_DATA", "readwrite").objectStore("FILE_DATA");
            let file = store.get("/UGH/UGHH.HI");
            file.onsuccess = (e) => {
                let data = e.target.result;
                res(data);
            }
            file.onerror = (e) => {
                rej(`store onerror: ${e}`)
            }
        })
    }

    var run = async function() {
        console.log("in run")
        try {
            await conn();
            let file = await getValue();
            return file.contents;
        } catch(e) {
            console.error(e);
        }
    }
    mon_.getRecord = run;
})(mon);