var mon = mon || {};
((mon_) => {
    var request,
        db;

    var conn = function() {
        return new Promise((res, rej) => {
            request = indexedDB.open("/UGH2", 21);
            request.onsuccess = function(e) {
                console.log("onsuccess")
                db = this.result;
                res("success");
            }
            request.onupgradeneeded = function(e) {
                console.log("onupgradeneeded")
                db = e.target.result;
                var store = db.createObjectStore("FILE_DATA", {keyPath: "timestamp"});
                res("upgrade");
            }
            request.onerror = function(e) {
                rej(`error: ${e}`);
            }
        })
    }
    
    var getValue = function() {
        return new Promise((res, rej) => {
            let store = db.transaction("FILE_DATA", "readwrite").objectStore("FILE_DATA");
            let file = store.get("/UGH2/UGHH.HI");
            file.onsuccess = (e) => {
                let data = e.target.result;
                res(data);
            }
            file.onerror = (e) => {
                rej(`store onerror: ${e}`)
            }
        })
    }

    var getRecord = async function() {
        try {
            let con = await conn();
            if(con == "success") {
                let file = await getValue();
                return file.contents;
            }
            return null;
        } catch(e) {
            console.error(e);
        }
    }
    var update = async function(contents) {
        try {
            await conn();
            let file = await getValue();
            console.log(`is file? ${file}`)
            if(file) {
                let store = db.transaction("FILE_DATA", "readwrite").objectStore("FILE_DATA");
                for(let i=0; i<contents.length; i++) {
                    // 이렇게 하지 않으면 file.contents의 타입이 UInt8Array에서 Array로 바뀐다.
                    // Array 타입은 Dosbox js에서 읽을 수 없다.
                    file.contents[i] = contents[i];
                }
                let file2 = store.put(file, "/UGH2/UGHH.HI");
    
                file2.onsuccess = function(e) {
                    console.log('done');
                }
            }
        } catch(e) {
            console.error(e);
        }
    }
    mon_.getRecord = getRecord;
    mon_.update = update;
})(mon);