import React from 'react';
import { render, screen } from '../../test/test-utils';
import Reports from '../Reports';

describe('Reports Component', () => {
  test('renders without crashing', () => {
    render(<Reports />);
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
  });

  test('displays the correct tabs', () => {
    render(<Reports />);
    expect(screen.getByText('Generated Reports')).toBeInTheDocument();
    expect(screen.getByText('Report Templates')).toBeInTheDocument();
    expect(screen.getByText('Scheduled Reports')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });
});