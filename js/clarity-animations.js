document.addEventListener('DOMContentLoaded', () => {
  // --- Accent Section Animation ---
  const section = document.getElementById('solutions');
  const title = section?.querySelector('.accent-title');
  const text = section?.querySelector('.accent-text');

  if (section && title && text) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          title.style.animationPlayState = 'running';
          text.style.animationPlayState = 'running';
          observer.unobserve(section); // Optional: stop observing after activation
        }
      });
    }, {
      threshold: 0.4 // Animation triggers when 40% of the section is visible
    });

    observer.observe(section);
  }

// --- Neural Network Animation ---
const canvas = document.getElementById('neural-center');
if (canvas) {
  const ctx = canvas.getContext('2d');

  // Funzione per sincronizzare la dimensione interna del canvas con lo stile CSS
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    // Imposta le dimensioni interne basate sulle dimensioni CSS (offsetWidth/offsetHeight)
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    // Imposta il transform del contesto per gestire correttamente il scaling
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Definiamo la classe Node per rappresentare un punto della rete
  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 2 + 1;
      this.life = 180 + Math.random() * 120;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.2;
      this.vx *= 0.96;
      this.vy *= 0.96;
      if (Math.random() > 0.9) {
        this.vx += (Math.random() - 0.5) * 0.3;
        this.vy += (Math.random() - 0.5) * 0.3;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
    }
  }

  let nodes = [];
  const maxNodes = 150;

  // Funzione per generare un nuovo nodo relativo al centro (0,0)
  function spawnNode() {
    if (nodes.length < maxNodes) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 300; // Modifica questo valore in base all'area desiderata
      // Poiché stiamo disegnando con l'origine traslata, spawniamo il nodo con coordinate relative al centro
      nodes.push(new Node(Math.cos(angle) * radius, Math.sin(angle) * radius));
    }
  }

  // Funzione per disegnare le connessioni tra nodi
  function connectNodes() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Funzione di animazione
  function animate() {
    // Pulisce l'intero canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    // Trasla il contesto in modo che l'origine sia al centro VISIBILE del canvas.
    // Si usa canvas.offsetWidth e canvas.offsetHeight (le dimensioni in CSS pixels)
    ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);

    // Ogni frame genera nuovi nodi (con probabilità, se non si è raggiunto il numero massimo)
    if (Math.random() > 0.4) spawnNode();

    // Aggiorna e disegna i nodi esistenti
    for (let i = nodes.length - 1; i >= 0; i--) {
      nodes[i].update();
      nodes[i].draw();
      if (nodes[i].life <= 0) nodes.splice(i, 1);
    }

    // Disegna le connessioni tra i nodi
    connectNodes();
    ctx.restore();
    
    requestAnimationFrame(animate);
  }

  // Avvia l'animazione
  animate();
}

// === ASCII HERO ANIMATION ===
let current = 0;
let frames = [];
let frameIntervalId = null;
let cancelCurrentAnimation = false; // Flag per annullare l'animazione corrente

// asciiWidth dinamico, inizialmente impostato
let asciiWidth = 100;

const asciiOutput = document.getElementById('ascii-output');
if (!asciiOutput) return;

const imageFilenames = [
  "assets/F1_rb.png",
  "assets/F2_rb.png",
  "assets/F3_rb.png",
  "assets/F4_rb.png"
];

const frameDelay = 8000;
const aspectRatio = 1.91;
const animationSteps = 30;
const animationDuration = 1000;
const visibilityThreshold = 0.15;

const charDarkness = [
  [" ", 0], ["", 0.0987], [".", 0.1166], ["'", 0.1225], ["-", 0.1387], [":", 0.203],
  [",", 0.2323], ["^", 0.237], ['"', 0.2416], ["!", 0.2568], ["~", 0.2668], ["_", 0.2767],
  ["\\", 0.2822], ["/", 0.2875], ["*", 0.3252], [";", 0.3385], ["r", 0.3573], ["v", 0.3616],
  ["+", 0.3628], ["?", 0.373], ["(", 0.3766], [")", 0.3804], ["|", 0.3852], ["L", 0.4037],
  ["=", 0.4049], ["c", 0.4167], ["{", 0.4187], ["y", 0.4491], ["}", 0.4522], ["Y", 0.4536],
  ["7", 0.4615], ["J", 0.4712], ["x", 0.4716], ["z", 0.4754], ["n", 0.4816], ["u", 0.4885],
  ["[", 0.4905], ["T", 0.4926], ["]", 0.4936], ["l", 0.4985], ["s", 0.514], ["i", 0.5233],
  ["f", 0.5252], ["F", 0.5382], ["C", 0.5404], ["1", 0.5444], ["t", 0.5473], ["h", 0.5534],
  ["V", 0.5603], ["o", 0.5603], ["w", 0.5641], ["k", 0.5731], ["3", 0.5767], ["Z", 0.5862],
  ["K", 0.5877], ["I", 0.5934], ["j", 0.5965], ["U", 0.6022], ["2", 0.611], ["A", 0.6271],
  ["P", 0.633], ["X", 0.6333], ["5", 0.635], ["e", 0.635], ["b", 0.6414], ["d", 0.6414],
  ["p", 0.6478], ["q", 0.6495], ["S", 0.6518], ["a", 0.6518], ["W", 0.6668], ["4", 0.6704],
  ["H", 0.6732], ["M", 0.6752], ["m", 0.6797], ["9", 0.6851], ["E", 0.6872], ["O", 0.6901],
  ["6", 0.6963], ["N", 0.7289], ["G", 0.7448], ["R", 0.7462], ["D", 0.7543], ["8", 0.7681],
  ["0", 0.7949], ["B", 0.7992], ["#", 0.8284], ["%", 0.8444], ["&", 0.8527], ["$", 0.8532],
  ["Q", 0.8969], ["g", 0.9483], ["@", 1]
];

