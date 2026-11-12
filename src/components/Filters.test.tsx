import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from './Filters';

const renderFilters = (selected: { species?: string[]; strains?: string[]; provenances?: string[] } = {}) => {
  const handlers = {
    onSpeciesChange: vi.fn(),
    onStrainChange: vi.fn(),
    onProvenanceChange: vi.fn(),
    onClearFilters: vi.fn(),
  };
  render(
    <Filters
      uniqueSpecies={['Duck', 'Goose']}
      uniqueStrains={['H5N1', 'H7N2']}
      uniqueProvenances={['Wild', 'Livestock']}
      selectedSpecies={selected.species ?? []}
      selectedStrains={selected.strains ?? []}
      selectedProvenances={selected.provenances ?? []}
      {...handlers}
    />
  );
  return handlers;
};

test('toggles report their pressed state to assistive tech', () => {
  renderFilters({ species: ['Duck'], strains: ['H7N2'] });
  expect(screen.getByRole('button', { name: 'Duck' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Goose' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: 'H7N2' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Wild' })).toHaveAttribute('aria-pressed', 'false');
});

test('clicking a toggle reports which value changed', () => {
  const { onSpeciesChange, onStrainChange, onProvenanceChange } = renderFilters();
  fireEvent.click(screen.getByRole('button', { name: 'Goose' }));
  fireEvent.click(screen.getByRole('button', { name: 'H5N1' }));
  fireEvent.click(screen.getByRole('button', { name: 'Livestock' }));
  expect(onSpeciesChange).toHaveBeenCalledWith('Goose');
  expect(onStrainChange).toHaveBeenCalledWith('H5N1');
  expect(onProvenanceChange).toHaveBeenCalledWith('Livestock');
});

test('Clear filters only appears once something is selected', () => {
  renderFilters();
  expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
});

test('Clear filters calls the clear handler', () => {
  const { onClearFilters } = renderFilters({ provenances: ['Wild'] });
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(onClearFilters).toHaveBeenCalledTimes(1);
});
