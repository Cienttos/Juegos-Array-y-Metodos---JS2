document.addEventListener("DOMContentLoaded", function() {
    // ...todo tu código actual aquí...
    let botonVerde = document.getElementById("botonVerde")
    let botonRojo = document.getElementById("botonRojo")
    let botonAmarillo = document.getElementById("botonAmarillo")
    let botonAzul = document.getElementById("botonAzul")
    let botonComenzar = document.getElementById("botonComenzar")
    let Tiempo = document.getElementById("Tiempo")
    let Aciertos = document.getElementById("Aciertos")

    const opciones = ["Verde", "Rojo", "Amarillo", "Azul"]
    const botones = {
        "Verde": botonVerde,
        "Rojo": botonRojo,
        "Amarillo": botonAmarillo,
        "Azul": botonAzul
    }

    let secuencia = []
    let secuenciaUsuario = []
    let aciertos = 0
    let tiempo = 0
    let intervalo
    let esperandoInput = false

    function agregarColorSecuencia() {
        const random = Math.floor(Math.random() * 4)
        secuencia.push(opciones[random])
    }

    function mostrarSecuencia() {
        let i = 0
        esperandoInput = false
        secuenciaUsuario = []
        const intervaloMostrar = setInterval(() => {
            resaltarBoton(secuencia[i])
            i++
            if (i >= secuencia.length) {
                clearInterval(intervaloMostrar)
                esperandoInput = true
            }
        }, 700)
    }

    function resaltarBoton(color) {
        const boton = botones[color]
        boton.classList.add("ring-4", "ring-white")
        setTimeout(() => {
            boton.classList.remove("ring-4", "ring-white")
        }, 400)
    }

    function iniciarJuego() {
        secuencia = []
        aciertos = 0
        actualizarAciertos()
        agregarColorSecuencia()
        mostrarSecuencia()
    }

    function manejarInput(color) {
        if (!esperandoInput) return
        secuenciaUsuario.push(color)
        resaltarBoton(color)
        if (color !== secuencia[secuenciaUsuario.length - 1]) {
            alert("¡Perdiste! Intenta de nuevo.")
            iniciarJuego()
            return
        }
        if (secuenciaUsuario.length === secuencia.length) {
            aciertos++
            actualizarAciertos()
            setTimeout(() => {
                agregarColorSecuencia()
                mostrarSecuencia()
            }, 1000)
        }
    }

    function actualizarAciertos() {
        Aciertos.textContent = `Aciertos: ${aciertos}`
    }

    botonComenzar.addEventListener("click", iniciarJuego)
    botonVerde.addEventListener("click", () => manejarInput("Verde"))
    botonRojo.addEventListener("click", () => manejarInput("Rojo"))
    botonAmarillo.addEventListener("click", () => manejarInput("Amarillo"))
    botonAzul.addEventListener("click", () => manejarInput("Azul"))
});