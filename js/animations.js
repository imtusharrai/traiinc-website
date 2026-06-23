/**
 * Trai Inc — Scroll Animations (animations.js)
 * Lightweight IntersectionObserver for .fade-in elements.
 * Uses requestAnimationFrame to ensure layout is complete before observing.
 */
(function() {
    function initAnimations() {
        // Wait for next frame to ensure layout is complete
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                var observer = new IntersectionObserver(function(entries, obs) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            obs.unobserve(entry.target);
                        }
                    });
                }, { root: null, rootMargin: '50px', threshold: 0.05 });

                document.querySelectorAll('.fade-in').forEach(function(el) {
                    observer.observe(el);
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
