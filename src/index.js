import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create CSS variable --vh (1% of the viewport height) to avoid mobile 100vh resize issues
// Set two viewport vars:
// --vh-initial: set once on load (and on orientationchange) to the *initial* viewport height
//   we use this for backgrounds that should remain stable when the soft keyboard opens
// --vh: updated on resize for UI elements that should track the visible viewport
function setVhVars({ updateInitial = false } = {}) {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  if (updateInitial || !document.documentElement.style.getPropertyValue('--vh-initial')) {
    // Set initial only once by default, or when explicitly requested (e.g., orientation change)
    document.documentElement.style.setProperty('--vh-initial', `${vh}px`);
  }
}

// initial set
setVhVars({ updateInitial: true });
window.addEventListener('resize', () => setVhVars());
// Update the initial value after an orientation change, because the initial natural
// viewport size may change permanently in that case.
window.addEventListener('orientationchange', () => setVhVars({ updateInitial: true }));

// If the Visual Viewport API is available, track its offset so we can compensate
// fixed-position backgrounds while the soft keyboard (or other UI) shifts the visual viewport.
if (window.visualViewport) {
  const setVvOffset = () => {
    document.documentElement.style.setProperty('--vv-offset', `${window.visualViewport.offsetTop || 0}px`);
  };
  setVvOffset();
  window.visualViewport.addEventListener('resize', setVvOffset);
  window.visualViewport.addEventListener('scroll', setVvOffset);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
