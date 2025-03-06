<template>
  <div>
    <div class="slider">
      <div class="slides">
        <!-- Renderizado Dinámico de los Slides -->
        <div
          v-for="(slide, index) in duplicatedSlides"
          :key="index"
          class="slide"
          :class="slideClasses.value[index]"
          :ref="(el) => (slideRefs[index] = el)">
          <div class="slide-image">
            <img
              v-if="slide.media.type === 'image'"
              :src="slide.media.src"
              :alt="slide.title" />
            <video
              v-else
              :src="slide.media.src"
              preload="auto"
              autoplay
              muted
              loop
              playsinline
              crossorigin="anonymous"></video>
          </div>
        </div>
      </div>

      <!-- Título -->
      <div class="slide-title">
        <h1>
          <span>{{ currentSlideBackground?.title }}</span>
        </h1>
      </div>
      <!-- Contador y Navegación -->
      <div class="slide-counter">
        <p>{{ currentSlideIndex + 1 }} / {{ duplicatedSlides.length }}</p>
      </div>
      <div class="slide-names">
        <p
          v-for="(slide, index) in duplicatedSlides"
          :key="index"
          :class="{ activeItem: index === currentSlideIndex }"
          @click="goToSlide(index)">
          {{ slide.title }}
        </p>
      </div>

      <!-- Fondo -->
      <div class="slider-bg">
        <img
          v-if="currentSlideBackground?.media?.type === 'image'"
          :src="currentSlideBackground?.media?.src"
          :alt="currentSlideBackground?.title" />
        <video
          v-else
          :src="currentSlideBackground?.media?.src"
          preload="auto"
          autoplay
          muted
          loop
          playsinline
          crossorigin="anonymous"></video>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch, nextTick } from "vue";
  import { useNuxtApp } from "#app";
  const slideRefs = ref([]);
  const { $gsap: gsap, $CustomEase: CustomEase } = useNuxtApp();

  const props = defineProps({
    slides: { type: Array, required: true },
    loop: { type: Boolean, default: true },
    autoplayDelay: { type: Boolean, default: false }
  });

  const currentSlideIndex = ref(0);
  const isAnimating = ref(false);

  const duplicatedSlides = computed(() => {
    if (props.slides.length >= 3) {
      return props.slides;
    } else {
      const slides = [...props.slides];
      while (slides.length < 3) {
        slides.push(...props.slides);
      }
      return slides.slice(0, 3);
    }
  });

  const clipPath = {
    closed: {
      left: {
        start: "polygon(30% 30%, 60% 30%, 60% 70%, 30% 70%)"
      },
      right: {
        start: "polygon(40% 30%, 70% 30%, 70% 70%, 40% 70%)"
      }
    }
  };

  const activeIndex = computed(() => currentSlideIndex.value);
  const prevIndex = computed(
    () =>
      (currentSlideIndex.value - 1 + duplicatedSlides.value.length) %
      duplicatedSlides.value.length
  );
  const nextIndex = computed(
    () => (currentSlideIndex.value + 1) % duplicatedSlides.value.length
  );
  let autoplayInterval = null;

  let slideClasses = (index) => {
    if (index === activeIndex.value) {
      return "slide active-slide";
    }
    if (index === prevIndex.value) {
      return "slide prev-slide";
    }
    if (index === nextIndex.value) {
      return "slide next-slide";
    }
    return "slide";
  };

  const currentSlideBackground = computed(() => {
    return duplicatedSlides.value[currentSlideIndex.value] || {};
  });

  async function createAndAnimateTitle(content, direction) {
    const container = document.querySelector(".slide-title");

    if (!container) {
      console.error("No se encontró el contenedor .slide-title");
      return;
    }

    const currentTitle = container.querySelector("h1");
    const currentContent = container.querySelectorAll("h1 span");

    const newTitle = document.createElement("h1");
    newTitle.innerHTML = content;
    newTitle.style.position = "absolute";
    newTitle.style.width = "100%";
    newTitle.style.color = "#fff";
    newTitle.style.margin = "15px 0";
    newTitle.style.display = "inline-block";

    container.appendChild(newTitle);

    const chars = splitTextIntoSpans(newTitle);
    await nextTick();

    gsap.fromTo(
      chars,
      {
        y: direction === "next" ? 50 : -50,
        opacity: 0,
        display: "inline-block",
        margin: 0
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(newTitle, {
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2,
            onComplete: () => {}
          });
        }
      }
    );
    gsap.fromTo(
      currentContent,
      {
        y: 0,
        opacity: 1,
        display: "inline-block",
        margin: 0
      },
      {
        transform: "translate(-50%, -50%) scale(0.4) opacity 1s ease",
        y: direction === "next" ? -50 : 50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          if (currentTitle) {
            container.removeChild(currentTitle);
          }
          gsap.to(currentTitle, {
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
            onComplete: () => {}
          });
        }
      }
    );
  }

  function splitTextIntoSpans(element) {
    const text = element.innerText;
    element.innerHTML = "";

    const spans = text.split("").map((char) => {
      const span = document.createElement("span");
      span.innerHTML = char === " " ? "&nbsp;&nbsp;" : char;
      element.appendChild(span);
      return span;
    });

    return spans;
  }

  const updateSlideClasses = () => {
    slideClasses.value = duplicatedSlides.value.map((_, index) => {
      if (index === activeIndex.value) return "active-slide";
      if (index === prevIndex.value) return "prev-slide";
      if (index === nextIndex.value) return "next-slide";
    });
  };

  const transitionSlides = (direction) => {
    if (isAnimating.value) return;

    const activeSlide = document.querySelector(".slide.active-slide");
    const prevSlide = document.querySelector(".slide.prev-slide");
    const nextSlide = document.querySelector(".slide.next-slide");

    if (activeSlide) activeSlide.removeAttribute("style");
    if (prevSlide) prevSlide.removeAttribute("style");
    if (nextSlide) nextSlide.removeAttribute("style");
    isAnimating.value = true;

    const newIndex =
      direction === "next"
        ? (currentSlideIndex.value + 1) % duplicatedSlides.value.length
        : (currentSlideIndex.value - 1 + duplicatedSlides.value.length) %
          duplicatedSlides.value.length;

    if (!props.loop) {
      if (
        (direction === "next" && newIndex === 0) ||
        (direction === "prev" && newIndex === duplicatedSlides.value.length - 1)
      ) {
        isAnimating.value = false;
        return;
      }
    }

    const mainTl = gsap
      .timeline({
        onComplete: () => {
          isAnimating.value = false;
        }
      })
      .add(() => {
        createAndAnimateTitle(
          duplicatedSlides.value[newIndex].title,
          direction
        );
      }, 0);

    const slides = document.querySelectorAll(".slide");
    const outgoingSlide = slides[currentSlideIndex.value];
    const incomingSlide =
      direction === "next"
        ? slides[(currentSlideIndex.value + 1) % slides.length]
        : slides[(currentSlideIndex.value - 1 + slides.length) % slides.length];
    const newSlide =
      direction === "next"
        ? slides[(currentSlideIndex.value + 2) % slides.length]
        : slides[(currentSlideIndex.value - 2) % slides.length];
    const hiddeSlide =
      direction === "next"
        ? slides[(currentSlideIndex.value - 1 + slides.length) % slides.length]
        : slides[(currentSlideIndex.value + 1) % slides.length];

    mainTl

      .to(
        outgoingSlide,
        {
          left: direction === "next" ? "15%" : "85%",
          scale: 0.8,
          rotation: direction === "next" ? -90 : 90,
          duration: 2.5,
          ease: "power2.inOut",
          clipPath:
            direction === "next"
              ? clipPath.closed.left.start
              : clipPath.closed.right.start
        },
        0
      )

      .to(
        incomingSlide,
        {
          rotation: direction === "next" ? 90 : -90,
          left: "50%",
          scale: 1,
          rotation: 0,
          duration: 2.5,
          ease: "power2.inOut",
          clipPath: "polygon(25% 0%, 75% 0%, 75% 100%, 25% 100%)"
        },
        0
      )

      .to(
        hiddeSlide,
        {
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.4) opacity 1s ease",
          duration: 2,
          scale: 0.4,
          clipPath:
            direction === "prev"
              ? clipPath.closed.right.start
              : clipPath.closed.left.start,
          ease: "power2.inOut"
        },
        0
      )
      .to(
        newSlide,
        {
          autoAlpha: 0,
          left: direction === "prev" ? "15%" : "85%",
          scale: 0.4,
          rotation: direction === "prev" ? -90 : 90,
          duration: 0,
          xPercent: -50,
          yPercent: -50,
          clipPath:
            direction === "prev"
              ? clipPath.closed.left.start
              : clipPath.closed.right.start
        },
        0
      )
      .to(
        newSlide,
        {
          autoAlpha: 1,
          duration: 2,
          ease: "power2.in",
          scale: 0.8,
          transform: "translate(-50%, -50%) scale(0.8) opacity 1s ease"
        },
        0
      )
      .to(
        ".slider-bg",
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",

          onStart: async () => {
            currentSlideIndex.value = newIndex;
            updateSlideClasses();
          }
        },
        1
      )
      .to(".slide", {
        clearProps: "all",
        duration: 1.5
      });

    const bg = document.querySelector(".slider-bg");
    if (bg) {
      mainTl
        .to(
          bg,
          {
            duration: 0.5,
            ease: "power2.inOut"
          },
          0
        )
        .to(
          bg,
          {
            opacity: 0.5,
            duration: 0.5,
            ease: "power2.out"
          },
          0.5
        );
    }
  };

  const nextSlide = () => {
    if (!isAnimating.value) {
      transitionSlides("next");
    }
  };

  const prevSlide = () => {
    if (!isAnimating.value) {
      transitionSlides("prev");
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating.value && index !== currentSlideIndex.value) {
      const direction = index > currentSlideIndex.value ? "next" : "prev";
      transitionSlides(direction);
    }
  };
  async function preloadVideos() {
    for (const slide of duplicatedSlides.value) {
      if (slide.media.type === "video") {
        const video = document.createElement("video");
        video.src = slide.media.src;
        video.preload = "auto";
        video.load();

        await new Promise((resolve) => {
          video.onloadeddata = resolve;
        });

        console.log(`Video ${slide.media.src} precargado.`);
      }
    }
    for (const slide of duplicatedSlides.value) {
      if (slide.media.type === "video") {
        const bgVideo = document.createElement("video");
        bgVideo.src = slide.media.src;
        bgVideo.preload = "auto";
        bgVideo.load();

        await new Promise((resolve) => {
          bgVideo.onloadeddata = resolve;
        });

        console.log(`Video de fondo ${slide.media.src} precargado.`);
      }
    }
  }

  onMounted(() => {
    if (!gsap || !CustomEase) {
      console.error("GSAP o CustomEase no están disponibles");
      return;
    }
    updateSlideClasses();
    createAndAnimateTitle(
      duplicatedSlides.value[currentSlideIndex.value].title
    );
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
    );
    document
      .querySelector(".slides")
      ?.addEventListener("click", handleSlideClick);

    if (props.loop && props.autoplayDelay > 0) {
      autoplayInterval = setInterval(() => {
        if (!isAnimating.value) {
          nextSlide();
        }
      }, 3000);
    }
    preloadVideos();
  });

  const handleSlideClick = (event) => {
    const prevEl = event.target.closest(".prev-slide");
    const nextEl = event.target.closest(".next-slide");
    if (prevEl) {
      prevSlide();
    } else if (nextEl) {
      nextSlide();
    }
  };
  watch(
    duplicatedSlides,
    () => {
      updateSlideClasses();
    },
    { deep: true, immediate: true }
  );
  onUnmounted(() => {
    if (autoplayInterval) clearInterval(autoplayInterval);
    document
      .querySelector(".slides")
      ?.removeEventListener("click", handleSlideClick);
    slideRefs.value = [];
  });
</script>

<style scoped lang="scss">
  @use "/assets/scss/slider.scss";
</style>
