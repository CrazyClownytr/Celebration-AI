import { HandLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18";

const enableWebcamButton = document.getElementById("webcamButton")
// const logButton = document.getElementById("logButton")

const poseLabel = document.getElementById("poseLabel");
const confidentScore = document.getElementById("confidenceScore");

const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasCtx = canvasElement.getContext("2d")

const drawUtils = new DrawingUtils(canvasCtx)
let handLandmarker = undefined;
let webcamRunning = false;
let results = undefined;

// modal
const modal = document.getElementById('howToPlayModal');
const btn = document.getElementById('howToPlayBtn');
const closeBtn = document.querySelector('.close');

const startQuizModal = document.getElementById("startQuizModal");
const closeStartBtn = document.querySelector(".close-start");
const startQuizBtn = document.getElementById("startQuizBtn");
const footballerImg = document.getElementById("footballerImg");
const playerImage = document.getElementById("playerImage");


// let image = document.querySelector("#myimage")
const players = [
    { name: "pedri", img: "./img/pedri.jpeg" },
    { name: "messi", img: "./img/messi.jpg" },
    { name: "dybala", img: "./img/dybala.jpg" },
    { name: "gyokeres", img: "./img/gyokeres.png" },
    { name: "depay", img: "./img/depay.png" },
  ];
  let currentPlayer = null;

  

let nn

function createNeuralNetwork() {
    ml5.setBackend('webgl');
    nn = ml5.neuralNetwork({ task: 'classification', debug: true })
    const options = {
        model: './model/model.json',
        metadata: './model/model_meta.json',
        weights: './model/model.weights.bin'
    }
    nn.load(options, createHandLandmarker())
}


btn.onclick = () => {
    modal.style.display = 'block';
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};



/********************************************************************
// CREATE THE POSE DETECTOR
********************************************************************/
const createHandLandmarker = async () => {
    console.log("neural network model is loaded")
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
    });
    console.log("model loaded, you can start webcam")

    enableWebcamButton.addEventListener("click", (e) => enableCam(e))
 //   logButton.addEventListener("click", (e) => logAndClassifyHands(e))
}

/********************************************************************
// START THE WEBCAM
********************************************************************/
async function enableCam() {
    webcamRunning = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            canvasElement.style.width = video.videoWidth;
            canvasElement.style.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            document.querySelector(".videoView").style.height = video.videoHeight + "px";
            predictWebcam();

            startQuizModal.style.display = "none";
            currentPlayer = players[Math.floor(Math.random() * players.length)]
            footballerImg.src = currentPlayer.img;
            playerImage.style.display = "block";
     
        });

        

    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}

/********************************************************************
// START PREDICTIONS    
********************************************************************/
async function predictWebcam() {
    results = await handLandmarker.detectForVideo(video, performance.now());

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Loop door alle handen
    for (let hand of results.landmarks) {
        drawUtils.drawConnectors(hand, HandLandmarker.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
        drawUtils.drawLandmarks(hand, { radius: 4, color: "#FF0000", lineWidth: 2 });
    }

   // Log de handcoördinaten en maak voorspellingen automatisch
//    if (results.landmarks.length > 0) {
//         logAndClassifyHands();
//     }

    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
    }
}


/********************************************************************
// LOG HAND COORDINATES IN THE CONSOLE
********************************************************************/
function logAndClassifyHands() {
    if (results && results.landmarks.length > 0) {
        let hand = results.landmarks[0]; // We nemen de eerste gedetecteerde hand

        let numbersonly = [];
        for (let point of hand) {
            numbersonly.push(point.x, point.y, point.z);
        }

        // Controleer de lengte van de input
        console.log("Hand coordinates:", numbersonly);
        if (numbersonly.length === 63) {
            nn.classify(numbersonly, (results) => {
                console.log(results);
                console.log(`I think this pose is a ${results[0].label}`);
                console.log(results[0].label);
                console.log(`I'm ${(results[0].confidence.toFixed(2)) * 100}% sure`);

                // Update de label alleen als er een geldige voorspelling is
                if (results[0].label) {
                    poseLabel.innerText = `What the AI thinks is the celebration you replicated: ${results[0].label}`;
                    confidentScore.innerText = `Confidence: ${(results[0].confidence.toFixed(2)) * 100}%`;
                }

                // Controleer of het correct is
                if (
                    currentPlayer &&
                    results[0].label.toLowerCase() === currentPlayer.name.toLowerCase() &&
                    results[0].confidence > 0.5
                ) {
                    alert(`Juist! Dat is de ${currentPlayer.name} celebration! 🎉`);

                    // Nieuwe random speler laden
                    currentPlayer = players[Math.floor(Math.random() * players.length)];
                    footballerImg.src = currentPlayer.img;
                    playerImage.style.display = "block";
                    poseLabel.innerText = `What the AI thinks is the celebration you replicated: ${results[0].label}`;
                    confidentScore.innerText = `Confidence: ${(results[0].confidence.toFixed(2)) * 100}%`;
                } else {
                    alert(`Fout! Dat is de ${currentPlayer.name} celebration! ❌`);

                    // Nieuwe random speler laden
                    currentPlayer = players[Math.floor(Math.random() * players.length)];
                    footballerImg.src = currentPlayer.img;
                    playerImage.style.display = "block";
                    poseLabel.innerText = `What the AI thinks is the celebration you replicated: ${results[0].label}`;
                    confidentScore.innerText = `Confidence: ${(results[0].confidence.toFixed(2)) * 100}%`;
                }
            });
        } else {
            console.error("Invalid input length:", numbersonly.length);
        }
    } else {
        // Alleen het label leegmaken als er geen handen zijn gedetecteerd
        poseLabel.innerText = "No hands detected";
        confidentScore.innerText = "";
    }
}

/********************************************************************
// START THE APP
********************************************************************/

createNeuralNetwork();

setInterval(() => {
    logAndClassifyHands(); // Voer classificatie uit om de 2 seconden
}, 2000);

  