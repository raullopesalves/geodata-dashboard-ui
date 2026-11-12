import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './components/Navbar';

test('shows the dashboard title and a help dialog that labels the data as synthetic', () => {
  render(<Navbar />);
  expect(screen.getByText(/bird flu cases in switzerland/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Help'));
  expect(screen.getByText(/dataset is synthetic/i)).toBeInTheDocument();
});
