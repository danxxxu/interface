// access collection 'interactions'
let interactions = db.collection('interactions');
let interactionID = db.collection('data').doc('interactionID');
let existingID = [];
let elementType = db.collection('data').doc('elementType');
let existType = [];
// let elementCount = db.collection('data').doc('elementCount');
// let existEcount = [];
// let configT = db.collection('data').doc('configT');
// let existConfigT = [];
// let configF = db.collection('data').doc('configF');
// let existConfigF = [];
// let comCount = db.collection('data').doc('comCount');
// let existCcount = [];

let allInputs = {};

const mainR = 55;
const dirR = 0;
const viaR = 15;
const viaR1 = viaR - 1;
const mainDist = 50;
const viaDist = -10;
const dirDist = - 50;

let node = {};
let link = {};

let nodes = [];
let links = [];

export { mainR, viaR1, viaR };
import { drawVis } from "./script.js"

document.querySelector("#visualise").addEventListener("click", visualise);
document.querySelector("#submit").addEventListener("click", submitDB);

window.addEventListener('load', displayID, false);
// window.location.reload(true);
document.querySelector("#add_element").addEventListener('click', displaySelect());

function displayID() {
    interactionID.get().then((doc) => {
        const existingID = doc.data().ids;
        let selectInteraction = document.querySelector("#select_interaction");
        existingID.forEach(id => {
            selectInteraction.innerHTML += `<option value="` + id + `">` + id + `</option>`;
        });
    });
    loadData();
};

function updateID(id) {
    let selectInteraction = document.querySelector("#select_interaction");
    selectInteraction.innerHTML += `<option value="` + id + `">` + id + `</option>`;
}

async function loadData() {
    const Etype = await elementType.get();
    existType = Etype.data().types;

    // const Ecount = await elementCount.get();
    // existEcount = Ecount.data().count;
    displaySelect();
}

function displaySelect() {
    const allEles = document.querySelectorAll(".element");
    allEles.forEach(element => {
        const eTypes = element.querySelector("#existTypes");
        existType.forEach(type => {
            eTypes.innerHTML += `<option value="` + type + `"></option>`
        });

        // const eCount = element.querySelector("#eCount");
        // existEcount.forEach(count => {
        //     eCount.innerHTML += `<option value="` + count + `"></option>`
        // });
    });
}

// visualise
function visualise() {
    collectAllInputs();
    // console.log(nodes);
    // console.log(links);
    drawVis(nodes, links);
}

// submit all inputs to database
function submitDB() {
    // const inputID = prompt('Please name the worksheet (avoid using . and /), e.g. "artwork title (year) by artist" or "ddmmyyyy short description".');
    const getID = document.querySelector("#name_interaction").value;
    let exist = false;
    let check = false;

    const inputID = getID.replace(".", "_").replace("/", "_");

    if (inputID) {
        // check whether id already exist, get existing list and compare  
        interactionID.get().then((doc) => {
            existingID = doc.data().ids;
            for (let i = 0; i < existingID.length; i++) {
                if (existingID[i] == inputID) {
                    exist = true;
                    break;
                }
            }
            if (exist) {
                check = confirm("The name already exists, do you want to overwrite the existing data?");
            }
            if (!exist || check) {
                //if the name does not exist or to update the existing interaction, save the entry to the database
                collectAllInputs();
                try {
                    interactions.doc(inputID).set(allInputs).then(console.log("submitted"));
                    if (!exist) {
                        interactionID.update({
                            ids: firebase.firestore.FieldValue.arrayUnion(inputID)
                        });
                        updateID(inputID);
                    }
                }
                catch (err) {
                    alert("Please fill in all the input areas and submit again!");
                }
            }
        });
    } else {
        alert("Please name the worksheet and submit again!");
    }
}

