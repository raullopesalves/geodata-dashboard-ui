import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './components/Navbar';

test('shows the dashboard title and a help dialog that labels the data as synthetic', () => {
  render(<Navbar />);
  expect(screen.getByRole('heading', { name: /bird flu cases in switzerland/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Help' }));
  const dialog = screen.getByRole('dialog', { name: 'Dashboard Help' });
  expect(dialog).toHaveAttribute('open');
  expect(dialog).toHaveTextContent(/dataset is synthetic/i);

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(dialog).not.toHaveAttribute('open');
});
