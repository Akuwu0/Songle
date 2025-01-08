export const getLetraCancion = async (track) => {
    const artist = track.artists;
    const songTitle = track.solucion;

    let timeout;  // Variable para almacenar el timeout

    try {
        // Creamos una nueva promesa que se resuelve con la letra o se rechaza por timeout
        const letraPromise = new Promise(async (resolve, reject) => {
            // Configuramos el timeout para devolver -1 después de 5 segundos
            timeout = setTimeout(() => {
                reject(-1);  // Si pasa el tiempo, rechazamos la promesa con -1
            }, 1000);

            // Realiza la búsqueda de la canción en Lyrics.ovh
            const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist[0])}/${encodeURIComponent(songTitle)}`);

            // Si la respuesta fue exitosa, limpiamos el timeout
            clearTimeout(timeout);

            // Verifica si la respuesta fue exitosa (status 200)
            if (!response.ok) {
                reject(-1);  // Si la respuesta no es exitosa, rechazamos la promesa con -1
            }

            const data = await response.json();

            // Verifica si la respuesta tiene el campo 'lyrics' o un error
            if (data.lyrics) {
                resolve(data.lyrics);  // Si la letra está disponible, resolvemos la promesa
            } else {
                reject(-1);  // Si no se encuentran letras, rechazamos la promesa con -1
            }
        });

        // Esperamos la resolución de la promesa
        const lyrics = await letraPromise;
        return lyrics;

    } catch (error) {
        // Si ocurre un error (timeout o cualquier otro), devolvemos -1
        return -1;
    }
};
