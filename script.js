const URL_PASTA = "./my_model/";

let model, webcam;
let labelContainer, statusDiv, resultH2, confidenceText;
let imageUpload, previewImage, previewPlaceholder, analyzeBtn;
let btnWebcam, btnUpload, webcamSection, uploadSection;

let isModelReady = false;
let currentMode = "webcam"; // "webcam" ou "upload"
let uploadedImage = null;

async function setup() {
    let canvas = createCanvas(640, 480);
    canvas.parent("canvas-holder");

    webcam = createCapture(VIDEO);
    webcam.size(640, 480);
    webcam.hide();

    // Elementos da interface
    statusDiv = document.getElementById("status-div");
    resultH2 = document.getElementById("final-result");
    labelContainer = document.getElementById("label-text");
    confidenceText = document.getElementById("confidence-text");

    imageUpload = document.getElementById("image-upload");
    previewImage = document.getElementById("preview-image");
    previewPlaceholder = document.getElementById("preview-placeholder");
    analyzeBtn = document.getElementById("analyze-btn");

    btnWebcam = document.getElementById("btn-webcam");
    btnUpload = document.getElementById("btn-upload");
    webcamSection = document.getElementById("webcam-section");
    uploadSection = document.getElementById("upload-section");

    // Eventos
    btnWebcam.addEventListener("click", activateWebcamMode);
    btnUpload.addEventListener("click", activateUploadMode);
    imageUpload.addEventListener("change", handleImageUpload);
    analyzeBtn.addEventListener("click", analyzeUploadedImage);

    labelContainer.innerText = "Carregando modelo...";
    // confidenceText.innerText = "Confiança: -";

    try {
        const modelURL = URL_PASTA + "model.json";
        const metadataURL = URL_PASTA + "metadata.json";

        console.log("Carregando modelo de:", modelURL);
        console.log("Carregando metadata de:", metadataURL);

        model = await tmImage.load(modelURL, metadataURL);

        isModelReady = true;
        labelContainer.innerText = "✅ Modelo Ativo";
        console.log("Sucesso: Modelo Teachable Machine carregado.");

        predictWebcam();
    } catch (e) {
        labelContainer.innerText = "❌ Erro ao carregar o modelo";
        // confidenceText.innerText = "Confiança: -";
        console.error("Erro técnico:", e);
    }
}

function draw() {
    background(0);

    if (currentMode === "webcam" && webcam) {
        push();
        translate(width, 0);
        scale(-1, 1);
        image(webcam, 0, 0, width, height);
        pop();
    } else {
        background(30);
    }
}

// =========================
// TROCA DE MODOS
// =========================
function activateWebcamMode() {
    currentMode = "webcam";

    webcamSection.classList.remove("hidden");
    uploadSection.classList.add("hidden");

    btnWebcam.classList.add("active");
    btnUpload.classList.remove("active");

    resetResult("📷 Webcam ativa. Aguardando detecção...");
}

function activateUploadMode() {
    currentMode = "upload";

    webcamSection.classList.add("hidden");
    uploadSection.classList.remove("hidden");

    btnUpload.classList.add("active");
    btnWebcam.classList.remove("active");

    resetResult("🖼️ Modo imagem ativa. Selecione uma imagem.");
}

// =========================
// UPLOAD DE IMAGEM
// =========================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        previewPlaceholder.style.display = "none";
        analyzeBtn.disabled = false;
        uploadedImage = previewImage;

        resetResult("Imagem carregada. Clique em 'Analisar Imagem'.");
    };

    reader.readAsDataURL(file);
}

async function analyzeUploadedImage() {
    if (!uploadedImage || !isModelReady || !model) return;

    labelContainer.innerText = "🔎 Analisando imagem...";
    confidenceText.innerText = "Confiança: processando...";

    try {
        const prediction = await model.predict(uploadedImage);
        processPrediction(prediction);
    } catch (err) {
        console.error("Erro ao analisar imagem:", err);
        labelContainer.innerText = "❌ Erro ao analisar imagem";
        confidenceText.innerText = "Confiança: -";
    }
}

// =========================
// WEBCAM EM TEMPO REAL
// =========================
async function predictWebcam() {
    if (!isModelReady || !model || !webcam) {
        window.requestAnimationFrame(predictWebcam);
        return;
    }

    if (currentMode === "webcam") {
        try {
            const prediction = await model.predict(webcam.elt);
            processPrediction(prediction);
        } catch (err) {
            console.error("Erro na predição da webcam:", err);
        }
    }

    window.requestAnimationFrame(predictWebcam);
}

// =========================
// PROCESSAMENTO DO RESULTADO
// =========================
function processPrediction(prediction) {
    let highestProb = 0;
    let bestClass = "";

    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestClass = prediction[i].className;
        }
    }

    let confidencePercent = (highestProb * 100).toFixed(2) + "%";
    confidenceText.innerText = "Confiança: " + confidencePercent;

    if (highestProb > 0.8) {
        let displayLabel = bestClass.replaceAll("_", " ").toUpperCase();
        resultH2.innerText = displayLabel;

        if (bestClass === "epi_completo") {
            statusDiv.className = "status-box seguro";
            labelContainer.innerText = "SITUAÇÃO: SEGURO";
        } else if (bestClass === "epi_incompleto") {
            statusDiv.className = "status-box alerta";
            labelContainer.innerText = "SITUAÇÃO: EPI INCOMPLETO";
        } else if (bestClass === "sem_epi") {
            statusDiv.className = "status-box perigo";
            labelContainer.innerText = "SITUAÇÃO: SEM EPI";
        } else if (bestClass === "fundo_imagens") {
            statusDiv.className = "status-box neutro";
            labelContainer.innerText = "SEM DETECÇÃO RELEVANTE";
        } else {
            statusDiv.className = "status-box neutro";
            labelContainer.innerText = "AGUARDANDO DETECÇÃO...";
        }
    } else {
        statusDiv.className = "status-box neutro";
        labelContainer.innerText = "AGUARDANDO DETECÇÃO...";
        resultH2.innerText = "-";
        confidenceText.innerText = "Confiança: " + confidencePercent;
    }
}

// =========================
// RESET DE RESULTADO
// =========================
function resetResult(message) {
    statusDiv.className = "status-box neutro";
    labelContainer.innerText = message;
    resultH2.innerText = "-";
    confidenceText.innerText = "Confiança: -";
}