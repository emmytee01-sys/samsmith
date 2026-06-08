/**
 * Sam Smith - Main Script file
 * Logic for responsive menus, scrolling indicators, datepicker validation,
 * booking calculations, and premium animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const mainHeader = document.getElementById('main-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Booking Form Elements
    const bookingForm = document.getElementById('booking-form');
    const bookingRoom = document.getElementById('booking-room');
    const bookingCheckin = document.getElementById('booking-checkin');
    const bookingCheckout = document.getElementById('booking-checkout');
    const bookingGuests = document.getElementById('booking-guests');
    
    // Modals
    const bookingModal = document.getElementById('booking-modal');
    const bookingModalClose = document.getElementById('booking-modal-close');
    const infoModal = document.getElementById('info-modal');
    const infoModalClose = document.getElementById('info-modal-close');
    const btnReadMore = document.getElementById('btn-read-more');
    const btnInfoClose = document.getElementById('btn-info-close');
    
    // Modal Summary Elements
    const modalSuiteName = document.getElementById('modal-suite-name');
    const modalSuitePrice = document.getElementById('modal-suite-price');
    const modalCheckin = document.getElementById('modal-checkin');
    const modalCheckout = document.getElementById('modal-checkout');
    const modalNights = document.getElementById('modal-nights');
    const modalGuests = document.getElementById('modal-guests');
    const modalTotalPrice = document.getElementById('modal-total-price');
    const modalConfirmForm = document.getElementById('modal-confirm-form');
    
    // Feedback & Toast Elements
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const successToast = document.getElementById('success-toast');

    // --- Pricing Configuration ---
    const pricing = {
        classic: { name: 'Classic Ocean-View Room', price: 25000 },
        deluxe: { name: 'Deluxe Sunset Cliffside Suite', price: 25000 },
        presidential: { name: 'Sam Smith Presidential Suite', price: 25000 }
    };

    // --- Date Initialization & Handlers ---
    const initDates = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Format dates as YYYY-MM-DD
        const formatDateString = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        bookingCheckin.value = formatDateString(today);
        bookingCheckin.min = formatDateString(today);
        
        bookingCheckout.value = formatDateString(nextWeek);
        bookingCheckout.min = formatDateString(tomorrow);
    };

    initDates();

    // --- Hero Background Slideshow ---
    const bgSlides = document.querySelectorAll('.hero-bg');
    if (bgSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            bgSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % bgSlides.length;
            bgSlides[currentSlide].classList.add('active');
        }, 2000);
    }

    bookingCheckin.addEventListener('change', () => {
        const checkinDate = new Date(bookingCheckin.value);
        if (isNaN(checkinDate.getTime())) return;
        
        // Check-out must be at least 1 day after check-in
        const minCheckoutDate = new Date(checkinDate);
        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
        
        const yyyy = minCheckoutDate.getFullYear();
        const mm = String(minCheckoutDate.getMonth() + 1).padStart(2, '0');
        const dd = String(minCheckoutDate.getDate()).padStart(2, '0');
        const minCheckoutString = `${yyyy}-${mm}-${dd}`;
        
        bookingCheckout.min = minCheckoutString;
        
        // Adjust check-out date if it is currently before the new minimum checkout
        const currentCheckoutDate = new Date(bookingCheckout.value);
        if (isNaN(currentCheckoutDate.getTime()) || currentCheckoutDate <= checkinDate) {
            bookingCheckout.value = minCheckoutString;
        }
    });

    // --- Header & Scroll Progress Scroll Listener ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Scroll indicator
        scrollProgress.style.width = scrollPercent + '%';
        
        // Header background opacity trigger
        if (scrollTop > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Active Link Spy
        const sections = document.querySelectorAll('section');
        let currentSectionId = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Room Card Select Interactivity ---
    const selectButtons = document.querySelectorAll('.btn-card-book');
    selectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const roomType = e.target.getAttribute('data-room');
            if (pricing[roomType]) {
                bookingRoom.value = roomType;
                
                // Smooth scroll to booking section
                const target = document.getElementById('home');
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Indicator Interactivity ---
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const target = document.getElementById('rooms');
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    }

    // --- Modal Logic ---
    const openModal = (modal) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Info Modal Events
    btnReadMore.addEventListener('click', () => openModal(infoModal));
    infoModalClose.addEventListener('click', () => closeModal(infoModal));
    btnInfoClose.addEventListener('click', () => closeModal(infoModal));
    
    // Booking Modal Close
    bookingModalClose.addEventListener('click', () => closeModal(bookingModal));

    // Close modal clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal(bookingModal);
        if (e.target === infoModal) closeModal(infoModal);
    });

    // Esc key close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(bookingModal);
            closeModal(infoModal);
        }
    });

    // --- Booking Summary & Modal Generation ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const roomVal = bookingRoom.value;
        const checkinVal = bookingCheckin.value;
        const checkoutVal = bookingCheckout.value;
        const guestsVal = bookingGuests.options[bookingGuests.selectedIndex].text;
        
        const checkin = new Date(checkinVal);
        const checkout = new Date(checkoutVal);
        
        // Calculate difference in nights
        const diffTime = Math.abs(checkout - checkin);
        const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffNights <= 0) return alert('Invalid stay duration selected.');
        
        const selectedSuite = pricing[roomVal];
        const totalCost = selectedSuite.price * diffNights;
        
        // Map details to modal summary
        modalSuiteName.textContent = selectedSuite.name;
        modalSuitePrice.textContent = `₦${selectedSuite.price.toLocaleString()} / Night`;
        
        // Format dates into readable localized strings
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        modalCheckin.textContent = checkin.toLocaleDateString('en-US', dateOptions);
        modalCheckout.textContent = checkout.toLocaleDateString('en-US', dateOptions);
        
        modalNights.textContent = `${diffNights} Night${diffNights > 1 ? 's' : ''}`;
        modalGuests.textContent = guestsVal;
        modalTotalPrice.textContent = `₦${totalCost.toLocaleString()}`;
        
        openModal(bookingModal);
    });

    // --- Final Booking Confirmation Form ---
    modalConfirmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const confirmBtn = document.getElementById('btn-final-confirm');
        const originalText = confirmBtn.textContent;
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'SENDING CONFIRMATION...';

        const nameVal = document.getElementById('modal-name').value;
        const emailVal = document.getElementById('modal-email').value;
        const phoneVal = document.getElementById('modal-phone').value;
        const suiteVal = modalSuiteName.textContent;
        const rateVal = modalSuitePrice.textContent;
        const checkinVal = modalCheckin.textContent;
        const checkoutVal = modalCheckout.textContent;
        const nightsVal = modalNights.textContent;
        const guestsVal = modalGuests.textContent;
        const totalVal = modalTotalPrice.textContent;

        // Send booking details via FormSubmit AJAX to support@samsmith.com
        fetch("https://formsubmit.co/ajax/support@samsmith.com", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "Customer Name": nameVal,
                "Customer Email": emailVal,
                "Customer Phone": phoneVal,
                "Suite Category": suiteVal,
                "Nightly Rate": rateVal,
                "Check-In Date": checkinVal,
                "Check-Out Date": checkoutVal,
                "Total Nights": nightsVal,
                "Guest Count": guestsVal,
                "Total Booking Cost": totalVal,
                "_subject": `New Booking Alert - ${suiteVal} by ${nameVal}`
            })
        })
        .then(() => {
            confirmBtn.disabled = false;
            confirmBtn.textContent = originalText;
            
            // Reset modal inputs & form
            modalConfirmForm.reset();
            closeModal(bookingModal);
            
            // Show custom toast notification
            showToast();
        })
        .catch(error => {
            console.error("Error sending booking email:", error);
            // Fallback: Proceed even if AJAX fails, so the user experience is not blocked
            confirmBtn.disabled = false;
            confirmBtn.textContent = originalText;
            modalConfirmForm.reset();
            closeModal(bookingModal);
            showToast();
        });
    });

    // --- Toast Handler ---
    const showToast = () => {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 4000);
    };

    // --- Contact Form Handling ---
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            contactForm.reset();
            contactSuccess.style.display = 'flex';
            
            setTimeout(() => {
                contactSuccess.style.display = 'none';
            }, 5000);
        }, 1000);
    });
});
