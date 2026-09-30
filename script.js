let goToSlide;

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentIdx = 0;
    
    // Select the counter element
    const counterEl = document.getElementById('slide-counter');

    // Function to update the text in the bottom right corner
    function updateCounter() {
        if (!counterEl) return;
        
        // If we are on the hidden index slide, display "INDEX" instead of a number
        if (slides[currentIdx].id === 'index-slide') {
            counterEl.textContent = 'INDEX';
            return;
        }

        const current = String(currentIdx + 1).padStart(2, '0');
        // Subtract 1 from the total so the hidden slide isn't counted in the UI
        const total = String(totalSlides - 1).padStart(2, '0');
        counterEl.textContent = `${current}/${total} slides`;
    }

    goToSlide = function(index, isShortcut = false) {
        changeSlide(index, isShortcut);
    };

    function changeSlide(index, isShortcut = false) {
        if (index < 0 || index >= totalSlides) return;
        
        // INVISIBILITY MAGIC: Prevent normal arrow/click navigation from entering the index slide
        if (!isShortcut && slides[index].id === 'index-slide') {
            return; 
        }
        
        slides[currentIdx].classList.remove('active');
        currentIdx = index;
        slides[currentIdx].classList.add('active');
        
        updateCounter();
    }

    // Initialize counter on page load
    updateCounter();

    const deck = document.getElementById('deck');

    // ==========================================
    // 1. Swipe Controls (Strict Horizontal)
    // ==========================================
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    const swipeThreshold = 50; 
    const maxVerticalDeviation = 30; // Prevents triggering when scrolling vertically

    deck.addEventListener('touchstart', (e) => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });

    deck.addEventListener('touchend', (e) => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        
        const deltaX = touchendX - touchstartX;
        const deltaY = touchendY - touchstartY;

        const isHorizontalLongEnough = Math.abs(deltaX) >= swipeThreshold;
        const isStrictlyHorizontal = Math.abs(deltaY) <= maxVerticalDeviation;

        if (isHorizontalLongEnough && isStrictlyHorizontal) {
            if (deltaX < 0) {
                changeSlide(currentIdx + 1); 
            } else {
                changeSlide(currentIdx - 1); 
            }
        }
    });

    // ==========================================
    // 2. Edge Click Controls (10% Boundary)
    // ==========================================
    deck.addEventListener('click', (e) => {
        // Prevent slide navigation when clicking on images or buttons
        if (e.target.tagName.toLowerCase() === 'img' || e.target.closest('button') || e.target.closest('a')) {
            return;
        }

        const rect = deck.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        // Changed from 5% (0.05/0.95) to 10% (0.10/0.90)
        if (clickX < width * 0.10) {
            changeSlide(currentIdx - 1); 
        } else if (clickX > width * 0.90) {
            changeSlide(currentIdx + 1); 
        }
    });

    // ==========================================
    // 3. Keyboard Controls (Laptops/Clickers)
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            changeSlide(currentIdx + 1);
        } 
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            changeSlide(currentIdx - 1);
        } 
        else if (e.key === 'Home') {
            e.preventDefault();
            changeSlide(0, true);
        } 
        else if (e.key === 'End') {
            e.preventDefault();
            // Send to the Thank You slide (skips the hidden index)
            changeSlide(totalSlides - 2, true);
        }
        // Custom Section Jump Keys (Notice the 'true' bypasses the invisibility block)
        else if (e.key.toLowerCase() === 'i') {
            const idx = Array.from(slides).findIndex(s => s.id === 'index-slide');
            if (idx !== -1) changeSlide(idx, true);
        }
        else if (e.key.toLowerCase() === 'p') {
            changeSlide(5, true);  
        } 
        else if (e.key.toLowerCase() === 'a') {
            changeSlide(20, true); 
        } 
        else if (e.key.toLowerCase() === 'b') {
            changeSlide(29, true); 
        }
    });

    // ==========================================
    // 4. Cursor Highlight / Mouse Halo Effect
    // ==========================================
    const cursorHalo = document.getElementById('cursor-halo');
    
    if (cursorHalo) {
        document.addEventListener('mousemove', (e) => {
            cursorHalo.style.setProperty('--mouse-x', `${e.clientX}px`);
            cursorHalo.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }
});
