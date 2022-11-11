const wybor_raty = localStorage.getItem("wybor_raty")
const wybor_okresu = localStorage.getItem("wybor_okresu")
const ilosc_pieniedzy = +localStorage.getItem("kwota")
const ilosc_lat = +localStorage.getItem("raty")
let prowizja = +localStorage.getItem("prowizja")
let oprocentowanie = +localStorage.getItem("oprocentowanie")
prowizja = prowizja/100
oprocentowanie = oprocentowanie/100


let oprocentowanie_okresy = +localStorage.getItem("oprocentowanie_okresy")
let oprocentowanie_przyszle = +localStorage.getItem("oprocentowanie_przyszle")
oprocentowanie_przyszle /= 100
let opcje_zaawansowane = (oprocentowanie_okresy != "")
if (oprocentowanie_okresy == "") oprocentowanie_okresy =  Number.MAX_SAFE_INTEGER

let okres
if(wybor_okresu == "miesieczny"){
    okres = 1
}
if(wybor_okresu == "kwartalny"){
    okres = 3
}
if(wybor_okresu == "roczny"){
    okres = 12
}

let kapitalizacja
if(wybor_okresu == "miesieczny"){
    kapitalizacja = 12
}
if(wybor_okresu == "kwartalny"){
    kapitalizacja = 4
}
if(wybor_okresu == "roczny"){
    kapitalizacja = 1
}

let oprocentowanie_w_skali_roku = oprocentowanie

oprocentowanie /= kapitalizacja
oprocentowanie_przyszle /= kapitalizacja

let ilosc_rat = (ilosc_lat*12)/okres


let chartLabels = [
    'Kwota kredytu', 
    'Odsetki przed zmiana orpocentowania', 
    'Odsetki po zmianie oprocentowania', 
    'Prowizja']
let chartColors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(24, 129, 199)',
    'rgb(255, 217, 0)'
]

if (opcje_zaawansowane == false){
    chartLabels.splice(1, 2)
    chartLabels.splice(1, 0, "Odsetki")
    chartColors.splice(2, 1)
}



let stala_rata_kredytu = 0
let renta = 0
let odsetki_stala_rata = 0
let odsetki_stala_czesc_kapitalowa = 0

class Kredyt{
	constructor(ilosc_pieniedzy, stopa_oprocentowania, ilosc_rat){
		this.ilosc_pieniedzy = ilosc_pieniedzy
		this.stopa_oprocentowania = oprocentowanie
		this.ilosc_rat = ilosc_rat
	}
    

    policz_prowizje(kwota_pocz, prow){
        let wartosc_prowizji = kwota_pocz * prow
        return wartosc_prowizji
    }

	policz_rente_platna_z_dolu(){
		let renta = 0
		for(let i = 1; i <= ilosc_rat; i++){
			renta += Math.pow(1/(1 + oprocentowanie), i)
		}
		return renta
	}

	policz_stala_rate_kredytu(){
		stala_rata_kredytu = ilosc_pieniedzy / this.policz_rente_platna_z_dolu()
	}


