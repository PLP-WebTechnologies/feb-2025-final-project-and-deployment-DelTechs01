// Hardcoded Data
const destinations = [
    { name: 'Paris', region: 'Europe', image: 'https://i.pinimg.com/736x/3d/f8/9f/3df89ff2ef171d95ed22b457e4c09400.jpg', description: 'The City of Lights, known for the Eiffel Tower and rich culture.', lat: 48.8566, lng: 2.3522 },
    { name: 'Tokyo', region: 'Asia', image: 'https://i.pinimg.com/736x/3f/d1/1c/3fd11cde6740d8a6c1f9b0e93596230e.jpg', description: 'A vibrant metropolis blending tradition and modernity.', lat: 35.6762, lng: 139.6503 },
    { name: 'Santorini', region: 'Europe', image: 'https://i.pinimg.com/736x/94/d5/c1/94d5c1a4b0fe0cc3c105dd0472953c64.jpg', description: 'Stunning island with whitewashed buildings and blue domes.', lat: 36.3932, lng: 25.4615 },
    { name: 'New York', region: 'North America', image: 'https://i.pinimg.com/736x/82/35/ce/8235cea867da62c679f7f7603545c320.jpg', description: 'The city that never sleeps, famous for Times Square.', lat: 40.7128, lng: -74.0060 },
  ];
  
  const blogPosts = [
    {
      id: 1,
      title: 'A Week in Paris',
      excerpt: 'Exploring the romantic streets and iconic landmarks of Paris.',
      content: 'From the Eiffel Tower to the Louvre, Paris is a dream destination...',
      image: 'https://i.pinimg.com/736x/8a/e9/99/8ae999537dfdc473c8af9a9c2a2b6859.jpg',
      likes: 0,
      comments: [],
    },
    {
      id: 2,
      title: 'Tokyo Adventures',
      excerpt: 'Diving into the neon-lit streets and serene temples of Tokyo.',
      content: 'Tokyo offers a perfect blend of futuristic vibes and ancient traditions...',
      image: 'https://i.pinimg.com/736x/26/d9/45/26d945bc383f77ef6f6b5a36f80529b0.jpg',
      likes: 0,
      comments: [],
    },
  ];
  
  const galleryImages = [
    { src: 'https://i.pinimg.com/736x/79/7a/25/797a258c020baa1cbbe64910bbb07361.jpg', alt: 'Eiffel Tower in Paris' },
    { src: 'https://i.pinimg.com/736x/23/15/54/2315548891ddb9b7b8ec25e5acd1b475.jpg', alt: 'Tokyo skyline at night' },
    { src: 'https://i.pinimg.com/736x/26/b3/0c/26b30c0400e3a27cc9aaf7de789e7ac7.jpg', alt: 'Santorini blue domes' },
    { src: 'https://i.pinimg.com/736x/01/36/78/0136787a3d562a8392531f7955424dd0.jpg', alt: 'New York Times Square' },
  ];
  
  // Initialize Local Storage
  function initLocalStorage() {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      blogPosts.forEach((post, index) => {
        const stored = JSON.parse(storedPosts)[index];
        post.likes = stored.likes || 0;
        post.comments = stored.comments || [];
      });
    }
  }
  initLocalStorage();
  
  // GSAP Animations
  gsap.from('header', { y: -100, opacity: 0, duration: 1, ease: 'power2.out' });
  gsap.from('.btn-neon', { scale: 0.8, opacity: 0, delay: 1, duration: 0.8 });
  
  // Dynamic Year in Footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
    themeIcon.innerHTML = currentTheme === 'dark' ?
      '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"/>' :
      '<path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14z"/>';
    localStorage.setItem('theme', document.body.dataset.theme);
    showToast('Theme changed');
  });
  
  // Load Theme from Local Storage
  document.body.dataset.theme = localStorage.getItem('theme') || 'dark';
  
  // Smooth Scroll for Nav Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Debounce Utility
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Search Functionality
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase();
    const filteredDestinations = destinations.filter(dest =>
      dest.name.toLowerCase().includes(query) || dest.region.toLowerCase().includes(query)
    );
    renderDestinations(filteredDestinations);
  }, 300));
  
  // Render Destinations with Weather
  async function renderDestinations(destinationsToRender) {
    const destinationList = document.getElementById('destination-list');
    destinationList.innerHTML = '';
    for (const dest of destinationsToRender) {
      const weather = await fetchWeather(dest.name);
      destinationList.innerHTML += `
        <div class="card">
          <img src="${dest.image}" alt="${dest.name}" class="w-full h-48 object-cover rounded-lg mb-4" loading="lazy">
          <h3 class="text-xl font-bold">${dest.name}</h3>
          <p class="text-sm text-gray-400">${dest.region}</p>
          <p>${dest.description}</p>
          <p class="text-sm mt-2">Weather: ${weather || 'N/A'}</p>
        </div>
      `;
    }
  }
  renderDestinations(destinations);
  
  // Fetch Weather from OpenWeatherMap
  async function fetchWeather(city) {
    const apiKey = '1c130d2b3c2cbb25dcea384ed212f5a2'; // Replace with your API key
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      if (!response.ok) throw new Error('Weather data not available');
      const data = await response.json();
      return `${data.main.temp}°C, ${data.weather[0].description}`;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  // Render Blog Posts
  function renderBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    blogContainer.innerHTML = blogPosts.map(post => `
      <article class="card">
        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover rounded-lg mb-4" loading="lazy">
        <h3 class="text-xl font-bold">${post.title}</h3>
        <p>${post.excerpt}</p>
        <p class="mt-2">${post.content}</p>
        <button class="like-btn btn-neon mt-4" data-id="${post.id}">Like (${post.likes})</button>
        <div class="comment-section mt-4">
          <h4 class="text-sm font-bold">Comments</h4>
          <div class="comments">
            ${post.comments.map(comment => `<p class="text-sm">${comment}</p>`).join('')}
          </div>
          <form class="comment-form mt-2" data-id="${post.id}">
            <input type="text" class="comment-input w-full p-2 rounded bg-gray-800 text-white" placeholder="Add a comment..." required aria-label="Add a comment">
            <button type="submit" class="btn-neon mt-2">Post</button>
          </form>
        </div>
      </article>
    `).join('');
  
    // Add Like Button Listeners
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = parseInt(btn.dataset.id);
        const post = blogPosts.find(p => p.id === postId);
        post.likes += 1;
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        renderBlogPosts();
        showToast('Post liked!');
      });
    });
  
    // Add Comment Form Listeners
    document.querySelectorAll('.comment-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = parseInt(form.dataset.id);
        const input = form.querySelector('.comment-input');
        const comment = input.value.trim();
        if (comment) {
          const post = blogPosts.find(p => p.id === postId);
          post.comments.push(comment);
          input.value = '';
          localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
          renderBlogPosts();
          showToast('Comment added!');
        }
      });
    });
  }
  renderBlogPosts();
  
  // Render Gallery
  function renderGallery() {
    const gallerySlider = document.querySelector('#gallery-slider .swiper-wrapper');
    gallerySlider.innerHTML = galleryImages.map(img => `
      <div class="swiper-slide">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
      </div>
    `).join('');
  }
  renderGallery();
  
  // Initialize Swiper for Gallery
  const swiper = new Swiper('#gallery-slider', {
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-prev', prevEl: '.swiper-button-next' },
    autoplay: { delay: 5000 },
  });
  
  // Contact Form Validation and Submission
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    if (validateForm(name, email, message)) {
      showToast(`Thank you, ${name}! Your message has been sent.`);
      contactForm.reset();
    }
  });
  
  // Real-Time Form Validation
  ['name', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      validateField(id, input.value);
    });
  });
  
  function validateField(id, value) {
    const error = document.getElementById(`${id}-error`);
    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error.classList.toggle('hidden', emailRegex.test(value) || !value);
    } else {
      error.classList.toggle('hidden', !!value);
    }
  }
  
  function validateForm(name, email, message) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = name && emailRegex.test(email) && message;
    validateField('name', name);
    validateField('email', email);
    validateField('message', message);
    return isValid;
  }
  
  // Toast Notification
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
  
  // Initialize Globe.gl
  const globe = Globe()(document.getElementById('globe'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .pointsData(destinations)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor(() => '#00ffcc')
    .pointRadius(0.5)
    .pointAltitude(0.1)
    .pointLabel('name')
    .onPointClick(dest => {
      showToast(`Explore ${dest.name}!`);
      const filtered = destinations.filter(d => d.name === dest.name);
      renderDestinations(filtered);
    });
  
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }