let farbspielReihenfolge = ["Kreuz", "Piek", "Herz", "Karo"];
let ZusätzeReihenfolge = ["ouvert", "schwarz", "schneider"];


let currentReizwert = 1;
let currentBauernMultiplikator = 5;
let currentZusatzMultiplikator = 0;
let spielNull = false;

let bauernText = ""
let currentZusatzListe = []

function updateSpielInfo() {
    let spielWahlBox = document.getElementById("SpielwahlKomboBox");
    let spielNr = parseInt(spielWahlBox.value, 10);

    console.log("Neuer Wert:", spielNr);
    if (spielNr <= 3) {
        let farbe = farbspielReihenfolge[spielNr];
        neuerInhaltText = `- die Farbe und die Bauern sind Trumpf <br> - ${farbe} hat den Wert ${12 - spielNr}`;
        currentReizwert = 12 - spielNr;
        spielNull = false;

    } else if (spielNr === 4) {
        neuerInhaltText = "- keine Trüpfe (auch nicht Bauern)<br>- die 10er sind niedrig <br> - du darfst keinen Stich machen <br>- ein Stich von deiner Seite beendet das Spiel <br>- gereizt wird bis 23"
        currentReizwert = 23;
        spielNull = true;
    } else if (spielNr === 5) {
        neuerInhaltText = "- Nur Bauern sind Trumpf!<br>- Das Spiel hat den Wert 24.";
        currentReizwert = 24;
        spielNull = false;
    } else {
        neuerInhaltText = "Error";
    }
    document.getElementById("SpielInfoBox").innerHTML = neuerInhaltText;            
    
    updateResult()

    //document.getElementById("SpielInfoBox").innerHTML = neuerInhaltText;
}
updateSpielInfo()

function updateZusatzInfo() {
    let checkedList = [];
    let checked = (document.querySelectorAll("#SpielZusätzeCheckboxes input[type=checkbox]:checked")).forEach(e => checkedList.push(e.value));
    
    let neuerInhaltText = "";

    console.log("Markiert:", checkedList);
    if (checkedList.length != 0) {
        currentZusatzMultiplikator = checkedList.length;
        
        if (checkedList.includes("ouvert")) {
            neuerInhaltText += "<b>ouvert</b>: du spielst mit offenen Karten<br>";
        }
        
        if (checkedList.includes("schwarz")) {
            neuerInhaltText += "<b>schwarz</b>: du darfst den Stock nicht aufnehmen<br>";

        }

        if (checkedList.includes("schneider")) {
            neuerInhaltText += "<b>schneider</b>: du oder deine Gegner haben unter 30 Punkte - (fürs Spielende)<br>";
    }

    } else {
        currentZusatzMultiplikator = 0;

        neuerInhaltText = "normales Spiel";
    }
    currentZusatzListe = checkedList
    document.getElementById("ZusätzeInfoBox").innerHTML = neuerInhaltText; 
    updateResult()           

}

document.getElementById("SpielZusätzeCheckboxes").addEventListener("change", (event) => {
if (event.target.type === "checkbox") {
    updateZusatzInfo();
}
});

updateZusatzInfo()

function updateBauern() {
    let checkedList = [];
    let checked = (document.querySelectorAll("#BauernCheckboxes input[type=checkbox]:checked")).forEach(e => checkedList.push(parseInt((e.value), 10)));
    let neuerInhaltText = "";
    if (checkedList.includes(0)) {
        for (let i = 1; i < 5; i++) {
            if (!checkedList.includes(i)) {
                currentBauernMultiplikator = i+1;
                neuerInhaltText = `Mit ${i} gespielt ${i+1}`;
                break;
            }
        } 
    } else {
        for (let i = 0; i < 5; i++) {
            if (checkedList.includes(i)) {
                currentBauernMultiplikator = i+1;
                neuerInhaltText = `ohne ${i} gespielt ${i+1}`;
                break
            }
        } 
    }
    if (checkedList.length === 0) {
        neuerInhaltText = `ohne 4 gespielt 5`;
        currentBauernMultiplikator = 5;

    }
    bauernText = neuerInhaltText
    document.getElementById("BauernInfoBox").innerHTML = neuerInhaltText;    
    updateResult()        

}

document.getElementById("BauernCheckboxes").addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
        updateBauern()
}
});

updateBauern()

function updateResult() {
    let finalReizWert = 0;
    let neuerInhaltText = "";
    if (!spielNull) {
        console.log(currentBauernMultiplikator, currentZusatzMultiplikator, currentReizwert)
        finalReizWert = (currentBauernMultiplikator + currentZusatzMultiplikator) * currentReizwert;
        let miese = 0
        // parseInt((e.value), 10)
        let letzteStelle = parseInt(finalReizWert.toString().slice(-1), 10);  
        let ohneLetzteStelle = parseInt(finalReizWert.toString().slice(0, -1), 10); 

        if (letzteStelle>4) {
            miese = ohneLetzteStelle + 1;
        } else {
            miese = ohneLetzteStelle;
        }

        let sprichText = `<b>Sprich:</b> <span class="black">${bauernText}</span>`;

        for (let i = 0; i < currentZusatzListe.length; i++) {
            sprichText += ", " + currentZusatzListe[i] + " " + (currentBauernMultiplikator + i + 1);
        }

        sprichText += `<span class="black">, mal ${currentReizwert} ergibt ${finalReizWert}</span>`
        

            
        neuerInhaltText = `<b>Reizwert:</b> <span class="red">${finalReizWert}</span> <br>
                   <b>Miese für Gegner bei Sieg:</b> <span class="blue">${miese}</span> <br>
                   <b>Miese für dich bei Niederlage:</b> <span class="green">${miese*2}</span> <br>
                   ${sprichText}`;
    } else {
        neuerInhaltText = `<b>Reizwert:</b> <span class="red">23</span> <br> 
                   <b>Miese für Gegner bei Sieg:</b> <span class="blue">2</span> <br> 
                   <b>Miese für dich bei Niederlage:</b> <span class="green">4</span>`;

    }

    document.getElementById("ErgebnisInfo").innerHTML = neuerInhaltText;            

}


document.getElementById("SpielwahlKomboBox").addEventListener("change", (event) => {updateSpielInfo()});

updateResult()
