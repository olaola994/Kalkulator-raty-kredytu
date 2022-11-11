const form_s = document.querySelector(".form_s");

const kwota_s = form_s.querySelector(".kwota");
const raty_s = form_s.querySelector(".myRange");
let oprocentowanie_s = form_s.querySelector(".oprocentowanie")
let prowizja = form_s.querySelector(".prowizja")
let oprocentowanie_okresy = form_s.querySelector(".oprocentowanie-okresy")
let oprocentowanie_przyszle = form_s.querySelector(".oprocentowanie-przyszle")

let oprocentowanie_button = form_s.querySelector(".oprocentowanie-btn")

console.log("oprocentowanie_okresy", oprocentowanie_okresy)
console.log("oprocentowanie_przyszle", oprocentowanie_przyszle)


const procent_skladany = document.querySelector(".procent_skladany")



const error_s = form_s.querySelector(".error");


const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {
	const select = dropdown.querySelector(".select");
	const caret = dropdown.querySelector(".caret");
	const menu = dropdown.querySelector(".menu_kapitalizacji");
	const options = dropdown.querySelectorAll(".menu_kapitalizacji li");
	const selected = dropdown.querySelector(".selected");

	select.addEventListener('click', () => {
		select.classList.toggle('select-clicked');
		caret.classList.toggle('caret-rotate');
		menu.classList.toggle('menu_kapitalizacji-open')
	});

	options.forEach(option => {
		option.addEventListener('click', () => {
			selected.innerHTML = option.innerHTML;
			select.classList.remove('select-clicked');
			caret.classList.remove('caret-rotate');
			menu.classList.remove('menu_kapitalizacji-open');
			options.forEach(option => {
				option.classList.remove('active')
			});
			option.classList.add('active');
		});
	});
});


let wybor_raty 
function checkRadioValue_raty() {
	var ele = document.getElementsByName('wybor-raty');
	  
	for(i = 0; i < ele.length; i++) {
		if(ele[i].checked) {
		  wybor_raty = ele[i];
		}    
	}
} 


const isOneNull = (el1, el2) => {
    if(el1 == "" && el2 != "") return true;
    if(el1 != "" && el2 == "") return true;
    return false;
}

oprocentowanie_button.addEventListener("click", (e) => {
	e.preventDefault();

	let state = false
	if(oprocentowanie_okresy.closest('div').hidden == false) state = true

	oprocentowanie_okresy.closest('div').hidden = state
	oprocentowanie_przyszle.closest('div').hidden = state

})


form_s.addEventListener("submit", (e) => {
	e.preventDefault();
	localStorage.setItem("oprocentowanie_okresy", "")
	localStorage.setItem("oprocentowanie_przyszle", "")

	console.log('oprocentowanie przyszle', oprocentowanie_przyszle.value);

	if (kwota_s.value < 500) {
		error_s.innerText = "kwota musi być większa niż 500";
		error_s.style.fontSize = "15px"
		error_s.style.color = "red";
	} 
	
	else if (isOneNull(oprocentowanie_okresy.value, oprocentowanie_przyszle.value)) {
        if(oprocentowanie_okresy.value == ""){
			error_s.innerHTML = "Wymagane jest podanie liczby okresow"
			error_s.style.fontSize = "15px"
			error_s.style.color = "red";
		}
		if(oprocentowanie_przyszle.value == ""){
			error_s.innerHTML = "Wymagane jest podanie nowego oprocentowania"
			error_s.style.fontSize = "15px"
			error_s.style.color = "red";
		}
    }
	else {
		checkRadioValue_raty()
		localStorage.setItem("wybor_okresu", form_s.querySelector(".menu_kapitalizacji .active").getAttribute("value"));
		localStorage.setItem("wybor_raty", wybor_raty.value);
		localStorage.setItem("kwota", kwota_s.value);
		localStorage.setItem("raty", raty_s.value);
		localStorage.setItem("oprocentowanie", oprocentowanie_s.value)
		if(oprocentowanie_okresy.value != "" && oprocentowanie_przyszle.value != ""){

			localStorage.setItem("oprocentowanie_okresy", oprocentowanie_okresy.value)
			localStorage.setItem("oprocentowanie_przyszle", oprocentowanie_przyszle.value)
		}
		localStorage.setItem("prowizja", prowizja.value)
		window.location = "strona2.html";
		error_s.innerText = "";
	}

});


let slider_s = form_s.querySelector(".myRange");
let output_s = form_s.querySelector(".demo");
output_s.innerHTML = slider_s.value;

slider_s.oninput = function() {
	output_s.innerHTML = this.value;
}