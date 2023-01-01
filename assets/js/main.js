let selectedStationId;
let selectedPlatform;

function loadSessionData() {
    let stationId = localStorage.getItem("stnId")
    let platform = localStorage.getItem("selectedPlatform");
    selectedStationId = stationId;
    selectedPlatform = platform;
}

function saveData() {
    localStorage.saveData("stnId", selectedStationId);
    localStorage.saveData("selectedPlatform", selectedStationId);
}

function parseQuery() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if(params["stnId"] !== undefined) {
        selectedStationId = params["stnId"];
    }
    if(params["plat"] !== undefined) {
        let parsedPlatform = parseInt(params["plat"]);
        if(!isNaN(parsedPlatform)) {
            selectedPlatform = parsedPlatform;
        }
    }
}

function updateData() {
    let pidsElem = document.getElementById("pids");
    if(pidsElem != null && selectedStationId != null && selectedPlatform != null) {
        pidsElem.contentWindow.postMessage(JSON.stringify({
            id: 'updateCurrentData',
            stnId: selectedStationId,
            selectedPlatform: selectedPlatform
        }), "*")
    }
}

window.onload = (() => {
    loadSessionData();
    parseQuery();
    updateData();

    //UI
    let stnSel = document.getElementById("stnSel");
    stnSel.onchange = updatePlatform;
    updateStationList();
    updatePlatform();
    if(selectedStationId == null || selectedPlatform == null) {
        showConfig();
    }
});