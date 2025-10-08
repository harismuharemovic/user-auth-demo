/**
 * LLTC Unit Tests for cn utility function
 * 
 * This test file validates the cn utility function which combines clsx and tailwind-merge
 * to handle conditional classes and merge conflicting Tailwind classes.
 * 
 * File: src/lib/utils.ts
 * Function: cn
 * Test Type: LLTC (Low Level Test Case)
 * Framework: Vitest
 * 
 * Related GitHub Issue: https://github.com/harismuharemovic/user-auth-demo/issues/1
 */

import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  describe('Empty inputs', () => {
    it('should return empty string when no arguments provided', () => {
      expect(cn()).toBe('');
    });

    it('should handle empty string input', () => {
      expect(cn('')).toBe('');
    });

    it('should handle multiple empty strings', () => {
      expect(cn('', '', '')).toBe('');
    });
  });

  describe('Single class string', () => {
    it('should return single class unchanged', () => {
      expect(cn('bg-red-500')).toBe('bg-red-500');
    });

    it('should return single class with spaces trimmed', () => {
      expect(cn('  bg-red-500  ')).toBe('bg-red-500');
    });

    it('should handle single class with multiple words', () => {
      expect(cn('flex items-center justify-center')).toBe('flex items-center justify-center');
    });
  });

  describe('Multiple class strings', () => {
    it('should concatenate multiple class strings', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle multiple class strings with spaces', () => {
      expect(cn('bg-red-500 text-white', 'p-4 m-2')).toBe('bg-red-500 text-white p-4 m-2');
    });

    it('should handle mixed empty and non-empty strings', () => {
      expect(cn('bg-red-500', '', 'text-white', '')).toBe('bg-red-500 text-white');
    });
  });

  describe('Array inputs', () => {
    it('should handle array of classes', () => {
      expect(cn(['bg-red-500', 'text-white'])).toBe('bg-red-500 text-white');
    });

    it('should handle nested arrays', () => {
      expect(cn(['bg-red-500', ['text-white', 'p-4']])).toBe('bg-red-500 text-white p-4');
    });

    it('should handle arrays with empty strings', () => {
      expect(cn(['bg-red-500', '', 'text-white'])).toBe('bg-red-500 text-white');
    });

    it('should handle mixed array and string inputs', () => {
      expect(cn(['bg-red-500'], 'text-white', ['p-4'])).toBe('bg-red-500 text-white p-4');
    });
  });

  describe('Object inputs with conditional classes', () => {
    it('should handle object with truthy conditions', () => {
      expect(cn({
        'bg-red-500': true,
        'text-white': true
      })).toBe('bg-red-500 text-white');
    });

    it('should handle object with falsy conditions', () => {
      expect(cn({
        'bg-red-500': true,
        'text-white': false,
        'p-4': true
      })).toBe('bg-red-500 p-4');
    });

    it('should handle object with mixed condition types', () => {
      expect(cn({
        'bg-red-500': 1,
        'text-white': 0,
        'p-4': 'yes',
        'm-4': '',
        'rounded': null,
        'shadow': undefined
      })).toBe('bg-red-500 p-4');
    });

    it('should handle mixed object and string inputs', () => {
      expect(cn('base-class', {
        'bg-red-500': true,
        'text-white': false
      }, 'final-class')).toBe('base-class bg-red-500 final-class');
    });
  });

  describe('Tailwind class merging', () => {
    it('should merge conflicting padding classes (later wins)', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('should merge conflicting margin classes', () => {
      expect(cn('m-2', 'm-4', 'm-6')).toBe('m-6');
    });

    it('should merge conflicting background colors', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should merge conflicting text colors', () => {
      expect(cn('text-red-500', 'text-blue-500', 'text-green-500')).toBe('text-green-500');
    });

    it('should preserve non-conflicting classes while merging conflicting ones', () => {
      expect(cn('flex', 'px-2', 'items-center', 'px-4', 'justify-center'))
        .toBe('flex items-center justify-center px-4');
    });

    it('should handle complex conflicting class scenarios', () => {
      expect(cn(
        'bg-red-500 text-white p-2 m-1',
        'bg-blue-600 p-4',
        { 'bg-green-700': true, 'm-3': true }
      )).toBe('text-white bg-green-700 p-4 m-3');
    });
  });

  describe('Null and undefined handling', () => {
    it('should handle null values', () => {
      expect(cn('bg-red-500', null, 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle undefined values', () => {
      expect(cn('bg-red-500', undefined, 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle mixed null/undefined with other types', () => {
      expect(cn(null, ['bg-red-500'], undefined, { 'text-white': true }))
        .toBe('bg-red-500 text-white');
    });
  });

  describe('Edge cases and complex scenarios', () => {
    it('should handle very long class lists', () => {
      const longClassList = Array.from({ length: 50 }, (_, i) => `class-${i}`).join(' ');
      expect(cn(longClassList)).toBe(longClassList);
    });

    it('should handle deeply nested arrays and objects', () => {
      expect(cn(
        ['base', ['nested', { 'conditional': true }]],
        { 'outer': true, 'inner': [{ 'deep': true }] }
      )).toBe('base nested conditional outer deep');
    });

    it('should handle special characters in class names', () => {
      expect(cn('hover:bg-red-500', 'sm:text-lg', 'lg:p-4')).toBe('hover:bg-red-500 sm:text-lg lg:p-4');
    });

    it('should handle responsive and state variants with conflicts', () => {
      expect(cn('p-2', 'sm:p-4', 'p-6', 'lg:p-8')).toBe('sm:p-4 lg:p-8 p-6');
    });

    it('should maintain order for non-conflicting responsive classes', () => {
      expect(cn('sm:bg-red-500', 'md:bg-blue-500', 'lg:bg-green-500'))
        .toBe('sm:bg-red-500 md:bg-blue-500 lg:bg-green-500');
    });
  });

  describe('Performance and consistency', () => {
    it('should return consistent results for identical inputs', () => {
      const input = ['bg-red-500', { 'text-white': true }, 'p-4'];
      const result1 = cn(...input);
      const result2 = cn(...input);
      expect(result1).toBe(result2);
    });

    it('should handle empty array efficiently', () => {
      expect(cn([])).toBe('');
    });

    it('should handle empty object efficiently', () => {
      expect(cn({})).toBe('');
    });
  });
});