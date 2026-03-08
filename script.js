/* =========================================================================
   WORKNEST - Premium Interactions Script
   ========================================================================= */

const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. Navigation & Mobile Menu Setup
       ========================================================================= */
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle Mobile Menu
    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    // Auto-close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    /* =========================================================================
       2. Scroll Effects (Navbar Styling & Active Links)
       ========================================================================= */

    // Add background to navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active Navigation Highlight using Intersection Observer
    const sections = document.querySelectorAll('section');

    const highlightNav = () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust offset to trigger actively before section completely enters
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    /* =========================================================================
       3. Scroll Reveal Animations
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Trigger distance

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Trigger immediately on load then bind to scroll
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    /* =========================================================================
       4. Animated Statistic Counters
       ========================================================================= */
    const counters = document.querySelectorAll('.counter');
    const percentCounters = document.querySelectorAll('.counter-percent');
    let hasCounted = false;

    const runCounters = () => {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight && !hasCounted) {
            hasCounted = true;

            // Standard Number Counters (e.g., 10K+)
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let currentStep = 0;

                const timer = setInterval(() => {
                    currentStep++;
                    const value = Math.floor(increment * currentStep);

                    if (target >= 1000) {
                        counter.innerText = (value / 1000).toFixed(1).replace('.0', '') + 'K+';
                    } else {
                        counter.innerText = value + '+';
                    }

                    if (currentStep >= steps) {
                        clearInterval(timer);
                        counter.innerText = target >= 1000 ? (target / 1000) + 'K+' : target + '+';
                    }
                }, duration / steps);
            });

            // Percentage Counter (e.g., 85%)
            percentCounters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let currentStep = 0;

                const timer = setInterval(() => {
                    currentStep++;
                    const value = Math.floor(increment * currentStep);
                    counter.innerText = value + '%';

                    if (currentStep >= steps) {
                        clearInterval(timer);
                        counter.innerText = target + '%';
                    }
                }, duration / steps);
            });
        }
    };

    window.addEventListener('scroll', runCounters, { passive: true });
    runCounters(); // Initial check

    /* =========================================================================
       5. Opportunities Filtering System
       ========================================================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const oppCards = document.querySelectorAll('.opp-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            oppCards.forEach(card => {
                // Determine if card should show
                const match = filterValue === 'all' || card.getAttribute('data-category') === filterValue;

                if (match) {
                    card.style.display = 'flex';
                    // Tick delay to ensure display: flex applies before opacity animates
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95) translateY(10px)';
                    // Match timeout to CSS transition duration
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

});

/* =========================================================================
   6. Authentication Modal System (Global Scope to map to inline HTML events)
   ========================================================================= */
const modal = document.getElementById('authModal');
const mobileMenuOverlay = document.querySelector('.mobile-menu');

function openModal() {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    resetAuthSelection();
    window.scrollTo(0, 0);

    // Close mobile menu gracefully if we arrived from there
    if (mobileMenuOverlay.classList.contains('active')) {
        mobileMenuOverlay.classList.remove('active');
    }
}

function closeModal() {
    // Left empty for compatibility in case older closing logic triggers
}

function closeAuthScreen() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    resetAuthSelection();
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    // Reset UI
    tabs.forEach(tab => tab.classList.remove('active'));
    forms.forEach(form => {
        form.classList.remove('active-form');
        form.reset(); // Clear inputs on switch
    });

    // Activate specific UI
    if (tabId === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active-form');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active-form');
    }
}

/* =========================================================================
   2. Auth Screen Management
   ========================================================================= */

function showAuthForm(role) {
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('authRole').value = role;

    // Default to Login mode
    document.getElementById('authMode').value = 'login';
    document.getElementById('authRoleTitle').innerText = 'Log In as ' + (role === 'student' ? 'Job Seeker' : 'Recruiter');
    document.getElementById('mainAuthBtn').innerText = 'Log In';
    document.getElementById('nameGroup').style.display = 'none';
    document.getElementById('mainAuthToggleText').innerText = 'Need an account? Sign up';
}

function resetAuthSelection() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('roleSelection').style.display = 'block';
    document.getElementById('mainAuthForm').reset();
}

