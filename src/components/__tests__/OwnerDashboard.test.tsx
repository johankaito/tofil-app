import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import OwnerDashboard from '@/app/(protected)/owner/page';

describe('OwnerDashboard', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<OwnerDashboard />);
    expect(getByText('Owner Dashboard')).toBeTruthy();
  });
}); 