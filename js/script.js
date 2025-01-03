import { cancionAleatoria } from "./spotify.js";

let juego = document.getElementById('juego');
let seleccion = document.getElementById('seleccion');
let juego_section = document.getElementById('juego_section');
let playlist = document.getElementById('playlist');
// declaracion elementos playlist
let imagesPlaylists = document.querySelectorAll('.playlistDiv');
let btn_seleccionar = document.getElementById('btn_seleccionar');
let audio = document.getElementById('audio');




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

let juegoEmpezado = false;
const comenzarJuego = async () => {
    if (seleccionado) {
        juegoEmpezado = true;
        juego_section.classList.remove('hidden');
        playlist.classList.add('hidden');

        // Obtener el track seleccionado aleatorio
        let list = anterior.id.split('_')[1];
        let track = await cancionAleatoria(list);  // Esperar la canción aleatoria

        // Crear el iframe con la URL de Spotify y parámetros para minimizar la información
        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/track/${track.idTrack}?utm_source=generator&theme=0&view=detail`; // Usar el tema oscuro y minimizar información
        iframe.width = '100%';
        iframe.height = '80';
        iframe.style.border = 'none'; // Usar CSS para manejar el borde
        iframe.allow = 'encrypted-media'; // Permitir medios cifrados
        iframe.allowTransparency = 'true';

        // Insertar el iframe en el contenedor
        const element = document.getElementById('embed-iframe');
        element.innerHTML = ''; // Limpiar el contenedor antes de agregar el nuevo iframe
        element.appendChild(iframe);

        // Opcional: Agregar lógica para cambiar de track si se hace clic en un botón
        document.querySelectorAll('.track').forEach(trackElement => {
            trackElement.addEventListener('click', () => {
                iframe.src = `https://open.spotify.com/embed/track/${trackElement.dataset.spotifyId}?utm_source=generator&theme=0&view=detail`;
            });
        });
    }
};


juego.addEventListener('click', mostrarJuego);
seleccion.addEventListener('click', mostrarPlaylists);
imagesPlaylists.forEach((image) => {
    image.addEventListener('click', seleccionarPlaylist);
});
btn_seleccionar.addEventListener('click', comenzarJuego);