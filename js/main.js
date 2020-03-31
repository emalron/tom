(async () => {
    let url = await gameDB.run("tom", "https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1BaMqdybA44wwzjr6h2S2m7Pe47Redtr2");
    Dos(document.getElementById("jsdos")).ready((fs, main) => {
        fs.extract(url).then(() => {
            main(["-c", "TOM.EXE"])
        });
    });
})();
