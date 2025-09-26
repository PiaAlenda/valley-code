// ===== Menu toggle =====
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const sideMenu = document.getElementById('sideMenu');
    const menuToggle = document.querySelector('.menu-toggle');

    if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        sideMenu.classList.remove('active');
    }
});

// ===== Show more works =====
let worksExpanded = false;
function showMoreWorks() {
    const hiddenWorks = document.getElementById('hiddenWorks');
    const showMoreBtn = document.querySelector('.show-more-btn');

    if (!worksExpanded) {
        hiddenWorks.classList.add('show');
        showMoreBtn.textContent = 'Ver menos';
        worksExpanded = true;
    } else {
        hiddenWorks.classList.remove('show');
        showMoreBtn.textContent = 'Ver más trabajos';
        worksExpanded = false;
    }
}

// ===== Smooth scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('sideMenu').classList.remove('active');
        }
    });
});

// ===== Intersection Observer for sections =====
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    sectionObserver.observe(section);
});

// ===== Counters =====
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");
    const speed = 250;

    const startCounting = (counter) => {
        const target = +counter.getAttribute("data-target");
        let count = 0;

        const updateCount = () => {
            const increment = target / speed;
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
});

// ===== Reveal icons sequentially =====
const icons = document.querySelectorAll('.reveal');
let revealedCount = 0;

function revealSequentially() {
    const windowHeight = window.innerHeight;

    for (let i = revealedCount; i < icons.length; i++) {
        const iconTop = icons[i].getBoundingClientRect().top;

        if (iconTop < windowHeight - 50) {
            setTimeout(() => {
                icons[i].classList.add('active');
            }, (i - revealedCount) * 300);
            revealedCount = i + 1;
        } else {
            break;
        }
    }
}

window.addEventListener('scroll', revealSequentially);
window.addEventListener('load', revealSequentially);

// ===== Section dividers =====
const dividers = document.querySelectorAll('.section-divider');

function animateDivider() {
    const windowHeight = window.innerHeight;
    dividers.forEach(divider => {
        const top = divider.getBoundingClientRect().top;
        if (top < windowHeight - 50) {
            divider.classList.add('active');
        }
    });
}

window.addEventListener('scroll', animateDivider);
window.addEventListener('load', animateDivider);

// ===== Underline words on scroll =====
const words = document.querySelectorAll('.underline-on-scroll .word');

function underlineWordsOnScroll() {
    const windowHeight = window.innerHeight;

    words.forEach((word, index) => {
        const top = word.getBoundingClientRect().top;
        if (top < windowHeight - 50 && !word.classList.contains('active')) {
            setTimeout(() => {
                word.classList.add('active');
            }, index * 300);
        }
    });
}

window.addEventListener('scroll', underlineWordsOnScroll);
window.addEventListener('load', underlineWordsOnScroll);

// ===== FAQ accordion =====
document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const answer = item.querySelector(".faq-answer");

        // Close all others
        document.querySelectorAll(".faq-item").forEach((faq) => {
            const faqAnswer = faq.querySelector(".faq-answer");
            if (faq !== item) {
                faq.classList.remove("active");
                faqAnswer.style.maxHeight = null;
            }
        });

        // Toggle clicked
        item.classList.toggle("active");

        if (item.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// ===== Testimonials animations =====
const testimonialObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.testimonial-card').forEach(card => testimonialObserver.observe(card));

class TestimonialsSlider {
  constructor() {
    this.grid = document.getElementById("testimonialsGrid")
    this.dotsContainer = document.getElementById("sliderDots")
    this.cards = Array.from(this.grid.querySelectorAll(".testimonial-card"))
    this.currentSlide = 0
    this.isSliderMode = false

    this.init()
    this.handleResize()
    window.addEventListener("resize", () => this.handleResize())
  }

  init() {

    this.animateCards()

    this.createDots()

    this.setupEvents()
  }

  animateCards() {
    this.cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("visible", "animate-in")
      }, index * 100)
    })
  }

  createDots() {
    this.dotsContainer.innerHTML = ""

    if (this.isSliderMode) {
      const slidesCount = this.getSlidesCount()

      for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement("button")
        dot.classList.add("dot")
        if (i === 0) dot.classList.add("active")

        dot.addEventListener("click", () => this.goToSlide(i))
        this.dotsContainer.appendChild(dot)
      }
    }
  }

  getSlidesCount() {
    const screenWidth = window.innerWidth

    if (screenWidth <= 480) {
 
      return this.cards.length
    } else if (screenWidth <= 768) {
   
      return this.cards.length
    } else if (screenWidth <= 1024) {

      return Math.ceil(this.cards.length / 2)
    }

    return this.cards.length
  }

  getCardsPerSlide() {
    const screenWidth = window.innerWidth

    if (screenWidth <= 768) {
      return 1 
    } else if (screenWidth <= 1024) {
      return 2 
    }

    return 1
  }

  goToSlide(slideIndex) {
    if (!this.isSliderMode) return

    this.currentSlide = slideIndex
    const cardsPerSlide = this.getCardsPerSlide()
    const cardWidth = this.cards[0].offsetWidth
    const gap = 16
    const translateX = slideIndex * (cardWidth + gap) * cardsPerSlide

    this.grid.style.transform = `translateX(-${translateX}px)`


    this.updateActiveDot()
  }

  updateActiveDot() {
    const dots = this.dotsContainer.querySelectorAll(".dot")
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide)
    })
  }

  handleResize() {
    const screenWidth = window.innerWidth
    const wasSliderMode = this.isSliderMode
    this.isSliderMode = screenWidth <= 1024

    if (this.isSliderMode !== wasSliderMode) {
      this.currentSlide = 0
      this.grid.style.transform = ""
      this.createDots()
    } else if (this.isSliderMode) {
      this.createDots()
      this.goToSlide(0) 
    }
  }

  setupEvents() {
    let startX = 0
    let isDragging = false

    this.grid.addEventListener("touchstart", (e) => {
      if (!this.isSliderMode) return
      startX = e.touches[0].clientX
      isDragging = true
    })

    this.grid.addEventListener("touchmove", (e) => {
      if (!this.isSliderMode || !isDragging) return
      e.preventDefault()
    })

    this.grid.addEventListener("touchend", (e) => {
      if (!this.isSliderMode || !isDragging) return

      const endX = e.changedTouches[0].clientX
      const diff = startX - endX
      const threshold = 50

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && this.currentSlide < this.getSlidesCount() - 1) {
          this.goToSlide(this.currentSlide + 1)
        } else if (diff < 0 && this.currentSlide > 0) {
          this.goToSlide(this.currentSlide - 1)
        }
      }

      isDragging = false
    })

    document.addEventListener("keydown", (e) => {
      if (!this.isSliderMode) return

      if (e.key === "ArrowLeft" && this.currentSlide > 0) {
        this.goToSlide(this.currentSlide - 1)
      } else if (e.key === "ArrowRight" && this.currentSlide < this.getSlidesCount() - 1) {
        this.goToSlide(this.currentSlide + 1)
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
window.testimonialsSlider = new TestimonialsSlider();

setInterval(() => {
    const slider = window.testimonialsSlider;
    if (slider && slider.isSliderMode) {
    const nextSlide = (slider.currentSlide + 1) % slider.getSlidesCount();
    slider.goToSlide(nextSlide);
    }
}, 1500); 
});
