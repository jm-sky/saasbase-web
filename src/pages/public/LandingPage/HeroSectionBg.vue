
<template>
  <div class="absolute inset-0 overflow-hidden h-full">
    <div class="absolute -top-40 -right-40 size-100 bg-gradient-to-br from-red-400/50 to-pink-500/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
    <div class="absolute -bottom-40 -left-40 size-100 bg-gradient-to-br from-blue-400/50 to-purple-500/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
    <div class="absolute top-40 left-40 size-100 bg-gradient-to-br from-primary-200/50 to-primary-300/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

    <div class="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-t from-background/0 to-background/100" />
    <div class="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-background/0 to-background/100" />
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
