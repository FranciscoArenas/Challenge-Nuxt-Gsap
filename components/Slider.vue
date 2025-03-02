<template>
  <div class="slider">
    <div
      class="slides"
      @click="handleSlideClick">
      <!-- Slide Anterior -->
      <div
        v-if="showPrevSlide"
        class="slide prev-slide">
        <div class="slide-image">
          <img
            v-if="duplicatedSlides[getPrevIndex()].media.type === 'image'"
            :src="duplicatedSlides[getPrevIndex()].media.src"
            :alt="duplicatedSlides[getPrevIndex()].title" />
          <video
            v-else
            :src="duplicatedSlides[getPrevIndex()].media.src"
            preload="auto"
            autoplay
            muted
            loop
            playsinline
            crossorigin="anonymous"></video>
        </div>
      </div>

      <!-- Slide Activo -->
      <div class="slide active-slide">
        <div class="slide-image">
          <img
            v-if="duplicatedSlides[currentSlideIndex]?.media?.type === 'image'"
            :src="duplicatedSlides[currentSlideIndex]?.media?.src"
            :alt="duplicatedSlides[currentSlideIndex]?.title" />
          <video
            v-else
            :src="duplicatedSlides[currentSlideIndex]?.media?.src"
            preload="auto"
            autoplay
            muted
            loop
            playsinline
            crossorigin="anonymous"></video>
        </div>
        <div class="slide-title">
          <h1>{{ duplicatedSlides[currentSlideIndex]?.title }}</h1>
        </div>
      </div>

      <!-- Slide Siguiente -->
      <div
        v-if="showNextSlide"
        class="slide next-slide">
        <div class="slide-image">
          <img
            v-if="duplicatedSlides[getNextIndex()].media.type === 'image'"
            :src="duplicatedSlides[getNextIndex()].media.src"
            :alt="duplicatedSlides[getNextIndex()].title" />
          <video
            v-else
            :src="duplicatedSlides[getNextIndex()].media.src"
            preload="auto"
            autoplay
            muted
            loop
            playsinline
            crossorigin="anonymous"></video>
        </div>
      </div>
    </div>

    <!-- Contador y Navegación -->
    <div class="slide-counter">
      {{ currentSlideIndex + 1 }} / {{ duplicatedSlides.length }}
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
</template>

