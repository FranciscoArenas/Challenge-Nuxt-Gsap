<template>
  <div>
    <Slider
      :slides="slidesData"
      :loop="true"
      :autoplayDelay="true" />
  </div>
</template>

<script setup>
  import Slider from "~/components/Slider.vue";

  const slidesData = [
    {
      title: "Serene space",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2",
        w: "1920",
        h: "1080"
      }
    },
    {
      title: "Gentle Horizon",
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4",
        w: "1080",
        h: "1920"
      }
    },
    {
      title: "Quiet Flow",
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/6959665/6959665-hd_1920_1080_25fps.mp4",
        w: "1920",
        h: "1080"
      }
    },
    {
      title: "Minimalist Geometry",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2",
        w: "1920",
        h: "1080"
      }
    },
    {
      title: "Vídeo de Esra Afşar",
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/12839896/12839896-uhd_2560_1440_25fps.mp4",
        w: "1080",
        h: "1920"
      }
    },
    {
      title: "Berlin, BE, Germany",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/10894216/pexels-photo-10894216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        w: "1080",
        h: "1920"
      }
    },
    {
      title: "damla selen demir",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/30818073/pexels-photo-30818073/free-photo-of-una-experiencia-gastronomica-elegante-con-queso-burrata.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        w: "1080",
        h: "1920"
      }
    },
    {
      title: "Foto de Tiana de Pexels",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/3312232/pexels-photo-3312232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        w: "1080",
        h: "1920"
      }
    },
    {
      title: "Persona sentada",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/20300824/pexels-photo-20300824/free-photo-of-ciudad-hombre-edificio-pared.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        w: "1080",
        h: "1920"
      }
    }
  ];
</script>
<style>
  body {
    margin: 0;
    background-color: #111;
  }
</style>
