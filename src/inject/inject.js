function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "GET_GROUPS_INFO") {
            fetchGroupsData(sendResponse);
            sendResponse('processing');
            // await sleep(2000);
            // console.log('ress', ress);
            // sendResponse(ress);
            // await chrome.extension.sendMessage({ress: ress});
        }
        return true;
    }
);

// function log() {
// 	keyMapping.forEach(function(value, key) {
// 		let groupSize = keyMapping.get(key);
// 		let groupName = nameMapping.get(key);
// 		console.log(groupName + " : " + groupSize);
// 	});
// }

let db;
let nameMapping = new Map();
let keyMapping = new Map();

function fetchGroupsData(sendResponse) {

    window.innerHeight = 10000;
    let request = indexedDB.open("model-storage");
    request.onerror = (event) => {
        console.error("Connection to IndexDB Failed");
    };
    let result = null;
    request.onsuccess = (event) => {
        db = event.target.result;
        let idbGroupsRequest = db.transaction("participant").objectStore("participant").getAll();
        idbGroupsRequest.onsuccess = async (event) => {
            let groups = event.target.result;
            groups.forEach(function (group) {
                chrome.extension.sendMessage({
                    type: 'keyMapping',
                    key: group.groupId,
                    value: group.participants.length
                });
            });
        }

        let idbChatsRequest = db.transaction("chat").objectStore("chat").getAll();
        idbChatsRequest.onsuccess = (event) => {
            let chats = event.target.result;
            chats.forEach(function (chat) {
                chrome.extension.sendMessage({type: 'nameMapping', key: chat.id, value: chat.name});
            });
        }
    };
}