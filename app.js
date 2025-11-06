// Referencias a los elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraStream = document.getElementById('cameraStream');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const switchCameraBtn = document.getElementById('switchCamera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const galleryContainer = document.getElementById('galleryContainer');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

let stream = null;
let useFrontCamera = false;
let photos = []; // Array para almacenar las fotos capturadas

// Función para abrir la cámara
async function openCamera() {
  try {
    const constraints = {
      video: {
        facingMode: useFrontCamera ? 'user' : 'environment',
        width: { ideal: 320 },
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

  canvas.width = 320;
  canvas.height = 240;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageDataURL = canvas.toDataURL('image/png');
  photos.push(imageDataURL);
  addPhotoToGallery(imageDataURL);

  canvas.style.display = 'block';
  video.style.display = 'none';

  closeCamera();
}

// Función para agregar imagen a la galería
function addPhotoToGallery(imageDataURL) {
  const img = document.createElement('img');
  img.src = imageDataURL;
  img.alt = 'Foto tomada';
  img.addEventListener('click', () => openModal(imageDataURL));
  galleryContainer.prepend(img); // Agrega la nueva foto al inicio
}

// Mostrar imagen ampliada
function openModal(src) {
  modalImage.src = src;
  imageModal.style.display = 'flex';
}

// Cerrar modal al hacer click fuera
imageModal.addEventListener('click', () => {
  imageModal.style.display = 'none';
});

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
  closeCamera();
  await openCamera();
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
window.addEventListener('beforeunload', closeCamera);
