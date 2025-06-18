import { useState } from 'react';
import API from '../utils/api'; // Axios instance
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
    age: '',
    gender: ''
  });
  const [error, setError] = useState('');

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Sending form data:", form);
      await API.post('/api/v1/user/userragister', form);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmpassword"
          placeholder="Confirm Password"
          value={form.confirmpassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
