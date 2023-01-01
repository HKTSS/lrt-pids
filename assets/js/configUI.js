function updateStationList() {
    let stnSel = document.getElementById("stnSel");
    if(stnSel == null) return;

    stnSel.innerHTML = ``;
    for(const [stnId, stnData] of StationCodeList) {
        let option = document.createElement('option');
        option.value = stnId;
        option.text = stnData.name.split("|").join(" ");
        stnSel.append(option)
    }
}

function updatePlatform() {
    let stnSel = document.getElementById("stnSel");
    let platSel = document.getElementById("platSel");
    platSel.innerHTML = ``;
    if(stnSel == null || platSel == null) return;

    let station = StationCodeList.get(stnSel.value);

    for(let platform of station.platforms) {
        let option = document.createElement('option');
        option.value = platform;
        option.text = platform;
        platSel.append(option)
    }
}

function selectStation(stnId) {
    let stnSel = document.getElementById("stnSel");
    if(stnSel != null && stnId != null) {
        stnSel.value = stnId;
    }
}

function selectPlatform(plat) {
    let platSel = document.getElementById("platSel");
    if(platSel != null && plat != null) {
        platSel.value = plat;
    }
}

function showConfig(stnId, plat) {
    let config = document.getElementById("config");
    if(config != null) config.style.display = "block";
    selectStation(stnId);
    selectPlatform(plat);
}

function hideConfig() {
    let config = document.getElementById("config");
    if(config != null) config.style.display = "";
}