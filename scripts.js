const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%&$#@";
let currentState = "home";

function decryptText(element, finalValue) {
  let iteration = 0;
  clearInterval(element.interval);

  element.interval = setInterval(() => {
    element.innerText = finalValue
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return finalValue[index];
        }
        return letters[Math.floor(Math.random() * 40)];
      })
      .join("");

    if (iteration >= finalValue.length) {
      clearInterval(element.interval);
    }
    iteration += 1 / 3;
  }, 30);
}

window.addEventListener("DOMContentLoaded", function () {

  // --- SCROLL LOCK ---
  document.body.classList.add('no-scroll');
  setTimeout(() => {
    document.body.classList.remove('no-scroll');
  }, 3000);

  // --- NAV SCROLL ---
  window.onscroll = function () {
    const nav = document.querySelector('.nav');
    const scrollPos = window.scrollY;
    if (scrollPos > 1) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  // --- PAGE LABEL (changes when header reaches middle of screen) ---
  const pageEl = document.querySelector('.page');

  const sectionMap = [
    { selector: '.banner',                           state: 'home',       dataKey: 'home'       },
    { selector: '[data-value="ABOUT"]',              state: 'about',      dataKey: 'about'      },
    { selector: '[data-value="TECH STACK & TOOLS"]', state: 'techstack',  dataKey: 'techstack'  },
    { selector: '[data-value="PROJECT"]',            state: 'project',    dataKey: 'project'    },
    { selector: '[data-value="EXPERIENCE"]',         state: 'experience', dataKey: 'experience' },
    { selector: '[data-value="CONTACT"]',            state: 'contact',    dataKey: 'contact'    },
  ];
sectionMap.forEach(s => {
  const el = document.querySelector(s.selector);
  console.log(s.selector, el); // check if it finds the right element
});
  // rootMargin: "-50% 0px -50% 0px" means the element must reach the CENTER of the screen
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const matched = sectionMap.find(s => entry.target.matches(s.selector));
        if (matched && matched.state !== currentState) {
          currentState = matched.state;
          decryptText(pageEl, pageEl.dataset[matched.dataKey]);
        }
      }
    });
  }, {
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0
  });

  sectionMap.forEach(s => {
    const el = document.querySelector(s.selector);
    if (el) sectionObserver.observe(el);
  });

  // --- DECRYPT OBSERVER ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        decryptText(entry.target, entry.target.dataset.value);
        entry.target.dataset.done = "true";
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".decrypt").forEach((el) => observer.observe(el));

  // --- SCROLL LINE ---
  window.addEventListener("scroll", () => {
    const section = document.querySelector(".expline");
    const line = document.querySelector(".scroll-line");

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const start = 100;
    const total = section.offsetHeight - start;

    let progress = (windowHeight - rect.top - start) / total;
    progress = Math.max(0, Math.min(progress, 1));

    line.style.height = (progress * 100) + "%";
  });

  // --- CLOCK ---
  function updateClock() {
    const options = {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    document.getElementById('ph-time').textContent = `Baliwag, Philippines | ${formatter.format(new Date())} (UTC +8)`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // --- FADE UP ---
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach((el) => fadeObserver.observe(el));

  // --- TECHSTACK ---
  const techHolders = document.querySelectorAll('.tech-holder');

  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        techObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  techHolders.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    techObserver.observe(el);
  });

  // --- SCENES (project cards) ---
  const sceneEls = document.querySelectorAll('.scene');

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sceneObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sceneEls.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    sceneObserver.observe(el);
  });

  // --- EMAILJS ---
  emailjs.init("f4c2gDUwGEf-m25UC");
  const btn = document.querySelector(".contact-submit");

  if (!btn) {
    console.error("Button not found");
    return;
  }

  btn.addEventListener("click", function () {
    const name = document.getElementById("form-name").value;
    const email = document.getElementById("form-email").value;
    const message = document.getElementById("form-message").value;

    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    const params = { name, email, message, time: new Date().toLocaleString() };

    emailjs.send("service_mm9s7qg", "template_bjxyzl5", params)
      .then(() => alert("Message sent!"))
      .catch((err) => {
        console.log(err);
        alert("Failed");
      });
  });

  // --- POPUP ---
  const scenes = document.querySelectorAll(".scene");
  const popup = document.getElementById("popup");
  const closeBtn = document.querySelector(".close");

  const popupTitle = document.getElementById("popupTitle");
  const popupCompany = document.getElementById("popupCompany");
  const popupYear = document.getElementById("popupYear");
  const popupStack = document.getElementById("popupStack");
  const popupFocus = document.getElementById("popupFocus");
  const popupImages = document.getElementById("popupImages");
  const popupDots = document.getElementById("popupDots");
  const popupDescription = document.getElementById("popupDescription");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentSlide = 0;

  function showSlide(index) {
    const imgs = popupImages.querySelectorAll("img");
    const dots = popupDots.querySelectorAll("span");
    const total = imgs.length;

    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    popupImages.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    currentSlide = index;
  }

  const projects = [
    {
      title: "Log Sheet System",
      company: "Magellan Solutions Inc.",
      year: "2025 - 2026",
      stack: ["PHP", "JavaScript", "CSS", "NodeJs", "Bootstrap", "MySQL"],
      focus: ["Visitor & Employee Entry Logging",
              "Location-Based Record Tracking",
              "Backend Performance Optimization",
              "Data Accuracy & Validation",
              "System Debugging & Testing",
              "Reliable Log Sheet Operations",
              "Responsive Design"
            ],
      description: "A log sheet management system developed for Magellan Solutions Inc. to track and manage visitor and employee entry records. Built with a focus on backend reliability, the system ensures accurate location logging and seamless data management across operations.",
      images: [
        "LogSheetSystem/01.png",
        "LogSheetSystem/02.png",
        "LogSheetSystem/04.png",
        "LogSheetSystem/10.png",
        "LogSheetSystem/13.png"
      ]
    },
    {
      title: "Faculty Management System for Bulacan State University",
      company: "Bulacan State University",
      year: "Feb 2025 - Nov 2025 ",
      stack: ["PHP", "JavaScript", "CSS", "Bootstrap", "MySQL"],
      focus: ["Faculty Activity & Performance Logging",
              "Centralized Document Management & Submission Monitoring",
              "Admin Dashboard & Performance Overview",
              "Data Accuracy & Validation",
              "Secure Role-Based Access Control",
              "Responsive & User-Friendly Interface"],
      description: "A web-based faculty performance monitoring system built for Bulacan State University - Bustos Campus to streamline the tracking and evaluation of faculty activities. The platform provides a centralized space where faculty members can log their professional development, research outputs, and extension services. Designed to eliminate manual record-keeping, the system improves data accuracy and gives administrators a clearer view of faculty performance across the campus.",
      images: [
        "FacultyManagement/01.png",
        "FacultyManagement/02.png",
        "FacultyManagement/03.png",
        "FacultyManagement/04.png",
        "FacultyManagement/05.png",
        "FacultyManagement/06.png",
        "FacultyManagement/07.png",
        "FacultyManagement/08.png"
      ]
    },
    {
      title: "Kageyoshi Café System",
      company: "Web Development Project",
      year: "Oct 2024 - Dec 2024",
      stack: ["HTML", "PHP", "CSS", "JS"],
      focus: ["Interactive Drink Customization",
              "Real-Time UI & Image Updates",
              "Order Management System",
              "Inventory Tracking & Monitoring",
              "Automated PDF Report Generation",
              "POS (Point of Sale) Integration",
              "Responsive & Modern Interface"],
      description: "A web-based coffee shop management system built to handle the full operations of a modern café. The platform provides an interactive ordering experience where customers can personalize their drinks and see real-time visual updates as they customize their preferences. Designed with both the customer and the staff in mind, the system integrates order management, inventory tracking, and automated reporting into one seamless and efficient platform.",
      images: ["img/p3-1.jpg", "img/p3-2.jpg"]
    },
    {
      title: "Cinema Management System",
      company: "OOP Project",
      year: "Feb 2024 - Apr 2024",
      stack: ["Java", "MySQL"],
      focus: ["Multi-Branch Cinema Management",
              "Automated Conflict-Free Scheduling",
              "Seat Reservation System",
              "Inventory Tracking & Monitoring",
              "Sales Report Generation",
              "Centralized Admin Dashboard",
              "Multi-Cinema Administration",
              "Responsive & User-Friendly Interface"],
      description: "A web-based cinema management system designed to handle the full operations of a multi-branch movie theater. The platform provides administrators with a centralized tool to manage movie screenings, seat reservations, and daily operations across multiple cinema locations. Built with an automated scheduling system that prevents overlapping time slots, the platform ensures smooth and conflict-free screening management while keeping track of inventory, sales, and branch-wide administration.",
      images: ["img/p3-1.jpg", "img/p3-2.jpg"]
    }
  ];

  scenes.forEach((scene, index) => {
    scene.addEventListener("click", () => {
      const data = projects[index];

      popupTitle.textContent = data.title;
      popupCompany.textContent = data.company;
      popupYear.textContent = data.year;
      popupFocus.innerHTML = "";
      data.focus.forEach(item => {
        popupFocus.innerHTML += `<div class="focus-item">${item}</div>`;
      });
      popupDescription.textContent = data.description;

      popupStack.innerHTML = "";
      data.stack.forEach(item => {
        popupStack.innerHTML += `<div class="stack-item">${item}</div>`;
      });

      popupImages.innerHTML = "";
      popupDots.innerHTML = "";

      data.images.forEach((img, i) => {
        popupImages.innerHTML += `<img src="${img}" alt="">`;
        popupDots.innerHTML += `<span data-index="${i}"></span>`;
      });

      setTimeout(() => {
        popupDots.querySelectorAll("span").forEach(dot => {
          dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.index));
          });
        });
      }, 0);

      currentSlide = 0;
      showSlide(0);
      popup.classList.add("active");
    });
  });

  prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
  nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));

  closeBtn.addEventListener("click", () => popup.classList.remove("active"));

  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.classList.remove("active");
  });
document.querySelector('.btn-projects').addEventListener('click', () => {
  document.querySelector('[data-value="PROJECT"]').scrollIntoView({ behavior: 'smooth' });
});
});


