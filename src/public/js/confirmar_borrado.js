function mostrarConfirmacionBorrado(i){
        
    const elementos = document.querySelectorAll(".confirmar_borrado");
    let elemento_a_mostrar = elementos[i]
    elemento_a_mostrar.style.display= "flex";

}

function ocultarConfirmacionBorrado(i){
        
    var elementos = document.querySelectorAll(".confirmar_borrado");
    elemento_a_mostrar = elementos[i]
    elemento_a_mostrar.style.display= "none";
    
}

