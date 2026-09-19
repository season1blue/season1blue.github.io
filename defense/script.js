(() => {
  const total = 13;
  const stage = document.getElementById('stage');
  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');
  const fullscreenButton = document.getElementById('fullscreen');
  const currentPage = document.getElementById('currentPage');
  const progressBar = document.getElementById('progressBar');
  const slides = [...document.querySelectorAll('.deck-slide')];
  let index = Math.min(total - 1, Math.max(0, Number.parseInt(location.hash.slice(1), 10) - 1 || 0));
  let animating = false;
  let controlsTimer;
  let pointerStartX = null;

  const showControls = () => {
    stage.classList.add('controls-visible');
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => stage.classList.remove('controls-visible'), 2200);
  };

  const updateStatus = () => {
    currentPage.textContent = String(index + 1).padStart(2, '0');
    progressBar.style.width = `${((index + 1) / total) * 100}%`;
    previousButton.disabled = index === 0;
    nextButton.disabled = index === total - 1;
    document.title = `腾讯实习转正答辩 · ${index + 1}/${total}`;
    try { history.replaceState(null, '', `#${index + 1}`); } catch (_) { location.hash = String(index + 1); }
  };

  const goTo = (nextIndex) => {
    if (animating || nextIndex === index || nextIndex < 0 || nextIndex >= total) return;
    animating = true;
    const direction = nextIndex > index ? 'right' : 'left';
    slides[index].classList.remove('is-active');
    slides[index].classList.add(`leave-${direction === 'right' ? 'left' : 'right'}`);
    slides[nextIndex].classList.remove('is-hidden');
    slides[nextIndex].classList.add(`enter-${direction}`, 'is-active');
    index = nextIndex;
    updateStatus();
    showControls();
    setTimeout(() => {
      slides.forEach((slide, slideIndex) => {
        slide.classList.remove('leave-left', 'leave-right', 'enter-left', 'enter-right');
        if (slideIndex !== index) slide.classList.add('is-hidden');
      });
      animating = false;
    }, 350);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) { showControls(); }
  };

  previousButton.addEventListener('click', () => goTo(index - 1));
  nextButton.addEventListener('click', () => goTo(index + 1));
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(event.key)) { event.preventDefault(); goTo(index + 1); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) { event.preventDefault(); goTo(index - 1); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    else if (event.key === 'End') { event.preventDefault(); goTo(total - 1); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); }
    showControls();
  });
  stage.addEventListener('pointerdown', (event) => { pointerStartX = event.clientX; showControls(); });
  stage.addEventListener('pointerup', (event) => { if (pointerStartX === null) return; const distance = event.clientX - pointerStartX; pointerStartX = null; if (Math.abs(distance) >= 55) goTo(distance < 0 ? index + 1 : index - 1); });
  stage.addEventListener('pointermove', showControls);
  stage.addEventListener('mouseleave', () => stage.classList.remove('controls-visible'));
  stage.addEventListener('contextmenu', (event) => event.preventDefault());
  document.addEventListener('fullscreenchange', showControls);
  window.addEventListener('hashchange', () => {
    const target = Number.parseInt(location.hash.slice(1), 10) - 1;
    if (Number.isInteger(target) && target >= 0 && target < total && target !== index) goTo(target);
  });
  slides.forEach((slide, slideIndex) => {
    slide.classList.remove('is-active', 'is-hidden');
    if (slideIndex === index) slide.classList.add('is-active');
    else slide.classList.add('is-hidden');
  });
  updateStatus();
  showControls();
})();
