//pages/login.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import styles from '@/styles/Login.module.css'; // Create this CSS file

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async ({ email, password }) => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) setError(res.error);
    else window.location.href = '/index';
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