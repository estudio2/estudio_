const botones = document.querySelectorAll('.girar');
const frontales = document.querySelectorAll('.cara_frontal');
const traseras = document.querySelectorAll('.cara_trasera');


botones[0].onclick = function(){
    frontales[0].classList.toggle('cara_frontal_girada');
    traseras[0].classList.toggle('cara_trasera_girada');
   
}

botones[1].onclick = function(){
    frontales[0].classList.toggle('cara_frontal_girada');
    traseras[0].classList.toggle('cara_trasera_girada');
   
}

botones[2].onclick = function(){
    frontales[1].classList.toggle('cara_frontal_girada');
    traseras[1].classList.toggle('cara_trasera_girada');
   
}

botones[3].onclick = function(){
    frontales[1].classList.toggle('cara_frontal_girada');
    traseras[1].classList.toggle('cara_trasera_girada');
   
}

botones[4].onclick = function(){
    frontales[2].classList.toggle('cara_frontal_girada');
    traseras[2].classList.toggle('cara_trasera_girada');
   
}

botones[5].onclick = function(){
    frontales[2].classList.toggle('cara_frontal_girada');
    traseras[2].classList.toggle('cara_trasera_girada');
   
}