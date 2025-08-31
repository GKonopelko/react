import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './uncontrolledForm.module.css';
import { fileToBase64 } from './fileToBase64';
import { type FormValues, formSchema } from './formSchema';
import { useFormStore } from './formStore';
import { useState } from 'react';
import { CountryAutocomplete } from './CountryAutocomplete';

interface ControlledFormProps {
  onClose: () => void;
}

interface FormFieldProps {
  error?: { message?: string };
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField = ({
  error,
  label,
  htmlFor,
  children,
  required = false,
}: FormFieldProps) => {
  return (
    <div className={`${styles['form-group']} ${error ? styles.error : ''}`}>
      <label htmlFor={htmlFor}>
        {label} {required && '*'}
      </label>
      {children}
      {error && <span className={styles['error-text']}>{error.message}</span>}
    </div>
  );
};

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
    formState: { errors, isSubmitting, isValid },
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
      <FormField error={errors.name} label="Name" htmlFor="name" required>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <input type="text" id="name" {...field} />}
        />
      </FormField>
      <FormField error={errors.age} label="Age" htmlFor="age" required>
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
            />
          )}
        />
      </FormField>
      <FormField error={errors.email} label="Email" htmlFor="email" required>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <input type="email" id="email" {...field} />}
        />
      </FormField>

      <FormField
        error={errors.password}
        label="Password"
        htmlFor="password"
        required
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              type="password"
              id="password"
              {...field}
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
      </FormField>

      <FormField
        error={errors.confirmPassword}
        label="Confirm Password"
        htmlFor="confirmPassword"
        required
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <input type="password" id="confirmPassword" {...field} />
          )}
        />
      </FormField>

      <FormField error={errors.gender} label="Gender" htmlFor="gender" required>
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
      </FormField>

      <FormField
        error={errors.country}
        label="Country"
        htmlFor="country"
        required
      >
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField
        error={errors.profilePicture}
        label="Profile Picture"
        htmlFor="profilePicture"
      >
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
      </FormField>

      <FormField
        error={errors.agreeToTerms}
        label="Agree to terms and conditions"
        htmlFor="agreeToTerms"
        required
      >
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
      </FormField>

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
          disabled={isSubmitting || !isValid}
          className={styles['submit-button']}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};
