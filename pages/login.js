import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'; 
import styles from '@/styles/Login.module.css';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const router = useRouter(); 

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        router.push('/'); 
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          {...register('email')}
          placeholder="Email"
          className={styles.input}
          type="email"
          required
        />
        <input
          {...register('password')}
          placeholder="Password"
          className={styles.input}
          type="password"
          required
        />
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.button}>
          Log in
        </button>
      </form>
      <div className={styles.links}>
        <a href="/forgot-password" className={styles.link}>Forgotten password?</a>
        <a href="/signup" className={styles.link}>Create new account</a>
      </div>
    </div>
  );
}
