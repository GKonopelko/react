import { useEffect, useState } from 'react';
import { useFormStore } from './formStore';
import styles from './display.module.css';

export const DataDisplay = () => {
  const formData = useFormStore((state) => state.formData);
  const [newItems, setNewItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newestId = formData[formData.length - 1]?.submittedAt.toString();
    if (newestId && !newItems.has(newestId)) {
      setNewItems((prev) => new Set(prev).add(newestId));

      const timer = setTimeout(() => {
        setNewItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(newestId);
          return newSet;
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [formData, newItems]);

  if (formData.length === 0) {
    return <div className={styles.empty}>No form submissions yet</div>;
  }

  return (
    <section className={styles.container}>
      <h2>Form Submissions</h2>
      <div className={styles.grid}>
        {formData.map((data) => {
          const isNew = newItems.has(data.submittedAt.toString());
          return (
            <div
              key={data.submittedAt.toString()}
              className={`${styles.card} ${isNew ? styles.new : ''}`}
            >
              <h3>{data.name}</h3>
              <p>Age: {data.age}</p>
              <p>Email: {data.email}</p>
              <p>Gender: {data.gender}</p>
              <p>Country: {data.country}</p>
              <p>Submitted: {new Date(data.submittedAt).toLocaleString()}</p>
              {data.profilePicture && (
                <div className={styles.image}>
                  <img src={data.profilePicture} alt="Profile" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