    policz_splate_kredytu_w_stalych_ratach(){
        let saldo_dlugu = ilosc_pieniedzy
        let suma_do_zaplaty = 0
        let odsetki = 0
        let czesc_kapitalowa = 0
        let prowizja_po_przeliczeniu
        let poczatkowa_rata_kredytu = stala_rata_kredytu
        let odsetki_przed_zmiana = 0
        let odsetki_po_zmianie = 0

        for(let i = 1; i <= ilosc_rat; i++){
            if(i == oprocentowanie_okresy + 1) {
                let renta = 0
                for(let i = 1; i <= ilosc_rat - oprocentowanie_okresy; i++){
                    renta += Math.pow(1/(1 + oprocentowanie_przyszle), i)

                }
                stala_rata_kredytu = saldo_dlugu / renta
            }
            if(i <= oprocentowanie_okresy){
                odsetki = this.stopa_oprocentowania * saldo_dlugu
                odsetki_przed_zmiana += odsetki
            }
            else {
                odsetki = oprocentowanie_przyszle * saldo_dlugu
                odsetki_po_zmianie += odsetki
            }
            czesc_kapitalowa = stala_rata_kredytu - odsetki
            saldo_dlugu -= czesc_kapitalowa
            suma_do_zaplaty += stala_rata_kredytu
            


            if(i == ilosc_rat){
                saldo_dlugu = 0
            }
            const tableRowHTML = 
            `
                <td>${i}</td>
                <td>${stala_rata_kredytu.toFixed(2)}</td> 
                <td>${odsetki.toFixed(2)}</td>
                <td>${czesc_kapitalowa.toFixed(2)}</td>
                <td>${saldo_dlugu.toFixed(2)}</td>
            `;
            let tr = document.createElement('tr');
            tr.innerHTML = tableRowHTML;
            document.querySelector('.modal-content table tbody').appendChild(tr);
        }
        

        odsetki_stala_rata = suma_do_zaplaty - ilosc_pieniedzy
        prowizja_po_przeliczeniu = this.policz_prowizje(ilosc_pieniedzy, prowizja)
        suma_do_zaplaty = suma_do_zaplaty + prowizja_po_przeliczeniu

        let title = document.querySelector('.tytul');
        title.innerHTML = `Kredyt ze stala rata`

        let children = document.querySelector('.info').children;
        if(stala_rata_kredytu == poczatkowa_rata_kredytu){
            children[0].innerHTML = `<b>Wysokosc raty:</b> ${poczatkowa_rata_kredytu.toFixed(2)} PLN`;
            children[1].innerHTML = `<b>do zaplaty:</b> ${suma_do_zaplaty.toFixed(2)} PLN`;
            children[2].innerHTML = `<b>Kwota kredytu:</b> ${ilosc_pieniedzy.toFixed(2)} PLN`;
            children[3].innerHTML = `<b>Odsetki:</b> ${odsetki_stala_rata.toFixed(2)} PLN`;
            children[4].innerHTML = `<b>Prowizja:</b> ${prowizja_po_przeliczeniu.toFixed(2)} PLN`;
            children[5].innerHTML = ``;
        }
        else{
            children[0].innerHTML = `<b>Wysokosc raty przed zmiana oproc.:</b> ${poczatkowa_rata_kredytu.toFixed(2)} PLN`;
            children[1].innerHTML = `<b>Wysokosc raty po zmianie oproc.:</b> ${stala_rata_kredytu.toFixed(2)} PLN`;
            children[2].innerHTML = `<b>do zaplaty:</b> ${suma_do_zaplaty.toFixed(2)} PLN`;
            children[3].innerHTML = `<b>Kwota kredytu:</b> ${ilosc_pieniedzy.toFixed(2)} PLN`;
            children[4].innerHTML = `<b>Odsetki:</b> ${odsetki_stala_rata.toFixed(2)} PLN`;
            children[5].innerHTML = `<b>Prowizja:</b> ${prowizja_po_przeliczeniu.toFixed(2)} PLN`;
        }
        createChart(ilosc_pieniedzy.toFixed(2), odsetki_przed_zmiana.toFixed(2),odsetki_po_zmianie.toFixed(2), prowizja_po_przeliczeniu.toFixed(2));


        let oproc = document.querySelector('.info_oprocentowanie').children;
        let lb = []
        let vars = []

        let zmienne_op = oprocentowanie_w_skali_roku

        let rata_zmienne_op
        if(oprocentowanie_w_skali_roku >= 0.02){
            zmienne_op += 0.02
        }
        else if(oprocentowanie_w_skali_roku < 0.02 && oprocentowanie_w_skali_roku > 0.01){
            zmienne_op += 0.03
        }
        else{
            zmienne_op += 0.04
        }
    
        let text 
        let text2 
        let tmp
        let zmiana
        let znak

        let delta = zmienne_op
        
        zmienne_op /= kapitalizacja
        
        for(let i = 0; i < 5; i++){
            let renta = 0
            for(let i = 1; i <= ilosc_rat; i++){
                renta += Math.pow(1/(1 + zmienne_op), i)
            }
            rata_zmienne_op = ilosc_pieniedzy / renta;
            zmiana = Math.abs(poczatkowa_rata_kredytu - rata_zmienne_op)

            
            if(Math.abs(zmiana) < 0.01){
                
                text = 'Oproc. kredytu na obecnym poziomie '
                text2 = 'obecnie '
            }
            else if(delta > oprocentowanie_w_skali_roku){
                text = 'Oprocentowanie wzrasta o '
                text2 = 'wzrost o '
                znak = "<span style='color:red;'>+"
            }
            else if (delta < oprocentowanie_w_skali_roku){
                text = 'Oprocentowanie spada o '
                text2 = 'spadek o '
                znak = "<span style='color:green;'>-"
            
            }
            
            tmp = Math.abs(oprocentowanie_w_skali_roku - delta) * 100

            
            if(text2 == 'obecnie ') lb[i] = text;
            else lb[i] = text2 + tmp.toFixed(0) + '%'

          
            vars[i] = rata_zmienne_op.toFixed(2)

            
            oproc[i].innerHTML = `${text}  ${rata_zmienne_op == poczatkowa_rata_kredytu ? '': tmp.toFixed(2) + '%'} ${rata_zmienne_op.toFixed(2)} PLN ${rata_zmienne_op == poczatkowa_rata_kredytu ? '': '(zmiana: <b>' +  znak + ' ' + zmiana.toFixed(2) + ' PLN</span></b>)'}`
            delta -= 0.01
            zmienne_op = delta / kapitalizacja
        }
        createBarChart(lb, vars);

    }

