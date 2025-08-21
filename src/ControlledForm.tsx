import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './uncontrolledForm.module.css';
import { countries } from './countries';
import { fileToBase64 } from './fileToBase64';
import { type FormValues, formSchema } from './formSchema';
import { useFormStore } from './formStore';
import { useState } from 'react';

interface ControlledFormProps {
  onClose: () => void;
}

export const ControlledForm = ({ onClose }: ControlledFormProps) => {
  const addFormData = useFormStore((state) => state.addFormData);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const checkPasswordCriteria = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(password),
    });
  };

  const {
    control,
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
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              id="name"
              {...field}
              className={errors.name ? styles.error : ''}
            />
          )}
        />
        {errors.name && (
          <span className={styles['error-text']}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="age">Age *</label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              id="age"
              {...field}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              className={errors.age ? styles.error : ''}
            />
          )}
        />
        {errors.age && (
          <span className={styles['error-text']}>{errors.age.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="email">Email *</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              type="email"
              id="email"
              {...field}
              className={errors.email ? styles.error : ''}
            />
          )}
        />
        {errors.email && (
          <span className={styles['error-text']}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="password">Password *</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              type="password"
              id="password"
              {...field}
              className={errors.password ? styles.error : ''}
              onChange={(e) => {
                field.onChange(e);
                checkPasswordCriteria(e.target.value);
              }}
            />
          )}
        />

        <div className={styles['password-criteria']}>
          <div className={styles['criteria-item']}>
            <div
              className={`${styles['criteria-indicator']} ${passwordCriteria.length ? styles.valid : ''}`}
            ></div>
            <span className={styles['criteria-label']}>
              Length (min 8 chars)
            </span>
          </div>
          <div className={styles['criteria-item']}>
            <div
              className={`${styles['criteria-indicator']} ${passwordCriteria.uppercase ? styles.valid : ''}`}
            ></div>
            <span className={styles['criteria-label']}>Uppercase letter</span>
          </div>
          <div className={styles['criteria-item']}>
            <div
              className={`${styles['criteria-indicator']} ${passwordCriteria.lowercase ? styles.valid : ''}`}
            ></div>
            <span className={styles['criteria-label']}>Lowercase letter</span>
          </div>
          <div className={styles['criteria-item']}>
            <div
              className={`${styles['criteria-indicator']} ${passwordCriteria.number ? styles.valid : ''}`}
            ></div>
            <span className={styles['criteria-label']}>Number</span>
          </div>
          <div className={styles['criteria-item']}>
            <div
              className={`${styles['criteria-indicator']} ${passwordCriteria.symbol ? styles.valid : ''}`}
            ></div>
            <span className={styles['criteria-label']}>Special symbol</span>
          </div>
        </div>

        {errors.password && (
          <span className={styles['error-text']}>
            {errors.password.message}
          </span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <input
              type="password"
              id="confirmPassword"
              {...field}
              className={errors.confirmPassword ? styles.error : ''}
            />
          )}
        />
        {errors.confirmPassword && (
          <span className={styles['error-text']}>
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label>Gender *</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div className={styles['radio-group']}>
              <label>
                <input
                  type="radio"
                  value="male"
                  checked={field.value === 'male'}
                  onChange={() => field.onChange('male')}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  value="female"
                  checked={field.value === 'female'}
                  onChange={() => field.onChange('female')}
                />
                Female
              </label>
            </div>
          )}
        />
        {errors.gender && (
          <span className={styles['error-text']}>{errors.gender.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="country">Country *</label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <select
              id="country"
              {...field}
              className={errors.country ? styles.error : ''}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
        />
        {errors.country && (
          <span className={styles['error-text']}>{errors.country.message}</span>
        )}
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="profilePicture">Profile Picture</label>
        <Controller
          name="profilePicture"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              id="profilePicture"
              accept="image/jpeg,image/png,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0] || undefined;
                field.onChange(file);
              }}
            />
          )}
        />
        {errors.profilePicture && (
          <span className={styles['error-text']}>
            {errors.profilePicture.message}
          </span>
        )}
      </div>

      <div className={styles['form-group']}>
        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <label className={styles['checkbox-label']}>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              Agree to terms and conditions *
            </label>
          )}
        />
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
