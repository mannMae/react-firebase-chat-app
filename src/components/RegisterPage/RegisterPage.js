import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { firebaseAuth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import md5 from 'md5';

export const RegisterPage = () => {
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
      const createdUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        formData.email,
        formData.password
      );
      updateProfile(firebaseAuth.currentUser, {
        displayName: formData.name,
        photoURL: `http:gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      setLoading(false);
      console.log(createdUser);
    } catch (error) {
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
        <h3>Register</h3>
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
        <label>Name</label>
        <input
          name="name"
          type="text"
          {...register('name', { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === 'required' && (
          <p>Name field is required</p>
        )}
        {errors.name && errors.name.type === 'maxLength' && (
          <p>Your Name exceed maximum length</p>
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
        <label>Password Confirm</label>
        <input
          name="passwordConfirm"
          type="password"
          {...register('passwordConfirm', {
            required: true,
            validate: (value) => value === watch('password'),
          })}
        />
        {errors.passwordConfirm &&
          errors.passwordConfirm.type === 'required' && (
            <p>Password confirm field is required</p>
          )}
        {errors.passwordConfirm &&
          errors.passwordConfirm.type === 'validate' && (
            <p>Password confirm is not same as password</p>
          )}
        {submitError && <p>{submitError}</p>}
        <input type="submit" disabled={loading} />
        <Link to="/login">이미 아이디가 있다면...</Link>
      </form>
    </div>
  );
};
