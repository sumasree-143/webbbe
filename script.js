// Global variables
let currentSlide = 0;
let isLoggedIn = false;
let userProgress = {
    'python-basics': 65,
    'java-oop': 30,
    'python-web': 45
};
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    
    // Initialize dark mode
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Initialize bookmarks
    updateBookmarksUI();
    
    // Initialize mobile menu
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
});

// Slider functionality
function goToSlide(n) {
    const slider = document.getElementById('sliderContent');
    const dots = document.querySelectorAll('.slider-dot');
    
    currentSlide = n;
    slider.style.transform = `translateX(-${n * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === n);
    });
}

// Auto-advance slider
setInterval(() => {
    currentSlide = (currentSlide + 1) % 3;
    goToSlide(currentSlide);
}, 5000);

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.remove('hidden');
    
    // Update page title
    document.title = `CodeLearn Pro - ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`;
    
    // Close mobile menu if open
    document.getElementById('navLinks').classList.remove('active');
}

// Filter functions
function filterTutorials(filter) {
    const cards = document.querySelectorAll('.tutorial-card');
    const buttons = document.querySelectorAll('#tutorials .filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    cards.forEach(card => {
        const language = card.dataset.language;
        const difficulty = card.dataset.difficulty;
        
        if (filter === 'all' || 
            language === filter || 
            difficulty === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterProjects(filter) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('#projects .filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    cards.forEach(card => {
        const difficulty = card.dataset.difficulty;
        
        if (filter === 'all' || difficulty === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search functionality
function searchContent(query) {
    const tutorialCards = document.querySelectorAll('.tutorial-card');
    const projectCards = document.querySelectorAll('.project-card');
    
    const searchTerm = query.toLowerCase();
    
    [...tutorialCards, ...projectCards].forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = searchTerm === '' ? 'block' : 'none';
        }
    });
}

// Authentication functions
function showAuthModal(type) {
    const modal = document.getElementById('authModal');
    const content = document.getElementById('authContent');
    
    if (type === 'login') {
        content.innerHTML = `
            <h2>Log In to CodeLearn Pro</h2>
            <form onsubmit="handleLogin(event)">
                <div style="margin-bottom: 1rem;">
                    <input type="email" placeholder="Email" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <input type="password" placeholder="Password" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Log In</button>
                <p style="text-align: center;">
                    Don't have an account? 
                    <a href="#" onclick="showAuthModal('signup')" style="color: #667eea;">Sign up here</a>
                </p>
            </form>
        `;
    } else {
        content.innerHTML = `
            <h2>Join CodeLearn Pro</h2>
            <form onsubmit="handleSignup(event)">
                <div style="margin-bottom: 1rem;">
                    <input type="text" placeholder="Full Name" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <input type="email" placeholder="Email" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <input type="password" placeholder="Password" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <input type="password" placeholder="Confirm Password" required style="width: 100%; padding: 1rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Sign Up</button>
                <p style="text-align: center;">
                    Already have an account? 
                    <a href="#" onclick="showAuthModal('login')" style="color: #667eea;">Log in here</a>
                </p>
            </form>
        `;
    }
    
    modal.style.display = 'block';
}

function handleLogin(event) {
    event.preventDefault();
    // Simulate login
    isLoggedIn = true;
    updateAuthUI();
    closeModal('authModal');
    showNotification('Welcome back! You are now logged in.', 'success');
}

function handleSignup(event) {
    event.preventDefault();
    // Simulate signup
    isLoggedIn = true;
    updateAuthUI();
    closeModal('authModal');
    showNotification('Account created successfully! Welcome to CodeLearn Pro.', 'success');
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const dashboardBtn = document.getElementById('dashboardBtn');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <button class="theme-toggle" id="themeToggle" title="Toggle dark mode">
                <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
            </button>
            <button class="btn btn-primary" onclick="showSection('dashboard')">Dashboard</button>
            <button class="btn btn-secondary" onclick="logout()">Logout</button>
        `;
        document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
    }
}

