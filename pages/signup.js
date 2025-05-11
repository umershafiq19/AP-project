
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/Signup.module.css'; // Create this CSS file

export default function Signup() {
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');

  const onSubmit = async (data) => {
  const payload = {
    username: data.username,
    email: data.phoneOrEmail,
    password: data.password,
    name: `${data.firstName} ${data.surname}`,
    gender: data.gender === 'custom' ? data.customGender : data.gender,
    dob: `${data.day}-${data.month}-${data.year}`, // optional
  };

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.error) setError(result.error);
    else setSuccess(true);
  } catch (err) {
    setError('An error occurred. Please try again.');
  }
};


  // Generate date options
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 100}, (_, i) => currentYear - i);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create a new account</h1>
      <p className={styles.subheading}>It's quick and easy.</p>

      {success ? (
        <div className={styles.successMessage}>
          Account created! Please check your email to verify your account.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.nameGrid}>
            <input
              {...register('firstName', { required: true })}
              placeholder="First name"
              className={styles.input}
            />
            <input
            {...register('username', { required: true })}
            placeholder="Username"
            className={styles.input}
            />

            <input
              {...register('surname', { required: true })}
              placeholder="Surname"
              className={styles.input}
            />
          </div>

          <input
            {...register('phoneOrEmail', { required: true })}
            placeholder="Mobile number or email address"
            className={styles.input}
          />

          <input
            {...register('password', { required: true, minLength: 6 })}
            placeholder="New password"
            type="password"
            className={styles.input}
          />

          <div className={styles.formGroup}>
            <label>Date of birth</label>
            <div className={styles.dateGrid}>
              <select {...register('day')} className={styles.select}>
                <option value="">Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select {...register('month')} className={styles.select}>
                <option value="">Month</option>
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </select>
              <select {...register('year')} className={styles.select}>
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  {...register('gender')}
                  onChange={(e) => setSelectedGender(e.target.value)}
                />
                Female
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  {...register('gender')}
                  onChange={(e) => setSelectedGender(e.target.value)}
                />
                Male
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="custom"
                  {...register('gender')}
                  onChange={(e) => setSelectedGender(e.target.value)}
                />
                Custom
              </label>
            </div>
            {selectedGender === 'custom' && (
              <input
                {...register('customGender')}
                placeholder="Gender (optional)"
                className={styles.input}
              />
            )}
          </div>

          <p className={styles.disclaimer}>
            People who use our service may have uploaded your contact information to Facebook.{" "}
            <a href="#" className={styles.link}>Learn more.</a>
          </p>

          <p className={styles.disclaimer}>
            By clicking Sign Up, you agree to our{" "}
            <a href="#" className={styles.link}>Terms</a>,{" "}
            <a href="#" className={styles.link}>Privacy Policy</a> and{" "}
            <a href="#" className={styles.link}>Cookies Policy</a>. You may receive SMS
            notifications from us and can opt out at any time.
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>

          <hr className={styles.divider} />

          <p className={styles.loginLink}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>Log in</a>
          </p>
        </form>
      )}
    </div>
  );
}