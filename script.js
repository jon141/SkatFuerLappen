 let farbspielReihenfolge = ["Kreuz", "Piek", "Herz", "Karo"];
let ZusätzeReihenfolge = ["ouvert", "schwarz", "schneider"];


let currentReizwert = 1;
let currentBauernMultiplikator = 5;
let currentZusatzMultiplikator = 0;
let spielNull = false;

function updateSpielInfo() {
    let spielWahlBox = document.getElementById("SpielwahlKomboBox");
    let spielNr = parseInt(spielWahlBox.value, 10);

    console.log("Neuer Wert:", spielNr);
    if (spielNr <= 3) {
        let farbe = farbspielReihenfolge[spielNr];
        neuerInhaltText = `Beim Farbspiel ${farbe} sind alle Bauern und Karten der Farbe ${farbe} Trumpf. <br><br>${farbe} hat den Wert ${12 - spielNr}`;
        currentReizwert = 12 - spielNr;
        spielNull = false;

    } else if (spielNr === 4) {
        neuerInhaltText = "Beim Spiel Null gibt es keine Trüpfe (auch nicht die Bauern), die 10er sind niedrig. <br>Du darfst keinen Stich machen - ein Stich von deiner Seite beendet das Spiel. <br><br>Gereizt wird bis 23."
        currentReizwert = 23;
        spielNull = true;
    } else if (spielNr === 5) {
        neuerInhaltText = "Nur Bauern sind Trumpf!<br><br> Das Spiel hat den Wert 24.";
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
            neuerInhaltText += "ouvert: du spielst mit offenen Karten - Multiplikator + 1<br>";
        }
        
        if (checkedList.includes("schwarz")) {
            neuerInhaltText += "schwarz: du darfst den Stock nicht aufnehmen - Multiplikator + 1<br>";

        }

        if (checkedList.includes("schneider")) {
            neuerInhaltText += "schneider: du oder deine Gegner haben unter 30 Punkte - (nicht wichtig fürs Reizen, aber wichtig für Punkte am Spielende) - Multiplikator + 1<br>";
    }

    } else {
        currentZusatzMultiplikator = 0;

        neuerInhaltText = "normales Spiel";
    }

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
                neuerInhaltText = `Mit ${i} gespielt ${i+1}.`;
                break;
            }
        } 
    } else {
        for (let i = 0; i < 5; i++) {
            if (checkedList.includes(i)) {
                currentBauernMultiplikator = i+1;
                neuerInhaltText = `Ohne ${i} gespielt ${i+1}.`;
                break
            }
        } 
    }
    if (checkedList.length === 0) {
        neuerInhaltText = `Ohne 4 gespielt 5.`;
        currentBauernMultiplikator = 5;

    }
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
            miese = ohneLetzteStelle + 1
        } else {
            miese = ohneLetzteStelle
        }
            
        neuerInhaltText = `Reizwert: ${finalReizWert} <br> Miese für Gegner bei Sieg ${miese} <br> Miese für dich bei Niederlage ${miese*2}`
    } else {
        neuerInhaltText = `Reizwert: 23 <br> Miese für Gegner bei Sieg 2 <br> Miese für dich bei Niederlage 4`

    }

    document.getElementById("ErgebnisInfo").innerHTML = neuerInhaltText;            

}


document.getElementById("SpielwahlKomboBox").addEventListener("change", (event) => {updateSpielInfo()});

updateResult()
