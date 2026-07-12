const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach((el) => observer.observe(el));
document.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const images = track.querySelectorAll('img');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            track.scrollTo({
                left: index * track.clientWidth,
                behavior: 'smooth'
            });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    track.addEventListener('scroll', () => {
        const currentIndex = Math.round(track.scrollLeft / track.clientWidth);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    });
});