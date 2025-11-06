// Referencias a los elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraStream = document.getElementById('cameraStream');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stream = null;

// Función para abrir la cámara
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        cameraStream.style.display = 'block';
        canvas.style.display = 'none'; // Ocultar el canvas al abrir cámara
        video.style.display = 'block';

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

    // Ajustar el tamaño del canvas al video real
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Mostrar la foto capturada
    canvas.style.display = 'block';
    video.style.display = 'none';

    // Convertir a imagen Base64
    const imageDataURL = canvas.toDataURL('image/png');
    console.log('Foto capturada:', imageDataURL.substring(0, 50) + '...');

    // Cerrar la cámara
    closeCamera();
}

// Función para cerrar la cámara
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        cameraStream.style.display = 'none';
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
        console.log('Cámara cerrada');
    }
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
window.addEventListener('beforeunload', closeCamera);
