
const app = {
  isSignedIn: false,
  currentUser: null,
  currentScreen: 'signIn',
  history: [],
  currentData: null
};


function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('');
}

function createStars(rating, interactive = false, size = 'md') {
  const sizeClass = size === 'sm' ? 'width="16" height="16"' : size === 'lg' ? 'width="24" height="24"' : 'width="20" height="20"';
  let html = `<div class="rating-widget ${interactive ? '' : 'readonly'}" data-rating="${rating}">`;
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating ? 'filled' : 'empty';
    html += `<svg class="rating-star ${filled}" ${sizeClass} viewBox="0 0 24 24" ${interactive ? `data-star="${i}"` : ''} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`;
  }
  html += '</div>';
  return html;
}

// Navigation Functions
function navigateTo(screen, data = null) {
  app.history.push({ screen: app.currentScreen, data: app.currentData });
  app.currentScreen = screen;
  app.currentData = data;
  showScreen(screen);
  if (data) {
    populateScreen(screen, data);
  }
}

function navigateBack() {
  if (app.history.length > 0) {
    const previous = app.history.pop();
    app.currentScreen = previous.screen;
    app.currentData = previous.data;
    showScreen(previous.screen);
    if (previous.data) {
      populateScreen(previous.screen, previous.data);
    }
  } else {
    navigateTo('home');
  }
}

function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  const screen = document.getElementById(screenName + 'Screen');
  if (screen) {
    screen.classList.add('active');
  }
}

function populateScreen(screen, data) {
  switch (screen) {
    case 'course':
      populateCourseScreen(data);
      break;
    case 'noteDetail':
      populateNoteDetailScreen(data);
      break;
    case 'profile':
      populateProfileScreen(data);
      break;
  }
}

// Screen Population Functions
function populateHomeScreen() {
  // Populate courses
  const coursesList = document.getElementById('coursesList');
  coursesList.innerHTML = mockCourses.slice(0, 5).map(course => `
    <div class="course-chip" data-course='${JSON.stringify(course)}'>
      <div class="course-chip-header">
        <span class="course-chip-code">${course.code}</span>
        <span class="badge">${course.notesCount}</span>
      </div>
      <div class="course-chip-name">${course.name}</div>
    </div>
  `).join('');

  // Populate top notes
  const topNotesList = document.getElementById('topNotesList');
  topNotesList.innerHTML = mockNotes.slice(0, 3).map(note => createNoteCard(note)).join('');
}

function createNoteCard(note) {
  return `
    <div class="note-card" data-note='${JSON.stringify(note)}'>
      <div class="note-card-header">
        <div style="flex: 1;">
          <div class="note-card-title">${note.title}</div>
          <div class="note-card-meta">
            <span class="badge">${note.courseCode}</span>
            <span class="note-card-topic">${note.topic}</span>
          </div>
        </div>
        <svg class="note-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      <div class="note-card-stats">
        <div class="note-card-rating">
          <svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>${note.rating.toFixed(1)}</span>
          <span style="color: #6b7280; font-size: 12px;">(${note.totalRatings})</span>
        </div>
        <div class="note-card-downloads">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>${note.downloads}</span>
        </div>
      </div>
      <div class="note-card-footer">
        <span>${note.uploadedBy.name}</span>
        <span>•</span>
        <span>${formatDate(note.date)}</span>
      </div>
    </div>
  `;
}

