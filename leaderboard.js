// Load and display leaderboard from Supabase
async function loadLeaderboard() {
  const currentUser = localStorage.getItem('currentUser');

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('username, points')
      .order('points', { ascending: false });

    if (error) throw error;

    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    if (users && users.length > 0) {
      users.forEach((user, index) => {
        const li = document.createElement('li');

        let medal = '';
        if (index === 0) medal = '🥇 ';
        else if (index === 1) medal = '🥈 ';
        else if (index === 2) medal = '🥉 ';

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
    if (leaderboardList) {
      leaderboardList.innerHTML = '<li><span>Error loading leaderboard</span></li>';
    }
  }
}

// Initialize leaderboard page
function initLeaderboardPage() {
  loadLeaderboard();
  setInterval(loadLeaderboard, 10000);
}

// Run initialization
document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initLeaderboardPage)
  : initLeaderboardPage();

