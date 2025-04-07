document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.offer-item-image');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'image-fade-in');
        observer.unobserve(entry.target); // attiva solo una volta
      }
    });
  }, { threshold: 0.4 });

  images.forEach(img => observer.observe(img));
});