function populateCourseScreen(course) {
  document.getElementById('courseCode').textContent = course.code;
  document.getElementById('courseName').textContent = course.name;
  document.getElementById('courseSemester').textContent = course.semester;

  // Filter notes for this course
  const courseNotes = mockNotes.filter(note => note.courseCode === course.code);
  const courseRequests = mockRequests.filter(req => req.courseCode === course.code);

  // Populate notes tab
  const notesTab = document.getElementById('courseNotesTab');
  if (courseNotes.length > 0) {
    notesTab.innerHTML = courseNotes.map(note => createNoteCard(note)).join('');
  } else {
    notesTab.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h3>No notes yet</h3>
        <p>Be the first to upload notes for this course!</p>
        <button class="btn btn-primary" onclick="navigateTo('upload')">Upload Notes</button>
      </div>
    `;
  }

  // Populate requests tab
  const requestsTab = document.getElementById('courseRequestsTab');
  if (courseRequests.length > 0) {
    requestsTab.innerHTML = courseRequests.map(req => `
      <div class="request-card">
        <div class="request-header">
          <div class="request-title">
            <div class="request-badges">
              <span class="badge">${req.courseCode}</span>
              ${req.fulfilled ? '<span class="badge badge-fulfilled">Fulfilled</span>' : '<span class="badge badge-open">Open</span>'}
            </div>
            <h3>${req.topic}</h3>
            <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">${req.courseName}</p>
          </div>
        </div>
        <p class="request-description">${req.description}</p>
        <div class="request-footer">
          <span>Requested by ${req.requestedBy}</span>
          <span>${formatDate(req.date)}</span>
        </div>
        ${!req.fulfilled ? '<button class="btn btn-outline" style="margin-top: 12px; width: 100%;">Fulfill This Request</button>' : ''}
      </div>
    `).join('');
  } else {
    requestsTab.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <h3>No requests</h3>
        <p>No note requests for this course yet.</p>
      </div>
    `;
  }

  // Populate contributors tab
  const contributorsTab = document.getElementById('courseContributorsTab');
  contributorsTab.innerHTML = mockUsers.map((user, index) => `
    <div class="contributor-card" data-user='${JSON.stringify(user)}'>
      <div class="contributor-avatar-wrapper">
        <div class="avatar large">${getInitials(user.name)}</div>
        ${index === 0 ? `<svg class="crown" width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>` : ''}
      </div>
      <div class="contributor-info">
        <div class="contributor-name">
          <span>${user.name}</span>
          <span class="contributor-rank">#${index + 1}</span>
        </div>
        <p class="contributor-stats">${user.studentsHelped} students helped</p>
      </div>
      <div class="contributor-rating">
        <div class="rating-display">
          <span class="star">★</span>
          <span>${user.averageRating.toFixed(1)}</span>
        </div>
        <p class="contributor-uploads">${user.totalUploads} uploads</p>
      </div>
    </div>
  `).join('');
}

