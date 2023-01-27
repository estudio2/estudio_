const carrusel = document.querySelectorAll(".carrusel");
const botonIzquierdo = document.querySelectorAll(".flecha_izquierda");
const botonDerecho = document.querySelectorAll(".flecha_derecha");



/*
    Primer carrusel
*/
let carruselItems = document.querySelectorAll(".items_0");
let ultimoItem = carruselItems[carruselItems.length - 1];
carrusel[0].insertAdjacentElement('afterbegin', ultimoItem);


botonIzquierdo[0].onclick = function(){ izquierda(0, carruselItems, ".items_0")}
botonDerecho[0].onclick = function(){ derecha(0, ".items_0")}



/*
    Segundo carrusel
*/
let carruselItems1 = document.querySelectorAll(".items_1");
let ultimoItem1 = carruselItems1[carruselItems1.length - 1];
carrusel[1].insertAdjacentElement('afterbegin', ultimoItem1);


botonIzquierdo[1].onclick = function(){ izquierda(1, carruselItems1, ".items_1") }
botonDerecho[1].onclick = function(){ derecha(1, ".items_1")}



/*
    Tercer carrusel
*/
let carruselItems2 = document.querySelectorAll(".items_2");
let ultimoItem2 = carruselItems2[carruselItems2.length - 1];
carrusel[2].insertAdjacentElement('afterbegin', ultimoItem2);

botonIzquierdo[2].onclick = function(){ izquierda(2, carruselItems2, ".items_2") }
botonDerecho[2].onclick = function(){ derecha(2, ".items_2")}



/*
  Cuarto carrusel
*/
let carruselItems3 = document.querySelectorAll(".items_3");
let ultimoItem3 = carruselItems3[carruselItems3.length - 1];
carrusel[3].insertAdjacentElement('afterbegin', ultimoItem3);

botonIzquierdo[3].onclick = function(){ izquierda(3, carruselItems3, ".items_3") }
botonDerecho[3].onclick = function(){ derecha(3, ".items_3")}


/*
    Funciones para los botones del carrusel
*/



function izquierda(n, items, nombreListaItems) {
    ultimoItem = document.querySelectorAll(nombreListaItems)[items.length - 1];
    carrusel[n].style.transition = "all 0.5s";
    carrusel[n].style.marginLeft = "0";
    setTimeout(function () {
        carrusel[n].style.transition = "none";
        carrusel[n].insertAdjacentElement('afterbegin', ultimoItem);
        carrusel[n].style.marginLeft = "-100%";
    }, 500);
}


function derecha(n, nombreListaItems) {
    let primerItem = document.querySelectorAll(nombreListaItems)[0];
    carrusel[n].style.transition = "all 0.5s";
    carrusel[n].style.marginLeft = "-200%";
    setTimeout(function () {
        carrusel[n].style.transition = "none";
        carrusel[n].insertAdjacentElement('beforeend', primerItem);
        carrusel[n].style.marginLeft = "-100%";
    }, 500);
}






