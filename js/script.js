// imports
import { cancionAleatoria } from "./spotify.js";
import { getLetraCancion } from "./lyrics.js";


// declaracion elementos
let juego = document.getElementById('juego');
let seleccion = document.getElementById('seleccion');
let juego_section = document.getElementById('juego_section');
let playlist = document.getElementById('playlist');
let imagesPlaylists = document.querySelectorAll('.playlistDiv');
let btn_seleccionar = document.getElementById('btn_seleccionar');
let letra = document.getElementById('letra');
const element = document.getElementById('embed-iframe');
let puntuacion = document.getElementById('puntuacion');
let btn_comprobar = document.getElementById('comprobar');
let btn_otraVez = document.getElementById('otraVez');
let btn_changeList = document.getElementById('cambiarList');
let respuesta = document.getElementById('respuesta');
let pista = document.getElementById('pista');
let lives = document.getElementById('lives');
let record = document.getElementById('record');
let introducir = document.getElementById('introducir');


// funcion para intercambiar la clase 'hidden', mostrando y ocultando distintas vistas
let seleccionado = false;
const mostrarJuego = () => {
    if(seleccionado && juegoEmpezado){
        juego_section.classList.remove('hidden');
        playlist.classList.add('hidden')
    }
}

// funcion para intercambiar la clase 'hidden', mostrando y ocultando distintas vistas
const mostrarPlaylists = () => {
    playlist.classList.remove('hidden');
    juego_section.classList.add('hidden')
}

// funcion para marcar la playlist seleccionada y desmarcar la anterior seleccionada cuando hay una nueva.
let anterior = "";
const seleccionarPlaylist = (event) => {
    if(cambiarPlaylist){
        if(anterior == ""){
            event.target.classList.add('border');
            event.target.classList.add('border-8');
            event.target.classList.add('border-green-500');
            anterior = event.target;
        }else{
            anterior.classList.remove('border');
            anterior.classList.remove('border-8');
            anterior.classList.remove('border-green-500');
            event.target.classList.add('border');
            event.target.classList.add('border-8');
            event.target.classList.add('border-green-500');
            anterior = event.target;
        }
        seleccionado = true;
    }
}


// funcion para comenzar el juego, getletras se llama dentro de getifra me, 
// porque si se pone dentro de esta funcion da error.
let track;
let solucion;
let cambiarPlaylist = true;
let juegoEmpezado = false;
const comenzarJuego = () => {
    if (seleccionado) {
        juegoEmpezado = true;
        cambiarPlaylist = false;
        btn_seleccionar.disabled=true;
        iniciarRecord();
        mostrarRecord();
        restablecerVidas();
        ocultarBotones();
        mostrarJuego();
        reinicioSectionJuego();
        getIframe();
    }
};

// funcion para reiniciar el menu del juego cuando comenzamod a jugar
const reinicioSectionJuego = () => {
    letra.textContent = '"Letra parcial de la canción aquí..."';
    pista.classList.add('hidden');
    respuesta.focus();
}