function populateNoteDetailScreen(note) {
  const content = document.getElementById('noteDetailContent');
  content.innerHTML = `
    <div class="card">
      <div style="display: flex; gap: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #eef2ff; border-radius: 8px; flex-shrink: 0;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div style="flex: 1;">
          <h1 style="margin-bottom: 4px; color: #312e81;">${note.title}</h1>
          <p style="font-size: 14px; color: #6b7280;">${note.courseCode} • ${note.topic}</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            ${createStars(note.rating, false, 'sm')}
            <span style="font-size: 14px;">${note.rating.toFixed(1)}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280;">${note.totalRatings} ratings</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 14px;">${note.downloads} downloads</p>
          <p style="font-size: 12px; color: #6b7280;">this month</p>
        </div>
      </div>

      <button class="btn btn-primary btn-full" onclick="showToast('Download started!')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download PDF
      </button>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 12px;">Preview</h3>
      <div style="display: flex; align-items: center; justify-content: center; aspect-ratio: 3/4; background: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 8px;">
        <div style="text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="margin: 0 auto 8px;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p style="font-size: 14px; color: #6b7280;">PDF Preview</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 12px;">Uploaded By</h3>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="avatar">${getInitials(note.uploadedBy.name)}</div>
        <div style="flex: 1;">
          <p style="margin-bottom: 4px;">${note.uploadedBy.name}</p>
          <p style="font-size: 14px; color: #6b7280;">${new Date(note.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div style="text-align: right;">
          <div style="display: flex; align-items: center; gap: 4px; justify-content: flex-end;">
            <span class="star">★</span>
            <span style="font-size: 14px;">${note.uploadedBy.averageRating.toFixed(1)}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280;">${note.uploadedBy.totalUploads} uploads</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 12px;">Rate This Note</h3>
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        ${createStars(0, true, 'lg')}
      </div>
      <textarea placeholder="Write a review (optional)" rows="3" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 12px;"></textarea>
      <button class="btn btn-primary btn-full" onclick="submitRating()">Submit Rating</button>
    </div>

    ${note.reviews.length > 0 ? `
      <div class="card">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3>Reviews</h3>
        </div>
        ${note.reviews.map(review => `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <div>
                <p style="font-size: 14px; margin-bottom: 4px;">${review.userName}</p>
                ${createStars(review.rating, false, 'sm')}
              </div>
              <span style="font-size: 12px; color: #6b7280;">${formatDate(review.date)}</span>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${review.comment}</p>
            <button class="link-btn" style="font-size: 12px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-right: 4px;">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Helpful (${review.helpful})
            </button>
            <div style="height: 1px; background: #f3f4f6; margin-top: 16px;"></div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function populateProfileScreen(user) {
  const header = document.getElementById('profileHeader');
  header.innerHTML = `
    <div class="profile-info">
      <div class="avatar xl">${getInitials(user.name)}</div>
      <div class="profile-details">
        <h1 class="profile-name">${user.name}</h1>
        <p class="profile-email">${user.email}</p>
        <div class="profile-badges">
          ${user.badges.map(badge => `
            <span class="badge badge-indigo">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              ${badge}
            </span>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-card">
        <div class="stat-value">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>${user.totalUploads}</span>
        </div>
        <p class="stat-label">Uploads</p>
      </div>
      <div class="stat-card">
        <div class="stat-value">
          <svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>${user.averageRating.toFixed(1)}</span>
        </div>
        <p class="stat-label">Avg Rating</p>
      </div>
      <div class="stat-card">
        <div class="stat-value">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>${user.studentsHelped}</span>
        </div>
        <p class="stat-label">Helped</p>
      </div>
    </div>
  `;

  // Populate uploads tab
  const userNotes = mockNotes.filter(note => note.uploadedBy.id === user.id);
  const uploadsTab = document.getElementById('profileUploadsTab');
  uploadsTab.innerHTML = userNotes.map(note => createNoteCard(note)).join('');

  // Populate activity tab
  const activityTab = document.getElementById('profileActivityTab');
  activityTab.innerHTML = `
    <div class="activity-item">
      <div class="activity-content">
        <div class="activity-icon upload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div class="activity-text">
          <p>Uploaded <span class="activity-highlight">SQL Queries & Normalization</span></p>
          <p class="activity-date">2 days ago</p>
        </div>
      </div>
    </div>
    <div class="activity-item">
      <div class="activity-content">
        <div class="activity-icon rating">
          <svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="activity-text">
          <p>Received 5-star rating on <span class="activity-highlight">Process Scheduling</span></p>
          <p class="activity-date">3 days ago</p>
        </div>
      </div>
    </div>
    <div class="activity-item">
      <div class="activity-content">
        <div class="activity-icon badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
        </div>
        <div class="activity-text">
          <p>Earned <span class="activity-highlight">Best Note Taker</span> badge</p>
          <p class="activity-date">1 week ago</p>
        </div>
      </div>
    </div>
  `;
}

function populateLeaderboardScreen() {
  // Populate podium
  const podium = document.getElementById('podium');
  const topThree = [mockUsers[1], mockUsers[0], mockUsers[2]]; // 2nd, 1st, 3rd
  const positions = ['second', 'first', 'third'];
  const crownColors = ['crown-silver', 'crown-gold', 'crown-bronze'];
  
  podium.innerHTML = `
    <div class="podium-container">
      ${topThree.map((user, index) => `
        <div class="podium-place">
          <div class="podium-avatar-wrapper">
            <div class="podium-avatar">${getInitials(user.name)}</div>
            <svg class="podium-crown ${crownColors[index]}" width="${index === 1 ? '28' : '24'}" height="${index === 1 ? '28' : '24'}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </div>
          <div class="podium-rank">${index === 0 ? '2' : index === 1 ? '1' : '3'}</div>
          <p class="podium-name">${user.name}</p>
          <div class="podium-rating">
            <span class="star">★</span>
            <span style="font-size: ${index === 1 ? '14px' : '12px'};">${user.averageRating.toFixed(1)}</span>
          </div>
          <p class="podium-helped">${user.studentsHelped} helped</p>
        </div>
      `).join('')}
    </div>
  `;

  // Populate full list
  const list = document.getElementById('leaderboardList');
  list.innerHTML = mockUsers.map((user, index) => {
    const crownColor = index === 0 ? 'crown-gold' : index === 1 ? 'crown-silver' : index === 2 ? 'crown-bronze' : '';
    return `
      <div class="contributor-card" data-user='${JSON.stringify(user)}'>
        <div style="display: flex; align-items: center; justify-content: center; width: 32px;">
          ${index < 3 ? `
            <svg class="${crownColor}" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          ` : `<span style="font-size: 14px; color: #6b7280;">#${index + 1}</span>`}
        </div>
        <div class="avatar large">${getInitials(user.name)}</div>
        <div class="contributor-info">
          <div class="contributor-name">
            <span>${user.name}</span>
            ${user.badges.includes('Best Note Taker') ? '<span class="badge badge-indigo" style="font-size: 12px;">Best</span>' : ''}
          </div>
          <p class="contributor-stats">${user.studentsHelped} students helped</p>
        </div>
        <div class="contributor-rating">
          <div class="rating-display">
            <span class="star">★</span>
            <span>${user.averageRating.toFixed(1)}</span>
          </div>
          <p class="contributor-uploads">${user.totalUploads} uploads</p>
        </div>
      </div>
    `;
  }).join('');
}

function populateRequestsScreen() {
  updateRequestsTabs();
}

function updateRequestsTabs() {
  const activeTab = document.querySelector('#requestsScreen .tab.active');
  const filter = activeTab ? activeTab.dataset.tab : 'all';
  
  let requests = mockRequests;
  if (filter === 'open') {
    requests = mockRequests.filter(r => !r.fulfilled);
  } else if (filter === 'fulfilled') {
    requests = mockRequests.filter(r => r.fulfilled);
  }

  // Update tab counts
  document.getElementById('allRequestsTab').textContent = `All (${mockRequests.length})`;
  document.getElementById('openRequestsTab').textContent = `Open (${mockRequests.filter(r => !r.fulfilled).length})`;
  document.getElementById('fulfilledRequestsTab').textContent = `Fulfilled (${mockRequests.filter(r => r.fulfilled).length})`;

  const list = document.getElementById('requestsList');
  list.innerHTML = requests.map(req => `
    <div class="request-card">
      <div class="request-header">
        <div class="request-title">
          <div class="request-badges">
            <span class="badge">${req.courseCode}</span>
            ${req.fulfilled ? '<span class="badge badge-fulfilled">Fulfilled</span>' : '<span class="badge badge-open">Open</span>'}
          </div>
          <h3 style="margin: 8px 0 4px;">${req.topic}</h3>
          <p style="font-size: 14px; color: #6b7280;">${req.courseName}</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="flex-shrink: 0;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </div>
      <p class="request-description">${req.description}</p>
      <div class="request-footer">
        <span>Requested by ${req.requestedBy}</span>
        <span>${formatDate(req.date)}</span>
      </div>
      ${!req.fulfilled ? '<button class="btn btn-outline" style="margin-top: 12px; width: 100%;" onclick="showToast(\'Upload flow would open here\')">Fulfill This Request</button>' : ''}
    </div>
  `).join('');
}

function populateUploadScreen(step = 1) {
  const content = document.getElementById('uploadContent');
  const state = app.uploadState || {
    step: 1,
    course: '',
    title: '',
    topic: '',
    date: '',
    file: null
  };

  if (step === 1) {
    content.innerHTML = `
      <div class="upload-progress">
        <div class="progress-bar ${step >= 1 ? 'active' : ''}"></div>
        <div class="progress-bar ${step >= 2 ? 'active' : ''}"></div>
        <div class="progress-bar ${step >= 3 ? 'active' : ''}"></div>
      </div>

      <div class="upload-section">
        <h2>Note Details</h2>
        <div class="form-row">
          <label>Course *</label>
          <select id="uploadCourse">
            <option value="">Select course</option>
            ${mockCourses.map(course => `
              <option value="${course.code}">${course.code} - ${course.name}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-row">
          <label>Note Title *</label>
          <input type="text" id="uploadTitle" placeholder="e.g., SQL Queries & Normalization">
        </div>
        <div class="form-row">
          <label>Topic *</label>
          <input type="text" id="uploadTopic" placeholder="e.g., Database Design">
        </div>
        <div class="form-row">
          <label>Date *</label>
          <input type="date" id="uploadDate">
        </div>
        <button class="btn btn-primary btn-full" onclick="uploadStep1Next()">Continue</button>
      </div>

      <div class="tips-box">
        <h3>Tips for better notes</h3>
        <ul>
          <li>• Use clear, descriptive titles</li>
          <li>• Ensure handwriting is legible</li>
          <li>• Include relevant diagrams and examples</li>
          <li>• Verify all information is accurate</li>
        </ul>
      </div>
    `;
  } else if (step === 2) {
    content.innerHTML = `
      <div class="upload-progress">
        <div class="progress-bar active"></div>
        <div class="progress-bar active"></div>
        <div class="progress-bar"></div>
      </div>

      <div class="upload-section">
        <h2>Upload File</h2>
        ${!state.file ? `
          <label class="file-upload" id="fileUploadLabel">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p style="margin-bottom: 4px;">Click to upload</p>
            <p style="font-size: 14px; color: #6b7280;">PDF or Image files only</p>
            <input type="file" id="fileInput" accept=".pdf,image/*" style="display: none;">
          </label>
        ` : `
          <div class="file-preview">
            <div class="file-info">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div class="file-details">
                <p>${state.file.name}</p>
                <p>${(state.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button class="icon-btn" onclick="uploadRemoveFile()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `}
      </div>
    `;
  } else if (step === 3) {
    content.innerHTML = `
      <div class="upload-progress">
        <div class="progress-bar active"></div>
        <div class="progress-bar active"></div>
        <div class="progress-bar active"></div>
      </div>

      <div class="upload-section">
        <h2>Preview & Publish</h2>
        <div class="preview-summary">
          <div class="summary-row">
            <span class="summary-label">Course:</span>
            <span class="summary-value">${state.course}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Title:</span>
            <span class="summary-value">${state.title}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Topic:</span>
            <span class="summary-value">${state.topic}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${new Date(state.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div class="preview-box">
          <div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p style="font-size: 14px; color: #6b7280;">${state.file.name}</p>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn btn-outline" onclick="populateUploadScreen(2)">Back</button>
          <button class="btn btn-primary" onclick="uploadPublish()">Publish Notes</button>
        </div>
      </div>
    `;
  }
}

// Upload Functions
function uploadStep1Next() {
  const course = document.getElementById('uploadCourse').value;
  const title = document.getElementById('uploadTitle').value;
  const topic = document.getElementById('uploadTopic').value;
  const date = document.getElementById('uploadDate').value;

  if (!course || !title || !topic || !date) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  app.uploadState = { step: 2, course, title, topic, date, file: null };
  populateUploadScreen(2);

  // Add file input listener
  setTimeout(() => {
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileUploadLabel');
    if (fileInput && fileLabel) {
      fileLabel.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          app.uploadState.file = file;
          app.uploadState.step = 3;
          populateUploadScreen(3);
        }
      };
    }
  }, 100);
}

function uploadRemoveFile() {
  app.uploadState.file = null;
  app.uploadState.step = 2;
  populateUploadScreen(2);
}

function uploadPublish() {
  showToast('Notes uploaded successfully!');
  setTimeout(() => navigateBack(), 1000);
}

function submitRating() {
  const ratingWidget = document.querySelector('.rating-widget:not(.readonly)');
  const rating = parseInt(ratingWidget.dataset.rating) || 0;
  
  if (rating === 0) {
    showToast('Please select a rating', 'error');
    return;
  }
  
  showToast('Rating submitted successfully!');
}

// Event Listeners
function initializeEventListeners() {
  // Sign In
  document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const errorElement = document.getElementById('emailError');

    if (!email.endsWith('@diu.edu.bd')) {
      errorElement.textContent = 'Please use your DIU email address';
      return;
    }

    app.isSignedIn = true;
    app.currentUser = mockUsers[0];
    showScreen('home');
    populateHomeScreen();
  });

  // Menu Button
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('navDrawer').classList.add('open');
  });

  // Drawer Overlay
  document.querySelector('.drawer-overlay').addEventListener('click', () => {
    document.getElementById('navDrawer').classList.remove('open');
  });

  // Drawer Navigation
  document.querySelectorAll('.drawer-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      document.getElementById('navDrawer').classList.remove('open');
      
      if (page === 'home') {
        app.history = [];
        navigateTo('home');
        populateHomeScreen();
      } else if (page === 'upload') {
        app.uploadState = { step: 1 };
        navigateTo('upload');
        populateUploadScreen(1);
      } else if (page === 'requests') {
        navigateTo('requests');
        populateRequestsScreen();
      } else if (page === 'leaderboard') {
        navigateTo('leaderboard');
        populateLeaderboardScreen();
      } else if (page === 'profile') {
        navigateTo('profile', app.currentUser);
      } else if (page === 'about') {
        navigateTo('about');
      }
    });
  });

  // Sign Out
  document.getElementById('signOutBtn').addEventListener('click', () => {
    app.isSignedIn = false;
    app.currentUser = null;
    app.history = [];
    document.getElementById('navDrawer').classList.remove('open');
    showScreen('signIn');
  });

  // Back Buttons
  document.getElementById('courseBackBtn').addEventListener('click', navigateBack);
  document.getElementById('noteBackBtn').addEventListener('click', navigateBack);
  document.getElementById('uploadBackBtn').addEventListener('click', navigateBack);
  document.getElementById('requestsBackBtn').addEventListener('click', navigateBack);
  document.getElementById('leaderboardBackBtn').addEventListener('click', navigateBack);
  document.getElementById('profileBackBtn').addEventListener('click', navigateBack);
  document.getElementById('aboutBackBtn').addEventListener('click', navigateBack);

  // FABs
  document.getElementById('uploadFab').addEventListener('click', () => {
    app.uploadState = { step: 1 };
    navigateTo('upload');
    populateUploadScreen(1);
  });

  document.getElementById('requestsBtn').addEventListener('click', () => {
    navigateTo('requests');
    populateRequestsScreen();
  });

  document.getElementById('leaderboardBtn').addEventListener('click', () => {
    navigateTo('leaderboard');
    populateLeaderboardScreen();
  });

  document.getElementById('addRequestFab').addEventListener('click', () => {
    showToast('Create request modal would open here');
  });

  // Drawer header
  const drawerHeader = document.getElementById('drawerHeader');
  const currentUser = mockUsers[0];
  drawerHeader.innerHTML = `
    <div class="drawer-user">
      <div class="avatar">${getInitials(currentUser.name)}</div>
      <h2 class="drawer-user-name">${currentUser.name}</h2>
      <p class="drawer-user-email">${currentUser.email}</p>
    </div>
  `;

  
  document.body.addEventListener('click', (e) => {
 
    const courseChip = e.target.closest('.course-chip');
    if (courseChip) {
      const course = JSON.parse(courseChip.dataset.course);
      navigateTo('course', course);
    }

  
    const noteCard = e.target.closest('.note-card');
    if (noteCard) {
      const note = JSON.parse(noteCard.dataset.note);
      navigateTo('noteDetail', note);
    }

 
    const contributorCard = e.target.closest('.contributor-card');
    if (contributorCard) {
      const user = JSON.parse(contributorCard.dataset.user);
      navigateTo('profile', user);
    }


    const ratingStar = e.target.closest('.rating-star');
    if (ratingStar && !ratingStar.closest('.readonly')) {
      const widget = ratingStar.closest('.rating-widget');
      const rating = parseInt(ratingStar.dataset.star);
      widget.dataset.rating = rating;
      
      const stars = widget.querySelectorAll('.rating-star');
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add('filled');
          star.classList.remove('empty');
        } else {
          star.classList.remove('filled');
          star.classList.add('empty');
        }
      });
    }

    
    const tab = e.target.closest('.tab');
    if (tab) {
      const parent = tab.parentElement;
      parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

 
      if (tab.closest('#courseScreen')) {
        const tabName = tab.dataset.tab;
        document.querySelectorAll('#courseScreen .tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`course${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`).classList.add('active');
      } else if (tab.closest('#profileScreen')) {
        const tabName = tab.dataset.tab;
        document.querySelectorAll('#profileScreen .tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`profile${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`).classList.add('active');
      } else if (tab.closest('#requestsScreen')) {
        updateRequestsTabs();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
});
