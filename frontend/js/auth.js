document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const successMessage = document.getElementById('successMessage');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const organizationInput = document.getElementById('organization');
    const organization = organizationInput ? organizationInput.value.trim() : null;

    // Basic validation
    if (!fullName) {
      alert('Full name is required');
      return;
    }

    if (!email) {
      alert('Email is required');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!role) {
      alert('Please select a role');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  full_name: fullName,   // 👈 THIS IS THE FIX
  email,
  password,
  role,
  organization
})

      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Signup error:', data);
        alert(data.error || JSON.stringify(data));
        return;
      }

      // Save token & user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success animation
      signupForm.style.display = 'none';
      successMessage.style.display = 'block';

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      alert('Server error. Please try again later.');
    }
  });

  // Show organization field when role selected
  const roleSelect = document.getElementById('role');
  const organizationGroup = document.getElementById('organizationGroup');

  if (roleSelect && organizationGroup) {
    roleSelect.addEventListener('change', () => {
      if (roleSelect.value) {
        organizationGroup.style.display = 'block';
      } else {
        organizationGroup.style.display = 'none';
      }
    });
  }
});
