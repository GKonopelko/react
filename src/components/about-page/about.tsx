import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import { Footer } from '../footer/footer';
import { useTheme } from '../theme-context/use-theme';

export const About = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.about} data-theme={theme}>
      <Link to="/" className={styles.link}>
        Go back to Pokemons
      </Link>
      <h2>About Poke-monReact</h2>
      <div className={styles.content}>
        <p>
          This application was developed by Grigori Konopelko as part of the RS
          School React course.
        </p>
        <p>It uses the PokeAPI, React Router and Error Boundary.</p>
        <p>
          More information about the &nbsp;
          <a
            href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/functional-routing.md"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['link']}
          >
            task
          </a>{' '}
          and about the &nbsp;
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['link']}
          >
            course
          </a>
          .
        </p>
        <Footer></Footer>
      </div>
    </div>
  );
};