function toggleMainAuthMode() {
    const modeInput = document.getElementById('authMode');
    const role = document.getElementById('authRole').value;
    const title = document.getElementById('authRoleTitle');
    const btn = document.getElementById('mainAuthBtn');
    const toggleText = document.getElementById('mainAuthToggleText');
    const nameGroup = document.getElementById('nameGroup');
    const roleString = (role === 'student' ? 'Job Seeker' : 'Recruiter');

    if (modeInput.value === 'login') {
        modeInput.value = 'register';
        title.innerText = 'Register as ' + roleString;
        btn.innerText = 'Sign Up';
        nameGroup.style.display = 'block';
        document.getElementById('main-name').required = true;
        toggleText.innerText = 'Already have an account? Log in';
    } else {
        modeInput.value = 'login';
        title.innerText = 'Log In as ' + roleString;
        btn.innerText = 'Log In';
        nameGroup.style.display = 'none';
        document.getElementById('main-name').required = false;
        toggleText.innerText = 'Need an account? Sign up';
    }
}

async function handleMainAuth() {
    const mode = document.getElementById('authMode').value;
    const role = document.getElementById('authRole').value;
    const email = document.getElementById('main-email').value;
    const password = document.getElementById('main-password').value;
    const name = document.getElementById('main-name').value;

    const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
    const bodyArgs = mode === 'register' ? { name, email, password, role } : { email, password };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyArgs)
        });

        // Safely parse JSON
        let data;
        const textResponse = await res.text();
        try {
            data = JSON.parse(textResponse);
        } catch (parseErr) {
            console.error('Non-JSON response received:', textResponse);
            throw new Error(res.ok ? 'Invalid success response' : 'Server sent an HTML error page. Registration might have failed.');
        }

        if (res.ok) {
            localStorage.setItem('token', data.token);
            // Reload the page to cleanly initialize the app in an authenticated state
            window.location.reload();
        } else {
            alert(data.message || 'Authentication failed');
        }
    } catch (err) {
        console.error(err);
        alert(err.message || 'Network or Server Error');
    }
}

/* =========================================================================
   3. Backend API Integration (Old Modal Handlers)
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Initial App Load Flow
    const token = localStorage.getItem('token');
    const splash = document.getElementById('splashScreen');
    const auth = document.getElementById('authScreen');
    const app = document.getElementById('appContainer');

    if (token) {
        // User is logged in
        if (splash) splash.style.display = 'none';
        if (auth) auth.style.display = 'none';
        if (app) app.style.display = 'block';
        updateLoginState();
        fetchOpportunities();
    } else {
        // User is not logged in: Splash -> Auth
        if (app) app.style.display = 'none';
        setTimeout(() => {
            if (splash) splash.style.opacity = '0';
            setTimeout(() => {
                if (splash) splash.style.display = 'none';
                if (auth) {
                    auth.style.display = 'flex';
                    auth.style.opacity = '1';
                }
            }, 500); // 500ms fade out transition
        }, 1500); // Wait 1.5s on splash screen
    }

    // Set up other static listeners
    const mobileMenuBtn = document.querySelector('.hamburger');
    const mobileMenuCloseBtn = document.querySelector('.close-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu && mobileMenuCloseBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        mobileMenuCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Scroll effects
    window.addEventListener('scroll', revealElements);
    window.addEventListener('scroll', handleNavbarScroll);

    // Initial calls
    revealElements();
    handleNavbarScroll();

    // Check URL hash for modal opening
    if (window.location.hash === '#login') {
        openModal();
    }
});

/* =========================================================================
   7. Backend API Integration
   ========================================================================= */
// The API_URL constant is now defined in the Init & Global State section.

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const role = document.getElementById('reg-role').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            alert('Registration successful!');
            closeModal();
            updateLoginState();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
    }
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            closeModal();
            updateLoginState();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
    }
});