    policz_splate_kredytu_ze_stala_czescia_kapitalowa(){
        let rata_kapitalowa = ilosc_pieniedzy/ ilosc_rat
        let saldo_dlugu = ilosc_pieniedzy
        let suma_do_zaplaty = 0
        let odsetki = 0
        let rata_kredytu = 0
        let czesc_kapitalowa = rata_kapitalowa
        let prowizja_po_przeliczeniu
        let pierwsza_rata = this.stopa_oprocentowania * saldo_dlugu + rata_kapitalowa;
        let druga_rata = pierwsza_rata
        let odsetki_przed_zmiana = 0
        let odsetki_po_zmianie = 0

        console.log("Saldo dlugu po okresie 0: ", saldo_dlugu)
       

        for(let i = 1; i <= ilosc_rat; i++){

            if(i <= oprocentowanie_okresy){
                odsetki = this.stopa_oprocentowania * saldo_dlugu
                odsetki_przed_zmiana += odsetki
            }
            else {
                odsetki = oprocentowanie_przyszle * saldo_dlugu
                odsetki_po_zmianie += odsetki
            }

            saldo_dlugu -= rata_kapitalowa
            rata_kredytu = odsetki + rata_kapitalowa
            suma_do_zaplaty += rata_kredytu
            if(i == ilosc_rat){
                saldo_dlugu = 0
            }
            if(i == oprocentowanie_okresy +1) druga_rata = rata_kredytu
            console.log("Kwartal:", i, "Rata:", rata_kredytu, "czesc kapitalowa: ", czesc_kapitalowa,"Saldo dlugu:", saldo_dlugu)
           
            const tableRowHTML = 
            `
                <td>${i}</td>
                <td>${rata_kredytu.toFixed(2)}</td> 
                <td>${odsetki.toFixed(2)}</td>
                <td>${rata_kapitalowa.toFixed(2)}</td>
                <td>${saldo_dlugu.toFixed(2)}</td>
            `;
            let tr = document.createElement('tr');
            tr.innerHTML = tableRowHTML;
            document.querySelector('.modal-content table tbody').appendChild(tr);
        }


        
        odsetki_stala_czesc_kapitalowa = suma_do_zaplaty - ilosc_pieniedzy

        prowizja_po_przeliczeniu = this.policz_prowizje(ilosc_pieniedzy, prowizja)
        suma_do_zaplaty = suma_do_zaplaty + prowizja_po_przeliczeniu
        
        let title = document.querySelector('.tytul');
        title.innerHTML = `Kredyt ze stala czescia kapitalowa`

        let children = document.querySelector('.wszystko').children;
        if(pierwsza_rata - 0.001 <= druga_rata && druga_rata <= pierwsza_rata + 0.001){
            children[0].innerHTML = `<b>Wysokosc pierwszej raty:</b> ${pierwsza_rata.toFixed(2)} PLN`;
            children[1].innerHTML = `<b>do zaplaty:</b> ${suma_do_zaplaty.toFixed(2)} PLN`;
            children[2].innerHTML = `<b>Kwota kredytu:</b> ${ilosc_pieniedzy.toFixed(2)} PLN`;
            children[3].innerHTML = `<b>Odsetki:</b> ${odsetki_stala_czesc_kapitalowa.toFixed(2)} PLN`;
            children[4].innerHTML = `<b>Prowizja:</b> ${prowizja_po_przeliczeniu.toFixed(2)} PLN`;
            children[5].innerHTML = ``;
        }
        else{
            children[0].innerHTML = `<b>Wysokosc pierwszej raty przed zmiana oproc.:</b> ${pierwsza_rata.toFixed(2)} PLN`;
            children[1].innerHTML = `<b>Wysokosc pierwszej raty po zmianie oproc.:</b> ${druga_rata.toFixed(2)} PLN`;
            children[2].innerHTML = `<b>do zaplaty:</b> ${suma_do_zaplaty.toFixed(2)} PLN`;
            children[3].innerHTML = `<b>Kwota kredytu:</b> ${ilosc_pieniedzy.toFixed(2)} PLN`;
            children[4].innerHTML = `<b>Odsetki:</b> ${odsetki_stala_czesc_kapitalowa.toFixed(2)} PLN`;
            children[5].innerHTML = `<b>Prowizja:</b> ${prowizja_po_przeliczeniu.toFixed(2)} PLN`;
        }
        createChart(ilosc_pieniedzy.toFixed(2), odsetki_przed_zmiana.toFixed(2),odsetki_po_zmianie.toFixed(2), prowizja_po_przeliczeniu.toFixed(2));
        
        
        let lb = []
        let vars = []


        let oproc = document.querySelector('.info_oprocentowanie').children;
        let zmienne_op = oprocentowanie_w_skali_roku
        let rata_zmienne_op



        if(oprocentowanie_w_skali_roku >= 0.02){
            zmienne_op += 0.02
        }
        else if(oprocentowanie_w_skali_roku < 0.02 && oprocentowanie_w_skali_roku > 0.01){
            zmienne_op += 0.03
        }
        else{
            zmienne_op += 0.04
        }
        let text 
        let text2
        let tmp
        let zmiana
        let znak

        let delta = zmienne_op
        
        zmienne_op /= kapitalizacja
        
        for(let i = 0; i < 5; i++){
            rata_zmienne_op = zmienne_op * ilosc_pieniedzy + rata_kapitalowa
            zmiana = Math.abs(pierwsza_rata - rata_zmienne_op)
            if(-0.0001 <= zmiana <=  0.0001){
                text = 'Oproc. kredytu na obecnym poziomie '
                text2 = 'obecnie '
            }
            else if(delta > oprocentowanie_w_skali_roku){
                console.log("oprocentowanie w skali roku", oprocentowanie_w_skali_roku)
                console.log("delta", delta)

                text = 'Oprocentowanie wzrasta o '
                text2 = 'wzrost o '
                znak = "<span style='color:red;'>+"
            }
            else if (delta < oprocentowanie_w_skali_roku){
                text = 'Oprocentowanie spada o '
                text2 = 'spada o '
                znak = "<span style='color:green;'>-"
            }
            
            tmp = Math.abs(oprocentowanie_w_skali_roku - delta) * 100

         
            if(text2 == 'obecnie ') lb[i] = text;
            else lb[i] = text2 + tmp.toFixed(0) + '%'
            
            vars[i] = rata_zmienne_op.toFixed(2)

            oproc[i].innerHTML = `${text}  ${rata_zmienne_op == pierwsza_rata ? '': tmp.toFixed(2) + '%'} ${rata_zmienne_op.toFixed(2)} PLN ${rata_zmienne_op == pierwsza_rata ? '': '(zmiana: <b>' +  znak + ' ' + zmiana.toFixed(2) + ' PLN</span></b>)'}`
            delta -= 0.01
            zmienne_op = delta / kapitalizacja
        }
        createBarChart(lb, vars);

    }
    
}


