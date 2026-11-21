const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const searchInput = document.getElementById('searchInput');
const jewelryCards = document.querySelectorAll('.jewelry-card');

const cartBtn = document.getElementById('cartBtn');
const cartCountEl = document.getElementById('cartCount');
const cart = [];

const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Mobile menu toggle
menuBtn?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

// Live search filter for the jewelry cards
searchInput?.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();

  jewelryCards.forEach((card) => {
    const title = (card.dataset.title || '').toLowerCase();
    const alt = (card.querySelector('img')?.alt || '').toLowerCase();
    const matches = title.includes(query) || alt.includes(query);
    card.classList.toggle('is-hidden', !matches);
  });

  if (query.length > 0) {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

// Modal helpers
function openModal(title, htmlContent) {
  modalTitle.textContent = title;
  modalBody.innerHTML = htmlContent;
  modalBackdrop.hidden = false;
}

function closeModal() {
  modalBackdrop.hidden = true;
}

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});

// Cart helpers
function updateCartBadge() {
  if (cartCountEl) {
    cartCountEl.textContent = String(cart.length);
  }
}

window.addToCart = function (title, price) {
  cart.push({ title, price });
  updateCartBadge();
  closeModal();
};

cartBtn?.addEventListener('click', () => {
  if (cart.length === 0) {
    openModal(
      'Shopping Cart',
      `<p style="font-size:13px; color:#573842;">Your cart is currently empty. Click any jewelry piece to add it to your bag.</p>`
    );
    return;
  }

  const itemsHtml = cart
    .map(
      (item, idx) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #cfaab3; font-size:13px;">
        <span>${idx + 1}. ${item.title}</span>
        <strong>${item.price}</strong>
      </div>
    `
    )
    .join('');

  openModal(
    `Shopping Cart (${cart.length})`,
    `
      <div>${itemsHtml}</div>
      <button type="button" class="btn-pill" style="width:100%; margin-top:16px;" onclick="alert('Order placed! Thank you for supporting Celestial Atelier by Criselle.'); cart.length = 0; updateCartBadge(); closeModal();">
        Checkout
      </button>
    `
  );
});

// Sign in / Sign up buttons
document.querySelectorAll('[data-auth]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isSignUp = btn.dataset.auth === 'signup';
    openModal(
      isSignUp ? 'Create an Account' : 'Sign In',
      `
        <form class="modal-form" onsubmit="event.preventDefault(); document.getElementById('modalBackdrop').hidden = true;">
          ${isSignUp ? '<input type="text" placeholder="Full Name" required />' : ''}
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" class="btn-pill" style="width:100%; margin-top:4px;">
            ${isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
      `
    );
  });
});

document.getElementById('accountBtn')?.addEventListener('click', () => {
  document.querySelector('[data-auth="signin"]')?.click();
});

// Jewelry card quick-view preview
jewelryCards.forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const title = card.dataset.title || 'Handcrafted Piece';
    const price = card.dataset.price || '';
    const safeTitle = title.replace(/'/g, "\\'");

    openModal(
      title,
      `
        <img src="${img.src}" alt="${img.alt}" style="width:100%; border-radius:4px; margin-bottom:12px; max-height:240px; object-fit:cover;" />
        <p style="font-size:13px; color:#573842; margin-bottom:10px;">
          Handcrafted with glass seed beads and durable tarnish-resistant findings.
        </p>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <strong style="font-size:16px;">${price}</strong>
          <button type="button" class="btn-pill" onclick="addToCart('${safeTitle}', '${price}')">
            Add to Bag
          </button>
        </div>
      `
    );
  });
});
// Swipeable Full Product Section Slider
(() => {
  const slider = document.getElementById("bannerSlider");
  const track = document.getElementById("bannerTrack");
  const slides = document.querySelectorAll(".showcase-slide");
  const dots = document.querySelectorAll(".banner-dot");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  if (!slider || !track || slides.length === 0) return;

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  // Pigilan ang ghost-image drag kapag nag-swipe sa ibabaw ng cards
  slider.querySelectorAll("img").forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  prevBtn?.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goToSlide(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.index));
    });
  });

  const startSwipe = (x) => {
    startX = x;
    isDragging = true;
  };

  const endSwipe = (x) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - x;
    if (diff > 50) goToSlide(currentIndex + 1);
    else if (diff < -50) goToSlide(currentIndex - 1);
  };

  slider.addEventListener("touchstart", (e) => startSwipe(e.touches[0].clientX), { passive: true });
  slider.addEventListener("touchend", (e) => endSwipe(e.changedTouches[0].clientX));
  slider.addEventListener("mousedown", (e) => startSwipe(e.clientX));
  slider.addEventListener("mouseup", (e) => endSwipe(e.clientX));
  slider.addEventListener("mouseleave", () => {
    isDragging = false;
  });
})();