// Helper to decode JWT to get User info (very basic base64 decode for frontend)
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Update UI if user is logged in
function updateLoginState() {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.user && decoded.user.role) {
            localStorage.setItem('userRole', decoded.user.role);
        }
        const loginBtns = document.querySelectorAll('.nav-login, .mobile-login');
        const signupBtns = document.querySelectorAll('.nav-actions .btn-filled, .mobile-signup');

        if (loginBtns.length > 0) {
            loginBtns.forEach(btn => {
                if (decoded && (decoded.user.role === 'recruiter' || decoded.user.role === 'ngo')) {
                    btn.innerText = 'Recruiter Tools';
                    btn.onclick = (e) => {
                        e.preventDefault();
                        openRecruiterModal();
                    };
                } else {
                    btn.innerText = 'My Dashboard';
                    btn.onclick = (e) => {
                        e.preventDefault();
                        openStudentModal();
                    };
                }
            });
        }

        // Transform the secondary button into a Logout button
        if (signupBtns.length > 0) {
            signupBtns.forEach(btn => {
                btn.innerText = 'Log Out';
                btn.onclick = (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    window.location.reload();
                };
            });
        }

    }
}

/* =========================================================================
   8. Interactive Features: 1-Click Apply & Student Dashboard
   ========================================================================= */

async function applyToOpportunity(oppId, btnElement) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please log in first before applying!");
        openModal();
        return;
    }

    const originalText = btnElement.innerText;
    btnElement.innerText = "Applying...";
    btnElement.disabled = true;

    try {
        const res = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ opportunityId: oppId })
        });

        const data = await res.json();
        if (res.ok) {
            btnElement.innerText = "Applied ✓";
            btnElement.classList.replace('btn-outline', 'btn-filled');
            btnElement.style.backgroundColor = "var(--success)";
            btnElement.style.borderColor = "var(--success)";
        } else {
            alert(data.message || 'Application failed');
            btnElement.innerText = originalText;
            btnElement.disabled = false;
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
        btnElement.innerText = originalText;
        btnElement.disabled = false;
    }
}

const studentModal = document.getElementById('studentModal');

function openStudentModal() {
    if (studentModal) {
        studentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        fetchMyApplications();
        fetchMyMessages();
        fetchMyCV();
    }
}

function closeStudentModal() {
    if (studentModal) {
        studentModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

studentModal?.addEventListener('click', (e) => {
    if (e.target === studentModal) {
        closeStudentModal();
    }
});

async function fetchMyCV() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'x-auth-token': token }
        });
        const user = await res.json();
        if (res.ok && user.cv) {
            document.getElementById('cv-skills').value = user.cv.skills || '';
            document.getElementById('cv-bio').value = user.cv.bio || '';
            document.getElementById('cv-exp').value = user.cv.experience || '';
        }
    } catch (err) {
        console.error(err);
    }
}

async function saveMyCV() {
    const token = localStorage.getItem('token');

    const skills = document.getElementById('cv-skills').value;
    const bio = document.getElementById('cv-bio').value;
    const experience = document.getElementById('cv-exp').value;

    try {
        const res = await fetch(`${API_URL}/auth/cv`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ skills, bio, experience })
        });

        if (res.ok) {
            alert('Dynamic CV Saved Successfully!');
        } else {
            alert('Failed to save CV');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
    }
}

document.getElementById('studentCVForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveMyCV();
});

async function fetchMyApplications() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/applications/my-applications`, {
            headers: { 'x-auth-token': token }
        });
        const apps = await res.json();

        const listContainer = document.getElementById('studentApplicationsList');
        if (listContainer && res.ok) {
            if (apps.length === 0) {
                listContainer.innerHTML = '<p>You have not applied to any opportunities yet.</p>';
                return;
            }

            listContainer.innerHTML = apps.map(app => `
                <div style="background: var(--gray-50); padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--gray-200);">
                    <h4 style="color: var(--primary); margin-bottom: 4px;">${app.opportunity ? app.opportunity.title : 'Unknown'}</h4>
                    <p style="margin:0; font-size:0.8rem;">Status: <span style="color: var(--success); font-weight: bold;">${app.status.toUpperCase()}</span></p>
                    <p style="margin:0; font-size:0.8rem; color: var(--gray-400);">Applied: ${new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

async function fetchMyMessages() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/messages/my-messages`, {
            headers: { 'x-auth-token': token }
        });
        const msgs = await res.json();

        const listContainer = document.getElementById('studentMessagesList');
        if (listContainer && res.ok) {
            if (msgs.length === 0) {
                listContainer.innerHTML = '<p>No messages from recruiters yet.</p>';
                return;
            }

            listContainer.innerHTML = msgs.map(msg => `
                <div style="background: #eef2ff; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #c7d2fe; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--primary); margin-bottom: 4px;">${msg.title}</h4>
                    <span style="font-size: 0.75rem; color: var(--gray-500);">From: ${msg.recruiter ? msg.recruiter.name : 'Unknown Recruiter'}</span>
                    <p style="margin-top:8px; font-size: 0.9rem;">${msg.content}</p>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}


