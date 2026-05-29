document.addEventListener('DOMContentLoaded', () => {
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleAuthBtn = document.getElementById('toggleAuthBtn');
    const authError = document.getElementById('authError');
    const btnLogout = document.getElementById('btnLogout');
    
    const problemForm = document.getElementById('problemForm');
    const problemsTableBody = document.getElementById('problemsTableBody');
    const codeModal = document.getElementById('codeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCodeContent = document.getElementById('modalCodeContent');
    const closeModalBtn = document.getElementById('closeModal');
    
    const btnCrawl = document.getElementById('btnCrawl');
    const crawlUrl = document.getElementById('crawlUrl');
    const crawlStatus = document.getElementById('crawlStatus');

    let currentProblems = []; 
    let isLoginMode = true;

   const codeEditor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: "text/x-java",
        theme: "monokai",
        lineNumbers: true,
        viewportMargin: Infinity
    });

    checkAuthStatus();

    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            authScreen.style.display = 'none';
            appScreen.style.display = 'block';
            setTimeout(() => codeEditor.refresh(), 10);
            fetchProblems();
        } else {
            authScreen.style.display = 'block';
            appScreen.style.display = 'none';
        }
    }

    toggleAuthBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        authError.style.display = 'none';
        authForm.reset();
        
        if (isLoginMode) {
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Please log in to your algorithm vault.';
            authSubmitBtn.textContent = 'Login';
            toggleAuthBtn.textContent = 'Need an account? Register here';
        } else {
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Start tracking your algorithms today.';
            authSubmitBtn.textContent = 'Register';
            toggleAuthBtn.textContent = 'Already have an account? Login here';
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        
        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });

            const data = await res.json();

            if (res.ok) {
                if (isLoginMode) {
                    localStorage.setItem('token', data.token);
                    authForm.reset();
                    authError.style.display = 'none';
                    checkAuthStatus();
                } else {
                    isLoginMode = true;
                    authTitle.textContent = 'Welcome Back';
                    authSubtitle.textContent = 'Please log in to your algorithm vault.';
                    authSubmitBtn.textContent = 'Login';
                    toggleAuthBtn.textContent = 'Need an account? Register here';
                    authForm.reset();
                    authError.textContent = 'Registration successful! Please login.';
                    authError.style.color = '#0d652d';
                    authError.style.display = 'block';
                }
            } else {
                authError.textContent = data.error || 'An error occurred';
                authError.style.color = '#b3261e';
                authError.style.display = 'block';
            }
        } catch (error) {
            authError.textContent = 'Server connection failed.';
            authError.style.color = '#b3261e';
            authError.style.display = 'block';
        }
    });

    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('token');
        checkAuthStatus();
    });

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    btnCrawl.addEventListener('click', async () => {
        const url = crawlUrl.value;
        if (!url) return alert('Please paste a valid URL first!');

        crawlStatus.style.display = 'block';
        crawlStatus.textContent = 'Bot is reading the page...';
        crawlStatus.style.color = '#006494';

        try {
            const res = await fetch('/api/problems/crawl', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (res.ok) {
                document.getElementById('title').value = data.title;
                document.getElementById('topic').value = data.topic;
                document.getElementById('difficulty').value = data.difficulty;
                crawlStatus.textContent = 'Data successfully fetched!';
                crawlStatus.style.color = '#0d652d';
            } else {
                crawlStatus.textContent = `Error: ${data.error}`;
                crawlStatus.style.color = '#b3261e';
            }
        } catch (error) {
            crawlStatus.textContent = 'Failed to reach the bot.';
            crawlStatus.style.color = '#b3261e';
        }
    });

    async function fetchProblems() {
        try {
            const res = await fetch('/api/problems', { headers: getAuthHeaders() });
            
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('token');
                checkAuthStatus();
                return;
            }

            const data = await res.json();
            currentProblems = data; 
            renderProblems(data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    }

    function renderProblems(problems) {
        problemsTableBody.innerHTML = '';
        if(!Array.isArray(problems)) return;

        problems.forEach(prob => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prob.title}</td>
                <td>${prob.topic || 'N/A'}</td>
                <td><span class="badge ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span></td>
                <td>
                    <button class="btn-action btn-view" data-id="${prob.id}">View Code</button>
                </td>
                <td>
                    <button class="btn-action btn-delete" data-id="${prob.id}">Delete</button>
                </td>
            `;
            problemsTableBody.appendChild(row);
        });
    }

    problemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const topic = document.getElementById('topic').value;
        const difficulty = document.getElementById('difficulty').value;
        const code = codeEditor.getValue();

        try {
            const res = await fetch('/api/problems', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ title, topic, difficulty, code })
            });

            if (res.ok) {
                problemForm.reset();
                codeEditor.setValue('');
                crawlUrl.value = '';
                crawlStatus.style.display = 'none';
                fetchProblems();
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error}`);
            }
        } catch (error) {
            console.error('Error creating problem:', error);
        }
    });

    problemsTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            try {
                const res = await fetch(`/api/problems/${id}`, { 
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                if (res.ok) {
                    fetchProblems();
                }
            } catch (error) {
                console.error('Error deleting problem:', error);
            }
        }

        if (e.target.classList.contains('btn-view')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const problem = currentProblems.find(p => p.id === id);
            
            if (problem) {
                modalTitle.textContent = `${problem.title} - Solution`;
                modalCodeContent.textContent = problem.code || 'No code provided for this problem.';
                
                modalCodeContent.className = '';
                modalCodeContent.removeAttribute('data-highlighted');
                hljs.highlightElement(modalCodeContent);
                
                codeModal.showModal();
            }
        }
    });

    closeModalBtn.addEventListener('click', () => {
        codeModal.close();
    });
});