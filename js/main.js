document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     Intersection Observer
  =============================== */
  const section = document.querySelector('.image-wrapper');
  if (section) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    observer.observe(section);
  }

  /* ===============================
     Popup Logic
  =============================== */
  const openBtn = document.getElementById("openPopup");
  const closeBtn = document.getElementById("closePopup");
  const popup = document.getElementById("popupOverlay");

  if (openBtn && closeBtn && popup) {
    openBtn.onclick = () => popup.classList.add("active");
    closeBtn.onclick = () => popup.classList.remove("active");
    popup.onclick = e => {
      if (e.target === popup) popup.classList.remove("active");
    };
  }

  /* ===============================
     Existing Mobile Slider
  =============================== */
  if (window.innerWidth <= 768) {
    const slider = document.querySelector('.mobile-slider');
    const dots = document.querySelectorAll('.dot');
    let index = 0;

    if (slider && dots.length) {
      function goToSlide(i) {
        index = i;
        slider.scrollTo({ left: index * slider.offsetWidth, behavior: 'smooth' });
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
      }

      dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

      setInterval(() => goToSlide((index + 1) % dots.length), 3500);
    }
  }

  /* ===============================
     Luxury Slider (MOBILE ONLY)
  =============================== */

/* Mobile-only slider logic */
(function () {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  if (!isMobile) return;

  const track = document.querySelector(".luxury-track");
  const slides = document.querySelectorAll(".luxury-slide");
  const dotsContainer = document.querySelector(".luxury-dots");

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let autoplayTimer;

  /* Create dots */
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "luxury-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".luxury-dot");

  function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function goToSlide(i) {
    index = i;
    updateSlider();
    resetAutoplay();
  }

  /* Autoplay */
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      index = (index + 1) % slides.length;
      updateSlider();
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  /* Touch support */
  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    clearInterval(autoplayTimer);
  });

  track.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", () => {
    const diff = startX - currentX;
    if (diff > 50 && index < slides.length - 1) index++;
    if (diff < -50 && index > 0) index--;
    updateSlider();
    startAutoplay();
  });

  /* Init */
  updateSlider();
  startAutoplay();
})();



  /* ===============================
     OTP FORM LOGIC (Safe)
  =============================== */
  const form = document.getElementById("leadForm");
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const submitBtn = document.getElementById("submitBtn");
  const otpSection = document.getElementById("otpSection");

  if (form && sendOtpBtn && verifyOtpBtn && submitBtn && otpSection) {

    let otpVerified = false;

    sendOtpBtn.addEventListener("click", async () => {
      const mobile = document.getElementById("mobile").value.trim();
      if (!/^\d{10}$/.test(mobile)) return alert("Enter valid 10 digit mobile number");

      const res = await fetch("php/otp-handler.php", {
        method: "POST",
        body: new URLSearchParams({ mobile })
      });

      const data = await res.json();
      console.log("TEST OTP:", data.otp);
      otpSection.classList.remove("d-none");
    });

    verifyOtpBtn.addEventListener("click", async () => {
      const otp = document.getElementById("otpInput").value;

      const res = await fetch("php/otp-handler.php", {
        method: "POST",
        body: new URLSearchParams({ verifyOtp: otp })
      });

      const data = await res.json();

      if (data.success) {
        otpVerified = true;
        submitBtn.disabled = false;
        alert("OTP Verified!");
      } else {
        document.getElementById("otpError").innerText = "Incorrect OTP";
      }
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();

      if (!otpVerified) return alert("Verify OTP first");

      const formData = new FormData(form);

      const res = await fetch("php/submit-form.php", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Form submitted successfully!");
        form.reset();
        submitBtn.disabled = true;
        otpVerified = false;
        otpSection.classList.add("d-none");
      } else {
        alert(data.message);
      }
    });

  }

});