// Fetch Opportunities
async function fetchOpportunities() {
    const token = localStorage.getItem('token');
    let userRole = localStorage.getItem('userRole');
    let currentUserId = null;
    if (token) {
        const decoded = parseJwt(token);
        currentUserId = decoded.user ? decoded.user.id : (decoded.id || null);
        if (!userRole && decoded.user) userRole = decoded.user.role;
        console.log('fetchOpportunities - User Role:', userRole, 'User ID:', currentUserId);
    }

    try {
        const res = await fetch(`${API_URL}/opportunities`);
        const opportunities = await res.json();

        const grid = document.querySelector('.opportunities-grid');
        if (!grid) return;

        grid.innerHTML = '';

        opportunities.forEach(opp => {
            const card = document.createElement('div');
            // Adding active globally to show card, filter logic will hide/show later
            card.className = 'opp-card active';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
            card.setAttribute('data-category', opp.category);

            let badgeClass = 'badge-internship';
            let iconClass = 'fa-cube';
            let logoBg = 'bg-light-purple';

            if (opp.category === 'volunteer') {
                badgeClass = 'badge-volunteer';
                iconClass = 'fa-hands-helping';
                logoBg = 'bg-light-orange';
            } else if (opp.category === 'rent') {
                badgeClass = 'badge-rent';
                iconClass = 'fa-paint-brush';
                logoBg = 'bg-light-blue';
            }

            const isOwner = opp.recruiter === currentUserId;
            console.log('Opp Card:', opp.title, 'Recruiter ID:', opp.recruiter, 'isOwner:', isOwner);
            const applicantCountDisplay = (userRole === 'recruiter' || userRole === 'ngo')
                ? `<div style="margin-bottom: 15px; font-weight: 600; color: var(--primary);"><i class="fas fa-users"></i> ${opp.applicantCount || 0} Applicants</div>`
                : '';

            const footerHtml = (userRole === 'recruiter' || userRole === 'ngo')
                ? `
                   ${applicantCountDisplay}
                   ${isOwner ? `<button class="btn btn-outline btn-full" style="color: red; border-color: red;" onclick="deleteJob('${opp._id || opp.id}')"><i class="fas fa-trash"></i> Delete Post</button>`
                    : `<button class="btn btn-outline btn-full" disabled>Recruiter View</button>`}
                  `
                : `<button class="btn btn-outline btn-full" onclick="applyToOpportunity('${opp._id || opp.id}', this)">1-Click Apply</button>`;

            card.innerHTML = `
                <div class="opp-card-header">
                    <div class="org-logo ${logoBg}"><i class="fas ${iconClass}"></i></div>
                    <div class="opp-badge ${badgeClass}">${opp.category.charAt(0).toUpperCase() + opp.category.slice(1)}</div>
                </div>
                <div class="opp-card-body">
                    <h3>${opp.title}</h3>
                    <p class="org-name">${opp.organization}</p>
                    <div class="opp-tags">
                        <span class="opp-tag"><i class="fas fa-map-marker-alt"></i> ${opp.location}</span>
                        <span class="opp-tag"><i class="far fa-clock"></i> ${opp.durationOrType}</span>
                        ${opp.compensation ? `<span class="opp-tag"><i class="fas fa-wallet"></i> ${opp.compensation}</span>` : ''}
                    </div>
                </div>
                <div class="opp-card-footer">
                    ${footerHtml}
                </div>
            `;

            grid.appendChild(card);
        });

        // Setup initial filter state again if needed
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            activeFilter.click();
        }
    } catch (err) {
        console.error('Error fetching opportunities:', err);
    }
}

/* =========================================================================
   9. Interactive Features: Recruiter Templates & Messaging
   ========================================================================= */
