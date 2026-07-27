<template>
  <div class="w-full md:w-xs flex flex-col gap-4">
    <div class="flex flex-col gap-4 border p-6 shadow-xl/30 bg-background">
      <slot />
    </div>
    <slot name="after" />
  </div>
</template>
