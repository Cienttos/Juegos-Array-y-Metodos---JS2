document.addEventListener("DOMContentLoaded", function() {
    let botonVerde = document.getElementById("botonVerde")
    let botonRojo = document.getElementById("botonRojo")
    let botonAmarillo = document.getElementById("botonAmarillo")
    let botonAzul = document.getElementById("botonAzul")
    let botonComenzar = document.getElementById("botonComenzar")
    let textoCentral = document.getElementById("textoCentral")

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
    let esperandoInput = false
    let procesoInterval = null

    function agregarColorSecuencia() {
        const random = Math.floor(Math.random() * 4)
        secuencia.push(opciones[random])
    }

    function mostrarSecuencia() {
        let i = 0
        esperandoInput = false
        secuenciaUsuario = []
        setCentralStatus("jugando")
        const intervaloMostrar = setInterval(() => {
            resaltarBoton(secuencia[i])
            i++
            if (i >= secuencia.length) {
                clearInterval(intervaloMostrar)
                esperandoInput = true
                setCentralStatus("jugando")
            }
        }, 700)
    }

    function resaltarBoton(color) {
        const boton = botones[color]
        boton.classList.add("led-on")
        setTimeout(() => {
            boton.classList.remove("led-on")
        }, 400)
    }

    function iniciarJuego() {
        secuencia = []
        aciertos = 0
        actualizarCentralAciertos()
        botonComenzar.disabled = true
        botonComenzar.classList.remove("jugando")
        let count = 3
        textoCentral.innerHTML = `<span class="cantidad">${count}</span>`
        let countdown = setInterval(() => {
            count--
            if (count > 0) {
                textoCentral.innerHTML = `<span class="cantidad">${count}</span>`
            } else if (count === 0) {
                textoCentral.innerHTML = `<span class="cantidad">¡Vamos!</span>`
            } else {
                clearInterval(countdown)
                setCentralStatus("jugando")
                agregarColorSecuencia()
                mostrarSecuencia()
            }
        }, 800)
    }

    function setCentralStatus(status) {
        if (status === "jugando") {
            botonComenzar.disabled = true
            botonComenzar.classList.add("jugando")
            textoCentral.innerHTML = `
                <span class="aciertos">Aciertos</span>
                <span class="cantidad">${aciertos}</span>
                <span class="proceso" id="puntosCargando">-</span>
            `
            let dots = ["-", "--", "---", "-", "--", "---"]
            let idx = 0
            if (procesoInterval) clearInterval(procesoInterval)
            procesoInterval = setInterval(() => {
                idx = (idx + 1) % dots.length
                document.getElementById("puntosCargando").textContent = dots[idx]
            }, 400)
        } else {
            botonComenzar.classList.remove("jugando")
            textoCentral.innerHTML = "Jugar"
            botonComenzar.disabled = false
            if (procesoInterval) clearInterval(procesoInterval)
        }
    }

    function manejarInput(color) {
        if (!esperandoInput) return
        secuenciaUsuario.push(color)
        const boton = botones[color]
        boton.classList.add("led-on")
        setTimeout(() => {
            boton.classList.remove("led-on")
        }, 200)
        if (color !== secuencia[secuenciaUsuario.length - 1]) {
            setCentralStatus()
            setTimeout(() => {
                textoCentral.innerHTML = "Jugar"
                botonComenzar.disabled = false
            }, 700)
            return
        }
        if (secuenciaUsuario.length === secuencia.length) {
            aciertos++
            actualizarCentralAciertos()
            setTimeout(() => {
                agregarColorSecuencia()
                mostrarSecuencia()
            }, 1000)
        }
    }

    function actualizarCentralAciertos() {
        textoCentral.innerHTML = `
            <span class="aciertos">Aciertos</span>
            <span class="cantidad">${aciertos}</span>
            <span class="proceso" id="puntosCargando">-</span>
        `
    }

    botonComenzar.addEventListener("click", iniciarJuego)
    botonVerde.addEventListener("click", () => manejarInput("Verde"))
    botonRojo.addEventListener("click", () => manejarInput("Rojo"))
    botonAmarillo.addEventListener("click", () => manejarInput("Amarillo"))
    botonAzul.addEventListener("click", () => manejarInput("Azul"))
});