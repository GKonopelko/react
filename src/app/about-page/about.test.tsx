import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { About } from './page';

describe('About Component', () => {
  it('should render about page content', () => {
    render(<About />);

    expect(screen.getByText('About Poke-monReact')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This application was developed by Grigori Konopelko as part of the RS School React course.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('It uses the PokeAPI, React Router and Error Boundary.')
    ).toBeInTheDocument();
  });

  it('should render back link', () => {
    render(<About />);

    const backLink = screen.getByRole('link', {
      name: 'Select item link-back Go back to Pokemons',
    });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('should render external links', () => {
    render(<About />);

    const taskLink = screen.getByText('task');
    expect(taskLink).toHaveAttribute(
      'href',
      'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/functional-routing.md'
    );
    expect(taskLink).toHaveAttribute('target', '_blank');
    expect(taskLink).toHaveAttribute('rel', 'noopener noreferrer');

    const courseLink = screen.getByText('course.');
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(courseLink).toHaveAttribute('target', '_blank');
    expect(courseLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render Footer component', () => {
    render(<About />);

    expect(screen.getByAltText('RS School')).toBeInTheDocument();
  });
});
