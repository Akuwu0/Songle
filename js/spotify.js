import spotifyConfig from './spotifyConfig.js';

let accessToken = "";

let imagesPlaylists = document.querySelectorAll('.playlistDiv');

const playlist_ids = [
    '3LnKnLXFIA7lEAbV0YROL4',
    '6EhNUv3qCmv6FlTmKsxPBh',
    '0sDahzOkMWOmLXfTMf2N4N',
    '4lKOBXoYWsEBLyZkzNmnfP',
    '2DNLQuVm2SepjFP2ZLVksD',
    '2uGtHlsrXprWFdIf7jqYsV',
    '27gN69ebwiJRtXEboL12Ih',
    '0X1ZraHn4xlPchQ0fJP2qg'
];


const getAccessToken = async () => {
    const clientId = spotifyConfig.clientId; 
    const clientSecret = spotifyConfig.clientSecret; 
  
    const respuesta = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`)
        },
        body: "grant_type=client_credentials"
    });
  
    if (respuesta.ok) {
        const data = await respuesta.json();
        accessToken = data.access_token;
        return accessToken;
    } else {
        console.log("Error al obtener el token de acceso");
    }
}
  
// Función para obtener datos de una playlist
async function getPlaylistDetails(playlist_id) {
    const token = await getAccessToken(); // nos aseguramos de que el  token sea valido.

    if (!token) {
        console.log("No se obtuvo un token válido");
        return;
    }

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.log("Error al obtener los datos de la playlist");
        return;
    }

    const data = await response.json();
    return data; // Devuelve los datos de la playlist
}

// Función para mostrar los datos de la playlist
async function displayPlaylistDetails() {
    try {
        
        playlist_ids.forEach(async (playlistId, index) => {
            const playlist = await getPlaylistDetails(playlistId);
            if (playlist) {
                
                imagesPlaylists[index].src = playlist.images[0]?.url;
            }
        });
        
    } catch (error) {
        console.error("Error al mostrar los datos de la playlist:", error);
    }
}

export const cancionAleatoria = async (numList) => {
    let artist = [];
    let idPlay = playlist_ids[numList-1];
    let playlist =await getPlaylistDetails(idPlay);
    let cantidad = playlist.tracks.items.length-1;
    let numSong = Math.floor(Math.random() * cantidad);
    let track = playlist.tracks.items[numSong].track;
    let artistas = track.artists;
    artistas.forEach(artista => {
        artist.push(artista.name);
    });
    let solucion = track.name.split('(')[0];
    let year = track.album.release_date.split('-')[0];
    let idTrack = track.id;
    let cancion = {
        'solucion' : solucion,
        'year' : year,
        'artists' : artist,
        'idTrack' : idTrack
    }
    return cancion;
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", displayPlaylistDetails);

