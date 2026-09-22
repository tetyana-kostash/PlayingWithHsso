(function() {
  const ssoConfig = {
    authority: "https://ncpdwp-hulk-hsso.int.dsomlabs.helixops.ai/rsso/oauth2", 
    client_id: "a9eb365f-b2ae-415e-b798-9aa9f34bc603",                 
    redirect_uri: "https://tetyana-kostash.github.io/PlayingWithHsso/callback.html", 
    response_type: "code",
    scope: "openid profile",

      metadata: {
    issuer: "https://ncpdwp-hulk-hsso.int.dsomlabs.helixops.ai/rsso/oauth2",
    authorization_endpoint: "https://helixops.ai",
    token_endpoint: "https://helixops.ai",
    userinfo_endpoint: "https://helixops.ai",
    jwks_uri: "https://helixops.ai"
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
}
