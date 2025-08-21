import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './uncontrolledForm.module.css';
import { countries } from './countries';
import { fileToBase64 } from './fileToBase64';
import { type FormValues, formSchema } from './formSchema';
import { useFormStore } from './formStore';

interface ControlledFormProps {
  onClose: () => void;
}

export const ControlledForm = ({ onClose }: ControlledFormProps) => {
  const addFormData = useFormStore((state) => state.addFormData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      country: '',
      agreeToTerms: false,
      profilePicture: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      let profilePictureBase64: string | undefined;

      if (data.profilePicture) {
        profilePictureBase64 = await fileToBase64(data.profilePicture);
      }

      addFormData({
        ...data,
        profilePicture: profilePictureBase64,
      });

      onClose();
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('root', {
        type: 'manual',
        message: 'An error occurred while submitting the form',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles['form-group']}>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={errors.name ? styles.error : ''}
        />
        {errors.name && (
          <span className={styles['error-text']}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="age">Age *</label>
        <input
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true })}
          className={errors.age ? styles.error : ''}
        />
        {errors.age && (
          <span className={styles['error-text']}>{errors.age.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={errors.email ? styles.error : ''}
        />
        {errors.email && (
          <span className={styles['error-text']}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={errors.password ? styles.error : ''}
        />
        {errors.password && (
          <span className={styles['error-text']}>
            {errors.password.message}
          </span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? styles.error : ''}
        />
        {errors.confirmPassword && (
          <span className={styles['error-text']}>
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label>Gender *</label>
        <div className={styles['radio-group']}>
          <label>
            <input type="radio" value="male" {...register('gender')} />
            Male
          </label>
          <label>
            <input type="radio" value="female" {...register('gender')} />
            Female
          </label>
        </div>
        {errors.gender && (
          <span className={styles['error-text']}>{errors.gender.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="country">Country *</label>
        <select
          id="country"
          {...register('country')}
          className={errors.country ? styles.error : ''}
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className={styles['error-text']}>{errors.country.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="profilePicture">Profile Picture</label>
        <input
          type="file"
          id="profilePicture"
          accept="image/jpeg,image/png,image/gif"
          {...register('profilePicture', {
            onChange: (e) => {
              return e.target.files?.[0] || undefined;
            },
          })}
        />
        {errors.profilePicture && (
          <span className={styles['error-text']}>
            {errors.profilePicture.message}
          </span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label className={styles['checkbox-label']}>
          <input type="checkbox" {...register('agreeToTerms')} />
          Agree to terms and conditions *
        </label>
        {errors.agreeToTerms && (
          <span className={styles['error-text']}>
            {errors.agreeToTerms.message}
          </span>
        )}
      </div>

      {errors.root && (
        <div className={styles['error-text']}>{errors.root.message}</div>
      )}

      <div className={styles['form-actions']}>
        <button
          type="button"
          onClick={onClose}
          className={styles['cancel-button']}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles['submit-button']}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};