const smth = new Kredyt(ilosc_pieniedzy, oprocentowanie, ilosc_rat)

smth.policz_rente_platna_z_dolu()
if(wybor_raty === "stala-rata"){
    smth.policz_stala_rate_kredytu()
    smth.policz_splate_kredytu_w_stalych_ratach()
}
else if(wybor_raty === "stala-ck"){
    smth.policz_splate_kredytu_ze_stala_czescia_kapitalowa()
}

const button = document.querySelector(".harmonogram_btn")
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

button.addEventListener('click', (e) => {
    e.preventDefault()
    modal.style.display = "block";

})


span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// chart
function createChart(kwota, odsetki_przed, odsetki_po, prowizja) {
    const ctx = document.getElementById('myChart').getContext('2d');
    let chartData = [kwota, odsetki_przed, odsetki_po, prowizja]; 
    if(opcje_zaawansowane == false) {
        chartData.splice(2, 1);
    }
    console.log(chartData);

    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
        datasets: [{
            label: 'My First Dataset',
            data: chartData,
            backgroundColor: chartColors,
            hoverOffset: 4
        }]
        },
        options: {
            
            plugins: {
                legend: {
                    labels: {
                        
                        font: {
                            size: 14,
                            color: 'white'
                        }
                    }
                }
            }
        }
        
    });
}

function createBarChart(lb, vars){
    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:[lb[0], lb[1], lb[2], lb[3], lb[4]],
            datasets:[
                {
                    label: 'Zmiany oprocentowania',
               
                    backgroundColor: 'rgb(255, 99, 132)',
                   
                    data: [vars[0], vars[1], vars[2], vars[3], vars[4]]
                }
            ]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        },
    });
}

function compareFunction (bank1, bank2){
    if(bank1.kwota_do_splaty > bank2.kwota_do_splaty) return 1;
    if(bank1.kwota_do_splaty < bank2.kwota_do_splaty) return -1;
    return 0;
}


 

        

   

