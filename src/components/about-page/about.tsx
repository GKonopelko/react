import styles from './styles.module.css';
import rssLogo from '../../assets/rss-logo.svg';

export const About = () => {
  return (
    <div className={styles.about}>
      <h2>About Poke-monReact</h2>
      <div className={styles.content}>
        <p>
          This application was developed by Grigori Konopelko as part of the RS
          School React course.
        </p>
        <p>It uses the PokeAPI to fetch and display Pokémon information.</p>
        <a
          href="https://rs.school/react/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <img
            src={rssLogo}
            alt="RS School React Course"
            className={styles.logo}
          />
          RS School React Course
        </a>
      </div>
    </div>
  );
};
