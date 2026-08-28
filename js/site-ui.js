document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.getElementById('primary-navigation');

  if (toggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
    });
  }
});
