import React, { useState } from 'react';
import { loginUser,type LoginPayload } from '../api';
import styles from '../css/Login.module.css';

interface LoginProps {
  onAuthSuccess?: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState<LoginPayload>({
    username: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginRes = await loginUser(formData);

      if (loginRes.access_token) {
        localStorage.setItem('access_token', loginRes.access_token);
        if (onAuthSuccess) onAuthSuccess(loginRes.access_token);
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Welcome Back</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="login-username" className={styles.label}>
            Username
          </label>
          <input
            id="login-username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="login-password" className={styles.label}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};