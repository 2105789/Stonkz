<template>
  <div class="app-container">
    <NuxtPage/>
  </div>
</template>

<style>
body { 
  background: #ffffff; 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  color: #000;
}

.app-container {
  min-height: 100vh;
  width: 100%;
}

html {
  scroll-behavior: smooth;
}

input, 
button, 
select, 
textarea {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s ease;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 300;
  letter-spacing: 0.05em;
}

/* Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
