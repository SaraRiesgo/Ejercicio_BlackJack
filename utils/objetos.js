class Carta {
  constructor(valor, palo) {
    this.valor = valor;
    this.palo = palo;
    this.puntos = this.calcularPuntos();
  }
  calcularPuntos() {
    if (this.valor === "A") {
      return 1;
    } else if (this.valor === "J" || this.valor === "Q" || this.valor === "K") {
      return 11;
    } else {
      return parseInt(this.valor);
    }
  }
}

let sumaBanca = 0;
class Baraja {
  constructor() {
    this.palos = ["T", "C", "P", "D"];
    this.valores = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    this.cartas = this.crearBaraja();
  }
  crearBaraja() {
    const cartas = [];
    let valor;
    let palo;
    for (palo of this.palos) {
      for (valor of this.valores) {
        cartas.push(new Carta(valor, palo));
      }
    }
    return cartas;
  }
  
  barajar() {
    this.cartas = _.shuffle(this.cartas);
    console.log(this.cartas);
  }

  mostrarCarta() {
    if (this.cartas.length > 0) {
      const carta = this.cartas.pop();

      const imagen = document.createElement("img");
      imagen.src = `./images/${carta.valor}${carta.palo}.png`;
      const tapete = document.querySelector("#cartas-banca");
      tapete.append(imagen);
      return carta;
    } 
  }

  mostrarCartasBanca(callback) {
    sumaBanca = 0;

    const resultadosContenedor = document.querySelector(".resultados");
    //Desactivar botones al inicio del turno de la banca
    document.querySelector("#pedirCarta").disabled = true;
    document.querySelector("#plantarse").disabled = true;

    const sacarYmostrarCarta = () => {
      const carta = this.mostrarCarta();

      sumaBanca += carta.puntos;
      setTimeout(() => {
        const mensaje = `Puntos de la banca: ${sumaBanca}`;
        resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
      }, 1000);

      if (sumaBanca >= 17 && sumaBanca <= 21) {
        setTimeout(() => {
          const mensaje = `La banca se planta con ${sumaBanca} puntos.`;
          resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
          //Reactivamos botones para el turno del jugador
          document.querySelector("#pedirCarta").disabled = false;
          document.querySelector("#plantarse").disabled = false;
          callback();
        }, 1500); 
      } else if (sumaBanca > 21) {
        setTimeout(() => {
          const mensaje = `La banca ha perdido. ¡¡¡GANASTE!!!`;
          resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
          //Desactivar los botones de pedir carta y plantarse
          document.querySelector("#pedirCarta").disabled = true;
          document.querySelector("#plantarse").disabled = true;
          btnJugarDeNuevo.style.display = "block";//Activamos el boton de volver a jugar
          callback();
        }, 1500);
      }
    };

    const intervalo = setInterval(() => {
      if (sumaBanca < 17) {
        sacarYmostrarCarta();
      } else {
        clearInterval(intervalo);
      }
    }, 2000);
  }

  mostrarCartaJugador() {
    const carta = this.cartas.pop();

    const imagen = document.createElement("img");
    imagen.src = `./images/${carta.valor}${carta.palo}.png`;
    const tapete = document.querySelector("#cartas-jugador");
    tapete.append(imagen);
    return carta;
  }
}
const btnJugarDeNuevo = document.querySelector("#jugarDeNuevo");
let sumJugador = 0;
let jugadorPlantado = 0;
const resultadosContenedor = document.querySelector(".resultados");
function pedirCarta() {
  if (jugadorPlantado) {
    return;
  }

  const carta = baraja.mostrarCartaJugador();

  if (carta) {
    setTimeout(() => {
      sumJugador += carta.puntos;
      const mensaje = `Puntos del jugador: ${sumJugador}`;
      resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;

      if (sumJugador > 21) {
        const excesoPuntos = `El jugador se ha pasado de 21 puntos. La banca gana con ${sumaBanca} puntos.`;
        resultadosContenedor.innerHTML = `<p>${excesoPuntos}</p>`;
        document.querySelector("#pedirCarta").disabled = true;
        document.querySelector("#plantarse").disabled = true;
        finalizarPartida();
      }
    }, 1000);
  }
}

function plantarse() {
  jugadorPlantado = true;
  const mensaje = `El jugador se planta con ${sumJugador} puntos.`;
  resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
  compararResultados();
}

function compararResultados() {
  if (sumaBanca > 21) {
    return;
  }
  if (sumJugador > sumaBanca && sumJugador <= 21) {
    const mensaje = `El jugador ${jugador} ha ganado con ${sumJugador} puntos.¡¡ENHORABUENA!!`;
    resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
  } else if (sumJugador < sumaBanca && sumaBanca <= 21) {
    const mensaje = `La banca ha ganado con ${sumaBanca} puntos.`;
    resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
  } else if (sumJugador === sumaBanca && sumJugador <= 21) {
    const mensaje = `Ha habido empate`;
    resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
  } else {
    const mensaje = `El jugador se ha pasado de 21 puntos con ${sumJugador} puntos.`;
    resultadosContenedor.innerHTML = `<p>${mensaje}</p>`;
  }
  finalizarPartida();
  
}

function finalizarPartida() {
  //Desactivar los botones de acción del jugador
  document.querySelector("#pedirCarta").disabled = true;
  document.querySelector("#plantarse").disabled = true;
  Swal.fire("El juego ha terminado. ¡Gracias por jugar!");
  mostrarBotonJugarDeNuevo();
}
btnJugarDeNuevo.addEventListener("click", reiniciarJuego);

function reiniciarJuego(){
  sumaBanca = 0;
  sumJugador = 0;
  jugadorPlantado = false;
  //Limpiar las cartas mostradas en pantalla
  document.querySelector("#cartas-banca").innerHTML = "";
  document.querySelector("#cartas-jugador").innerHTML = "";

  //Reiniciamos los textos de resultados
  resultadosContenedor.innerHTML = "";

  //Reactivamos los botones de juego
  document.querySelector("#pedirCarta").disabled = false;
  document.querySelector("#plantarse").disabled = false;

  //Ocultamos el boton de jugar de nuevo
  btnJugarDeNuevo.style.display = "none";

  baraja.cartas = baraja.crearBaraja();
  baraja.barajar();
  baraja.mostrarCartasBanca(() => {
    console.log("La banca ha terminado. Ahora es el turno del jugador");
  });
}

//Funcion para mostrar el boton de jugar de nuevo
function mostrarBotonJugarDeNuevo(){
  btnJugarDeNuevo.style.display = "block";
}

function turnoBanca() {
  baraja.mostrarCartasBanca();
}

const baraja = new Baraja();
baraja.barajar();
document.querySelector("#pedirCarta").addEventListener("click", pedirCarta);
document.querySelector("#plantarse").addEventListener("click", plantarse);

