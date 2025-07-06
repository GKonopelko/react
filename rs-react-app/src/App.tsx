import reactLogo from './assets/react.svg';
import './App.css';
import { Footer } from './components/footer/footer';
import { Controls } from './components/controls/controls';
import { Results } from './components/results/results';

function App() {
  return (
    <div className="wrapper">
      <header className="header">
        <h1>Ny React App</h1>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </header>
      <Controls />
      <Results />
      <Footer />
    </div>
  );
}

export default App;
