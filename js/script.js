let juego = document.getElementById('juego');
let seleccion = document.getElementById('seleccion');
let juego_section = document.getElementById('juego_section');
let playlist = document.getElementById('playlist');
// declaracion elementos playlist
let imagesPlaylists = document.querySelectorAll('.playlistDiv');
let btn_seleccionar = document.getElementById('btn_seleccionar');



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
const comenzarJuego= () => {
    if(seleccionado){
        juegoEmpezado = true;
        juego_section.classList.remove('hidden');
        playlist.classList.add('hidden');
    }
}

juego.addEventListener('click', mostrarJuego);
seleccion.addEventListener('click', mostrarPlaylists);
imagesPlaylists.forEach((image) => {
    image.addEventListener('click', seleccionarPlaylist);
});
btn_seleccionar.addEventListener('click', comenzarJuego);