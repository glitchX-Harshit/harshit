import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { CustomEase } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/CustomEase.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(CustomEase, ScrollTrigger);
CustomEase.create("hop", "0.85, 0, 0.15, 1");
CustomEase.create("luxury", "0.16, 1, 0.3, 1");

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
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 350);
    });

    gsap.ticker.lagSmoothing(0);

    // Minimal luxury approach heading animation
    const approachHeading = document.querySelector(".approach .heading h1");
    
    if (approachHeading) {
        // Split into lines and words
        const text = approachHeading.innerText;
        const words = text.split(" ");
        
        approachHeading.innerHTML = words.map(word => {
            return `<span class="approach-word"><span class="approach-word-inner">${word}</span></span>`;
        }).join(" ");

        const wordWrappers = approachHeading.querySelectorAll(".approach-word");
        
        // Set initial state - simple mask reveal
        gsap.set(wordWrappers, {
            overflow: "hidden",
            display: "inline-block",
            verticalAlign: "top"
        });
        
        gsap.set(".approach-word-inner", {
            yPercent: 100,
            opacity: 0
        });

        // Minimal, smooth reveal
        gsap.to(".approach-word-inner", {
            yPercent: 0,
            opacity: 1,
            duration: 1.8,
            stagger: 0.015,
            ease: "luxury",
            scrollTrigger: {
                trigger: ".approach .heading",
                start: "top 75%",
                end: "bottom 60%",
                toggleActions: "play none none none"
            }
        });
    }
});

(function () {
    const component = document.querySelector('.marquee-component');

    if (component) {
        const heroLines = component.querySelectorAll('.marquee-component__line');

        // Split text animation
        heroLines.forEach((line) => {
            const text = line.textContent;
            const words = text.split(' ');
            line.innerHTML = '';

            words.forEach((word, i) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'marquee-component__word';
                wordSpan.textContent = word;
                line.appendChild(wordSpan);

                if (i < words.length - 1) {
                    line.appendChild(document.createTextNode(' '));
                }
            });
        });

        const allWords = component.querySelectorAll('.marquee-component__word');

        gsap.to(allWords, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "power2.out",
            scrollTrigger: {
                trigger: component,
                start: 'top 60%',
                end: 'bottom 60%',
                toggleActions: 'play none none reverse'
            }
        });

        // Marquee animation
        const m1 = component.querySelector('[data-marquee="1"]');
        const m2 = component.querySelector('[data-marquee="2"]');

        if (m1 && m2) {
            let lastScroll = 0;
            let m1Pos = 0;
            let m2Pos = 0;
            let speed = 0;
            let direction = 1;

            const m1Width = m1.scrollWidth / 2;
            const m2Width = m2.scrollWidth / 2;

            function update() {
                m1Pos += speed * direction;
                m2Pos -= speed * direction;

                if (Math.abs(m1Pos) >= m1Width) {
                    m1Pos = 0;
                } else if (m1Pos > 0) {
                    m1Pos = -m1Width;
                }

                if (Math.abs(m2Pos) >= m2Width) {
                    m2Pos = 0;
                } else if (m2Pos > 0) {
                    m2Pos = -m2Width;
                }

                gsap.set(m1, { x: m1Pos });
                gsap.set(m2, { x: m2Pos });

                speed *= 0.95;

                requestAnimationFrame(update);
            }

            update();

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const delta = scrollY - lastScroll;

                direction = delta > 0 ? 1 : -1;
                speed = Math.min(Math.abs(delta) * 0.2, 8);

                lastScroll = scrollY;
            });
        }
    }

    // Video scale animation
    const mainVideo = document.querySelector(".main-video");

    if (mainVideo) {
        gsap.set(".main-video", {
            scale: 0.6,
            borderRadius: "24px",
            width: "calc(100% - 2rem)",
            margin: "0 1rem"
        });

        gsap.set(".video-container", {
            overflow: "hidden",
            borderRadius: "24px"
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: ".main-video",
                start: "top 80%",
                end: "top 20%",
                scrub: 1,
                markers: false
            }
        })
            .to(".main-video", {
                scale: 1,
                borderRadius: "0px",
                ease: "none"
            })
            .to(".video-container", {
                borderRadius: "0px",
                ease: "none"
            }, 0);
    }

})();