document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);

  CustomEase.create(
    "hop",
    "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
  );

  // ============================================
  // BLOQUER LE SCROLL SUR MOBILE/TABLETTE
  // ============================================
  function preventScroll(e) {
    // Permettre le scroll seulement dans le menu mobile
    if (!e.target.closest('.mobile-menu-content')) {
      e.preventDefault();
    }
  }

  // Bloquer le scroll sur mobile/tablette uniquement
  if (window.innerWidth <= 1024) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Empêcher le scroll tactile
    document.addEventListener('touchmove', preventScroll, { passive: false });
  }

  // Réactiver sur redimensionnement
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.removeEventListener('touchmove', preventScroll);
    }
  });

  // ============================================
  // MENU BURGER & MOBILE MENU
  // ============================================
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');
  const projectsListItems = document.querySelectorAll('.projects-list li');
  const body = document.body;

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    burgerMenu.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';

    // Animer les items de la liste
    gsap.fromTo('.projects-list li',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.2
      }
    );

    gsap.fromTo('.mobile-contact-btn',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.5
      }
    );
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    burgerMenu.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  if (burgerMenu) {
    burgerMenu.addEventListener('click', openMobileMenu);
  }

  if (closeMenu) {
    closeMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  // Fermer le menu si on clique en dehors
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  // ============================================
  // CAROUSEL MOBILE
  // ============================================
  const mobileCarousel = document.querySelector('.mobile-carousel');
  const mobileCarouselTrack = document.querySelector('.mobile-carousel-track');
  const mobileSlides = document.querySelectorAll('.mobile-slide');
  const mobileCarouselTitle = document.querySelector('.mobile-carousel-title h1');
  const mobileCarouselCounter = document.querySelector('.mobile-carousel-counter p span:first-child');
  const mobilePreviewBg = document.querySelector('.mobile-preview-bg img');

  let currentMobileIndex = 0;
  let mobileIsAnimating = false;
  let mobileTouchStartX = 0;
  let mobileTouchEndX = 0;

  const mobileSlideContent = [
    { name: "Serene Space", img: "./asset/PR01.webp" },
    { name: "Gentle Horizon", img: "./asset/PR02.webp" },
    { name: "Quiet Flow", img: "./asset/PR03.webp" },
    { name: "Ethereal Light", img: "./asset/PR04.webp" },
    { name: "Calm Drift", img: "./asset/PR05.webp" },
    { name: "Subtle Balance", img: "./asset/PR06.webp" },
    { name: "Soft Whisper", img: "./asset/PR07.webp" },
  ];

  function updateMobileCarousel(newIndex) {
    if (mobileIsAnimating) return;
    mobileIsAnimating = true;

    const prevIndex = (newIndex - 1 + 7) % 7;
    const nextIndex = (newIndex + 1) % 7;

    // Mettre à jour toutes les slides
    mobileSlides.forEach((slide) => {
      const slideIndex = parseInt(slide.getAttribute('data-index'));
      slide.classList.remove('active', 'prev', 'next');

      if (slideIndex === newIndex) {
        slide.classList.add('active');
      } else if (slideIndex === prevIndex) {
        slide.classList.add('prev');
      } else if (slideIndex === nextIndex) {
        slide.classList.add('next');
      }
    });

    // Mettre à jour le titre avec animation
    if (mobileCarouselTitle) {
      gsap.to(mobileCarouselTitle, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          mobileCarouselTitle.textContent = mobileSlideContent[newIndex].name;
          gsap.to(mobileCarouselTitle, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }

    // Mettre à jour le background preview
    if (mobilePreviewBg) {
      gsap.to(mobilePreviewBg, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          mobilePreviewBg.src = mobileSlideContent[newIndex].img;
          gsap.to(mobilePreviewBg, {
            opacity: 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }

    // Mettre à jour le compteur
    if (mobileCarouselCounter) {
      mobileCarouselCounter.textContent = newIndex + 1;
    }

    // Mettre à jour l'item actif du menu mobile
    updateMobileMenuActiveItem(newIndex);

    currentMobileIndex = newIndex;

    setTimeout(() => {
      mobileIsAnimating = false;
    }, 500);
  }

  function updateMobileMenuActiveItem(index) {
    projectsListItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  function handleMobileSwipe() {
    const swipeDistance = mobileTouchStartX - mobileTouchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe vers la gauche - slide suivante
        const newIndex = (currentMobileIndex + 1) % 7;
        updateMobileCarousel(newIndex);
      } else {
        // Swipe vers la droite - slide précédente
        const newIndex = (currentMobileIndex - 1 + 7) % 7;
        updateMobileCarousel(newIndex);
      }
    }
  }

  // Initialiser le carousel mobile au chargement
  function initMobileCarousel() {
    if (!mobileCarouselTrack) return;

    // Positionner les slides initiales
    const prevIndex = 6; // Dernière slide
    const nextIndex = 1; // Deuxième slide

    mobileSlides.forEach((slide) => {
      const slideIndex = parseInt(slide.getAttribute('data-index'));

      if (slideIndex === 0) {
        slide.classList.add('active');
      } else if (slideIndex === prevIndex) {
        slide.classList.add('prev');
      } else if (slideIndex === nextIndex) {
        slide.classList.add('next');
      }
    });
  }

  // Event listeners pour le carousel mobile
  if (mobileCarouselTrack) {
    // Initialiser les slides au chargement
    initMobileCarousel();

    mobileCarouselTrack.addEventListener('touchstart', (e) => {
      mobileTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mobileCarouselTrack.addEventListener('touchend', (e) => {
      mobileTouchEndX = e.changedTouches[0].screenX;
      handleMobileSwipe();
    }, { passive: true });

    // Support clic sur les slides prev/next
    mobileSlides.forEach(slide => {
      slide.addEventListener('click', () => {
        const slideIndex = parseInt(slide.getAttribute('data-index'));
        if (slideIndex !== currentMobileIndex && !mobileIsAnimating) {
          updateMobileCarousel(slideIndex);
        }
      });
    });
  }

  // Fermer le menu en cliquant sur un projet
  projectsListItems.forEach((item) => {
    item.addEventListener('click', () => {
      const slideIndex = parseInt(item.getAttribute('data-index'));

      // Mettre à jour l'item actif
      projectsListItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');

      // Mettre à jour le carousel mobile si on est sur mobile/tablette
      if (mobileCarousel && window.innerWidth <= 1024) {
        updateMobileCarousel(slideIndex);
      }

      // Fermer le menu après un court délai
      setTimeout(() => {
        closeMobileMenu();
      }, 300);
    });
  });

  // ============================================
  // SLIDER DESKTOP (NOUVEAU SYSTÈME CAROUSEL)
  // ============================================

  const slider = document.querySelector(".slider");
  const desktopSlides = document.querySelectorAll(".slider .slide-container");
  const sliderCounter = document.querySelector(
    ".slider-counter p span:first-child"
  );
  const sliderItems = document.querySelector(".slider-items");
  const sliderPreview = document.querySelector(".slider-preview");

  const totalSlides = 7;
  let currentDesktopIndex = 0;
  let desktopIsAnimating = false;
  let desktopTouchStartX = 0;
  let desktopTouchEndX = 0;

  const sliderContent = [
    { name: "Serene Space", img: "./asset/PR01.webp" },
    { name: "Gentle Horizon", img: "./asset/PR02.webp" },
    { name: "Quiet Flow", img: "./asset/PR03.webp" },
    { name: "Ethereal Light", img: "./asset/PR04.webp" },
    { name: "Calm Drift", img: "./asset/PR05.webp" },
    { name: "Subtle Balance", img: "./asset/PR06.webp" },
    { name: "Soft Whisper", img: "./asset/PR07.webp" },
  ];

  function updateDesktopCarousel(newIndex) {
    if (desktopIsAnimating) return;
    desktopIsAnimating = true;

    const prevIndex = (newIndex - 1 + 7) % 7;
    const nextIndex = (newIndex + 1) % 7;

    // Mettre à jour toutes les slides
    desktopSlides.forEach((slide) => {
      const slideIndex = parseInt(slide.getAttribute('data-index'));
      slide.classList.remove('active', 'prev', 'next');

      // Supprimer l'ancien titre si présent
      const oldTitle = slide.querySelector('.slide-title');
      if (oldTitle) {
        oldTitle.remove();
      }

      if (slideIndex === newIndex) {
        slide.classList.add('active');
        // Ajouter le titre sur la slide active
        const titleDiv = document.createElement('div');
        titleDiv.className = 'slide-title';
        titleDiv.innerHTML = `
          <h1>${sliderContent[newIndex].name}</h1>
          <a href="#" class="slide-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        `;
        slide.appendChild(titleDiv);

        // Animer l'apparition du titre et du bouton
        gsap.fromTo(titleDiv.querySelector('h1'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.2 }
        );
        gsap.fromTo(titleDiv.querySelector('.slide-btn'),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.15 }
        );
      } else if (slideIndex === prevIndex) {
        slide.classList.add('prev');
      } else if (slideIndex === nextIndex) {
        slide.classList.add('next');
      }

      // Mettre à jour les images
      const img = slide.querySelector('.slide-img img');
      if (img) {
        img.src = sliderContent[slideIndex].img;
        img.alt = sliderContent[slideIndex].name;
      }
    });

    // Mettre à jour le background preview avec animation
    const previewImg = sliderPreview.querySelector('img');
    if (previewImg) {
      gsap.to(previewImg, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          previewImg.src = sliderContent[newIndex].img;
          gsap.to(previewImg, {
            opacity: 0.5,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }

    // Mettre à jour le compteur
    if (sliderCounter) {
      sliderCounter.textContent = newIndex + 1;
    }

    // Mettre à jour l'item actif
    sliderItems.querySelectorAll("p").forEach((item, i) => {
      item.classList.toggle("activeitem", i === newIndex);
    });

    currentDesktopIndex = newIndex;

    setTimeout(() => {
      desktopIsAnimating = false;
    }, 600);
  }

  function handleDesktopSwipe() {
    const swipeDistance = desktopTouchStartX - desktopTouchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe vers la gauche - slide suivante
        const newIndex = (currentDesktopIndex + 1) % 7;
        updateDesktopCarousel(newIndex);
      } else {
        // Swipe vers la droite - slide précédente
        const newIndex = (currentDesktopIndex - 1 + 7) % 7;
        updateDesktopCarousel(newIndex);
      }
    }
  }

  // Initialiser le carousel desktop au chargement
  function initDesktopCarousel() {
    if (!slider || window.innerWidth <= 1024) return;

    // Positionner les slides initiales
    const prevIndex = 6; // Dernière slide
    const nextIndex = 1; // Deuxième slide

    desktopSlides.forEach((slide) => {
      const slideIndex = parseInt(slide.getAttribute('data-index'));

      if (slideIndex === 0) {
        slide.classList.add('active');
      } else if (slideIndex === prevIndex) {
        slide.classList.add('prev');
      } else if (slideIndex === nextIndex) {
        slide.classList.add('next');
      }
    });
  }

  // Event listeners pour le carousel desktop
  if (slider && window.innerWidth > 1024) {
    // Initialiser les slides au chargement
    initDesktopCarousel();

    // Support tactile pour les écrans tactiles desktop (ex: Surface)
    slider.addEventListener('touchstart', (e) => {
      desktopTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      desktopTouchEndX = e.changedTouches[0].screenX;
      handleDesktopSwipe();
    }, { passive: true });

    // Support souris pour desktop
    let mouseStartX = 0;
    let isMouseDown = false;

    slider.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
    });

    slider.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const mouseEndX = e.clientX;
      const swipeDistance = mouseStartX - mouseEndX;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          const newIndex = (currentDesktopIndex + 1) % 7;
          updateDesktopCarousel(newIndex);
        } else {
          const newIndex = (currentDesktopIndex - 1 + 7) % 7;
          updateDesktopCarousel(newIndex);
        }
      }
    });

    slider.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });

    // Support clic sur les slides prev/next
    desktopSlides.forEach(slide => {
      slide.addEventListener('click', (e) => {
        // Éviter de déclencher si c'est un swipe
        if (Math.abs(desktopTouchStartX - desktopTouchEndX) > 10) return;

        const slideIndex = parseInt(slide.getAttribute('data-index'));
        if (slideIndex !== currentDesktopIndex && !desktopIsAnimating) {
          updateDesktopCarousel(slideIndex);
        }
      });
    });

    // Support navigation par liste
    sliderItems.querySelectorAll("p").forEach((item, index) => {
      item.addEventListener("click", () => {
        if (index !== currentDesktopIndex && !desktopIsAnimating) {
          updateDesktopCarousel(index);
        }
      });
    });
  }
});