<script setup>
  import { ref, onMounted, computed, watch, nextTick } from "vue";
  import { useNuxtApp } from "#app";

  const { $gsap: gsap, $CustomEase: CustomEase } = useNuxtApp();

  // Props (NO MODIFICAR)
  const props = defineProps({
    slides: { type: Array, required: true },
    loop: { type: Boolean, default: true },
    autoplayDelay: { type: Boolean, default: false }
  });

  const totalSlides = props.slides.length;
  let activeSlideIndex = 1;
  // Estado básico - Cambiamos los nombres para evitar conflictos
  const currentSlideIndex = ref(0); // antes era activeSlide
  const isAnimating = ref(false);

  // Duplicar slides si es necesario
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

  const slidePositions = {
    prev: { left: "15%", top: "50%", scale: 0.8, rotation: -90 },
    active: { left: "50%", top: "50%", scale: 1, rotation: 0 },
    next: { left: "85%", top: "50%", scale: 0.8, rotation: 90 }
  };

  const clipPath = {
    closed: {
      left: {
        start: "polygon(40% 30%, 70% 30%, 70% 70%, 40% 70%)",
        middle: "polygon(30% 20%, 80% 20%, 80% 80%, 30% 80%)",
        end: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      },
      right: {
        start: "polygon(40% 30%, 70% 30%, 70% 70%, 40% 70%)",
        middle: "polygon(20% 20%, 70% 20%, 70% 80%, 20% 80%)",
        end: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      }
    }
  };

  // Computed properties mejoradas - Actualizamos las referencias
  const currentSlideBackground = computed(() => {
    return duplicatedSlides.value[currentSlideIndex.value] || {};
  });
  const showPrevSlide = computed(() => {
    return props.loop || currentSlideIndex.value > 0;
  });

  const showNextSlide = computed(() => {
    return (
      props.loop || currentSlideIndex.value < duplicatedSlides.value.length - 1
    );
  });

  function getSlideIndex(increment) {
    return (
      ((activeSlideIndex + increment + duplicatedSlides.value.length - 1) %
        duplicatedSlides.value.length) +
      1
    );
  }

  function createSlide(content, className) {
    console.log(content);
    const slide = document.createElement("div");
    slide.className = `slide ${className}-slide`;
    console.log(className);
    slide.innerHTML = `
    <div class="slide-image">
      <img src="${content?.media?.src || ""}" alt="${content?.title || ""}" />
    </div>
  `;
    return slide;
  }

  // Funciones auxiliares actualizadas
  const getPrevIndex = () => {
    const prevIndex = currentSlideIndex.value - 1;
    if (prevIndex < 0) {
      return props.loop
        ? duplicatedSlides.value.length - 1
        : currentSlideIndex.value;
    }
    return prevIndex;
  };

  const getNextIndex = () => {
    const nextIndex = currentSlideIndex.value + 1;
    if (nextIndex >= duplicatedSlides.value.length) {
      return props.loop ? 0 : currentSlideIndex.value;
    }
    return nextIndex;
  };

  const transitionSlides = (direction) => {
    if (isAnimating.value) return;
    // Seleccionar los slides
    const activeSlide = document.querySelector(".slide.active-slide");
    const prevSlide = document.querySelector(".slide.prev-slide");
    const nextSlide = document.querySelector(".slide.next-slide");
    // Eliminar estilos en línea de los slides
    if (activeSlide) activeSlide.removeAttribute("style");
    if (prevSlide) prevSlide.removeAttribute("style");
    if (nextSlide) nextSlide.removeAttribute("style");
    console.log(activeSlide, prevSlide, nextSlide, "slide");
    isAnimating.value = true;

    // Calcular el nuevo índice
    const newIndex =
      direction === "next"
        ? (currentSlideIndex.value + 1) % duplicatedSlides.value.length
        : (currentSlideIndex.value - 1 + duplicatedSlides.value.length) %
          duplicatedSlides.value.length;

    // Verificar límites si no está en modo loop
    if (!props.loop) {
      if (
        (direction === "next" && newIndex === 0) ||
        (direction === "prev" && newIndex === duplicatedSlides.value.length - 1)
      ) {
        isAnimating.value = false;
        return;
      }
    }

    // Actualizar el índice SOLO UNA VEZ al inicio de la animación
    currentSlideIndex.value = newIndex;

    const mainTl = gsap.timeline({
      onComplete: () => {
        // Actualizar clases sin modificar el índice
        const outgoingSlide = document.querySelector(".slide.active-slide");
        const incomingSlide = document.querySelector(
          direction === "next" ? ".slide.next-slide" : ".slide.prev-slide"
        );
        const newSlide = document.querySelector(
          direction === "next" ? ".slide.prev-slide" : ".slide.next-slide"
        );

        if (outgoingSlide && incomingSlide && newSlide) {
          newSlide.classList.remove(
            direction === "next" ? "prev-slide" : "next-slide"
          );
          newSlide.classList.add(
            direction === "next" ? "next-slide" : "prev-slide"
          );
          outgoingSlide.classList.remove("active-slide");
          outgoingSlide.classList.add(
            direction === "next" ? "prev-slide" : "next-slide"
          );
          incomingSlide.classList.remove(
            direction === "next" ? "next-slide" : "prev-slide"
          );
          incomingSlide.classList.add("active-slide");
        }

        isAnimating.value = false;
      }
    });

    // Configuración inicial del slide entrante
    const incomingSlide = document.querySelector(
      direction === "next" ? ".slide.next-slide" : ".slide.prev-slide"
    );
    const newSlide = document.querySelector(
      direction === "next" ? ".slide.prev-slide" : ".slide.next-slide"
    );
    const outgoingSlide = document.querySelector(".slide.active-slide");

    if (incomingSlide && outgoingSlide && newSlide) {
      // Configuración del slide ACTIVO (asegurar que está en la posición inicial)
      gsap.set(outgoingSlide, {
        left: "50%",
        scale: 1,
        rotation: 0,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      });

      // Configuración del slide ENTRANTE (posición inicial fuera de la pantalla)
      gsap.set(incomingSlide, {
        left: direction === "next" ? "85%" : "15%",
        scale: 0.8,
        rotation: direction === "next" ? 90 : -90,
        opacity: 0.8,
        clipPath: clipPath.closed.start
      });

      // Configuración del slide NUEVO (el que va a reemplazar al anterior)
      gsap.set(newSlide, {
        left: direction === "next" ? "15%" : "85%",
        scale: 0.4,
        rotation: direction === "next" ? -90 : 90,
        opacity: 0
      });
    }

    // Animación mejorada para mantener los slides
    mainTl
      // Fase 1: Animar el slide activo hacia afuera
      .to(
        outgoingSlide,
        {
          left: direction === "next" ? "15%" : "85%",
          scale: 0.8,
          rotation: direction === "next" ? -90 : 90,
          duration: 1.5,
          ease: "power2.inOut",
          clipPath: "polygon(30% 30%, 60% 30%, 60% 70%, 30% 70%)"
        },
        0
      )
      // Fase 2: Animar el slide entrante al centro
      .to(
        incomingSlide,
        {
          left: "50%",
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: "power2.inOut",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        },
        0
      )
      // Fase 3: Reducir y eliminar el slide saliente, luego aparecer en la nueva posición
      .to(
        newSlide,
        {
          scale: 0.4,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            if (newSlide) {
              newSlide.style.display = "none";
              gsap.set(newSlide, {
                left: direction === "next" ? "85%" : "15%",
                scale: 0.4,

                rotation: direction === "next" ? 90 : -90,
                display: "block"
              });
              gsap.to(newSlide, {
                scale: 0.8,
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut"
              });
            }
          }
        },
        0
      );

    // Animar título
    const currentTitle = document.querySelector(".slide-title h1");
    if (currentTitle) {
      const yOffset = direction === "next" ? 60 : -60;
      const nextTitle =
        duplicatedSlides.value[
          direction === "next" ? getNextIndex() : getPrevIndex()
        ].title;

      mainTl
        .to(
          currentTitle,
          {
            y: -yOffset,

            duration: 0.5,
            ease: "power2.in"
          },
          0
        )
        .add(() => {
          currentTitle.innerHTML = nextTitle;
        })
        .fromTo(
          currentTitle,
          {
            y: yOffset,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          },
          ">-0.1"
        );
    }

    // Animar fondo
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
    console.log("next");
    if (!isAnimating.value) {
      transitionSlides("next");
    }
  };

  const prevSlide = () => {
    console.log("prev");
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

  onMounted(() => {
    if (!gsap || !CustomEase) {
      console.error("GSAP o CustomEase no están disponibles");
      return;
    }

    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
    );
    // Configurar posiciones iniciales
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide) => {
      if (slide.classList.contains("prev-slide")) {
        gsap.set(slide, {
          left: "15%",
          scale: 0.8,
          rotation: -90,
          clipPath: "polygon(30% 30%, 60% 30%, 60% 70%, 30% 70%)"
        });
      } else if (slide.classList.contains("next-slide")) {
        gsap.set(slide, {
          left: "85%",
          scale: 0.8,
          rotation: 90,
          clipPath: "polygon(30% 30%, 60% 30%, 60% 70%, 30% 70%)"
        });
      } else {
        gsap.set(slide, {
          left: "50%",
          scale: 1,
          rotation: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        });
      }
    });

    // Configurar autoplay si está habilitado
    if (props.loop && props.autoplayDelay > 0) {
      setInterval(() => {
        if (!isAnimating.value) {
          nextSlide();
        }
      }, props.autoplayDelay);
    }
  });
  // Delegación de eventos: manejador de click en el contenedor de slides
  const handleSlideClick = (event) => {
    // Busca si el elemento clickeado (o su ancestro) tiene la clase .prev-slide
    const prevEl = event.target.closest(".prev-slide");
    const nextEl = event.target.closest(".next-slide");
    if (prevEl) {
      prevSlide();
    } else if (nextEl) {
      nextSlide();
    }
  };
</script>

<style scoped lang="scss">
  @use "/assets/scss/slider.scss";
</style>
