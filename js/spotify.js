import spotifyConfig from './spotifyConfig.js';

let accessToken = "";
let accessTokenExpiration = 0; // Timestamp para verificar si el token ha expirado

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

// Obtener el Access Token
const getAccessToken = async () => {
    const currentTime = Date.now() / 1000; // tiempo actual en segundos

    // Si el token aún no ha caducado, lo reutilizamos
    if (accessToken && accessTokenExpiration > currentTime) {
        return accessToken;
    }

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
        accessTokenExpiration = Date.now() / 1000 + data.expires_in; // Guardar el tiempo de expiración
        return accessToken;
    } else {
        console.log("Error al obtener el token de acceso");
        return null;
    }
};

// Función para hacer solicitudes a la API de Spotify y manejar errores 429
// Controlamos este error, ya que el primer dia dwe pruebas de esta web 
// Spotify bloqueo las peticiones a la api por exceso de peticiones en un dia.
const fetchWithRetry = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            // Si recibimos un error 429, no intentamos más y mostramos el mensaje
            console.log("Demasiadas solicitudes. No se intentará nuevamente.");
            return null; // No se hacen mas intentos
        }

        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        return await response.json();
    } catch (error) {
        console.log("Error final:", error);
        return null; // En caso de cualquier otro error, no se intenta más
    }
};

// Función para obtener los detalles de una playlist
const getPlaylistDetails = async (playlist_id) => {
    const token = await getAccessToken();
    if (!token) {
        console.log("No se obtuvo un token válido");
        return null;
    }

    const response = await fetchWithRetry(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

// Función para mostrar las imágenes de las playlists
const displayPlaylistDetails = async () => {
    try {
        for (let i = 0; i < playlist_ids.length; i++) {
            const playlistId = playlist_ids[i];
            const playlist = await getPlaylistDetails(playlistId);

            if (!playlist) {
                console.log(`Error al obtener la playlist ${playlistId}. Deteniendo las solicitudes.`);
                break; // Detenemos las peticiones si salta algun error
            }

            // Si se obtiene la playlist, actualizamos la imagen
            imagesPlaylists[i].src = playlist.images[0]?.url;
        }
    } catch (error) {
        console.error("Error al mostrar los datos de la playlist:", error);
    }
};

// Función para obtener una canción aleatoria de una playlist
export const cancionAleatoria = async (numList) => {
    let artist = [];
    let idPlay = playlist_ids[numList - 1];
    let playlist = await getPlaylistDetails(idPlay);
    let cantidad = playlist.tracks.items.length - 1;
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
        'solucion': solucion,
        'year': year,
        'artists': artist,
        'idTrack': idTrack
    };
    return cancion;
};

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", displayPlaylistDetails);

