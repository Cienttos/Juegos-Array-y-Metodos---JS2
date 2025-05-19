function jugar(eleccionUsuario) {
    const opciones = ["piedra", "papel", "tijera"];
    const eleccionComputadora = opciones[Math.floor(Math.random() * opciones.length)];
    
    let mensaje = `Elegiste: ${eleccionUsuario}. La computadora eligió: ${eleccionComputadora}. `;

    if (eleccionUsuario === eleccionComputadora) {
        mensaje += "¡Es un empate!";
    } else if (
        (eleccionUsuario === "piedra" && eleccionComputadora === "tijera") ||
        (eleccionUsuario === "papel" && eleccionComputadora === "piedra") ||
        (eleccionUsuario === "tijera" && eleccionComputadora === "papel")
    ) {
        mensaje += "¡Ganaste! 🎉";
    } else {
        mensaje += "¡Perdiste! 😢";
    }

    document.getElementById("mensaje").innerText = mensaje;
}
