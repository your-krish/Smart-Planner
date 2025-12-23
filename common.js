var supabase = window.supabaseClient;
const useSupabase = !!window.supabaseClient;

// Check if user is logged in
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Update user points display
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
      console.warn('Supabase error, fallback to localStorage');
      const users = JSON.parse(localStorage.getItem('smartPlannerUsers') || '{}');
      points = (users[currentUser] || { points: 0 }).points;
    }
  }

  const el = document.getElementById('userPoints');
  if (el) el.textContent = points + ' pts';
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

// Init page
function initializePage() {
  if (checkAuth()) {
    updateUserPoints();
    const btn = document.getElementById('logoutBtn');
    if (btn) btn.addEventListener('click', logout);
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initializePage)
  : initializePage();
