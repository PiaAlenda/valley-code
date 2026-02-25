document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. PROYECTOS: Premium Modal & Altura Dinámica =====
    const showMoreBtn = document.getElementById('show-more-projects');
    const projectsContainer = document.getElementById('projects-container');
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    const modalBackdrop = document.getElementById('modal-backdrop');

    let isExpanded = false;

    // Función para abrir Modal con diseño de dos columnas (IMG Izq | DESC Der)
    window.openProject = (title, desc, img, tags) => {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalImg = document.getElementById('modal-img');
        const modalTags = document.getElementById('modal-tags');

        if (!modalTitle || !modalDesc) return;

        // Inyectar contenido
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modalImg.src = img;
        
        // Limpiar y crear tags con estilo premium
        modalTags.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = "text-[10px] tracking-widest uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-primary font-bold shadow-sm";
            span.innerText = tag;
            modalTags.appendChild(span);
        });

        // Activar Modal
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeProject = () => {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProject();
    });

    // Lógica de Expansión Fluida (Ver más / Ver menos)
    if (showMoreBtn && projectsContainer) {
        // Establecer altura inicial para permitir transición
        projectsContainer.style.maxHeight = "750px"; 

        showMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            if (isExpanded) {
                // EXPANDIR
                hiddenProjects.forEach((project, index) => {
                    project.classList.remove('hidden');
                    setTimeout(() => {
                        project.classList.remove('opacity-0', 'translate-y-10');
                        project.classList.add('opacity-100', 'translate-y-0');
                    }, index * 50); // Stagger rápido
                });

                // Calcular altura real del contenido para expandir sin saltos
                const fullHeight = projectsContainer.scrollHeight;
                projectsContainer.style.maxHeight = fullHeight + 100 + "px";

                // Cambiar texto e icono
                showMoreBtn.innerHTML = `Ver menos <i class="fas fa-chevron-up text-xs transition-transform group-hover:-translate-y-1"></i>`;
            } else {
                // CONTRAER
                projectsContainer.style.maxHeight = "750px"; // Volver al tamaño original
                
                hiddenProjects.forEach((project) => {
                    project.classList.add('opacity-0', 'translate-y-10');
                    project.classList.remove('opacity-100', 'translate-y-0');
                });

                // Cambiar texto e icono
                showMoreBtn.innerHTML = `Ver más proyectos <i class="fas fa-chevron-down text-xs transition-transform group-hover:translate-y-1"></i>`;

                // Scroll suave al inicio de la sección para no perder el foco
                setTimeout(() => {
                    document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
                    hiddenProjects.forEach(p => p.classList.add('hidden'));
                }, 600);
            }
        });
    }

    // ===== 2. FAQ Accordion (Optimizado) =====
    document.querySelectorAll(".faq-question").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.parentElement;
            const answer = item.querySelector(".faq-answer");
            const isOpen = item.classList.contains("active");

            // Cerrar otros
            document.querySelectorAll(".faq-item").forEach((faq) => {
                faq.classList.remove("active");
                const faqAns = faq.querySelector(".faq-answer");
                if (faqAns) faqAns.style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // ===== 3. Smooth Scrolling (Refinado) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === "#") return;
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ===== 4. Intersection Observer (Efecto de Entrada) =====
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { 
        threshold: 0.1 
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });

    // ===== 5. Mobile Menu Toggle (Premium Blur) =====
    window.toggleMenu = () => {
        const navLinks = document.querySelector('header ul');
        const overlay = document.getElementById('nav-overlay');
        const isActive = overlay.classList.contains('active');
        
        if (!isActive) {
            navLinks.classList.remove('hidden');
            navLinks.classList.add('flex', 'flex-col', 'fixed', 'top-24', 'left-1/2', '-translate-x-1/2', 'bg-surface-elevated/95', 'backdrop-blur-xl', 'w-[90%]', 'p-8', 'rounded-3xl', 'z-[1600]', 'border', 'border-white/10', 'shadow-2xl');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.remove('active');
            navLinks.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };
});