import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { firebaseAuth } from '../../firebase';

export const LoginPage = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const loginUser = await signInWithEmailAndPassword(
        firebaseAuth,
        formData.email,
        formData.password
      );

      setLoading(false);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message);
      setLoading(false);
      setTimeout(() => {
        setSubmitError('');
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <header>
        <h3>Login</h3>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && errors.email.type === 'required' && (
          <p>Email field is required</p>
        )}
        {errors.email && errors.email.type === 'pattern' && (
          <p>Email Pattern is invalid</p>
        )}

        <label>Password</label>
        <input
          name="password"
          type="password"
          {...register('password', { required: true, minLength: 10 })}
        />
        {errors.password && errors.password.type === 'required' && (
          <p>Password field is required</p>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <p>Password must have at least 10 characters</p>
        )}

        {submitError && <p>{submitError}</p>}
        <input type="submit" disabled={loading} />
        <Link to="/register">아직 아이디가 없다면...</Link>
      </form>
    </div>
  );
};