function collectAllInputs() {
    allInputs = {};
    nodes = []; // {id, index, num, size, text}
    links = []; // {source, target, index, distance, dash}

    // getting all the inputs
    const allElements = document.querySelectorAll(".element");
    allInputs.eleCount = allElements.length;
    allElements.forEach(element => {
        node = {};
        link = {};
        let exist = false;
        const nodeIndex = element.querySelector("#index").innerText;
        const index = nodeIndex.replace("#", "element");
        allInputs[index] = {};
        allInputs[index].id = index;

        allInputs[index].type = element.querySelector("#type").value;
        for (let i = 0; i < existType.length; i++) {
            if (allInputs[index].type == existType[i]) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            elementType.update({
                types: firebase.firestore.FieldValue.arrayUnion(allInputs[index].type)
            });
            existType.push(allInputs[index].type);
        }

        // exist = false;
        allInputs[index].eleNum = element.querySelector("#ele_num").value;
        // for (let i = 0; i < existEcount.length; i++) {
        //     if (allInputs[index].eleNum == existEcount[i]) {
        //         exist = true;
        //         break;
        //     }
        // }
        // if (!exist) {
        //     elementCount.update({
        //         types: firebase.firestore.FieldValue.arrayUnion(allInputs[index].eleNum)
        //     });
        //     existEcount.push(allInputs[index].eleNum);
        // }

        // add main nodes
        node.id = nodeIndex;
        node.size = mainR;
        node.text = nodeIndex + ` ` + allInputs[index].type;
        node.num = `(` + allInputs[index].eleNum + `)`;
        nodes.push(node);

        // allInputs[index].actions = [];
        // allInputs[index].comCount = [];

        // get all actions from the selected element 
        const allActions = element.querySelectorAll(".action");
        allInputs[index].actionCount = allActions.length;
        let actionC = 0;
        allActions.forEach(action => {
            actionC++;
            const actionVal = action.querySelector("#actionV").value;
            // allInputs[index].actions.push(actionVal);
            const actionIndex = "action" + actionC;
            allInputs[index][actionIndex] = {};
            allInputs[index][actionIndex].action = actionVal;

            const allCom = action.querySelectorAll(".communications");
            allInputs[index][actionIndex].comCount = allCom.length;
            // allInputs[index].comCount.push(allCom.length);
            for (let i = 0; i < allCom.length; i++) {
                allInputs[index][actionIndex][i + 1] = {};
                const toElement = "#" + allCom[i].querySelector("#to").value;
                allInputs[index][actionIndex][i + 1].to = allCom[i].querySelector("#to").value;
                allInputs[index][actionIndex][i + 1].direct = allCom[i].querySelector(`#direct_means`).checked;

                // add direct links 
                if (allInputs[index][actionIndex][i + 1].direct) {
                    if (toElement != nodeIndex) {
                        link = {};
                        link.source = nodeIndex;
                        link.target = toElement;
                        link.distance = mainDist;
                        link.dash = `none`;
                        links.push(link);
                    } else {
                        node = {};
                        node.id = nodeIndex + `_to_` + toElement;
                        node.size = dirR;
                        node.text = ``;
                        node.num = ``;
                        nodes.push(node);

                        link = {};
                        link.source = nodeIndex;
                        link.target = node.id;
                        link.distance = dirDist;
                        link.dash = `none`;
                        links.push(link);

                        link = {};
                        link.source = node.id;
                        link.target = toElement;
                        link.distance = dirDist;
                        link.dash = `none`;
                        links.push(link);
                    }
                } else {
                    // add via links 
                    const viaElement = "#" + allCom[i].querySelector("#via").value;
                    // console.log(viaElement);

                    if (toElement != nodeIndex) {
                        node = {};
                        node.id = nodeIndex + `_via_` + viaElement + `_to_` + toElement;
                        node.size = viaR;
                        node.text = viaElement;
                        node.num = ``;
                        nodes.push(node);

                        link = {};
                        link.source = nodeIndex;
                        link.target = node.id;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link);

                        link = {};
                        link.source = node.id;
                        link.target = toElement;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link)
                    } else {
                        node = {};
                        node.id = nodeIndex + `_via_` + viaElement + `_to_` + toElement;
                        node.size = viaR1;
                        node.text = viaElement;
                        node.num = ``;
                        nodes.push(node);

                        link = {};
                        link.source = nodeIndex;
                        link.target = node.id;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link);

                        link = {};
                        link.source = node.id;
                        link.target = toElement;
                        link.distance = viaDist;
                        link.dash = `5,5`;
                        links.push(link)
                    }
                }
                if (!allInputs[index][actionIndex][i + 1].direct) {
                    allInputs[index][actionIndex][i + 1].via = allCom[i].querySelector("#via").value;
                }
                allInputs[index][actionIndex][i + 1].public = allCom[i].querySelector('#public_access').checked;
                allInputs[index][actionIndex][i + 1].configF = allCom[i].querySelector(`#config_from`).value;
                allInputs[index][actionIndex][i + 1].configT = allCom[i].querySelector(`#config_to`).value;
                allInputs[index][actionIndex][i + 1].comNum = allCom[i].querySelector(`#com_num`).value;
                allInputs[index][actionIndex][i + 1].effect = allCom[i].querySelector(`#effect`).value;
            }

        });
    });

    for (let i = 0; i < nodes.length; i++) {
        links.forEach(link => {
            if (nodes[i].id == link.source) {
                link.source = i;
            }
            if (nodes[i].id == link.target) {
                link.target = i;
            }
        });
    }
}