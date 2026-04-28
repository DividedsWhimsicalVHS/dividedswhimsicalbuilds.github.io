// Image Gallery Management
function addImageToGallery(galleryId) {
    const gallery = document.getElementById(galleryId);
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.id = 'placeholder-' + Date.now();

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    const img = document.createElement('img');
    img.style.display = 'none';

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                img.src = event.target.result;
                img.style.display = 'block';
                placeholder.innerHTML = '';
                placeholder.appendChild(img);
                addRemoveButton(placeholder);
            };
            reader.readAsDataURL(file);
        }
    });

    placeholder.appendChild(input);
    const textNode = document.createElement('p');
    textNode.textContent = 'Click to add image';
    textNode.className = 'placeholder-text';
    placeholder.appendChild(textNode);

    placeholder.addEventListener('click', () => input.click());

    gallery.appendChild(placeholder);
}

// Add Remove Button to Images
function addRemoveButton(placeholder) {
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '✕';
    removeBtn.type = 'button';
    removeBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    `;
    
    removeBtn.addEventListener('mouseover', () => {
        removeBtn.style.background = 'rgba(255, 0, 0, 1)';
    });
    
    removeBtn.addEventListener('mouseout', () => {
        removeBtn.style.background = 'rgba(255, 0, 0, 0.8)';
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        placeholder.remove();
    });

    placeholder.appendChild(removeBtn);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'Guest';
        const email = formData.get('email') || 'unknown@example.com';
        const message = formData.get('message') || '';

        // Show success message
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.disabled = true;

        // Reset form
        contactForm.reset();

        // Reset button after 2 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);

        console.log('Form submitted:', { name, email, message });
    });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe showcase sections
document.querySelectorAll('.showcase-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Dynamic gallery initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to gallery add buttons if they exist
    const galleryIds = [
        'gunshopsGallery',
        'carDealershipsGallery',
        'vhsShopsGallery',
        'eventShopsGallery',
        'cafesGallery'
    ];

    galleryIds.forEach(galleryId => {
        const gallery = document.getElementById(galleryId);
        if (gallery && gallery.children.length > 0) {
            // Make existing placeholders clickable for adding images
            const firstPlaceholder = gallery.querySelector('.image-placeholder');
            if (firstPlaceholder) {
                firstPlaceholder.addEventListener('click', () => {
                    addImageToGallery(galleryId);
                });
            }
        }
    });
});

// Utility: Dark mode toggle (optional feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Export functions for external use
window.addImageToGallery = addImageToGallery;
window.toggleDarkMode = toggleDarkMode;
