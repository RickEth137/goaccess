// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.top-nav');
    const videoBackground = document.querySelector('.fixed-video-bg');
    const aboutSection = document.querySelector('#about');
    const scrolled = window.pageYOffset;
    
    // Navbar opacity
    if (scrolled > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Progressive blur effect based on scroll position
    // Cap the blur when reaching the about section
    const aboutSectionTop = aboutSection ? aboutSection.offsetTop : window.innerHeight;
    const maxScrollForBlur = aboutSectionTop;
    const scrollProgress = Math.min(scrolled / maxScrollForBlur, 1);
    
    // Calculate blur amount: starts at 0px, goes up to 25px, then stays at 25px
    const blurAmount = scrollProgress * 25;
    
    // Apply blur to video background only
    if (videoBackground) {
        videoBackground.style.filter = `blur(${blurAmount}px)`;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Observe service cards for staggered animation
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
    observer.observe(card);
});

// Video loading optimization
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('fixed-bg-video');
    
    // Ensure video starts playing on mobile devices
    if (video) {
        video.play().catch(e => {
            console.log('Auto-play was prevented:', e);
        });
    }
});

// Villa Carousel Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.villa-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const translateX = -currentSlideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update active slide
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlideIndex);
    });
    
    // Update active indicator
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });
}

function moveSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    updateCarousel();
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    updateCarousel();
}

// Auto-play carousel
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Start auto-play when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (slides.length > 0) {
        updateCarousel();
        startAutoPlay();
        
        // Pause auto-play when user hovers over carousel
        const carouselContainer = document.querySelector('.villa-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }
    }
});

// Touch/swipe support for mobile
let startX = 0;
let isDragging = false;

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.villa-carousel');
    
    if (carousel) {
        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoPlay();
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    moveSlide(1); // Swipe left - next slide
                } else {
                    moveSlide(-1); // Swipe right - previous slide
                }
            }
            
            startAutoPlay();
        });
        
        // Mouse events for desktop
        carousel.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            stopAutoPlay();
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        carousel.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    moveSlide(1);
                } else {
                    moveSlide(-1);
                }
            }
            
            startAutoPlay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }
});

