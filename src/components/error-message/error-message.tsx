import { Component } from 'react';
import styles from './styles.module.css';

interface ErrorMessageProps {
  error: string;
  onDismiss: () => void;
}

export class ErrorMessage extends Component<ErrorMessageProps> {
  render() {
    return (
      <div className={styles['error-message']}>
        {this.props.error}
        <button onClick={this.props.onDismiss}>Hide error</button>
      </div>
    );
  }
}
