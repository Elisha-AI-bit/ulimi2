import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '../supabaseClient';

// Mock the environment variables
vi.mock(import.meta.env, () => ({
  'import.meta.env.VITE_SUPABASE_URL': 'https://test.supabase.co',
  'import.meta.env.VITE_SUPABASE_ANON_KEY': 'test-anon-key'
}));

describe('Supabase Client', () => {
  it('should create a Supabase client instance', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase).toBe('object');
  });

  it('should have auth property', () => {
    expect(supabase.auth).toBeDefined();
  });

  it('should have from property', () => {
    expect(supabase.from).toBeDefined();
  });

  it('should have storage property', () => {
    expect(supabase.storage).toBeDefined();
  });
});