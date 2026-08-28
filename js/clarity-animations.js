document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.getElementById('solutions');
  const title = section?.querySelector('.accent-title');
  const text = section?.querySelector('.accent-text');

  if (section && title && text && !reducedMotion) {
    const contentObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        title.style.animationPlayState = 'running';
        text.style.animationPlayState = 'running';
        contentObserver.disconnect();
      }
    }, { threshold: 0.4 });
    contentObserver.observe(section);
  }

  const canvas = document.getElementById('neural-center');
  if (!canvas || reducedMotion) return;

  const context = canvas.getContext('2d');
  const nodes = [];
  const maxNodes = 90;
  let animationFrame = null;
  let active = false;

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.offsetWidth * ratio);
    canvas.height = Math.round(canvas.offsetHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  class Node {
    constructor() {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(canvas.offsetWidth, 600) / 2;
      this.x = Math.cos(angle) * radius;
      this.y = Math.sin(angle) * radius;
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
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255,255,255,.7)';
      context.fill();
    }
  }

  const render = () => {
    if (!active || document.hidden) {
      animationFrame = null;
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
    if (nodes.length < maxNodes && Math.random() > 0.45) nodes.push(new Node());

    for (let index = nodes.length - 1; index >= 0; index -= 1) {
      const node = nodes[index];
      node.update();
      node.draw();
      if (node.life <= 0) nodes.splice(index, 1);
    }

    for (let first = 0; first < nodes.length; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        const dx = nodes[first].x - nodes[second].x;
        const dy = nodes[first].y - nodes[second].y;
        const distance = Math.hypot(dx, dy);
        if (distance >= 100) continue;
        context.beginPath();
        context.strokeStyle = `rgba(255,255,255,${1 - distance / 100})`;
        context.lineWidth = 0.5;
        context.moveTo(nodes[first].x, nodes[first].y);
        context.lineTo(nodes[second].x, nodes[second].y);
        context.stroke();
      }
    }

    context.restore();
    animationFrame = requestAnimationFrame(render);
  };

  const start = () => {
    active = true;
    if (!animationFrame) animationFrame = requestAnimationFrame(render);
  };

  const stop = () => {
    active = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });

  const canvasObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) start();
    else stop();
  }, { threshold: 0.1 });
  canvasObserver.observe(canvas);
});
