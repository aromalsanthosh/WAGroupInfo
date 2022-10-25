let processing = false;
let nameMapping = new Map();
let keyMapping = new Map();

let pdf = null;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let elem = document.getElementById("processing-text");
        if (request.type == 'nameMapping') {
            nameMapping.set(request.key, request.value);
        } else if (request.type == 'keyMapping') {
            keyMapping.set(request.key, request.value);
        }
    }
);

async function process() {
    console.log("process button clicked");

    processing = true;
    let elem = document.getElementById("processing-text");
    elem.innerText = "Processing...";
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "GET_GROUPS_INFO"}, async function (par) {
            console.log('par', par);
        });
        setTimeout(function () {
            var table = document.createElement('table');
            keyMapping.forEach(function (value, key) {
                let groupSize = keyMapping.get(key);
                let groupName = nameMapping.get(key);

                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var text1 = document.createTextNode(groupName);
                var text2 = document.createTextNode(groupSize);
                td1.appendChild(text1);
                td2.appendChild(text2);
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            });
            elem.innerText = '';
            elem.appendChild(table);

        }, 3000);
    });
}

function generatePDF() {
    
    const element = document.getElementById("processing-text");
    var opt = {
        margin: 1,
        filename: 'group-stats.pdf',
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    };

    html2pdf()
    .set(opt)
    .from(element)
    .save();
}

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("process-button").addEventListener("click", process);
    document.getElementById("save-pdf-button").addEventListener("click", generatePDF);
});

