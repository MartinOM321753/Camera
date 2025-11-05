// Referencias a los elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraStream = document.getElementById('cameraStream');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // Contexto 2D para dibujar en el Canvas

let stream = null; // Variable para almacenar el MediaStream de la cámara

// Función para abrir la cámara
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 320 },
                height: { ideal: 240 }
            }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        // Mostrar el streaming de la cámara
        cameraStream.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;

        console.log('Cámara abierta exitosamente');
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
}

// Función para tomar la foto
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara');
        return;
    }

    // Dibujar el frame de video en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir el canvas a Data URL (imagen base64)
    const imageDataURL = canvas.toDataURL('/image/png');
    console.log('Foto capturada en base64:', imageDataURL.length, 'caracteres');

    // Cerrar la cámara
    closeCamera();
}

// Función para cerrar la cámara y liberar recursos
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null; // Limpiar la referencia

        video.srcObject = null;
        cameraStream.style.display = 'none';
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;

        console.log('Cámara cerrada');
    }
}

// Ajustar el tamaño del canvas al tamaño del video
function adjustCanvasSize() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
video.addEventListener('loadedmetadata', adjustCanvasSize);

// Limpiar el stream cuando el usuario cierra la página
window.addEventListener('beforeunload', () => {
    closeCamera();
});
