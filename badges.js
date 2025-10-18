// All available badges
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

// Load badges from Supabase
async function loadBadges() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;
  
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('badges')
      .eq('username', currentUser)
      .single();
    
    if (error) throw error;
    
    const earnedBadgesGrid = document.getElementById('earnedBadges');
    const availableBadgesGrid = document.getElementById('availableBadges');
    
    earnedBadgesGrid.innerHTML = '';
    availableBadgesGrid.innerHTML = '';
    
    const userBadges = userData.badges || [];
    const earnedBadges = [];
    const lockedBadges = [];
    
    allBadges.forEach(badge => {
      if (userBadges.includes(badge.name)) {
        earnedBadges.push(badge);
      } else {
        lockedBadges.push(badge);
      }
    });
    
    // Display earned badges
    if (earnedBadges.length > 0) {
      earnedBadges.forEach(badge => {
        const card = document.createElement('div');
        card.className = 'card earned';
        card.innerHTML = `
          <h3>${badge.name}</h3>
          <p>${badge.desc}</p>
          <p style="color: #ffd700; font-weight: bold;">✓ Earned</p>
        `;
        earnedBadgesGrid.appendChild(card);
      });
    } else {
      earnedBadgesGrid.innerHTML = '<p style="color: rgba(255,255,255,0.7);">Complete challenges to earn badges!</p>';
    }
    
    // Display locked badges
    lockedBadges.forEach(badge => {
      const card = document.createElement('div');
      card.className = 'card locked';
      card.innerHTML = `
        <h3>${badge.name}</h3>
        <p>${badge.desc}</p>
        <p style="color: rgba(255,255,255,0.5);">🔒 Locked</p>
      `;
      availableBadgesGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading badges:', error);
  }
}

// Initialize badges page
function initBadgesPage() {
  loadBadges();
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBadgesPage);
} else {
  initBadgesPage();
}