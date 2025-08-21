import { useRef, useState } from 'react';
import { ZodError } from 'zod';
import styles from './UncontrolledForm.module.css';
import { fileToBase64 } from './fileToBase64';
import { type FormValues, formSchema } from './formSchema';
import { useFormStore } from './formStore';
import { CountryAutocomplete } from './CountryAutocomplete';

interface UncontrolledFormProps {
  onClose: () => void;
}

export const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryValue, setCountryValue] = useState('');
  const addFormData = useFormStore((state) => state.addFormData);

  const handleCountryChange = (value: string) => {
    setCountryValue(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const rawData = Object.fromEntries(formData.entries());

    const isZodError = (
      error: unknown
    ): error is {
      issues: Array<{ path: (string | number)[]; message: string }>;
    } => {
      return error instanceof ZodError;
    };

    const data = {
      name: rawData.name as string,
      age: Number(rawData.age),
      email: rawData.email as string,
      password: rawData.password as string,
      confirmPassword: rawData.confirmPassword as string,
      gender: rawData.gender as FormValues['gender'],
      country: countryValue,
      agreeToTerms: rawData.agreeToTerms === 'on',
      profilePicture: rawData.profilePicture
        ? (rawData.profilePicture as File)
        : undefined,
    };

    try {
      const validatedData = await formSchema.parseAsync(data);
      let profilePictureBase64: string | undefined;
      if (validatedData.profilePicture) {
        profilePictureBase64 = await fileToBase64(validatedData.profilePicture);
      }

      addFormData({
        ...validatedData,
        profilePicture: profilePictureBase64,
      });

      onClose();
    } catch (error) {
      if (isZodError(error)) {
        const newErrors: Partial<Record<keyof FormValues, string>> = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const path = err.path[0] as keyof FormValues;
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <div className={styles['form-group']}>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={errors.name ? styles.error : ''}
        />
        {errors.name && (
          <span className={styles['error-text']}>{errors.name}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="age">Age *</label>
        <input
          type="number"
          id="age"
          name="age"
          required
          min="18"
          max="120"
          className={errors.age ? styles.error : ''}
        />
        {errors.age && (
          <span className={styles['error-text']}>{errors.age}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={errors.email ? styles.error : ''}
        />
        {errors.email && (
          <span className={styles['error-text']}>{errors.email}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className={errors.password ? styles.error : ''}
        />
        {errors.password && (
          <span className={styles['error-text']}>{errors.password}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          className={errors.confirmPassword ? styles.error : ''}
        />
        {errors.confirmPassword && (
          <span className={styles['error-text']}>{errors.confirmPassword}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label>Gender *</label>
        <div className={styles['radio-group']}>
          <label>
            <input type="radio" name="gender" value="male" />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" />
            Female
          </label>
        </div>
        {errors.gender && (
          <span className={styles['error-text']}>{errors.gender}</span>
        )}
      </div>

      <div
        className={`${styles['form-group']} ${errors.country ? styles.error : ''}`}
      >
        <label htmlFor="country">Country *</label>
        <CountryAutocomplete
          value={countryValue}
          onChange={handleCountryChange}
        />
        <input type="hidden" name="country" value={countryValue} />
        {errors.country && (
          <span className={styles['error-text']}>{errors.country}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="profilePicture">Profile Picture</label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          accept="image/jpeg,image/png,image/gif"
        />
        {errors.profilePicture && (
          <span className={styles['error-text']}>{errors.profilePicture}</span>
        )}
      </div>
      <div className={styles['form-group']}>
        <label className={styles['checkbox-label']}>
          <input type="checkbox" name="agreeToTerms" />
          Agree to terms and conditions *
        </label>
        {errors.agreeToTerms && (
          <span className={styles['error-text']}>{errors.agreeToTerms}</span>
        )}
      </div>
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