const recruiterModal = document.getElementById('recruiterModal');

function openRecruiterModal() {
    if (recruiterModal) {
        recruiterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        fetchMessageTemplates();
        fetchRecentApplicants();
    }
}

function closeRecruiterModal() {
    if (recruiterModal) {
        recruiterModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

recruiterModal?.addEventListener('click', (e) => {
    if (e.target === recruiterModal) {
        closeRecruiterModal();
    }
});

async function saveTemplate() {
    const title = document.getElementById('msg-title').value;
    const content = document.getElementById('msg-content').value;
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_URL}/messages/templates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ title, content })
        });

        const data = await res.json();
        if (res.ok) {
            alert('Template Saved Successfully!');
            fetchMessageTemplates();
        } else {
            alert(data.message || 'Failed to save template');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
    }
}

document.getElementById('messageTemplateForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveTemplate();
});

async function fetchMessageTemplates() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/messages/templates`, {
            headers: { 'x-auth-token': token }
        });
        const templates = await res.json();

        const listContainer = document.getElementById('savedTemplatesList');
        if (listContainer && res.ok) {
            if (templates.length === 0) {
                listContainer.innerHTML = '<p>No templates saved yet.</p>';
                return;
            }

            listContainer.innerHTML = templates.map(t => `
                <div style="background: var(--gray-50); padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--gray-200); position: relative;">
                    <h4 style="color: var(--primary); margin-bottom: 4px; cursor: pointer;" onclick="document.getElementById('msg-title').value='${t.title}'; document.getElementById('msg-content').value='${t.content}'; alert('Template loaded into textboxes!');">${t.title} <i class="fas fa-edit" style="font-size:0.8rem;"></i></h4>
                    <p style="margin:0;">${t.content.substring(0, 50)}...</p>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

async function postNewJob() {
    const token = localStorage.getItem('token');

    // Collect specific job data
    const title = document.getElementById('job-title').value;
    const organization = document.getElementById('job-org').value;
    const category = document.getElementById('job-cat').value;
    const location = document.getElementById('job-loc').value;
    const durationOrType = document.getElementById('job-dur').value;
    const compensation = document.getElementById('job-comp').value;
    const skillsRequired = document.getElementById('job-skills').value;
    const expectedSalary = document.getElementById('job-salary').value;

    try {
        const res = await fetch(`${API_URL}/opportunities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ title, organization, category, location, durationOrType, compensation, skillsRequired, expectedSalary })
        });

        if (res.ok) {
            alert('Job Posted Successfully!');
            document.getElementById('postJobForm').reset();
            fetchOpportunities();
            switchRecruiterTab('applicants');
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to post job');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
    }
}

document.getElementById('postJobForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    postNewJob();
});

async function fetchRecentApplicants() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/applications/all`, {
            headers: { 'x-auth-token': token }
        });
        const applicants = await res.json();

        const listContainer = document.getElementById('recruiterApplicantsList');
        if (listContainer && res.ok) {
            if (applicants.length === 0) {
                listContainer.innerHTML = '<p>No recent applicants found.</p>';
                return;
            }

            listContainer.innerHTML = applicants.map(app => {
                const cvHtml = app.user.cv && (app.user.cv.skills || app.user.cv.bio) ? `
                    <div style="margin-top: 10px; padding: 10px; background: var(--white); border-radius: 6px; border: 1px dashed var(--gray-300);">
                        <strong>Dynamic CV</strong><br/>
                        <span style="font-size:0.8rem;"><em>Skills:</em> ${app.user.cv.skills || 'None listed'}</span><br/>
                        <span style="font-size:0.8rem;"><em>Bio:</em> ${app.user.cv.bio || 'None listed'}</span><br/>
                        <span style="font-size:0.8rem;"><em>Exp:</em> ${app.user.cv.experience || 'None listed'}</span>
                    </div>
                ` : '<div style="font-size:0.8rem; color:var(--gray-400); margin-top:5px;">No CV Data Provided</div>';

                return `
                <div style="background: var(--gray-50); padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--gray-200);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="color: var(--primary); margin-bottom: 2px;">${app.user ? app.user.name : 'Unknown'}</h4>
                        <span style="font-size: 0.75rem; font-weight:bold; color: ${app.status === 'accepted' ? 'var(--success)' : app.status === 'rejected' ? 'red' : 'var(--warning)'};">${app.status ? app.status.toUpperCase() : 'APPLIED'}</span>
                    </div>
                    <p style="margin:0; font-size:0.75rem; color: var(--gray-500);">${app.user ? app.user.email : ''}</p>
                    <p style="margin:4px 0; font-size:0.85rem; font-weight: bold;">Applied for: ${app.opportunity ? app.opportunity.title : 'Unknown'}</p>
                    
                    ${cvHtml}

                    <div style="display:flex; gap: 5px; margin-top: 10px;">
                        <button class="btn btn-outline" style="padding: 4px; flex:1; font-size: 0.75rem; border-color: var(--success); color: var(--success);" 
                                onclick="updateAppStatus('${app._id}', 'accepted')">
                            Accept
                        </button>
                        <button class="btn btn-outline" style="padding: 4px; flex:1; font-size: 0.75rem; border-color: red; color: red;" 
                                onclick="updateAppStatus('${app._id}', 'rejected')">
                            Reject
                        </button>
                    </div>
                    
                    <button class="btn btn-filled" style="padding: 4px; font-size: 0.75rem; width: 100%; margin-top: 5px;" 
                            onclick="sendQuickMessage('${app.user ? app.user._id : ''}', '${app.opportunity ? app.opportunity._id : ''}')">
                        <i class="fas fa-paper-plane"></i> Send Direct Message
                    </button>
                </div>
            `}).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateAppStatus(appId, status) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/applications/${appId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            fetchRecentApplicants();
        } else {
            alert("Failed to update status");
        }
    } catch (err) {
        console.error(err);
    }
}

async function sendQuickMessage(studentId, oppId) {
    const token = localStorage.getItem('token');
    const title = document.getElementById('msg-title').value;
    const content = document.getElementById('msg-content').value;

    if (!title || !content) {
        alert("Please write or click a template on the left to load text before sending!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ studentId, opportunityId: oppId, title, content })
        });

        if (res.ok) {
            alert('Message Sent Successfully!');
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to send message');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error (Trace: ' + err.message + ')');
    }
}

