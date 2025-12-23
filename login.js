var supabase = window.supabaseClient;

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const welcomeMsg = document.getElementById('welcomeMsg');

  if (!username || !password) {
    welcomeMsg.textContent = 'Please enter both username and password.';
    welcomeMsg.style.display = 'block';
    welcomeMsg.style.color = '#ff6b6b';
    return;
  }

  try {
    welcomeMsg.textContent = 'Logging in...';
    welcomeMsg.style.display = 'block';
    welcomeMsg.style.color = '#0031e2ff';

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username,
            points: 0,
            badges: [],
            completed_challenges: []
          }
        ]);

      if (insertError) throw insertError;

      welcomeMsg.textContent = `Welcome, ${username}! Account created. Redirecting...`;
    } else {
      welcomeMsg.textContent = `Welcome back, ${username}! Redirecting...`;
    }

    localStorage.setItem('currentUser', username);

    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);

  } catch (error) {
    console.error('Login error:', error);
    welcomeMsg.textContent = 'Error: ' + (error.message || 'Something went wrong.');
    welcomeMsg.style.color = '#ff6b6b';
  }
});

document.getElementById('forgotPasswordLink').addEventListener('click', function (e) {
  e.preventDefault();
  alert('You can type anything in the password field to login.');
});
