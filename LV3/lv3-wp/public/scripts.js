let sviPodaci = [];
let kosarica = [];

 
// 1. DOHVAT PODATAKA (CSV)
window.onload = () => {
    fetch('glazba.csv') 
        .then(res => res.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    sviPodaci = results.data;
                    prikaziPodatke(sviPodaci);
                }
            });
        });

    document.getElementById('Naslov').addEventListener('input', primijeniFiltere);
    document.getElementById('Izvođač').addEventListener('input', primijeniFiltere);
    document.getElementById('filterZanr').addEventListener('change', primijeniFiltere);
    };
 
// 2. PRIKAZ U TABLICI
function prikaziPodatke(podaci) {
    const tbody = document.getElementById('bodyTable');
    const thead = document.getElementById('headRow');
    tbody.innerHTML = "";
 
    if (podaci.length === 0) {
        tbody.innerHTML = "<tr><td colspan='100%'>Nema rezultata.</td></tr>";
        return;
    }
 
    const stupci = Object.keys(podaci[0]);
    thead.innerHTML = stupci.map(s => `<th>${s}</th>`).join('') + "<th>Akcija</th>";
 
    podaci.forEach(red => {
        const tr = document.createElement('tr');
 
        let redHtml = "";
        stupci.forEach(stupac => {
            let vrijednost = red[stupac];
            redHtml += `<td>${vrijednost || '-'}</td>`;
        });
 
        tr.innerHTML = redHtml + `<td><button onclick="dodajUKosaricu('${red.Naslov}')">Dodaj</button></td>`;
        tbody.appendChild(tr);
    });
}
 
// 3. Filtriranje za glazbu

function primijeniFiltere() {
    const naslov = document.getElementById('Naslov').value.toLowerCase();
    const izvodjac = document.getElementById('Izvođač').value.toLowerCase();
    const zanr = document.getElementById('filterZanr').value;
    const godMin = parseInt(document.getElementById('Godina').value) || 0;

    const filtrirano = sviPodaci.filter(pjesma => {
        const podudaraSeNaslov = (pjesma.Naslov || "").toString().toLowerCase().includes(naslov);
        const podudaraSeIzvodjac = (pjesma.Izvođač || "").toString().toLowerCase().includes(izvodjac);
        const podudaraSeZanr = (zanr === "" || (pjesma.Žanr && pjesma.Žanr === zanr)); 
        const podudaraSeGodina = pjesma.Godina >= godMin;

        return podudaraSeNaslov && podudaraSeIzvodjac && podudaraSeZanr && podudaraSeGodina;
    });

    prikaziPodatke(filtrirano); 
}
 
//4. Funkcija za dodavanje u playlistu 
function dodajUKosaricu(naslov) {
    if (!kosarica.includes(naslov)) {
        kosarica.push(naslov);
        osvjeziPrikazKosarice();
    }
}
 
let potvrdenePjesme = []; 

function potvrdiPosudbu() {
    if (kosarica.length === 0) {
        alert("Košarica je prazna!");
        return;
    }

    kosarica.forEach(pjesma => {
        if (!potvrdenePjesme.includes(pjesma)) {
            potvrdenePjesme.push(pjesma);
        }
    });

    alert(`Uspješno ste dodali ${kosarica.length} pjesama u svoju konačnu listu!`);
    
    kosarica = []; 
    osvjeziPrikazKosarice();
    prikaziKonacnuListu(); 
}

function prikaziKonacnuListu() {
    const konacnaListaElement = document.getElementById('listaKonacno');
    konacnaListaElement.innerHTML = "";

    potvrdenePjesme.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item} 
            <button onclick="ukloniIzKonacneListe('${item}')" style="color: red; border: none; background: none; cursor: pointer; margin-left: 10px;">
                [Ukloni trajno]
            </button>`;
        konacnaListaElement.appendChild(li);
    });
}

// Funkcija za uklanjanje iz liste
function ukloniIzKonacneListe(naslov) {
    potvrdenePjesme = potvrdenePjesme.filter(item => item !== naslov);
    prikaziKonacnuListu();
}
 
function ukloniIzKosarice(naslov) {
    kosarica = kosarica.filter(item => item !== naslov);
    osvjeziPrikazKosarice();
}
 
function osvjeziPrikazKosarice() {
        const lista = document.getElementById('listaKosarica');
        const brojac = document.getElementById('brojStavki');
        lista.innerHTML = "";
    
        kosarica.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item} <button onclick="ukloniIzKosarice('${item}')">Ukloni</button>`;
            lista.appendChild(li);
        });
    
        brojac.innerText = kosarica.length;
}
