/* -------------------------------------------------------------------------- */
/* 1. SETUP                                   */
/* -------------------------------------------------------------------------- */
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.3, delay: 0.05 });
});

// Hover States
document.querySelectorAll('a, button, .work-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorCircle, { scale: 3, borderColor: 'transparent', backgroundColor: 'rgba(255,255,255,0.1)' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorCircle, { scale: 1, borderColor: 'rgba(0,0,0,0.5)', backgroundColor: 'transparent' });
    });
});

/* -------------------------------------------------------------------------- */
/* 2. LOADER                                  */
/* -------------------------------------------------------------------------- */
const loadTl = gsap.timeline();
let loadProgress = 0;

function updateLoader() {
    loadProgress += Math.random() * 5;
    if (loadProgress > 100) loadProgress = 100;

    document.getElementById('loader-count').innerText = Math.floor(loadProgress);
    gsap.to('#loader-bar', { width: loadProgress + '%' });

    if (loadProgress < 100) {
        requestAnimationFrame(updateLoader);
    } else {
        loadTl.to('#loader', { yPercent: -100, duration: 1.2, ease: "power4.inOut", delay: 0.5 })
            .from('.split-text', { y: '100%', duration: 1.5, ease: "power4.out", stagger: 0.1 }, "-=0.5");
    }
}
updateLoader();

/* -------------------------------------------------------------------------- */
/* 3. SCROLL LOGIC                                */
/* -------------------------------------------------------------------------- */
// Initialize Lenis (Smooth Scroll)
const lenis = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 0.9,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Subtle Background Color Changer
const sections = document.querySelectorAll('[data-bgcolor]');
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => gsap.to("body", { backgroundColor: section.dataset.bgcolor, color: section.dataset.textcolor, duration: 1 }),
        onEnterBack: () => gsap.to("body", { backgroundColor: section.dataset.bgcolor, color: section.dataset.textcolor, duration: 1 })
    });
});

/* -------------------------------------------------------------------------- */
/* 4. MATTER.JS GRAVITY WITH INTERACTIVE CONTACT PILLS                        */
/* -------------------------------------------------------------------------- */
const initGravity = () => {
    const container = document.getElementById('gravity-wrapper');
    const canvas = document.getElementById('gravity-canvas');
    const pillsContainer = document.getElementById('contact-pills-container');

    // Module aliases
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events;

    const engine = Engine.create();
    const world = engine.world;
    world.gravity.y = 1;

    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            background: 'transparent',
            wireframes: false,
            pixelRatio: window.devicePixelRatio
        }
    });

    // Create Boundaries
    const wallThickness = 60;
    const ground = Bodies.rectangle(
        container.clientWidth / 2,
        container.clientHeight + wallThickness / 2,
        container.clientWidth,
        wallThickness,
        { isStatic: true, render: { visible: false }, friction: 0.3, restitution: 0.2 }
    );
    const leftWall = Bodies.rectangle(
        -wallThickness / 2,
        container.clientHeight / 2,
        wallThickness,
        container.clientHeight,
        { isStatic: true, render: { visible: false }, friction: 0.3 }
    );
    const rightWall = Bodies.rectangle(
        container.clientWidth + wallThickness / 2,
        container.clientHeight / 2,
        wallThickness,
        container.clientHeight,
        { isStatic: true, render: { visible: false }, friction: 0.3 }
    );

    Composite.add(world, [ground, leftWall, rightWall]);

    // Contact Pills Data
    const contacts = [
        { label: "EMAIL", link: "mailto:hello@design.com", icon: "✉" },
        { label: "INSTAGRAM", link: "https://instagram.com", icon: "📷" },
        { label: "TWITTER", link: "https://twitter.com", icon: "🐦" },
        { label: "LINKEDIN", link: "https://linkedin.com", icon: "💼" },
        { label: "GITHUB", link: "https://github.com", icon: "💻" },
        { label: "DRIBBBLE", link: "https://dribbble.com", icon: "🏀" }
    ];

    const pillBodies = [];
    const pillElements = [];

    contacts.forEach((contact, i) => {
        // Calculate pill dimensions
        const textLength = contact.label.length;
        const width = Math.max(textLength * 12 + 70, 140);
        const height = 52;
        const x = Math.random() * (container.clientWidth - width) + width / 2;
        const y = -Math.random() * 600 - 100 - (i * 80);

        // Create physics body
        const body = Bodies.rectangle(x, y, width, height, {
            chamfer: { radius: height / 2 },
            restitution: 0.3,
            friction: 0.5,
            density: 0.001,
            render: { visible: false }
        });

        body.contactData = contact;
        pillBodies.push(body);
        Composite.add(world, body);

        // Create DOM element for the pill
        const pill = document.createElement('a');
        pill.href = contact.link;
        pill.target = "_blank";
        pill.className = 'contact-pill';
        pill.innerHTML = `
                    <span class="pill-icon">${contact.icon}</span>
                    <span class="pill-text">${contact.label}</span>
                `;
        pill.style.cssText = `
                    position: absolute;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 14px 28px;
                    border-radius: 100px;
                    background: ${i % 3 === 0 ? '#111' : i % 3 === 1 ? '#fff' : '#ff6b35'};
                    color: ${i % 3 === 0 ? '#fff' : i % 3 === 1 ? '#111' : '#fff'};
                    border: 2px solid #111;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    pointer-events: all;
                    cursor: grab;
                    user-select: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10;
                `;

        pillElements.push({ element: pill, body: body });
        pillsContainer.appendChild(pill);

        // Hover effects
        pill.addEventListener('mouseenter', () => {
            pill.style.transform = pill.style.transform + ' scale(1.05)';
            pill.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
        });
        pill.addEventListener('mouseleave', () => {
            pill.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
    });

    // Sync DOM elements with physics bodies
    function syncPills() {
        pillElements.forEach(({ element, body }) => {
            const pos = body.position;
            const angle = body.angle;
            element.style.left = `${pos.x}px`;
            element.style.top = `${pos.y}px`;
            element.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
        });
    }

    // Add Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Update cursor on drag
    Events.on(mouseConstraint, 'startdrag', () => {
        cursorCircle.style.cursor = 'grabbing';
    });
    Events.on(mouseConstraint, 'enddrag', () => {
        cursorCircle.style.cursor = 'grab';
    });

    // Animation loop
    Events.on(engine, 'afterUpdate', syncPills);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add random impulses occasionally for fun
    setInterval(() => {
        if (Math.random() > 0.7) {
            const randomPill = pillBodies[Math.floor(Math.random() * pillBodies.length)];
            Matter.Body.applyForce(randomPill, randomPill.position, {
                x: (Math.random() - 0.5) * 0.03,
                y: -Math.random() * 0.02
            });
        }
    }, 3000);

    // ScrollTrigger to start/stop physics for performance
    ScrollTrigger.create({
        trigger: "#gravity-wrapper",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => runner.enabled = true,
        onLeave: () => runner.enabled = false,
        onEnterBack: () => runner.enabled = true,
        onLeaveBack: () => runner.enabled = false
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            render.canvas.width = container.clientWidth;
            render.canvas.height = container.clientHeight;
            render.options.width = container.clientWidth;
            render.options.height = container.clientHeight;
        }, 250);
    });
};

// Delay gravity init slightly to ensure layout is calculated
setTimeout(initGravity, 1200);