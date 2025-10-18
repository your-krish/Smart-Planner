// Common functions used across all pages

// Check if Supabase is available
const useSupabase = typeof supabase !== 'undefined' && supabase !== null;

// Check if user is logged in
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Update user points display from Supabase OR localStorage
async function updateUserPoints() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;
  
  let points = 0;
  
  if (useSupabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('points')
        .eq('username', currentUser)
        .single();
      
      if (error) throw error;
      points = data.points || 0;
    } catch (error) {
      console.warn('Supabase error, using localStorage:', error);
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('smartPlannerUsers') || '{}');
      const userData = users[currentUser] || { points: 0 };
      points = userData.points;
    }
  } else {
    // Use localStorage
    const users = JSON.parse(localStorage.getItem('smartPlannerUsers') || '{}');
    const userData = users[currentUser] || { points: 0 };
    points = userData.points;
  }
  
  const pointsElement = document.getElementById('userPoints');
  if (pointsElement) {
    pointsElement.textContent = points + ' pts';
  }
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

// Initialize page
function initializePage() {
  console.log('Initializing page...');
  console.log('Supabase mode:', useSupabase ? 'Enabled' : 'Disabled (using localStorage)');
  
  if (checkAuth()) {
    updateUserPoints();
    
    // Add logout button event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
      console.log('Logout button listener added');
    }
  }
}

// Run initialization on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();

}
