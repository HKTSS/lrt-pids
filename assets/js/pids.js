const DisplayedArrivalRow = 10;
let stnId;
let selectedPlatform;

function updateClock(clockElement) {
    if(clockElement == null) return;
    let d = new Date();
    clockElement.textContent = padZero(d.getHours()) + ":" + padZero(d.getMinutes());
}

function clearETARow() {
    let e = document.getElementsByClassName("arrRow");
    let elems = Array.from(e);
    for(let elem of elems) {
        elem.remove();
    }
}

function updateETARow(arrData) {
    clearETARow();
    let etaElem = document.getElementById("eta");
    if(etaElem == null) return;
    let etaTable = etaElem.querySelector("tbody");
    if(etaTable == null) return;

    for(let i = 0; i < DisplayedArrivalRow; i++) {
        let entry = arrData[i];
        let row = document.createElement("tr");
        row.classList.add("arrRow");

        if(entry === undefined) {
            row.innerHTML = `<tr><td class="lineHeightDouble sizeDouble">&nbsp;</td> <td></td> <td></td> <td></td></tr>`
            etaTable.append(row);
        } else {
            let etaMin = "";
            let timetext = "分鐘|min";
            let carImg = `<img src="./assets/img/lrv.png" alt="LRV Car">`;
            if(entry.ttnt_en.includes("min")) {
                etaMin = entry.ttnt_en.split(" min")[0];
            } else if(entry.ttnt_en == "-") {
                etaMin = "-";
                timetext = "&nbsp;|&nbsp;"
            } else {
                timetext = `${entry.ttnt_zh}|${entry.ttnt_en}`;
            }
            
            let rtHTML = `<td class="lineHeightDouble sizeDouble">${entry.route_no}</td>`;
            let destHTML = `<td class="destCell"><span class="sizeZH">${entry.dest_zh}</span><br>${entry.dest_en}</td>`
            let carHTML = `<td>${carImg} ${entry.train_length == 2 ? carImg : ""}</td>`
            let etaHTML = `<td><span class="sizeDouble multiLine">${etaMin}</span><span class="eta">${getLang(timetext, "zh")}<br>${getLang(timetext, "en")}</span></td>`
            row.innerHTML += rtHTML;
            row.innerHTML += destHTML;
            row.innerHTML += carHTML;
            row.innerHTML += etaHTML;
            etaTable.append(row);
        }
    }
}

function updateTitlebar(platform, stnId) {
    let platformNumberElement = document.getElementById("platNum");
    let stnNameZHElem = document.getElementById("stnZH");
    let stnNameENElem = document.getElementById("stnEN");
    let station = StationCodeList.get(stnId);
    if(station == null) return;
    if(platformNumberElement != null) {
        platformNumberElement.textContent = platform;
    }
    stnNameZHElem.textContent = getLang(station.name, 'zh');
    stnNameENElem.textContent = getLang(station.name, 'en');
}

async function fetchData() {
    if(stnId == null || selectedPlatform == null) return;
    let resp = await fetch(ApiURL.replace("{stn}", stnId));
    let data = await resp.json();
    if(data == null) return;
    /* Only 1 should be valid */
    if(data.status != 1) return;

    let entries = [];
    for(let platform of data.platform_list) {
        if(selectedPlatform === 0 || platform.platform_id !== selectedPlatform) continue;
        for(let rawEntry of platform.route_list) {
            /* Line stopped */
            if(rawEntry.stop === 1) continue;
            let entry = new ArrivalEntry(rawEntry.route_no, rawEntry.train_length, rawEntry.dest_ch, rawEntry.dest_en, rawEntry.arrival_departure, rawEntry.time_ch, rawEntry.time_en);
            entries.push(entry);
        }
    }

    updateETARow(entries);
}

window.onload = function(e) {
    let clockElement = document.getElementById("clock");
    updateClock(clockElement);
    setInterval(updateClock, 5 * 1000, clockElement)
    setInterval(fetchData, 10 * 1000);
}





/******** Util ********/
function getLang(str, lang) {
    if(lang == "en") {
        return str.split("|")[1]
    } else {
        return str.split("|")[0]
    }
}

function padZero(i) {
    if(i < 10) {
        return "0" + i.toString()
    }
    return i;
}

/******** Iframe communication *********/
window.onmessage = function(e) {
    let data = JSON.parse(e.data);

    switch(data.id) {
        case 'updateCurrentData':
                selectedPlatform = data.selectedPlatform;
                stnId = data.stnId;
                updateTitlebar(selectedPlatform, stnId);
                fetchData();
            break;
        default:
            break;
    }
};