// Button click animations
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// VILLASLUX Interactive Map System
class VillasLuxMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.villaData = [];
        this.filteredVillas = [];
        this.currentPopup = null;
        
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        this.initializeVillaData();
        await this.initializeMap();
        this.setupFilterHandlers();
        this.addVillasToMap();
        this.updateResultsCounter();
    }

    initializeVillaData() {
        // Real villa data from your database
        this.villaData = [
            // TULUM, MEXICO VILLAS
            {
                id: 1,
                name: "Tulum Beachfront Villa HOZ2015",
                location: "Tulum, México",
                coordinates: [-87.4653, 20.2114],
                price: 2500,
                guests: 14,
                bedrooms: 5,
                type: "beachfront",
                amenities: ["infinity-pool", "spa", "chef"],
                activities: ["diving", "spa"],
                image: "Villas/modern-villa-with-ocean-view-infinity-pool.jpg",
                description: "Luxury beachfront villa in Tulum's hotel zone with stunning ocean views",
                provider: "Sbx Travel",
                code: "HOZ2015"
            },
            {
                id: 2,
                name: "Tulum Ocean Villa HOZ2039",
                location: "Tulum, México",
                coordinates: [-87.4643, 20.2104],
                price: 3200,
                guests: 18,
                bedrooms: 10,
                type: "beachfront",
                amenities: ["infinity-pool", "chef"],
                activities: ["diving", "spa"],
                image: "Villas/modern-villa-with-ocean-view-sunset.jpg",
                description: "Spectacular beachfront villa perfect for large groups in Tulum",
                provider: "Sbx Travel",
                code: "HOZ2039"
            },
            {
                id: 3,
                name: "Tulum Beach View Villa HOZ2040",
                location: "Tulum, México",
                coordinates: [-87.4633, 20.2094],
                price: 2000,
                guests: 12,
                bedrooms: 6,
                type: "beachfront",
                amenities: ["infinity-pool", "spa"],
                activities: ["diving"],
                image: "Villas/home-has-swimming-pool-view-ocean.jpg",
                description: "Beautiful beach view villa with tropical garden in Tulum",
                provider: "Sbx Travel",
                code: "HOZ2040"
            },
            {
                id: 4,
                name: "Tulum Luxury Estate HOZ2046",
                location: "Tulum, México",
                coordinates: [-87.4623, 20.2084],
                price: 4500,
                guests: 24,
                bedrooms: 12,
                type: "beachfront",
                amenities: ["infinity-pool", "spa", "chef", "gym"],
                activities: ["diving", "spa"],
                image: "Villas/home-is-market-1-5-million.jpg",
                description: "Ultimate luxury beachfront estate for exclusive gatherings",
                provider: "Sbx Travel",
                code: "HOZ2046"
            },
            {
                id: 5,
                name: "Sian Ka'an Beachfront SIK3006",
                location: "Tulum, México",
                coordinates: [-87.4213, 20.1894],
                price: 2800,
                guests: 12,
                bedrooms: 5,
                type: "beachfront",
                amenities: ["infinity-pool", "chef"],
                activities: ["diving", "spa"],
                image: "Villas/modern-building-with-swimming-pool-trees-chairs-urban-landscape-with-blue-sky-reflecting-pool.jpg",
                description: "Secluded beachfront villa in pristine Sian Ka'an reserve",
                provider: "Sbx Travel",
                code: "SIK3006"
            },
            {
                id: 6,
                name: "Aldea Zama Luxury Villa AZA1084",
                location: "Tulum, México",
                coordinates: [-87.4293, 20.2014],
                price: 3500,
                guests: 20,
                bedrooms: 10,
                type: "city",
                amenities: ["infinity-pool", "spa", "gym"],
                activities: ["spa", "shopping"],
                image: "Villas/home-person-is-market-1-5-million.jpg",
                description: "Modern luxury villa in exclusive Aldea Zama community",
                provider: "Sbx Travel",
                code: "AZA1084"
            },
            
            // IBIZA, SPAIN VILLAS
            {
                id: 7,
                name: "Villa Armonía",
                location: "Sant Josep, Ibiza",
                coordinates: [1.3366, 38.9653],
                price: 4200,
                guests: 10,
                bedrooms: 5,
                type: "mountain",
                amenities: ["infinity-pool", "spa", "chef"],
                activities: ["nightlife", "shopping"],
                image: "Villas/modern-villa-with-ocean-view-infinity-pool.jpg",
                description: "Elegant villa with breathtaking views in Sant Josep",
                provider: "VIP Soul",
                code: "Armonía"
            },
            {
                id: 8,
                name: "Villa Azahara",
                location: "Sant Josep, Ibiza",
                coordinates: [1.3356, 38.9643],
                price: 5500,
                guests: 12,
                bedrooms: 6,
                type: "mountain",
                amenities: ["infinity-pool", "spa", "chef", "gym"],
                activities: ["nightlife", "shopping"],
                image: "Villas/modern-villa-with-ocean-view-sunset.jpg",
                description: "Luxury villa with panoramic sea views and modern amenities",
                provider: "VIP Soul",
                code: "Azahara"
            },
            {
                id: 9,
                name: "Exclusive Estate",
                location: "Ibiza, Spain",
                coordinates: [1.4823, 38.9067],
                price: 8500,
                guests: 15,
                bedrooms: 6,
                type: "private-island",
                amenities: ["infinity-pool", "spa", "chef", "helipad"],
                activities: ["nightlife", "shopping"],
                image: "Villas/home-has-swimming-pool-view-ocean.jpg",
                description: "Ultra-exclusive estate with unparalleled luxury and privacy",
                provider: "VIP Soul",
                code: "Exclusive Estate"
            },
            {
                id: 10,
                name: "Can Flowers",
                location: "Santa Eulalia, Ibiza",
                coordinates: [1.5320, 38.9845],
                price: 6200,
                guests: 13,
                bedrooms: 7,
                type: "beachfront",
                amenities: ["infinity-pool", "chef"],
                activities: ["diving", "nightlife"],
                image: "Villas/home-is-market-1-5-million.jpg",
                description: "Charming villa with beautiful gardens near Santa Eulalia",
                provider: "VIP Soul",
                code: "Can Flowers"
            },
            {
                id: 11,
                name: "Villa Talamanca",
                location: "Talamanca, Ibiza",
                coordinates: [1.4423, 38.9267],
                price: 3800,
                guests: 8,
                bedrooms: 4,
                type: "beachfront",
                amenities: ["infinity-pool", "spa"],
                activities: ["diving", "nightlife"],
                image: "Villas/modern-building-with-swimming-pool-trees-chairs-urban-landscape-with-blue-sky-reflecting-pool.jpg",
                description: "Stylish villa steps away from Talamanca beach",
                provider: "VIP Soul",
                code: "Villa Talamanca"
            },
            {
                id: 12,
                name: "Marina Luxury Apartment",
                location: "Marina de Botafoch, Ibiza",
                coordinates: [1.4523, 38.9167],
                price: 2200,
                guests: 6,
                bedrooms: 3,
                type: "city",
                amenities: ["spa", "gym"],
                activities: ["nightlife", "shopping"],
                image: "Villas/home-person-is-market-1-5-million.jpg",
                description: "Sophisticated apartment in prestigious Marina de Botafoch",
                provider: "VIP Soul",
                code: "Paul Apartment"
            },
            
            // LISBOA, PORTUGAL VILLAS
            {
                id: 13,
                name: "Aroeira Mansion",
                location: "Aroeira, Lisboa",
                coordinates: [-9.2319, 38.5755],
                price: 3200,
                guests: 10,
                bedrooms: 4,
                type: "mountain",
                amenities: ["infinity-pool", "spa", "gym"],
                activities: ["golf", "spa"],
                image: "Villas/modern-villa-with-ocean-view-infinity-pool.jpg",
                description: "Magnificent mansion in exclusive Aroeira resort community",
                provider: "Vhils",
                code: "Aroeira Mansion"
            },
            {
                id: 14,
                name: "Green Cabin",
                location: "Costa da Caparica, Lisboa",
                coordinates: [-9.2419, 38.5655],
                price: 1200,
                guests: 4,
                bedrooms: 2,
                type: "beachfront",
                amenities: ["spa"],
                activities: ["diving", "spa"],
                image: "Villas/modern-villa-with-ocean-view-sunset.jpg",
                description: "Charming beachfront cabin with direct beach access",
                provider: "Vhils",
                code: "Green Cabin"
            },
            {
                id: 15,
                name: "Melides Art Villa",
                location: "Melides, Lisboa",
                coordinates: [-8.7846, 38.1398],
                price: 2800,
                guests: 8,
                bedrooms: 4,
                type: "beachfront",
                amenities: ["infinity-pool", "spa"],
                activities: ["diving", "spa"],
                image: "Villas/home-has-swimming-pool-view-ocean.jpg",
                description: "Artistic villa with contemporary design near pristine beaches",
                provider: "Vhils",
                code: "Melides Art"
            }
        ];

        this.filteredVillas = [...this.villaData];
    }

    async initializeMap() {
        // You'll need to get a free Mapbox token from https://account.mapbox.com/
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ29hY2Nlc3MiLCJhIjoiY21na2lmemh4MHVsMjJpb2s3Y3Z2bThsciJ9.h5z9fEcDpWa0KcFZhgzczg';
        
        this.map = new mapboxgl.Map({
            container: 'villa-map',
            style: 'mapbox://styles/mapbox/dark-v11', // Luxury dark theme
            center: [0, 20], // Start centered on world
            zoom: 1.5,
            attributionControl: false
        });

        // Add custom controls
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Remove loading screen when map loads
        this.map.on('load', () => {
            document.querySelector('.map-loading').style.display = 'none';
        });

        // Handle map control buttons
        this.setupMapControls();
    }

    setupMapControls() {
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.map.zoomIn();
        });

        document.getElementById('zoom-out').addEventListener('click', () => {
            this.map.zoomOut();
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.map.flyTo({
                center: [0, 20],
                zoom: 1.5,
                duration: 2000
            });
        });
    }

    setupFilterHandlers() {
        // Location search
        const locationInput = document.getElementById('location-search');
        locationInput.addEventListener('input', (e) => {
            this.applyFilters();
        });

        // Date inputs
        document.getElementById('checkin-date').addEventListener('change', () => this.applyFilters());
        document.getElementById('checkout-date').addEventListener('change', () => this.applyFilters());

        // Guest count slider
        const guestSlider = document.getElementById('guest-count');
        const guestValue = guestSlider.nextElementSibling;
        guestSlider.addEventListener('input', (e) => {
            guestValue.textContent = `${e.target.value} guests`;
            this.applyFilters();
        });

        // Price range slider
        const priceSlider = document.getElementById('price-range');
        const priceValue = priceSlider.nextElementSibling;
        priceSlider.addEventListener('input', (e) => {
            priceValue.textContent = `$${parseInt(e.target.value).toLocaleString()}`;
            this.applyFilters();
        });

        // Checkbox filters
        document.querySelectorAll('.villa-type-filter, .amenity-filter, .activity-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Filter action buttons
        document.querySelector('.btn-clear').addEventListener('click', () => this.clearAllFilters());
        document.querySelector('.btn-apply').addEventListener('click', () => this.applyFilters());
    }

    applyFilters() {
        const filters = this.getFilterValues();
        
        this.filteredVillas = this.villaData.filter(villa => {
            // Location filter
            if (filters.location && !villa.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Guest count filter
            if (villa.guests < filters.guests) {
                return false;
            }

            // Price filter
            if (villa.price > filters.maxPrice) {
                return false;
            }

            // Villa type filter
            if (filters.villaTypes.length > 0 && !filters.villaTypes.includes(villa.type)) {
                return false;
            }

            // Amenities filter
            if (filters.amenities.length > 0) {
                const hasRequiredAmenities = filters.amenities.every(amenity => 
                    villa.amenities.includes(amenity)
                );
                if (!hasRequiredAmenities) {
                    return false;
                }
            }

            // Activities filter
            if (filters.activities.length > 0) {
                const hasRequiredActivities = filters.activities.some(activity => 
                    villa.activities.includes(activity)
                );
                if (!hasRequiredActivities) {
                    return false;
                }
            }

            return true;
        });

        this.updateMarkersOnMap();
        this.updateResultsCounter();
    }

    getFilterValues() {
        return {
            location: document.getElementById('location-search').value,
            checkin: document.getElementById('checkin-date').value,
            checkout: document.getElementById('checkout-date').value,
            guests: parseInt(document.getElementById('guest-count').value),
            maxPrice: parseInt(document.getElementById('price-range').value),
            villaTypes: Array.from(document.querySelectorAll('.villa-type-filter:checked')).map(cb => cb.value),
            amenities: Array.from(document.querySelectorAll('.amenity-filter:checked')).map(cb => cb.value),
            activities: Array.from(document.querySelectorAll('.activity-filter:checked')).map(cb => cb.value)
        };
    }

    clearAllFilters() {
        document.getElementById('location-search').value = '';
        document.getElementById('checkin-date').value = '';
        document.getElementById('checkout-date').value = '';
        document.getElementById('guest-count').value = 2;
        document.querySelector('#guest-count + .slider-value').textContent = '2 guests';
        document.getElementById('price-range').value = 2000;
        document.querySelector('#price-range + .slider-value').textContent = '$2,000';
        
        document.querySelectorAll('.villa-type-filter, .amenity-filter, .activity-filter').forEach(cb => {
            cb.checked = false;
        });

        this.filteredVillas = [...this.villaData];
        this.updateMarkersOnMap();
        this.updateResultsCounter();
    }

    addVillasToMap() {
        this.filteredVillas.forEach(villa => {
            this.addMarkerToMap(villa);
        });
    }

    addMarkerToMap(villa) {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'villa-marker';
        markerElement.innerHTML = `
            <div class="villa-marker-icon">
                <span>🏖️</span>
                <div class="villa-marker-price">$${villa.price.toLocaleString()}</div>
            </div>
        `;

        // Add marker styles
        const markerStyle = `
            .villa-marker {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .villa-marker:hover {
                transform: scale(1.1);
            }
            .villa-marker-icon {
                background: linear-gradient(135deg, #0ea5e9, #1e40af);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
                text-align: center;
                font-weight: 600;
                border: 2px solid white;
            }
            .villa-marker-price {
                font-size: 10px;
                margin-top: 2px;
            }
        `;

        if (!document.getElementById('villa-marker-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'villa-marker-styles';
            styleSheet.textContent = markerStyle;
            document.head.appendChild(styleSheet);
        }

        // Create popup content
        const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            className: 'villa-popup'
        }).setHTML(`
            <div class="villa-popup-content">
                <img src="${villa.image}" alt="${villa.name}" class="villa-popup-image">
                <div class="villa-popup-info">
                    <h3>${villa.name}</h3>
                    <p class="villa-location">📍 ${villa.location}</p>
                    <p class="villa-description">${villa.description}</p>
                    <div class="villa-details">
                        <span class="villa-price">$${villa.price.toLocaleString()}/night</span>
                        <span class="villa-guests">👥 ${villa.guests} guests</span>
                    </div>
                    <div class="villa-amenities">
                        ${villa.amenities.map(amenity => `<span class="amenity-tag">${this.getAmenityIcon(amenity)} ${this.formatAmenity(amenity)}</span>`).join('')}
                    </div>
                    <button class="villa-book-btn">Book Now</button>
                </div>
            </div>
        `);

        // Add popup styles
        const popupStyle = `
            .villa-popup .mapboxgl-popup-content {
                padding: 0;
                border-radius: 15px;
                overflow: hidden;
                max-width: 300px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            .villa-popup-image {
                width: 100%;
                height: 150px;
                object-fit: cover;
            }
            .villa-popup-info {
                padding: 1rem;
            }
            .villa-popup-info h3 {
                margin: 0 0 0.5rem 0;
                color: #333;
                font-size: 1.1rem;
            }
            .villa-location {
                color: #666;
                font-size: 0.9rem;
                margin: 0 0 0.5rem 0;
            }
            .villa-description {
                color: #555;
                font-size: 0.85rem;
                line-height: 1.4;
                margin: 0 0 1rem 0;
            }
            .villa-details {
                display: flex;
                justify-content: space-between;
                margin: 0 0 1rem 0;
            }
            .villa-price {
                color: #0ea5e9;
                font-weight: 700;
                font-size: 1rem;
            }
            .villa-guests {
                color: #666;
                font-size: 0.9rem;
            }
            .villa-amenities {
                display: flex;
                flex-wrap: wrap;
                gap: 0.25rem;
                margin: 0 0 1rem 0;
            }
            .amenity-tag {
                background: #f0f9ff;
                color: #0ea5e9;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 500;
            }
            .villa-book-btn {
                width: 100%;
                background: linear-gradient(135deg, #0ea5e9, #1e40af);
                color: white;
                border: none;
                padding: 0.75rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .villa-book-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3);
            }
        `;

        if (!document.getElementById('villa-popup-styles')) {
            const popupStyleSheet = document.createElement('style');
            popupStyleSheet.id = 'villa-popup-styles';
            popupStyleSheet.textContent = popupStyle;
            document.head.appendChild(popupStyleSheet);
        }

        // Create and add marker
        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat(villa.coordinates)
            .setPopup(popup)
            .addTo(this.map);

        this.markers.push({ marker, villa, element: markerElement });
    }

    updateMarkersOnMap() {
        // Remove all existing markers
        this.markers.forEach(({ marker }) => marker.remove());
        this.markers = [];

        // Add filtered markers with animation
        this.filteredVillas.forEach((villa, index) => {
            setTimeout(() => {
                this.addMarkerToMap(villa);
            }, index * 100); // Staggered animation
        });

        // Fit map to show all filtered villas
        if (this.filteredVillas.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            this.filteredVillas.forEach(villa => {
                bounds.extend(villa.coordinates);
            });
            this.map.fitBounds(bounds, { padding: 50, duration: 1000 });
        }
    }

    updateResultsCounter() {
        const counter = document.getElementById('villa-count');
        const count = this.filteredVillas.length;
        counter.textContent = `${count} villa${count !== 1 ? 's' : ''} found`;
    }

    getAmenityIcon(amenity) {
        const icons = {
            'infinity-pool': '🏊',
            'spa': '🧘',
            'chef': '👨‍🍳',
            'gym': '💪',
            'yacht': '🛥️',
            'helipad': '🚁'
        };
        return icons[amenity] || '✨';
    }

    formatAmenity(amenity) {
        return amenity.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Initialize VillasLux when page loads
new VillasLuxMap();