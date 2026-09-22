// ==========================================
// 1. BMC Helix SSO Integration Layer
// ==========================================
const ssoConfig = {
  authority: "https://ncpdwp-hulk-hsso.int.dsomlabs.helixops.ai/rsso/oauth2",
  client_id: "a9eb365f-b2ae-415e-b798-9aa9f34bc603",                 
  redirect_uri: "https://tetyana-kostash.github.io/PlayingWithHsso/callback.html", 
  response_type: "code",
  scope: "openid profile"
};

const userManager = new oidc.UserManager(ssoConfig);

// Automatically force login if no valid user session is present
userManager.getUser().then((user) => {
  if (!user || user.expired) {
    // Hide the page content immediately before redirecting to prevent visual flash
    document.body.style.display = 'none';
    userManager.signinRedirect();
  } else {
    console.log("Welcome back,", user.profile.name || user.profile.sub);
    // Initialize your page elements since the user is authenticated
    initializePage();
  }
}).catch((err) => {
  console.error("SSO Initialization error:", err);
  userManager.signinRedirect();
});

// ==========================================
// 2. Original Application Logic
// ==========================================
function initializePage() {
  const open = document.getElementById('open')
  const close = document.getElementById('close')
  const container = document.querySelector('.container')

  open.addEventListener('click', () => container.classList.add('show-nav'))

  close.addEventListener('click', () => container.classList.remove('show-nav'))
}
