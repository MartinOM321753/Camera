// Referencias a los elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraStream = document.getElementById('cameraStream');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const switchCameraBtn = document.getElementById('switchCamera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stream = null;
let useFrontCamera = false; // false = trasera, true = frontal

// Función para abrir la cámara
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: useFrontCamera ? 'user' : 'environment',
                width: { ideal: 220 },
                height: { ideal: 240 }
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        cameraStream.style.display = 'block';
        canvas.style.display = 'none';
        video.style.display = 'block';

        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;

        console.log(`Cámara abierta (${useFrontCamera ? 'frontal' : 'trasera'})`);
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

    canvas.width = 220;
    canvas.height = 240;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.style.display = 'block';
    video.style.display = 'none';

    const imageDataURL = canvas.toDataURL('image/png');
    console.log('Foto capturada:', imageDataURL.substring(0, 50) + '...');

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

// Función para cambiar entre cámaras
async function switchCamera() {
    useFrontCamera = !useFrontCamera;
    closeCamera(); // Detiene la cámara actual
    await openCamera(); // Vuelve a abrir con el nuevo modo
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
window.addEventListener('beforeunload', closeCamera);
