document.addEventListener("DOMContentLoaded", () => {
  const images = [
    { id: "step-ascii-1", srcs: ["assets/u1.png", "assets/u2.png", "assets/u3.png"] },
    { id: "step-ascii-2", srcs: ["assets/a1.png", "assets/a2.png", "assets/a3.png"] },
    { id: "step-ascii-3", srcs: ["assets/step_3.png", "assets/step_3_alt.png", "assets/step_3_var3.png"] }
  ];

  const threshold = 0.15;

  const asciiMap = [
    [" ", 0], ["`", 0.0987], [".", 0.1166], ["'", 0.1225], ["-", 0.1387], [":", 0.203],
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

  function getAsciiChar(value, opacity, map) {
    if (value * opacity < threshold) return " ";
    const adjusted = (value - (1 - opacity)) / opacity;
    const clamped = Math.max(0, Math.min(adjusted, 1));
    const index = Math.floor(clamped * (map.length - 1));
    return map[index]?.[0] || " ";
  }

  function getColor(t) {
    const r = Math.round(30 + t * (255 - 30));
    const g = Math.round(64 + t * (255 - 64));
    const b = Math.round(175 + t * (255 - 175));
    return `rgb(${r},${g},${b})`;
  }

  async function getBrightnessMatrix(src, width = 60, aspectRatio = 1.91) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    await img.decode();

    const canvas = document.createElement("canvas");
    const height = Math.floor(img.height / img.width * width / aspectRatio);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const data = ctx.getImageData(0, 0, width, height).data;

    const matrix = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const idx = 4 * (y * width + x);
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3] / 255;
        row.push((1 - (r + g + b) / 765) * a);
      }
      matrix.push(row);
    }
    return matrix;
  }

  function createTransition(container, fromMatrix, toMatrix, duration = 1000, steps = 30) {
    let frame = 0;
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const progress = frame / steps;
        let output = "";

        for (let y = 0; y < fromMatrix.length; y++) {
          for (let x = 0; x < fromMatrix[0].length; x++) {
            const fromValue = fromMatrix[y][x];
            const toValue = toMatrix[y][x];
            const value = fromValue * (1 - progress) + toValue * progress;
            const char = getAsciiChar(value, 1, asciiMap); // Opacità fissa a 1 per transizione
            const color = getColor(value);
            output += `<span style="color:${color}">${char}</span>`;
          }
          output += "<br>";
        }

        container.innerHTML = output;

        if (++frame > steps) {
          clearInterval(interval);
          resolve();
        }
      }, duration / steps);
    });
  }

  function cycleImages(srcs, container) {
    let currentIndex = 0;
    let currentMatrix = null;

    async function cycle() {
      const nextIndex = (currentIndex + 1) % srcs.length;
      const nextSrc = srcs[nextIndex];

      const nextMatrix = await getBrightnessMatrix(nextSrc);

      if (currentMatrix) {
        await createTransition(container, currentMatrix, nextMatrix, 1000, 30);
      } else {
        let output = "";
        for (let y = 0; y < nextMatrix.length; y++) {
          for (let x = 0; x < nextMatrix[0].length; x++) {
            const value = nextMatrix[y][x];
            const char = getAsciiChar(value, 1, asciiMap);
            const color = getColor(value);
            output += `<span style="color:${color}">${char}</span>`;
          }
          output += "<br>";
        }
        container.innerHTML = output;
      }

      currentMatrix = nextMatrix;
      currentIndex = nextIndex;

      setTimeout(cycle, 2000); // Pausa di 2 secondi tra una transizione e l'altra
    }

    cycle();
  }

  images.forEach(({ id, srcs }) => {
    const el = document.getElementById(id);
    if (el) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cycleImages(srcs, el);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(el);
    }
  });
});