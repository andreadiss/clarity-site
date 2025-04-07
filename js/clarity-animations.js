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

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    function spawnNode() {
      if (nodes.length < maxNodes) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 300;
        nodes.push(new Node(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        ));
      }
    }

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

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.4) spawnNode();

      for (let i = nodes.length - 1; i >= 0; i--) {
        nodes[i].update();
        nodes[i].draw();
        if (nodes[i].life <= 0) nodes.splice(i, 1);
      }

      connectNodes();
      requestAnimationFrame(animate);
    }

    animate();
  }

  // === ASCII HERO ANIMATION ===
  const asciiOutput = document.getElementById('ascii-output');
  if (!asciiOutput) return;

  const imageFilenames = [
    "assets/F1_rb.png",
    "assets/F2_rb.png",
    "assets/F3_rb.png",
    "assets/F4_rb.png"
  ];

  const frameDelay = 8000;
  const asciiWidth = 100;
  const aspectRatio = 1.91;
  const animationSteps = 30;
  const animationDuration = 1000;
  const visibilityThreshold = 0.15;

  const charDarkness = [
  [" ", 0], ["", .0987], [".", .1166], ["'", .1225], ["-", .1387], [":", .203],
  [",", .2323], ["^", .237], ['"', .2416], ["!", .2568], ["~", .2668], ["_", .2767],
  ["\\", .2822], ["/", .2875], ["*", .3252], [";", .3385], ["r", .3573], ["v", .3616],
  ["+", .3628], ["?", .373], ["(", .3766], [")", .3804], ["|", .3852], ["L", .4037],
  ["=", .4049], ["c", .4167], ["{", .4187], ["y", .4491], ["}", .4522], ["Y", .4536],
  ["7", .4615], ["J", .4712], ["x", .4716], ["z", .4754], ["n", .4816], ["u", .4885],
  ["[", .4905], ["T", .4926], ["]", .4936], ["l", .4985], ["s", .514], ["i", .5233],
  ["f", .5252], ["F", .5382], ["C", .5404], ["1", .5444], ["t", .5473], ["h", .5534],
  ["V", .5603], ["o", .5603], ["w", .5641], ["k", .5731], ["3", .5767], ["Z", .5862],
  ["K", .5877], ["I", .5934], ["j", .5965], ["U", .6022], ["2", .611], ["A", .6271],
  ["P", .633], ["X", .6333], ["5", .635], ["e", .635], ["b", .6414], ["d", .6414],
  ["p", .6478], ["q", .6495], ["S", .6518], ["a", .6518], ["W", .6668], ["4", .6704],
  ["H", .6732], ["M", .6752], ["m", .6797], ["9", .6851], ["E", .6872], ["O", .6901],
  ["6", .6963], ["N", .7289], ["G", .7448], ["R", .7462], ["D", .7543], ["8", .7681],
  ["0", .7949], ["B", .7992], ["#", .8284], ["%", .8444], ["&", .8527], ["$", .8532],
  ["Q", .8969], ["g", .9483], ["@", 1]]; 

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

    const canvas = document.createElement("canvas");
    const height = ~~(img.height / img.width * width / ratio);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const data = ctx.getImageData(0, 0, width, height).data;
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
      const focus = direction === "in"
        ? step / total
        : 1 - step / total;

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

  async function startAsciiAnimation() {
    const frames = await Promise.all(imageFilenames.map(src => loadImageData(src)));

    let current = 0;
    animateFocus(frames[current], "in");

    setInterval(() => {
      const next = (current + 1) % frames.length;
      animateFocus(frames[current], "out", () => {
        animateFocus(frames[next], "in");
      });
      current = next;
    }, frameDelay);
  }

  startAsciiAnimation();
});
