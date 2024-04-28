var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor(0x000000, 0);
// Configura a posição da orientação da camara
camera.position.set(0, 0, 5); // Posiciona a camara a 5 unidades no eixo Z
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var video1 = createVideoElement();
var video2 = createVideoElement();

var videoTexture1 = new THREE.VideoTexture(video1);
var videoMaterial1 = new THREE.MeshBasicMaterial({ map: videoTexture1, side: THREE.DoubleSide });
var planeGeometry1 = new THREE.PlaneGeometry(32, 18); 
var plane1 = new THREE.Mesh(planeGeometry1, videoMaterial1);
plane1.position.z = -5;
scene.add(plane1);

var videoTexture2 = new THREE.VideoTexture(video2);
var videoMaterial2 = new THREE.MeshBasicMaterial({ map: videoTexture2, side: THREE.DoubleSide });
var planeGeometry2 = new THREE.PlaneGeometry(32, 18); 
var plane2 = new THREE.Mesh(planeGeometry2, videoMaterial2);
plane2.position.z = -5;
scene.add(plane2);

var currentVideo = video1;
var nextVideo = video2;
var videoDuration = 13; // Duração do vídeo em segundos

currentVideo.addEventListener('ended', function() {
    fadeOutAndSwapVideos();
});
// currentVideo.addEventListener('timeupdate', function() {
//     console.log('Current video time:', currentVideo.currentTime);
// });

function createVideoElement() {
    var video = document.createElement('video');
    video.src = 'video.mp4'; 
    video.loop = true; // Desativar o loop automático
    video.muted = true;
    video.play();
    return video;
}
function fadeOutAndSwapVideos() {
    nextVideo.currentTime = 0; // Reinicia o próximo vídeo
    nextVideo.play();
    
    var fadeInStartTime = videoDuration - 1; // Inicia o fade in 3 segundos antes do final do vídeo1
    
    // Define um ouvinte de evento para verificar a posição de reprodução do vídeo atual
    var timeUpdateListener = function() {
        // Inicia o fade in do próximo vídeo quando o vídeo atual estiver próximo do final
        if (currentVideo.currentTime >= fadeInStartTime) {
            // Calcula a opacidade dos vídeos com base na proximidade do final do vídeo atual
            var opacity = (currentVideo.duration - currentVideo.currentTime) / 4;
            nextVideo.volume = 1 - opacity;
            currentVideo.volume = opacity;
        }
        
        // Quando o vídeo atual termina, troca os vídeos e remove o ouvinte de evento
        if (currentVideo.ended) {
            currentVideo.removeEventListener('timeupdate', timeUpdateListener);
            currentVideo.pause();
            var temp = currentVideo;
            currentVideo = nextVideo;
            nextVideo = temp;
        }
    };
    
    // Adiciona um ouvinte de evento para monitorar a posição de reprodução do vídeo atual
    currentVideo.addEventListener('timeupdate', timeUpdateListener);
}

// function fadeOutAndSwapVideos() {
//     nextVideo.currentTime = 0; // Reinicia o próximo vídeo
//     nextVideo.play();
    
//     // Define o tempo para iniciar o fade in do próximo vídeo
//     var startFadeInTime = videoDuration - 3; // Inicia o fade in 3 segundos antes do final do vídeo1
    
//     var startFadeOutTime = currentVideo.currentTime;
//     var fadeInterval = setInterval(function() {
//         var elapsedTime = currentVideo.currentTime - startFadeOutTime;
//         var fadeDuration = videoDuration - elapsedTime;
        
//         // Ajusta o volume dos vídeos com base no tempo decorrido
//         nextVideo.volume = Math.min(1, fadeDuration / 3); // Inicia o fade in do vídeo2 quando o vídeo1 estiver a 3 segundos do final
//         currentVideo.volume = Math.max(0, (fadeDuration - 3) / 3); // Faz o fade out do vídeo1 3 segundos antes do final
        
