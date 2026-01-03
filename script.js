import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { CustomEase } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/CustomEase.js";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.85, 0, 0.15, 1");

const counterProgress = document.querySelector(".counter h1");
const counter = { value: 0 };

// Custom split text function
function splitText(selector) {
    const el = document.querySelector(selector);
    const words = el.innerText.split(" ");
    el.innerHTML = words
        .map(word => `<span class="word">${word}</span>`)
        .join(" ");
}

document.addEventListener("DOMContentLoaded", () => {
    // Split the text into words
    splitText(".hero-header h1");

    const counterTl = gsap.timeline({ delay: 0.5 });
    const overlayTextTl = gsap.timeline({ delay: 0.75 });
    const revealTl = gsap.timeline({ delay: 0.5 });

    counterTl.to(counter, { 
        value: 100,
        duration: 5,
        ease: "power2.out",
        onUpdate: () => {
            counterProgress.textContent = Math.floor(counter.value);
        },
    });

    overlayTextTl.to(".overlay-text", {
        y: "0",
        duration: 0.75,
        ease: "hop",
    })
        .to(".overlay-text", {
            y: "-2rem",
            duration: 0.75,
            ease: "hop",
            delay: 0.75,
        })
        .to(".overlay-text", {
            y: "-4rem",
            duration: 0.75,
            ease: "hop",
            delay: 0.75,
        })
        .to(".overlay-text", {
            y: "-6rem",
            duration: 0.75,
            ease: "hop",
            delay: 1,
        });

    revealTl.to(".img img", {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: "hop",
    })
        .to(".hero-images", {
            gap: "0.75vw",
            duration: 1,
            delay: 0.5,
            ease: "hop",
        })
        .to(".img img", {
            scale: 1,
            duration: 1,
            ease: "hop",
        },
            ">"
        )
        .to(".img:not(.hero-img) img", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            stagger: 0.1,
            ease: "hop",
        })
        .to(".hero-img img", {
            scale: 3.1,
            duration: 1,
            ease: "hop",
        })
        .to(".hero-overlay", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "hop",
        })
        .to(".hero-header h1 .word", {
            y: "0%",
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
        },
         "-=0.5"
        );

    // Initialize Lenis with increased sensitivity
    const lenis = new Lenis({
        duration: 5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // smoothWheel: true,
        // wheelMultiplier: 2,
        // touchMultiplier: 2.5,
        // infinite: false,
    });

    // Lenis scroll event
    // lenis.on('scroll', (e) => {
    //     console.log(e);
    // });

    // Integrate Lenis with animation frame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
});