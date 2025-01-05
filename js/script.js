import { cancionAleatoria } from "./spotify.js";
import { getLetraCancion } from "./lyrics.js";


let juego = document.getElementById('juego');
let seleccion = document.getElementById('seleccion');
let juego_section = document.getElementById('juego_section');
let playlist = document.getElementById('playlist');
// declaracion elementos playlist
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

let seleccionado = false;
const mostrarJuego = () => {
    if(seleccionado && juegoEmpezado){
        juego_section.classList.remove('hidden');
        playlist.classList.add('hidden')
    }
}

const mostrarPlaylists = () => {
    playlist.classList.remove('hidden');
    juego_section.classList.add('hidden')
}

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

let track;
let solucion;
let cambiarPlaylist = true;
let juegoEmpezado = false;
const comenzarJuego = async () => {
    if (seleccionado) {
        cambiarPlaylist = false;
        btn_seleccionar.disabled=true;
        iniciarRecord();
        mostrarRecord();
        restablecerVidas();
        ocultarBotones();

        letra.textContent = '"Letra parcial de la canción aquí..."';
        juegoEmpezado = true;
        juego_section.classList.remove('hidden');
        playlist.classList.add('hidden');
        pista.classList.add('hidden');

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
};

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

let fallos = 0;
const comprobarSolucion = () => {
    if(solucion.trim().toLowerCase() == respuesta.value.trim().toLowerCase() ){
        element.classList.remove('hidden');
        letra.textContent = 'CORRECTO!!!!';
        let puntos = '0'+ (parseInt(puntuacion.textContent) +1);
        puntuacion.textContent = puntos.slice(-2);
        fallos = 0;
        respuesta.value = "";
        mostrarBotones();
        guardarRecord(puntos);
    }else{
        fallos++;
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
            mostrarBotones();
        }
        cambiarVidas(fallos == 0? 5 : fallos);
    }
    mostrarRecord();
}

const cambiarVidas = (fallos) => {
    let imgs = lives.childNodes;
    imgs.forEach(img => {
        if(img.alt == fallos)
            img.src = './../assets/images/cruz.png';
    })
}

const restablecerVidas = () => {
    let imgs = lives.childNodes;
    imgs.forEach(img => {
            img.src = './../assets/images/Heart.png';
    })
}

const mostrarBotones = () => {
    btn_changeList.classList.remove('hidden');
    btn_otraVez.classList.remove('hidden');
    btn_comprobar.classList.add('hidden');
}
const ocultarBotones = () => {
    btn_changeList.classList.add('hidden');
    btn_otraVez.classList.add('hidden');
    btn_comprobar.classList.remove('hidden');
}

const cambiarList = () => {
    btn_seleccionar.disabled=false;
    cambiarPlaylist = true;
    anterior.classList.remove('border');
    anterior.classList.remove('border-8');
    anterior.classList.remove('border-green-500');
    juego_section.classList.add('hidden');
    playlist.classList.remove('hidden');
}

const iniciarRecord = () => {
    if (localStorage.getItem('record') == null) localStorage.setItem('record', 0);
}

const mostrarRecord = () => {
    let recordGuardado = localStorage.getItem('record');
    record.textContent = recordGuardado==0? '00' :  ('0' + recordGuardado).slice(-2);
}

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

juego.addEventListener('click', mostrarJuego);
seleccion.addEventListener('click', mostrarPlaylists);
imagesPlaylists.forEach((image) => {
    image.addEventListener('click', seleccionarPlaylist);
});
btn_seleccionar.addEventListener('click', comenzarJuego);
btn_comprobar.addEventListener('click', comprobarSolucion);
btn_otraVez.addEventListener('click', comenzarJuego);
btn_changeList.addEventListener('click', cambiarList);