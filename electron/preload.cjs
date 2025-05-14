// preload.cjs
const { contextBridge } = require('electron');

// This will run when the page begins to load
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script executing - creating logo splash screen');
  
  // Create a container for the logo
  const logoContainer = document.createElement('div');
  logoContainer.id = 'preload-logo-container';
  logoContainer.style.position = 'fixed';
  logoContainer.style.top = '0';
  logoContainer.style.left = '0';
  logoContainer.style.width = '100%';
  logoContainer.style.height = '100%';
  logoContainer.style.backgroundColor = '#ffffff'; // Or any color you prefer
  logoContainer.style.display = 'flex';
  logoContainer.style.justifyContent = 'center';
  logoContainer.style.alignItems = 'center';
  logoContainer.style.zIndex = '9999';
  
  // Create and add the logo image
  const logoImage = document.createElement('img');
  // logoImage.src = 'app://logo.png'; // This path will need to be adjusted
  logoImage.src = 'sentia.png'; 
  logoImage.alt = 'App Logo';
  logoImage.style.maxWidth = '200px'; // Adjust size as needed
  
  logoContainer.appendChild(logoImage);
  document.body.appendChild(logoContainer);
});

// Expose a function to remove the preloader to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  removePreloader: () => {
    const preloader = document.getElementById('preload-logo-container');
    if (preloader) {
      preloader.style.transition = 'opacity 0.5s ease-in-out';
      preloader.style.opacity = '0';
      
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }
  }
});