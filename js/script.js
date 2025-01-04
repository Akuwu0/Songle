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

let track;
let juegoEmpezado = false;
const comenzarJuego = async () => {
    if (seleccionado) {
        letra.textContent = '"Letra parcial de la canción aquí..."';
        juegoEmpezado = true;
        juego_section.classList.remove('hidden');
        playlist.classList.add('hidden');

        let list = anterior.id.split('_')[1];
        track = await cancionAleatoria(list);  // Esperar la canción aleatoria

        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/track/${track.idTrack}?utm_source=generator&theme=0&view=detail`; 
        iframe.width = '100%';
        iframe.height = '80';
        iframe.style.border = 'none'; 
        iframe.allow = 'encrypted-media'; 
        iframe.allowTransparency = 'true';
        element.innerHTML = '';
        element.appendChild(iframe);

        getLetras();
    }
};

const getLetras = async () => {
    // Llamamos a la función para obtener la letra de la canción
    const lyrics = await getLetraCancion(track);
    if (lyrics == -1) {
        comenzarJuego();
    }else{
        letra.textContent = lyrics.slice(0, Math.floor(lyrics.length * 0.25)) + "...";
    }

  };


juego.addEventListener('click', mostrarJuego);
seleccion.addEventListener('click', mostrarPlaylists);
imagesPlaylists.forEach((image) => {
    image.addEventListener('click', seleccionarPlaylist);
});
btn_seleccionar.addEventListener('click', comenzarJuego);