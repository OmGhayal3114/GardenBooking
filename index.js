const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".box");

const firstSlide = slides[0].cloneNode(true);
slider.appendChild(firstSlide);

let currentSlide = 0;

setInterval(() => {

    currentSlide++;

    slider.style.transform =
        `translateX(-${currentSlide * 100}%)`;

}, 3000);


slider.addEventListener("transitionend", () => {

    if (currentSlide === slides.length) {

        slider.style.transition = "none";

        currentSlide = 0;

        slider.style.transform = "translateX(0)";

        // Force browser to apply the reset
        slider.offsetHeight;

        slider.style.transition = "transform 0.8s ease-in-out";
    }

});