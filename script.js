document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);

  CustomEase.create(
    "hop",
    "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
  );

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
  // SLIDER DESKTOP (CODE EXISTANT PRÉSERVÉ)
  // ============================================

  const slider = document.querySelector(".slider");
  const sliderTitle = document.querySelector(".slider-title");
  const sliderCounter = document.querySelector(
    ".slider-counter p span:first-child"
  );
  const sliderItems = document.querySelector(".slider-items");
  const sliderPreview = document.querySelector(".slider-preview");

  const totalSlides = 7;
  let activeSlideIndex = 1;
  let isAnimating = false;

  const sliderContent = [
    { name: "Serene Space", img: "./asset/PR01.webp" },
    { name: "Gentle Horizon", img: "./asset/PR02.webp" },
    { name: "Quiet Flow", img: "./asset/PR03.webp" },
    { name: "Ethereal Light", img: "./asset/PR04.webp" },
    { name: "Calm Drift", img: "./asset/PR05.webp" },
    { name: "Subtle Balance", img: "./asset/PR06.webp" },
    { name: "Soft Whisper", img: "./asset/PR07.webp" },
  ];

  const clipPath = {
    closed: "polygon(25% 30%, 75% 30%, 75% 70%, 25% 70%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  };

  const slidePositions = {
    prev: { left: "15%", rotation: -90 },
    active: { left: "50%", rotation: 0 },
    next: { left: "85%", rotation: 90 },
  };

  function splitTextIntoSpans(element) {
    element.innerHTML = element.innerText
      .split("")
      .map((char) => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
      .join("");
  }

  function createAndAnimateTitle(content, direction) {
    const newTitle = document.createElement("h1");
    newTitle.innerText = content.name;
    sliderTitle.appendChild(newTitle);
    splitTextIntoSpans(newTitle);

    const yOffset = direction === "next" ? 60 : -60;
    gsap.set(newTitle.querySelectorAll("span"), { y: yOffset });
    gsap.to(newTitle.querySelectorAll("span"), {
      y: 0,
      duration: 1.25,
      stagger: 0.02,
      ease: "hop",
      delay: 0.25,
    });

    const currentTitle = sliderTitle.querySelector("h1:not(:last-child)");
    if (currentTitle) {
      gsap.to(currentTitle.querySelectorAll("span"), {
        y: -yOffset,
        duration: 1.25,
        stagger: 0.02,
        ease: "hop",
        delay: 0.25,
        onComplete: () => currentTitle.remove(),
      });
    }
  }

  function createSlide(content, className) {
    const slide = document.createElement("div");
    slide.className = `slide-container ${className}`;
    slide.innerHTML = `<div class="slide-img"><img src="${content.img}" alt="${content.name}"></div>`;
    return slide;
  }

  function getSlideIndex(increment) {
    return ((activeSlideIndex + increment - 1 + totalSlides) % totalSlides) + 1;
  }

  function updateCounterAndHighlight(index) {
    sliderCounter.textContent = index;
    sliderItems
      .querySelectorAll("p")
      .forEach((item, i) =>
        item.classList.toggle("activeitem", i === index - 1)
      );
  }

  function updatePreviewImage(content) {
    const newImage = document.createElement("img");
    newImage.src = content.img;
    newImage.alt = content.name;
    sliderPreview.appendChild(newImage);

    gsap.fromTo(
      newImage,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5,
        onComplete: () =>
          sliderPreview.querySelector("img:not(:last-child)")?.remove(),
      }
    );
  }

  function animateSlide(slide, props) {
    gsap.to(slide, { ...props, duration: 2, ease: "hop" });
    gsap.to(slide.querySelector(".slide-img"), {
      rotation: -props.rotation,
      duration: 2,
      ease: "hop",
    });
  }

  function transitionSlides(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const [outgoingPos, incomingPos] =
      direction === "next" ? ["prev", "next"] : ["next", "prev"];

    const outgoingSlide = slider.querySelector(`.${outgoingPos}`);
    const activeSlide = slider.querySelector(".active");
    const incomingSlide = slider.querySelector(`.${incomingPos}`);

    animateSlide(incomingSlide, {
      ...slidePositions.active,
      clipPath: clipPath.open,
    });

    animateSlide(activeSlide, {
      ...slidePositions[outgoingPos],
      clipPath: clipPath.closed,
    });

    gsap.to(outgoingSlide, { scale: 0, opacity: 0, duration: 2, ease: "hop" });

    const newSlideIndex = getSlideIndex(direction === "next" ? 2 : -2);
    const newSlide = createSlide(sliderContent[newSlideIndex - 1], incomingPos);
    slider.appendChild(newSlide);
    gsap.set(newSlide, {
      ...slidePositions[incomingPos],
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      clipPath: clipPath.closed,
    });

    gsap.to(newSlide, { scale: 1, opacity: 1, duration: 2, ease: "hop" });

    const newActiveIndex = getSlideIndex(direction === "next" ? 1 : -1);
    createAndAnimateTitle(sliderContent[newActiveIndex - 1], direction);
    updatePreviewImage(sliderContent[newActiveIndex - 1]);

    setTimeout(() => updateCounterAndHighlight(newActiveIndex), 1000);

    setTimeout(() => {
      outgoingSlide.remove();
      activeSlide.className = `slide-container ${outgoingPos}`;
      incomingSlide.className = "slide-container active";
      newSlide.className = `slide-container ${incomingPos}`;
      activeSlideIndex = newActiveIndex;
      isAnimating = false;
    }, 2000);
  }

  function goToSlide(targetIndex) {
    if (isAnimating || targetIndex === activeSlideIndex) return;
    isAnimating = true;

    const direction = targetIndex > activeSlideIndex ? "next" : "prev";

    // Récupérer toutes les slides actuelles
    const prevSlide = slider.querySelector('.prev');
    const activeSlide = slider.querySelector('.active');
    const nextSlide = slider.querySelector('.next');

    // Calculer les nouveaux indices
    const prevIndex = targetIndex === 1 ? totalSlides : targetIndex - 1;
    const nextIndex = targetIndex === totalSlides ? 1 : targetIndex + 1;

    // Phase 1: Fade to black - toutes les images
    const allSlides = [prevSlide, activeSlide, nextSlide].filter(s => s);
    allSlides.forEach(slide => {
      const img = slide.querySelector('.slide-img img');
      if (img) {
        gsap.to(img, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut"
        });
      }
    });

    // Fade out preview
    const previewImg = sliderPreview.querySelector('img');
    if (previewImg) {
      gsap.to(previewImg, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      });
    }

    // Animer le titre sortant
    const currentTitle = sliderTitle.querySelector('h1');
    if (currentTitle) {
      const titleExitY = direction === "next" ? -60 : 60;
      gsap.to(currentTitle.querySelectorAll('span'), {
        y: titleExitY,
        opacity: 0,
        duration: 0.5,
        stagger: 0.01,
        ease: "power2.inOut"
      });
    }

    // Phase 2: Changer les images et faire le fade in
    setTimeout(() => {
      // Changer les images
      if (prevSlide) {
        const prevImg = prevSlide.querySelector('.slide-img img');
        prevImg.src = sliderContent[prevIndex - 1].img;
        prevImg.alt = sliderContent[prevIndex - 1].name;
        gsap.to(prevImg, {
          opacity: 0.75,
          duration: 0.4,
          ease: "power2.inOut"
        });
      }

      const activeImg = activeSlide.querySelector('.slide-img img');
      activeImg.src = sliderContent[targetIndex - 1].img;
      activeImg.alt = sliderContent[targetIndex - 1].name;
      gsap.to(activeImg, {
        opacity: 0.75,
        duration: 0.4,
        ease: "power2.inOut"
      });

      if (nextSlide) {
        const nextImg = nextSlide.querySelector('.slide-img img');
        nextImg.src = sliderContent[nextIndex - 1].img;
        nextImg.alt = sliderContent[nextIndex - 1].name;
        gsap.to(nextImg, {
          opacity: 0.75,
          duration: 0.4,
          ease: "power2.inOut"
        });
      }

      // Changer la preview
      if (previewImg) {
        previewImg.src = sliderContent[targetIndex - 1].img;
        previewImg.alt = sliderContent[targetIndex - 1].name;
        gsap.to(previewImg, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut"
        });
      }

      // Animer le nouveau titre
      if (currentTitle) {
        currentTitle.innerText = sliderContent[targetIndex - 1].name;
        splitTextIntoSpans(currentTitle);

        const titleEntryY = direction === "next" ? 60 : -60;
        gsap.set(currentTitle.querySelectorAll("span"), { y: titleEntryY, opacity: 0 });
        gsap.to(currentTitle.querySelectorAll("span"), {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.inOut"
        });
      }

      // Mettre à jour le compteur
      updateCounterAndHighlight(targetIndex);
      activeSlideIndex = targetIndex;
    }, 400);

    // Débloquer l'animation
    setTimeout(() => {
      isAnimating = false;
    }, 900);
  }

  slider.addEventListener("click", (e) => {
    const clickedSlide = e.target.closest(".slide-container");
    if (clickedSlide && !isAnimating) {
      transitionSlides(
        clickedSlide.classList.contains("next") ? "next" : "prev"
      );
    }
  });

  Object.entries(slidePositions).forEach(([key, value]) => {
    gsap.set(`.slide-container.${key}`, {
      ...value,
      xPercent: -50,
      yPercent: -50,
      clipPath: key === "active" ? clipPath.open : clipPath.closed,
    });
    if (key !== "active") {
      gsap.set(`.slide-container.${key} .slide-img`, {
        rotation: -value.rotation,
      });
    }
  });

  const initialTitle = sliderTitle.querySelector("h1");
  splitTextIntoSpans(initialTitle);
  gsap.fromTo(
    initialTitle.querySelectorAll("span"),
    {
      y: 60,
    },
    {
      y: 0,
      duration: 1,
      stagger: 0.02,
      ease: "hop",
    }
  );

  updateCounterAndHighlight(activeSlideIndex);

  sliderItems.querySelectorAll("p").forEach((item, index) => {
    item.addEventListener("click", () => {
      if (index + 1 !== activeSlideIndex && !isAnimating) {
        goToSlide(index + 1);
      }
    });
  });
});
