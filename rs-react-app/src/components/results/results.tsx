import React from 'react';
import styles from './styles.module.css';

interface ResultsProps {
  resultArray?: string[];
}

export class Results extends React.Component<ResultsProps> {
  render() {
    const { resultArray = [] } = this.props;
    return (
      <div className={styles.results}>
        <div className={styles['results-content']}>
          {resultArray.length > 0 ? (
            <ul>
              {resultArray.map((item, index) => (
                <li key={index}>
                  <div>{item}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div>No results found</div>
          )}
        </div>
      </div>
    );
  }
}
