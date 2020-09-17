(() => {
  const toggle = (element, className) => {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  };

  const smoothScroll = (target, duration, offset) => {
    const startPosition = window.pageYOffset;

    const targetSection = document.querySelector(target);
    const distance = targetSection.getBoundingClientRect().top - (offset || 0);

    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;
      
      const progres = timeElapsed / duration;
      const run = startPosition + distance * progres;

      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const fadingLetters = (el) => {
    const textLetters = el.textContent.split("");
    el.textContent = "";

    for (let i = 0; i < textLetters.length; i++) {
      el.innerHTML += `<span>${textLetters[i]}</span>`;
    }

    let char = 0;

    const onTick = () => {
      const span = el.querySelectorAll("span")[char];
      span.classList.add("fade");
      char++;

      if (char === textLetters.length) {
        clearInterval(timer);
        return;
      }
    };

    let timer = setInterval(onTick, 50);
  };

  const smoothAppear = (selector) => {
    const content = document.querySelector(selector);
    const contentPosition = content.getBoundingClientRect().top;
    const screenPosition = window.innerHeight * 0.5;

    if (contentPosition < screenPosition) {
      content.classList.add("fade-in");
    }
  };

  const initFadeCarousel = (selector) => {
    const rootElement = document.querySelector(selector);
    const bullets = rootElement.querySelectorAll(".bullets .circle");
    const slides = rootElement.querySelectorAll(".slide");

    let currentTimeout = null;

    const clearActive = (elms) =>
      elms.forEach((el) => el.classList.remove("active"));

    const setActive = (elms, index) => elms[index].classList.add("active");

    const switchToSlide = (index) => {
      clearActive(slides);
      clearActive(bullets);

      setActive(bullets, index);
      setActive(slides, index);

      clearTimeout(currentTimeout);

      currentTimeout = setTimeout(() => {
        switchToSlide((index + 1) % slides.length);
      }, 4000);
    };

    bullets.forEach((element, index) => {
      element.addEventListener("click", () => {
        switchToSlide(index);
      });
    });

    switchToSlide(0);
  };

  const initSlideCarousel = (selector) => {
    const rootElement = document.querySelector(selector);
    const items = rootElement.querySelector(".items-container");
    const indicators = rootElement.querySelectorAll(".bullets .circle");
    let currentSlide;

    const removeActive = () =>
      indicators.forEach((el) => {
        el.classList.remove("active");
      });

    const nextSlide = (index) => {
      items.style.transform = `translate(-${
        (100 / indicators.length) * index
      }%)`;

      removeActive();
      indicators[index].classList.add("active");

      clearTimeout(currentSlide);

      currentSlide = setTimeout(() => {
        const nextIndex = (index + 1) % indicators.length;

        nextSlide(nextIndex);
      }, 4000);
    };

    indicators.forEach((el, index) => {
      el.addEventListener("click", () => {
        nextSlide(index);
      });
    });

    nextSlide(0);
  };

  //-------------------- UI setup --------------------------

  const initNavigation = () => {
    const menu = document.querySelector(".hamburger-menu");
    const navbar = document.querySelector(".navbar");
    const menuLinks = navbar.querySelectorAll("li");
    const scrollUp = document.querySelector(".scroll-up");

    menu.addEventListener("click", () => {
      toggle(navbar, "open");
      toggle(menu, "close");
    });

    menuLinks.forEach((el) => {
      el.addEventListener("click", () => {
        navbar.classList.remove("open");
        menu.classList.remove("close");
      });
    });

    navbar.addEventListener("click", function (event) {
      event.preventDefault();

      if (event.target.tagName === "A") {
        const offset = parseInt(event.target.getAttribute("data-offset"));
        smoothScroll(event.target.hash, 1000, offset);
      }
    });

    scrollUp.addEventListener("click", function () {
      smoothScroll("#jumbotron", 1000);
    });

    window.addEventListener("scroll", function (e) {
      if (window.scrollY > window.innerHeight) {
        scrollUp.classList.remove("hidden");
      } else {
        scrollUp.classList.add("hidden");
      }
    });
  };

  const initJumbotron = () => {
    const learnMoreButton = document.querySelector("header button");

    fadingLetters(learnMoreButton);

    learnMoreButton.addEventListener("click", function () {
      smoothScroll("#intro", 1000);
    });
  };

  const initMotto = () => {
    const button = document.querySelector("#motto button");

    button.addEventListener("click", () => {
      smoothScroll('#qualities', 1000);
    });
  };

  document.querySelector('#ignite button').addEventListener('click', () => {
    smoothScroll('#contacts', 1000);
  });

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initJumbotron();
    initMotto();

    initFadeCarousel("#specialists .carousel");
    initSlideCarousel("#qualities");
    initFadeCarousel(".team-container");

    window.addEventListener("scroll", () => {
      smoothAppear("#intro");
      smoothAppear("#service");
      smoothAppear("#ignite");
    });
  });
})();