// funcion para agregar el iframe de la cancion de spotify
const getIframe = async () => {
    let list = anterior.id.split('_')[1];
    track = await cancionAleatoria(list);  // Esperar la canción aleatoria
    solucion = track.solucion;
    const iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/track/${track.idTrack}?utm_source=generator&theme=0&view=detail`; 
    iframe.width = '100%';
    iframe.height = '80';
    iframe.style.border = 'none'; 
    iframe.allow = 'encrypted-media'; 
    iframe.allowTransparency = 'true';
    element.innerHTML = '';
    element.classList.add('hidden');
    element.appendChild(iframe);
    getLetras();
}

// funcion para hacer la peticion de las letras a la api
let lyrics;
const getLetras = async () => {
    // Llamamos a la función para obtener la letra de la canción
     lyrics = await getLetraCancion(track);
    if (lyrics == -1) {
        comenzarJuego();
    }else{
        letra.textContent = lyrics.slice(0, Math.floor(lyrics.length * .25)) + "...";
    }
  };

// funcion para cambiar la imagen de las vidas, y comprobar si has gabnado o has fallado.
let fallos = 0;
const comprobarSolucion = () => {
    if(respuesta.value.trim() != ''){
        introducir.classList.add('hidden');
        if(solucion.trim().toLowerCase() == respuesta.value.trim().toLowerCase() ){
            element.classList.remove('hidden');
            letra.textContent = 'CORRECTO!!!!';
            let puntos = '0'+ (parseInt(puntuacion.textContent) +1);
            puntuacion.textContent = puntos.slice(-2);
            fallos = 0;
            respuesta.value = "";
            respuesta.classList.remove('outline-red-400');
            mostrarBotones();
            guardarRecord(puntos);
        }else{
            fallos++;
            respuesta.classList.add('outline-red-400');
            respuesta.focus();
            if(fallos == 2)
                letra.textContent = lyrics.slice(0, Math.floor(lyrics.length * .5)) + "...";
            if(fallos == 3){
                pista.textContent = pista.textContent + (track.artists.length ==1 )? String(track.artists).replace('[', '').replace(']', '').replace('"', ''): track.artists.join(', ').replace('[', '').replace(']', '').replace('"', '');
                pista.classList.remove('hidden');
            }
            if(fallos == 4)
                letra.textContent = lyrics;
            if(fallos == 5){
                element.classList.remove('hidden');
                letra.textContent = 'Has perdidoo!!!! Tu puntuacion ha sido: '+puntuacion.textContent;
                respuesta.value = "";
                fallos = 0;
                puntuacion.textContent = '00';
                respuesta.classList.remove('outline-red-400');
                mostrarBotones();
            }
            cambiarVidas(fallos == 0? 5 : fallos);
        }
        mostrarRecord();
    }else{
        introducir.classList.remove('hidden');
    }
}

// funcion para cambiar la imagen a un fallo
const cambiarVidas = (fallos) => {
    let imgs = lives.childNodes;
    imgs.forEach(img => {
        if(img.alt == fallos)
            img.src = './../assets/images/cruz.png';
    })
}

// funcion para volver a poner todos los corazones
const restablecerVidas = () => {
    let imgs = lives.childNodes;
    imgs.forEach(img => {
            img.src = './../assets/images/Heart.png';
    })
}

// funcion para mostrar los botones tras acertar o quedarte sin oportunidades al adivinar una cancion
const mostrarBotones = () => {
    btn_changeList.classList.remove('hidden');
    btn_otraVez.classList.remove('hidden');
    btn_comprobar.classList.add('hidden');
}

// funcion para ocultar los botones de volver a jugar o de cambiar playlist
const ocultarBotones = () => {
    btn_changeList.classList.add('hidden');
    btn_otraVez.classList.add('hidden');
    btn_comprobar.classList.remove('hidden');
}

// funcion para cuando quiewres seguir jugando `pero cambiando la playlist
const cambiarList = () => {
    btn_seleccionar.disabled=false;
    cambiarPlaylist = true;
    anterior.classList.remove('border');
    anterior.classList.remove('border-8');
    anterior.classList.remove('border-green-500');
    anterior = "";
    seleccionado = false;
    juego_section.classList.add('hidden');
    playlist.classList.remove('hidden');
}

// funcion para iniciar record en el localStorage del usuario
const iniciarRecord = () => {
    if (localStorage.getItem('record') == null) localStorage.setItem('record', 0);
}

// funcion para mostrar el record
const mostrarRecord = () => {
    let recordGuardado = localStorage.getItem('record');
    record.textContent = recordGuardado==0? '00' :  ('0' + recordGuardado).slice(-2);
}

// funcion para guardar el record
const guardarRecord = (puntos) => {
    let recordGuardado = localStorage.getItem('record');

    let recordActual = recordGuardado ? parseInt(recordGuardado) : 0;
    if (puntos > recordActual) {
      localStorage.setItem('record', puntos);
      console.log(`Nuevo record guardado: ${puntos}`);
    } else {
      console.log(`No se supera el record actual: ${recordActual}`);
    }
}


// eventos
juego.addEventListener('click', mostrarJuego);
seleccion.addEventListener('click', mostrarPlaylists);
imagesPlaylists.forEach((image) => {
    image.addEventListener('click', seleccionarPlaylist);
});
btn_seleccionar.addEventListener('click', comenzarJuego);
btn_comprobar.addEventListener('click', comprobarSolucion);
btn_otraVez.addEventListener('click', comenzarJuego);
btn_changeList.addEventListener('click', cambiarList);