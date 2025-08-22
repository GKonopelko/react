import { useEffect, useState, useRef } from 'react';
import { useFormStore } from './formStore';
import styles from './display.module.css';

export const DataDisplay = () => {
  const formData = useFormStore((state) => state.formData);
  const [newItems, setNewItems] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const formDataRef = useRef(formData);
  const newItemsRef = useRef(newItems);

  useEffect(() => {
    formDataRef.current = formData;
    newItemsRef.current = newItems;
  }, [formData, newItems]);

  useEffect(() => {
    if (formDataRef.current.length === 0) return;

    const latestSubmission =
      formDataRef.current[formDataRef.current.length - 1];
    const latestId = latestSubmission.submittedAt.toString();

    if (!newItemsRef.current.has(latestId)) {
      setNewItems((prev) => new Set(prev).add(latestId));

      const existingTimer = timersRef.current.get(latestId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        setNewItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(latestId);
          return newSet;
        });
        timersRef.current.delete(latestId);
      }, 5000);

      timersRef.current.set(latestId, timer);
    }
  }, [formData.length]);

  useEffect(() => {
    const currentTimers = timersRef.current;

    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

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
