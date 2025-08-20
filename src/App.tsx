import './App.css';
import { useState } from 'react';
import { Modal } from './modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>Shared modal components</h1>
      <h2>1. Uncontrolled components approach Form</h2>
      <h2>2. Form created using React Hook Form</h2>

      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Modal window</h3>
        <p>Form will be here.</p>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
