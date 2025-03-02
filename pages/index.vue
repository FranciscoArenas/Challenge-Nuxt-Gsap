<template>
  <div>
    <Slider
      :slides="slidesData"
      :loop="true"
      :autoplayDelay="false" />
  </div>
</template>

<script setup>
  import Slider from "~/components/Slider.vue";

  const slidesData = [
    {
      title: "Serene Mountainscape",
      media: {
        type: "image",
        src: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2",
        w: "1920",
        h: "1080"
      }
    },
    {
      title: "Abstract Fluid Art",
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4",
        w: "1080",
        h: "1920"
      }
    },
    {
      title: "Time Lapse City Lights",
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/12839875/12839875-uhd_2560_1440_25fps.mp4",
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
      title: "Nature Macro Shot",
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/12839896/12839896-uhd_2560_1440_25fps.mp4",
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