function logout() {
    isLoggedIn = false;
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <button class="theme-toggle" id="themeToggle" title="Toggle dark mode">
            <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
        </button>
        <button class="btn btn-secondary" onclick="showAuthModal('login')">Log In</button>
        <button class="btn btn-primary" onclick="showAuthModal('signup')">Sign Up</button>
    `;
    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
    showSection('home');
    showNotification('You have been logged out.', 'success');
}

// Tutorial and Project functions
function startTutorial(tutorialId) {
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    const tutorials = {
        'python-basics': {
            title: 'Python Basics',
            description: 'Learn Python fundamentals step by step',
            lessons: [
                'Introduction to Python',
                'Variables and Data Types',
                'Control Structures',
                'Functions and Modules',
                'File Handling'
            ]
        },
        'js-dom': {
            title: 'JavaScript DOM Manipulation',
            description: 'Master dynamic web development',
            lessons: [
                'DOM Fundamentals',
                'Event Handling',
                'Dynamic Content',
                'Form Validation',
                'Advanced Interactions'
            ]
        }
    };
    
    const tutorial = tutorials[tutorialId] || tutorials['python-basics'];
    
    content.innerHTML = `
        <h2>${tutorial.title}</h2>
        <p>${tutorial.description}</p>
        <div style="margin: 2rem 0;">
            <h3>Course Content:</h3>
            <ul style="margin-left: 2rem;">
                ${tutorial.lessons.map(lesson => `<li style="margin: 0.5rem 0;">${lesson}</li>`).join('')}
            </ul>
        </div>
        <div style="margin: 2rem 0;">
            <h3>Interactive Code Practice:</h3>
            <textarea class="code-editor" placeholder="# Try writing some Python code here
print('Hello, Python!')
name = 'CodeLearn Pro'
print(f'Welcome to {name}')"></textarea>
            <div class="editor-buttons">
                <button class="run-btn" onclick="runTutorialCode()">
                    <i class="fas fa-play"></i> Run Code
                </button>
                <button class="reset-btn" onclick="resetTutorialCode()">
                    <i class="fas fa-redo"></i> Reset
                </button>
            </div>
            <div id="tutorialOutput" style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-top: 1rem; font-family: monospace;">
                <strong>Output:</strong><br>
                <div id="tutorialOutputContent">Run your code to see the output</div>
            </div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button class="btn btn-primary" onclick="continueLesson()">
                <i class="fas fa-arrow-right"></i> Continue Lesson
            </button>
            <button class="btn btn-secondary" onclick="closeModal('detailModal')">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function viewProject(projectId) {
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    const projects = {
        'calculator': {
            title: 'Calculator App',
            description: 'Build a functional calculator with HTML, CSS, and JavaScript',
            requirements: ['HTML structure', 'CSS styling', 'JavaScript logic', 'Event handling'],
            code: `<!DOCTYPE html>
<html>
<head><title>Calculator</title></head>
<body>
    <div class="calculator">
        <input type="text" id="display" readonly>
        <div class="buttons">
            <button onclick="clearDisplay()">C</button>
            <button onclick="appendToDisplay('/')">/</button>
            <button onclick="appendToDisplay('*')">*</button>
            <button onclick="deleteLast()">←</button>
        </div>
    </div>
</body>
</html>`
        },
        'weather': {
            title: 'Weather Dashboard',
            description: 'Create a weather app using APIs and responsive design',
            requirements: ['API integration', 'Responsive design', 'Data visualization', 'Local storage'],
            code: `// Weather API integration
async function getWeather(city) {
    const response = await fetch(\`https://api.weather.com/\${city}\`);
    const data = await response.json();
    return data;
}`
        }
    };
    
    const project = projects[projectId] || projects['calculator'];
    
    content.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <div style="margin: 2rem 0;">
            <h3>Project Requirements:</h3>
            <ul style="margin-left: 2rem;">
                ${project.requirements.map(req => `<li style="margin: 0.5rem 0;">${req}</li>`).join('')}
            </ul>
        </div>
        <div style="margin: 2rem 0;">
            <h3>Starter Code:</h3>
            <textarea class="code-editor" readonly>${project.code}</textarea>
            <div class="editor-buttons">
                <button class="btn btn-primary" onclick="downloadCode('${projectId}')">
                    <i class="fas fa-download"></i> Download Code
                </button>
                <button class="btn btn-secondary" onclick="tryProject('${projectId}')">
                    <i class="fas fa-code"></i> Try Online
                </button>
            </div>
        </div>
        <div class="comments">
            <h3>Student Reviews:</h3>
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-user">Sarah M.</span>
                    <span class="comment-date">2 days ago</span>
                </div>
                <div class="rating">
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star">★</span>
                </div>
                <p>Great project! Really helped me understand JavaScript fundamentals.</p>
            </div>
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-user">Mike R.</span>
                    <span class="comment-date">1 week ago</span>
                </div>
                <div class="rating">
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star empty">☆</span>
                </div>
                <p>Well structured and easy to follow. Could use more advanced features.</p>
            </div>
            <div class="comment-form">
                <h4>Add Your Review</h4>
                <div class="rating" style="margin-bottom: 1rem;">
                    <span class="star" onclick="setRating(1)">☆</span>
                    <span class="star" onclick="setRating(2)">☆</span>
                    <span class="star" onclick="setRating(3)">☆</span>
                    <span class="star" onclick="setRating(4)">☆</span>
                    <span class="star" onclick="setRating(5)">☆</span>
                </div>
                <textarea class="comment-input" placeholder="Share your experience with this project..."></textarea>
                <button class="btn btn-primary" onclick="addComment()">
                    <i class="fas fa-paper-plane"></i> Post Review
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function tryProject(projectId) {
    closeModal('detailModal');
    const modal = document.getElementById('editorModal');
    const editor = document.getElementById('codeEditor');
    
    const projectCode = {
        'calculator': `// Calculator JavaScript
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculate() {
    try {
        const result = eval(document.getElementById('display').value);
        document.getElementById('display').value = result;
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}

console.log('Calculator ready!');`,
        'weather': `// Weather App JavaScript
async function getWeather() {
    const city = document.getElementById('cityInput').value;
    console.log('Getting weather for:', city);
    
    // Simulated weather data
    const weather = {
        temperature: Math.round(Math.random() * 30 + 5),
        condition: 'Sunny',
        humidity: Math.round(Math.random() * 100)
    };
    
    console.log('Weather data:', weather);
    return weather;
}

console.log('Weather app ready!');`
    };
    
    editor.value = projectCode[projectId] || projectCode['calculator'];
    modal.style.display = 'block';
}

// Code execution functions
function runCode() {
    const code = document.getElementById('codeEditor').value;
    const output = document.getElementById('outputContent');
    
    try {
        // Capture console.log output
        let logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
            logs.push(args.join(' '));
            originalLog.apply(console, arguments);
        };
        
        // Execute code
        eval(code);
        
        // Restore console.log
        console.log = originalLog;
        
        // Display output
        output.innerHTML = logs.length > 0 ? logs.join('<br>') : 'Code executed successfully (no output)';
    } catch (error) {
        output.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

function runTutorialCode() {
    const code = document.querySelector('#detailModal .code-editor').value;
    const output = document.getElementById('tutorialOutputContent');
    
    try {
        let logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
            logs.push(args.join(' '));
            originalLog.apply(console, arguments);
        };
        
        eval(code);
        console.log = originalLog;
        
        output.innerHTML = logs.length > 0 ? logs.join('<br>') : 'Code executed successfully';
    } catch (error) {
        output.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

function resetCode() {
    document.getElementById('codeEditor').value = "console.log('Hello, World!');";
    document.getElementById('outputContent').innerHTML = "Click 'Run Code' to see output";
}

function resetTutorialCode() {
    const editor = document.querySelector('#detailModal .code-editor');
    editor.value = "# Try writing some Python code here\nprint('Hello, Python!')\nname = 'CodeLearn Pro'\nprint(f'Welcome to {name}')";
    document.getElementById('tutorialOutputContent').innerHTML = "Run your code to see the output";
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function downloadCode(projectId) {
    const code = document.querySelector('#detailModal .code-editor').value;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectId}-starter.html`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Code downloaded successfully!', 'success');
}

function continueLesson() {
    showNotification('Great! Moving to the next lesson...', 'success');
    closeModal('detailModal');
}

function addComment() {
    const input = document.querySelector('.comment-input');
    if (input.value.trim()) {
        showNotification('Thank you for your feedback!', 'success');
        input.value = '';
    }
}

// New functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const icon = document.querySelector('#themeToggle i');
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

function toggleBookmark(btn, itemId) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.classList.add('bookmarked');
        bookmarks[itemId] = true;
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('bookmarked');
        delete bookmarks[itemId];
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
    const action = btn.classList.contains('bookmarked') ? 'bookmarked' : 'removed from bookmarks';
    showNotification(`Item ${action} successfully!`, 'success');
}

function updateBookmarksUI() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const itemId = btn.getAttribute('onclick').match(/toggleBookmark\(this, '(.+)'\)/)[1];
        if (bookmarks[itemId]) {
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('bookmarked');
        }
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    text.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function setRating(rating) {
    const stars = document.querySelectorAll('.comment-form .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.remove('empty');
        } else {
            star.textContent = '☆';
            star.classList.add('empty');
        }
    });
}

// Contact form handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    this.reset();
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Initialize theme toggle
document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);