//         if (elapsedTime >= startFadeInTime) {
//             clearInterval(fadeInterval);
//             currentVideo.pause();
//             var temp = currentVideo;
//             currentVideo = nextVideo;
//             nextVideo = temp;
//         }
//     }, 50); // Ajuste o intervalo de tempo conforme necessário
// }

var loader = new THREE.FontLoader();
var textureLoader = new THREE.TextureLoader();
var matcapTextureU = textureLoader.load('/textures/matcaps/3.png')
matcapTextureU.colorSpace = THREE.SRGBColorSpace
var matcapTextureO = textureLoader.load('/textures/matcaps/2.png')
matcapTextureO.colorSpace = THREE.SRGBColorSpace
var matcapTextureA = textureLoader.load('/textures/matcaps/8.png')
matcapTextureA.colorSpace = THREE.SRGBColorSpace

loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    var materialU = new THREE.MeshMatcapMaterial()
    var materialO = new THREE.MeshMatcapMaterial()
    var materialA = new THREE.MeshMatcapMaterial()

    var textGeometryU = new THREE.TextGeometry('U', {
        font: font,
        size: 3.5,
        height: 0.4,
        curveSegments: 13,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5,
        bevelOffset: 0
    });
    materialU.wireframe = false
    materialU.matcap = matcapTextureU
    
    // Manual way of center text
    //textGeometryU.computeBoundingBox()
    //console.log(textGeometryU.boundingBox)
    // textGeometryU.translate(
    //    - (textGeometryU.boundingBox.max.x - 0.02) * 0.5,
    //    - (textGeometryU.boundingBox.max.y - 0.02) * 0.5,
    //    - (textGeometryU.boundingBox.max.z - 0.03) * 0.5,
    // )
    //textGeometryU.computeBoundingBox()
    //console.log(textGeometryU.boundingBox)

    //Centrar automáticamente
    textGeometryU.center()


    var textGeometryA = new THREE.TextGeometry('A', {
        font: font,
        size: 1.01,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.01,
        bevelSegments: 5
    });
    materialA.wireframe = false
    materialA.matcap = matcapTextureA
     //Centrar automáticamente
    textGeometryA.center()

    var textGeometryO = new THREE.TextGeometry('O', {
    font: font,
    size: 1.8,
    height: 0.3,
    curveSegments: 18,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 5,
    bevelOffset: 0
    });
    materialO.wireframe = false
    materialO.matcap = matcapTextureO
     //Centrar automáticamente
    textGeometryO.center()

    var textMeshU = new THREE.Mesh(textGeometryU, materialU);
    var textMeshA = new THREE.Mesh(textGeometryA, materialA);
    var textMeshO = new THREE.Mesh(textGeometryO, materialO);

    // Defina a escala dos objetos de texto
    textMeshU.scale.set(0.3, 0.3, 0.3); // Reduzir pela metade em todas as direções
    textMeshA.scale.set(0.3, 0.3, 0.3); // Reduzir pela metade em todas as direções
    textMeshO.scale.set(0.3, 0.3, 0.3); // Reduzir pela metade em todas as direções

    
 
    
    // Função para atualizar a rotação das letras a cada quadro de animação
    function update() {
        // Define a rotação aleatória para cada letra no eixo x
        textMeshU.rotation.y += Math.random() * 0.01;
        textMeshA.rotation.y += Math.random() * 0.03;
        textMeshO.rotation.x -= Math.random() * 0.05;
    }
    // Função para ajustar o tamanho da renderização quando a janela é redimensionada
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

       //Axes helper
       var axesHelperA = new THREE.AxesHelper()
    
       scene.add(camera);
       scene.add(textMeshU);
       scene.add(textMeshA);
       scene.add(textMeshO);
       //scene.add(axesHelperA)
    
       // Escuta de evento de redimensionamento
    window.addEventListener('resize', onWindowResize);
        function animate() {
            //console.log('Current video:', currentVideo.readyState, currentVideo.currentTime);
            //console.log('Next video:', nextVideo.readyState, nextVideo.currentTime);
            requestAnimationFrame(animate);
                // Chama a função de atualização
                update();
            renderer.render(scene, camera);
        }
    
    animate();
});


