const menu = document.getElementById('menu');
const contenido = document.getElementById('contenido');
const boton = document.getElementById('ham_button');

boton.onclick = function(){
    menu.classList.toggle('menu_desplazado');
    contenido.classList.toggle('contenido_desplazado');
}
