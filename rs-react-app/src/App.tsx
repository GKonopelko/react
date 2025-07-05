import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Footer } from './components/footer/footer';

function App() {
  return (
    <div className="wrapper">
      <h1>React App</h1>

      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <Footer />
    </div>
  );
}

export default App;
