// ==========================================
// 1. Original User Interface Logic
// ==========================================
function initializePage() {
  console.log("Initializing page layout assets...");
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const container = document.querySelector('.container');

  if (open && close && container) {
    open.addEventListener('click', () => container.classList.add('show-nav'));
    close.addEventListener('click', () => container.classList.remove('show-nav'));
    console.log("Navigation buttons initialized successfully.");
  } else {
    console.warn("Could not find navigation elements in DOM.");
  }
}

// ==========================================
// 2. Local AuthProxy SSO Integration Layer
// ==========================================
(function() {
  // Always initialize the visual layout first so the page structure works
  initializePage();

  console.log("Checking authentication status...");
  
  // Check if an active session token exists in browser session storage
  const hasToken = sessionStorage.getItem("rsso_access_token");

  if (!hasToken) {
    console.log("No valid session found. Redirecting via local AuthProxy...");
    
    // Hide body content to prevent visual flash before redirection
    document.body.style.display = 'none';

    // Target your local running proxy endpoint
    const authProxyServer = "http://localhost:3000/authproxy/oauth2/authorize"; 
    
    const clientId = "a9eb365f-b2ae-415e-b798-9aa9f34bc603"; // <-- REPLACE WITH YOUR REAL CLIENT ID FROM RSSO
    const redirectUri = "https://tetyana-kostash.github.io/PlayingWithHsso/callback.html";
    const state = Math.random().toString(36).substring(2); // Generate random state string for security

    // Construct the fully qualified authorization parameters endpoint URL string
    const authUrl = `${authProxyServer}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20profile&state=${state}`;

    // Execute direct native browser redirection to the proxy interface layout
    window.location.href = authUrl;
  } else {
    console.log("User authenticated successfully via local proxy.");
    
    // ====================================================================
    // DYNAMIC INJECTION: Load DWP Navigator Script ONLY after successful login
    // ====================================================================
    console.log("Loading DWP Employee Navigator script via local proxy...");
    
    const dwpScript = document.createElement('script');
    dwpScript.type = "text/javascript";
    dwpScript.id = "dwp-navigator__trigger-script";
    dwpScript.defer = true;
    
    // Routed through your local proxy at port 3000 to bypass CORS block rules
    dwpScript.src = "http://localhost:3000/dwpproxy/navigator/script/navigator-trigger.min.js";
    
    dwpScript.onload = function() {
        console.log("DWP Employee Navigator script loaded successfully!");
    };
    
    dwpScript.onerror = function() {
        console.error("Failed to load DWP Navigator script. Ensure local proxy and VPN are running.");
    };

    document.body.appendChild(dwpScript);
  }
})();
