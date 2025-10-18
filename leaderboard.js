// Load and display leaderboard from Supabase
async function loadLeaderboard() {
  const currentUser = localStorage.getItem('currentUser');
  
  try {
    // Fetch all users from Supabase, ordered by points
    const { data: users, error } = await supabase
      .from('users')
      .select('username, points')
      .order('points', { ascending: false });
    
    if (error) throw error;
    
    // Display leaderboard
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    
    if (users && users.length > 0) {
      users.forEach((user, index) => {
        const li = document.createElement('li');
        
        // Add medal emoji for top 3
        let medal = '';
        if (index === 0) medal = '🥇 ';
        else if (index === 1) medal = '🥈 ';
        else if (index === 2) medal = '🥉 ';
        
        // Highlight current user
        if (user.username === currentUser) {
          li.classList.add('current-user');
        }
        
        li.innerHTML = `
          <span>${medal}${user.username}</span>
          <span>${user.points} pts</span>
        `;
        
        leaderboardList.appendChild(li);
      });
    } else {
      leaderboardList.innerHTML = '<li><span>No users yet!</span></li>';
    }
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<li><span>Error loading leaderboard</span></li>';
  }
}

// Initialize leaderboard page
function initLeaderboardPage() {
  loadLeaderboard();
  
  // Auto-refresh leaderboard every 10 seconds
  setInterval(loadLeaderboard, 10000);
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeaderboardPage);
} else {
  initLeaderboardPage();
}