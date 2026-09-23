(function() {
  const ssoConfig = {
    authority: "https://ncpdwp-hulk-hsso.int.dsomlabs.helixops.ai",
    client_id: "a9eb365f-b2ae-415e-b798-9aa9f34bc603",                 
    redirect_uri: "https://tetyana-kostash.github.io/PlayingWithHsso/callback.html", 
    response_type: "code",
    scope: "openid profile",

    metadata: {
      issuer: "https://helixops.ai",
      authorization_endpoint: "https://helixops.ai/authorize",
      token_endpoint: "https://helixops.ai/token",
      userinfo_endpoint: "https://helixops.ai/userinfo",
      jwks_uri: "https://helixops.ai/jwks"
  }
  };

  // Capital "O" in Oidc is strictly required for CDN global builds
  if (typeof oidc === 'undefined') {
    console.error("Critical Error: The OIDC library failed to load from the CDN.");
    return;
  }

  const userManager = new oidc.UserManager(ssoConfig);

  console.log("Checking authentication status...");

  userManager.getUser().then((user) => {
    if (!user || user.expired) {
      console.log("No valid session found. Redirecting to BMC Helix SSO...");
      document.body.style.display = 'none'; // Prevent viewing content layout
      userManager.signinRedirect();
    } else {
      console.log("Welcome back,", user.profile.name || user.profile.sub);
      initializePage();
    }
  }).catch((err) => {
    console.error("SSO verification triggered an error, forcing login sequence:", err);
    userManager.signinRedirect();
  });
})();

// ==========================================
// 2. Your Original Application Logic
// ==========================================
function initializePage() {
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const container = document.querySelector('.container');

  if(open && close && container) {
    open.addEventListener('click', () => container.classList.add('show-nav'));
    close.addEventListener('click', () => container.classList.remove('show-nav'));
  }

  // Inject the DWP Employee Navigator script ONLY after the user passes SSO login verification
  console.log("Loading Employee Navigator Chat Panel Component...");
  const dwpScript = document.createElement('script');
  dwpScript.defer = true;
  dwpScript.id = "dwp-navigator__trigger-script";
  dwpScript.src = "https://ncpdwp-master1-dwp.int.dsomlabs.helixops.ai/dwp/navigator/script/navigator-trigger.min.js";
  
  // Optional parameters required by BMC Digital Workplace:
  dwpScript.setAttribute("data-productName", "Employee Navigator");
  
  dwpScript.onerror = function() {
    console.warn("DWP Chat Widget could not be reached. Ensure you are connected to the internal company VPN network environment.");
  };

  document.body.appendChild(dwpScript);
}
