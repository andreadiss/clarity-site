document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.getElementById('primary-navigation');

  if (toggle && navigation) {
    const isItalian = document.documentElement.lang === 'it';
    const openLabel = isItalian ? 'Apri il menu' : 'Open menu';
    const closeLabel = isItalian ? 'Chiudi il menu' : 'Close menu';

    const closeMenu = () => {
      navigation.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', openLabel);
    };

    toggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? closeLabel : openLabel);
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.navbar') && navigation.classList.contains('is-open')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
    });
  }

  document.querySelectorAll('.contact-form').forEach((form) => {
    form.addEventListener('submit', () => {
      const submitButton = form.querySelector('button[type="submit"]');
      const buttonText = submitButton?.querySelector('.button-text');
      if (!submitButton) return;

      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      if (buttonText) {
        buttonText.textContent = document.documentElement.lang === 'it'
          ? 'Invio in corso…'
          : 'Sending…';
      }
    });
  });
});
