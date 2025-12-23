var supabase = window.supabaseClient;

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

async function loadChallenges() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  const grid = document.getElementById('challengesGrid');
  grid.innerHTML = '<h3>Loading challenges...</h3>';

  try {
    const { data, error } = await supabase
      .from('users')
      .select('completed_challenges')
      .eq('username', currentUser)
      .single();

    if (error) throw error;

    grid.innerHTML = '';
    const completed = data.completed_challenges || [];

    challenges.forEach(ch => {
      const done = completed.includes(ch.id);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${ch.title}</h3>
        <p>${ch.desc}</p>
        <p class="points">+${ch.points} points</p>
        <button class="btn ${done ? 'completed' : ''}" ${done ? 'disabled' : ''} onclick="completeChallenge(${ch.id})">
          ${done ? '✓ Completed' : 'Complete'}
        </button>`;
      grid.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<h3>Error loading challenges</h3>';
  }
}

async function completeChallenge(id) {
  const user = localStorage.getItem('currentUser');
  if (!user) return;

  const ch = challenges.find(c => c.id === id);
  if (!ch) return;

  const { data } = await supabase
    .from('users')
    .select('points, badges, completed_challenges')
    .eq('username', user)
    .single();

  const updated = {
    points: data.points + ch.points,
    completed_challenges: [...data.completed_challenges, id],
    badges: data.badges.includes(ch.badge) ? data.badges : [...data.badges, ch.badge]
  };

  await supabase.from('users').update(updated).eq('username', user);
  loadChallenges();
  updateUserPoints();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', loadChallenges)
  : loadChallenges();