function getCharFromValue(value, focus) {
  if (value * focus < visibilityThreshold) return " ";
  const scaled = (value - (1 - focus)) / focus;
  const clamped = Math.max(0, Math.min(scaled, 1));
  const index = Math.floor(clamped * (charDarkness.length - 1));
  return charDarkness[index]?.[0] || " ";
}

function getColorFromValue(v) {
  const r = Math.round(30 + v * (255 - 30));
  const g = Math.round(64 + v * (255 - 64));
  const b = Math.round(175 + v * (255 - 175));
  return `rgb(${r},${g},${b})`;
}

async function loadImageData(src, width = asciiWidth, ratio = aspectRatio) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;
  await img.decode();

  const tempCanvas = document.createElement("canvas");
  const height = Math.floor(img.height / img.width * width / ratio);
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(img, 0, 0, width, height);

  const data = tempCtx.getImageData(0, 0, width, height).data;
  const matrix = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3] / 255;
      const brightness = 1 - (r + g + b) / 765;
      row.push(brightness * a);
    }
    matrix.push(row);
  }
  return matrix;
}

function animateFocus(matrix, direction = "in", onComplete) {
  let step = 0;
  const total = animationSteps;
  const interval = setInterval(() => {
    if (cancelCurrentAnimation) {
      clearInterval(interval);
      return;
    }
    const focus = direction === "in" ? step / total : 1 - step / total;
    let html = "";
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        const value = matrix[y][x];
        if (value * focus < visibilityThreshold) {
          html += `<span>&nbsp;</span>`;
          continue;
        }
        const char = getCharFromValue(value, focus);
        const color = getColorFromValue(value * focus);
        html += `<span style="color:${color}">${char}</span>`;
      }
      html += "<br>";
    }
    asciiOutput.innerHTML = html;
    step++;
    if (step > total) {
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, animationDuration / total);
}

async function initAsciiAnimation() {
  cancelCurrentAnimation = false;
  // Ricarica i frame in base al valore corrente di asciiWidth
  frames = await Promise.all(
    imageFilenames.map(src => loadImageData(src, asciiWidth, aspectRatio))
  );
  current = 0;
  animateFocus(frames[current], "in");
  frameIntervalId = setInterval(() => {
    if (document.hidden) return;
    const next = (current + 1) % frames.length;
    animateFocus(frames[current], "out", () => {
      animateFocus(frames[next], "in");
    });
    current = next;
  }, frameDelay);
}

function restartAsciiAnimation() {
  cancelCurrentAnimation = true;
  if (frameIntervalId) {
    clearInterval(frameIntervalId);
    frameIntervalId = null;
  }
  initAsciiAnimation();
}

// Funzione per aggiornare asciiWidth in base alla larghezza visiva del contenitore
function updateAsciiWidth() {
  const containerWidth = asciiOutput.clientWidth;
  asciiWidth = Math.max(25, Math.min(150, Math.floor(containerWidth / 10)));
  console.log("Nuovo asciiWidth:", asciiWidth);
}


// Gestione del resize (con debounce) e dell'orientation change
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateAsciiWidth();
    restartAsciiAnimation();
  }, 300);
});
window.addEventListener("orientationchange", () => {
  // Attendi qualche istante prima di aggiornare
  setTimeout(() => {
    updateAsciiWidth();
    restartAsciiAnimation();
  }, 500);
});

// Gestione della visibilità della pagina: pausa/ripresa
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (frameIntervalId) {
      clearInterval(frameIntervalId);
      frameIntervalId = null;
    }
  } else {
    restartAsciiAnimation();
  }
});

// Avvia l'animazione iniziale
initAsciiAnimation();
});
