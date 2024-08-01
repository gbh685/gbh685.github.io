// scripts.js

// Helper functions
function showErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
}

function clearErrorMessage(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.add('d-none');
}

// Authentication and Registration
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        showErrorMessage('loginError', 'Invalid username or password!');
    }
}

function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
        showErrorMessage('registerError', 'Username already exists!');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = 'index.html';
}

// Dashboard - Loading User Info and Posts
function loadDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('usernameDisplay').textContent = loggedInUser.username;

    loadPosts();
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'col-md-6';
        postElement.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content}</p>
                    <p class="text-muted">Posted on ${new Date(post.date).toLocaleString()}</p>
                    <a href="edit_post.html?id=${index}" class="btn btn-primary">Edit</a>
                    <button class="btn btn-danger" onclick="deletePost(${index})">Delete</button>
                </div>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function deletePost(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

// Post Creation and Editing
function handleCreatePost(event) {
    event.preventDefault();

    const title = document.getElementById('postTitle').value;
    const content = quill.root.innerHTML; // Use Quill.js content

    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.push({ title, content, date: new Date() });
    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = 'dashboard.html';
}

function handleEditPost(event) {
    event.preventDefault();
    const postId = new URLSearchParams(window.location.search).get('id');

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[postId];

    post.title = document.getElementById('postTitle').value;
    post.content = quill.root.innerHTML; // Use Quill.js content

    posts[postId] = post;
    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = 'dashboard.html';
}

function loadEditPostForm() {
    const postId = new URLSearchParams(window.location.search).get('id');

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[postId];

    if (!post) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('postTitle').value = post.title;
    quill.root.innerHTML = post.content; // Load Quill.js content
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        const quill = new Quill('#postContentEditor', { theme: 'snow' });
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    const editPostForm = document.getElementById('editPostForm');
    if (editPostForm) {
        const quill = new Quill('#postContentEditor', { theme: 'snow' });
        loadEditPostForm();
        editPostForm.addEventListener('submit', handleEditPost);
    }

    if (window.location.pathname.endsWith('dashboard.html')) {
        loadDashboard();
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }
});

document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
