import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CRM dashboard', () => {
  render(<App />);
  const headings = screen.getAllByText(/Dashboard/i);
  expect(headings.length).toBeGreaterThan(0);
});

test('renders sidebar navigation', () => {
  render(<App />);
  expect(screen.getAllByText(/Kontakte/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Leads/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Opportunities/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/KI-Assistent/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Integrationen/i).length).toBeGreaterThan(0);
});