async function fetchMyPostings() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token || userRole !== 'recruiter') return;

    try {
        const res = await fetch(`${API_URL}/opportunities`, {
            headers: { 'x-auth-token': token }
        });
        const opportunities = await res.json();

        // Filter those posted by THIS recruiter (backend route should ideally handle this, but we'll do it here to ensure)
        // Note: The /opportunities route currently returns ALL. 
        // We need the user ID. 
        const userData = JSON.parse(atob(token.split('.')[1]));
        const myOpps = opportunities.filter(o => o.recruiter === userData.user.id || o.recruiter === userData.id);

        const listContainer = document.getElementById('recruiterPostingsList');
        if (listContainer && res.ok) {
            if (myOpps.length === 0) {
                listContainer.innerHTML = '<p>You haven\'t posted any jobs yet.</p>';
                return;
            }

            listContainer.innerHTML = myOpps.map(o => `
                <div style="background: var(--gray-50); padding: 15px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--gray-200);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <h4 style="color: var(--primary); margin-bottom: 5px;">${o.title}</h4>
                            <p style="margin:0; font-size:0.8rem; color: var(--gray-600);">${o.organization} | ${o.location}</p>
                        </div>
                        <button class="btn btn-outline" style="color: red; border-color: red; padding: 4px 10px; font-size: 0.8rem;" 
                                onclick="deleteJob('${o._id || o.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.85rem;">
                        <strong>Budget:</strong> ${o.compensation || o.expectedSalary || 'Not specified'}<br/>
                        <strong>Category:</strong> ${o.category}
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteJob(id) {
    console.log('Attempting to delete job with ID:', id);
    if (!confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/opportunities/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });

        if (res.ok) {
            alert('Job Deleted Successfully');
            fetchMyPostings();
            fetchOpportunities(); // Refresh the main board too
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to delete job');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
}

// Check logged in status on load and fetch data
document.addEventListener('DOMContentLoaded', () => {
    updateLoginState();
    fetchOpportunities();
});
