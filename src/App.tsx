import { useState } from 'react';
import { Modal } from './Modal';
import { UncontrolledForm } from './uncontrolledForm';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app-container">
      <header>
        <h1>Shared Modal Components</h1>
      </header>

      <main>
        <section>
          <h2>1. Uncontrolled Components Approach Form</h2>
          <h2>2. Form Created Using React Hook Form</h2>
        </section>

        <button onClick={() => setIsModalOpen(true)} className="primary-button">
          Open Modal
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="modal-body">
            <h3>Modal Window</h3>
            <UncontrolledForm
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
            ,
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)}>Close Modal</button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default App;
