// challenges.js (Stored data in supabase)

const challenges = [
  { id: 1, title: '💧 Save Water', desc: 'Turn off taps while brushing and save 10L/day.', badge: '💧 Water Saver', points: 10 },
  { id: 2, title: '🔌 Power Saver', desc: 'Unplug devices not in use for a week.', badge: '🔌 Power Saver', points: 15 },
  { id: 3, title: '🌳 Plant a Tree', desc: 'Plant one tree in your neighborhood.', badge: '🌳 Green Thumb', points: 20 },
  { id: 4, title: '🚮 Waste Segregation', desc: 'Separate your household waste for 5 days.', badge: '🚮 Waste Warrior', points: 12 },
  { id: 5, title: '🛒 Eco Shopping', desc: 'Buy items with minimal plastic for one week.', badge: '🛒 Eco Shopper', points: 10 },
  { id: 6, title: '🚶‍♂️ Walk or Cycle', desc: 'Use no motor vehicle for short distances today.', badge: '🚶‍♂️ Commuter Hero', points: 8 },
  { id: 7, title: '🍃 Indoor Plants', desc: 'Place 2 indoor plants in your room or classroom.', badge: '🍃 Plant Keeper', points: 10 },
  { id: 8, title: '💡 Switch Off', desc: 'Turn off all lights and fans for one whole night.', badge: '💡 Switch Off', points: 12 },
  { id: 9, title: '♻️ Recycling Champ', desc: 'Recycle 5 items and log it in Smart Planner.', badge: '♻️ Recycling Champ', points: 15 },
  { id: 10, title: '🌿 Community Helper', desc: 'Participate in a local environmental activity.', badge: '🌿 Community Helper', points: 20 }
];

// Load challenges from Supabase
async function loadChallenges() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  const grid = document.getElementById('challengesGrid');
  grid.innerHTML = '<h3>Loading challenges...</h3>';

  try {
    // FETCH user data from Supabase
    const { data: userData, error } = await supabase
      .from('users')
      .select('completed_challenges')
      .eq('username', currentUser)
      .single();

    if (error) throw error;

    grid.innerHTML = '';
    const completedChallenges = userData.completed_challenges || [];

    challenges.forEach(challenge => {
      const isCompleted = completedChallenges.includes(challenge.id);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${challenge.title}</h3>
        <p>${challenge.desc}</p>
        <p class="points">+${challenge.points} points</p>
        <button class="btn ${isCompleted ? 'completed' : ''}" 
                onclick="completeChallenge(${challenge.id})"
                ${isCompleted ? 'disabled' : ''}>
          ${isCompleted ? '✓ Completed' : 'Complete'}
        </button>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading challenges:', error);
    grid.innerHTML = '<h3>Could not load challenges. Please refresh.</h3>';
  }
}

// Complete a challenge and save to Supabase
async function completeChallenge(challengeId) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  // Find the challenge details from our local list
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;

  try {
    // 1. GET the latest user data from Supabase
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('points, badges, completed_challenges')
      .eq('username', currentUser)
      .single();

    if (fetchError) throw fetchError;

    // Check if challenge is already completed to be safe
    if (userData.completed_challenges.includes(challengeId)) {
      return;
    }

    // 2. PREPARE the new data
    const newPoints = userData.points + challenge.points;
    const newCompletedChallenges = [...userData.completed_challenges, challengeId];
    const newBadges = userData.badges.includes(challenge.badge)
      ? userData.badges
      : [...userData.badges, challenge.badge];

    // 3. SAVE the updated data back to Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        points: newPoints,
        completed_challenges: newCompletedChallenges,
        badges: newBadges
      })
      .eq('username', currentUser);

    if (updateError) throw updateError;

    // 4. SHOW success and update UI
    showBadgeModal(challenge);
    loadChallenges(); // Reload the challenges to show the completed state
    updateUserPoints(); // Update the points display in the navbar

  } catch (error) {
    console.error('Error completing challenge:', error);
    alert('Something went wrong! Could not complete challenge.');
  }
}


// Show badge modal
function showBadgeModal(challenge) {
  const modal = document.getElementById('badgeModal');
  const badgeIcon = document.getElementById('badgeIcon');
  const badgeMessage = document.getElementById('badgeMessage');
  const pointsMessage = document.getElementById('pointsMessage');

  badgeIcon.textContent = challenge.badge.split(' ')[0]; // Get emoji
  badgeMessage.textContent = `You earned the "${challenge.badge}" badge!`;
  pointsMessage.textContent = `+${challenge.points} points added to your score!`;

  modal.classList.add('active');
}

// Close modal
function closeModal() {
  const modal = document.getElementById('badgeModal');
  modal.classList.remove('active');
}

// Initialize challenges page
function initChallengesPage() {
  loadChallenges();

  // Add close modal event listener
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close modal on background click
  const modal = document.getElementById('badgeModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChallengesPage);
} else {
  initChallengesPage();

}
