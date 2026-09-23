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
  // Always initialize UI script layout components first
  initializePage();

  console.log("Checking authentication status...");
  
  // Check if an active session token exists in browser session storage
  const hasToken = sessionStorage.getItem("rsso_access_token");

  if (!hasToken) {
    console.log("No valid session found. Redirecting via local AuthProxy...");
    
    // Hide body content to prevent visual flash before redirection
    document.body.style.display = 'none';

    // Target endpoint via local proxy port 3000
    const authProxyServer = "http://localhost:3000/authproxy/authorize"; 
    
    const clientId = "a9eb365f-b2ae-415e-b798-9aa9f34bc603"; // Your verified client ID
    const redirectUri = "https://tetyana-kostash.github.io/PlayingWithHsso/callback.html";// Matching GitHub Pages callback URI
    const state = Math.random().toString(36).substring(2); 

    // ====================================================================
    // REALM ROUTING FIX: Matches your verified RSSO Client Realm settings
    // ====================================================================
    const clientRealm = "dwp-master1"; 

    // Construct authorization query parameters URL with the exact matching variable name
    const authUrl = `${authProxyServer}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid&state=${state}&realm=${encodeURIComponent(clientRealm)}`;

    // Forward browser directly to target endpoint location
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
    
    // Dynamically loaded via local proxy to bypass CORS restrictions completely
    dwpScript.src = "http://localhost:3000/dwpproxy/navigator/script/navigator-trigger.min.js";
    dwpScript.setAttribute("data-productName", "Employee Navigator");
    
    dwpScript.onload = function() {
        console.log("DWP Employee Navigator script loaded successfully!");
    };
    
    dwpScript.onerror = function() {
        console.error("Failed to load DWP Navigator script. Ensure local proxy and VPN are running.");
    };

    document.body.appendChild(dwpScript);
  }
})();
