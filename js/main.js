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
     Mobile Slider (Only ≤ 768px)
  =============================== */
  if (window.innerWidth <= 768) {
    const slider = document.querySelector('.mobile-slider');
    const dots = document.querySelectorAll('.dot');
    let index = 0;

    if (slider && dots.length) {
      function goToSlide(i) {
        index = i;
        slider.scrollTo({
          left: index * slider.offsetWidth,
          behavior: 'smooth'
        });

        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
      }

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
      });

      setInterval(() => {
        goToSlide((index + 1) % dots.length);
      }, 3500);
    }
  }

  /* ===============================
     Luxury Slider (All Devices)
  =============================== */
  const track = document.querySelector('.luxury-track');
  const luxDots = document.querySelectorAll('.lux-dot');
  let luxIndex = 0;

  if (track && luxDots.length) {
    function updateSlider() {
      track.style.transform = `translateX(-${luxIndex * 100}%)`;
      luxDots.forEach(dot => dot.classList.remove('active'));
      luxDots[luxIndex].classList.add('active');
    }

    luxDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        luxIndex = i;
        updateSlider();
      });
    });

    setInterval(() => {
      luxIndex = (luxIndex + 1) % luxDots.length;
      updateSlider();
    }, 3500);
  }

});

// OTP form.

const form = document.getElementById("leadForm");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const submitBtn = document.getElementById("submitBtn");
const otpSection = document.getElementById("otpSection");

let otpVerified = false;

sendOtpBtn.addEventListener("click", async () => {
  const mobile = document.getElementById("mobile").value.trim();

  if (!/^\d{10}$/.test(mobile)) {
    alert("Enter valid 10 digit mobile number");
    return;
  }

  const res = await fetch("php/otp-handler.php", {
    method: "POST",
    body: new URLSearchParams({ mobile })
  });

  const data = await res.json();
  console.log("TEST OTP:", data.otp); // Mock OTP shown here

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

  if (!otpVerified) {
    alert("Verify OTP first");
    return;
  }

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
