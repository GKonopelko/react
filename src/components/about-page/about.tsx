import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import { Footer } from '../footer/footer';
import { useTheme } from '../theme-context/use-theme';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import { Flyout } from '../flyout/flyout';

export const About = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.about} data-theme={theme}>
      <Link to="/" className={styles.link}>
        <CheckboxWrapper
          id="link-back"
          name="link back"
          description="Link to main page"
        >
          Go back to Pokemons
        </CheckboxWrapper>
      </Link>
      <CheckboxWrapper
        id="about-header"
        name="about header"
        description="Header on about page"
      >
        <h2>About Poke-monReact</h2>
      </CheckboxWrapper>
      <div className={styles.content}>
        <CheckboxWrapper
          id="about-content"
          name="about content"
          description="Content on about page"
        >
          <p>
            This application was developed by Grigori Konopelko as part of the
            RS School React course.
          </p>
          <p>It uses the PokeAPI, React Router and Error Boundary.</p>
        </CheckboxWrapper>
        <p>
          <CheckboxWrapper
            id="about-links"
            name="about links"
            description="Links on about page"
          >
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
              course.
            </a>
          </CheckboxWrapper>
        </p>
        <Flyout />
        <Footer></Footer>
      </div>
    </div>
  );
};
