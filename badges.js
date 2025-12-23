const allBadges = [
  { id: 1, name: '💧 Water Saver', desc: 'Complete the "Save Water" challenge.' },
  { id: 2, name: '🔌 Power Saver', desc: 'Complete the "Power Saver" challenge.' },
  { id: 3, name: '🌳 Green Thumb', desc: 'Complete the "Plant a Tree" challenge.' },
  { id: 4, name: '🚮 Waste Warrior', desc: 'Complete the "Waste Segregation" challenge.' },
  { id: 5, name: '🛒 Eco Shopper', desc: 'Complete the "Eco Shopping" challenge.' },
  { id: 6, name: '🚶‍♂️ Commuter Hero', desc: 'Complete the "Walk or Cycle" challenge.' },
  { id: 7, name: '🍃 Plant Keeper', desc: 'Complete the "Indoor Plants" challenge.' },
  { id: 8, name: '💻 Digital Cleanup', desc: 'Complete the "Digital Cleanup" challenge.' },
  { id: 9, name: '♻️ Recycling Champ', desc: 'Complete the "Recycling" challenge.' },
  { id: 10, name: '💡 Switch Off', desc: 'Complete the "Switch Off" challenge.' }
];

async function loadBadges() {
  const user = localStorage.getItem('currentUser');
  if (!user) return;

  const { data } = await supabase
    .from('users')
    .select('badges')
    .eq('username', user)
    .single();

  const earned = data.badges || [];
  const earnedGrid = document.getElementById('earnedBadges');
  const availableGrid = document.getElementById('availableBadges');

  earnedGrid.innerHTML = '';
  availableGrid.innerHTML = '';

  allBadges.forEach(b => {
    const card = document.createElement('div');
    card.className = 'card ' + (earned.includes(b.name) ? 'earned' : 'locked');
    card.innerHTML = `
      <h3>${b.name}</h3>
      <p>${b.desc}</p>
      <p>${earned.includes(b.name) ? '✓ Earned' : '🔒 Locked'}</p>`;
    (earned.includes(b.name) ? earnedGrid : availableGrid).appendChild(card);
  });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', loadBadges)
  : loadBadges();

