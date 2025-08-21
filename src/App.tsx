import { useState } from 'react';
import { ControlledForm } from './ControlledForm';
import { Modal } from './modal';
import { UncontrolledForm } from './UncontrolledForm';

function App() {
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] = useState(false);
  const [isControlledModalOpen, setIsControlledModalOpen] = useState(false);

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

        <div className="form-buttons" style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setIsUncontrolledModalOpen(true)}
            className="primary-button"
          >
            Open Uncontrolled Form
          </button>
          <button
            onClick={() => setIsControlledModalOpen(true)}
            className="primary-button"
          >
            Open Controlled Form
          </button>
        </div>

        <Modal
          isOpen={isUncontrolledModalOpen}
          onClose={() => setIsUncontrolledModalOpen(false)}
        >
          <div className="modal-body">
            <h3>Uncontrolled Form</h3>
            <UncontrolledForm
              onClose={() => setIsUncontrolledModalOpen(false)}
            />
          </div>
        </Modal>

        <Modal
          isOpen={isControlledModalOpen}
          onClose={() => setIsControlledModalOpen(false)}
        >
          <div className="modal-body">
            <h3>Controlled Form</h3>
            <ControlledForm onClose={() => setIsControlledModalOpen(false)} />
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default App;
