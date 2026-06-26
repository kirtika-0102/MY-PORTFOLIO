// =========================================
// script.js — Vanilla JS for standalone portfolio
// =========================================

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* ---- Active nav link highlight ---- */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const observerOptions = { rootMargin: "-40% 0px -40% 0px" };

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navAnchors.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${entry.target.id}`) {
          a.classList.add("active");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((sec) => sectionObserver.observe(sec));

/* ---- Hamburger mobile menu ---- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
let menuOpen = false;

hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    navLinks.style.display = "flex";
    navLinks.style.position = "fixed";
    navLinks.style.top = "0";
    navLinks.style.left = "0";
    navLinks.style.right = "0";
    navLinks.style.bottom = "0";
    navLinks.style.flexDirection = "column";
    navLinks.style.justifyContent = "center";
    navLinks.style.alignItems = "center";
    navLinks.style.background = "rgba(10,10,10,0.98)";
    navLinks.style.gap = "2.5rem";
    navLinks.style.zIndex = "999";
    hamburger.children[0].style.transform = "rotate(45deg) translate(5px,5px)";
    hamburger.children[1].style.opacity = "0";
    hamburger.children[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
  } else {
    closeMenu();
  }
});

function closeMenu() {
  menuOpen = false;
  navLinks.removeAttribute("style");
  hamburger.children[0].style.transform = "";
  hamburger.children[1].style.opacity = "";
  hamburger.children[2].style.transform = "";
}

// Close on link click
navAnchors.forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 700) closeMenu();
  });
});

/* ---- Scroll-triggered animations ---- */
const animateElements = document.querySelectorAll(
  ".edu-card, .project-card, .cert-card, .skills-category, .contact-item"
);

const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        animObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

animateElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  animObserver.observe(el);
});

/* ---- Contact form ---- */
const formSubmit = document.getElementById("formSubmit");
formSubmit.addEventListener("click", () => {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    formSubmit.textContent = "Please fill all fields!";
    setTimeout(() => (formSubmit.textContent = "Send Message →"), 2000);
    return;
  }

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:kirtikamittal0102@gmail.com?subject=${subject}&body=${body}`;

  document.getElementById("form-success").style.display = "block";
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactMessage").value = "";
});

/* ---- Smooth scroll polyfill for older browsers ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ---- Projects horizontal hover stack with ordered backtrack ---- */
(function () {
  const stack = document.querySelector(".projects-stack-h");
  if (!stack) return;

  const cards = Array.from(stack.querySelectorAll(".psh-card"));
  const total = cards.length;

  // Position config per card index when it is the "active front" card
  // Each entry = [card0_x, card1_x, card2_x, card0_rot, card1_rot, card2_rot]
 const positions = {
  // Card 0 is front — cards 1,2,3 fan out to the right
  0: { x: [-160,  140,  400,  640], r: [0,   4,   6,   8],  o: [1,    0.85, 0.65, 0.45] },
  // Card 1 is front — card 0 pushed left, cards 2,3 peek right
  1: { x: [-420, -160,  140,  400], r: [-4,  0,   4,   6],  o: [0.75, 1,    0.85, 0.65] },
  // Card 2 is front — cards 0,1 pushed left, card 3 peeks right
  2: { x: [-640, -420, -160,  140], r: [-6, -4,   0,   4],  o: [0.55, 0.75, 1,    0.85] },
  // Card 3 is front — all others pushed off to the left
  3: { x: [-860, -640, -420, -160], r: [-8, -6,  -4,   0],  o: [0.45, 0.55, 0.75, 1   ] },
};

  let currentFront = 0;   // which card is currently in front
  let targetFront  = 0;   // which card we are animating toward
  let isAnimating  = false;

  // Apply a position state instantly or via transition
  function applyState(frontIndex) {
    const pos = positions[frontIndex];
    cards.forEach((card, i) => {
      card.style.transform = `translateX(${pos.x[i]}px) rotate(${pos.r[i]}deg)`;
      card.style.opacity   = pos.o[i];
      card.style.zIndex    = frontIndex === i ? 10 : total - i;
      if (frontIndex === i) {
        card.style.boxShadow = "0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(155,35,53,0.3)";
      } else {
        card.style.boxShadow = "";
      }
    });
    currentFront = frontIndex;
  }

  // Animate step by step from current to target
  function animateToward(target) {
    if (isAnimating) return;
    if (currentFront === target) return;

    isAnimating = true;
    const step = target > currentFront ? 1 : -1;
    const next = currentFront + step;

    applyState(next);

    // Wait for transition to finish before stepping again
    cards[0].addEventListener("transitionend", function handler() {
      cards[0].removeEventListener("transitionend", handler);
      isAnimating = false;
      if (currentFront !== targetFront) {
        animateToward(targetFront);
      }
    });
  }

  // Set initial positions without transition
  cards.forEach(c => c.style.transition = "none");
  applyState(0);

  // Re-enable transitions after initial paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cards.forEach(c => {
        c.style.transition = `
          transform 1.1s cubic-bezier(0.16, 1, 0.3, 1),
          box-shadow 0.8s ease,
          opacity 0.8s ease
        `;
      });
    });
  });

  // Listen for mouseenter on each card
  cards.forEach((card, i) => {
    card.addEventListener("mouseenter", () => {
      targetFront = i;
      animateToward(targetFront);
    });
  });

})();
