import { describe, expect, it } from 'vitest';
import { isBlankMeal, toMealInput } from './mealDrafts';

describe('isBlankMeal', () => {
  it('is true when both label and text are empty or whitespace', () => {
    expect(isBlankMeal({ key: 'a', label: '', text: '' })).toBe(true);
    expect(isBlankMeal({ key: 'a', label: '  ', text: '  ' })).toBe(true);
  });

  it('is false when either field has content', () => {
    expect(isBlankMeal({ key: 'a', label: 'Almoço', text: '' })).toBe(false);
    expect(isBlankMeal({ key: 'a', label: '', text: 'Arroz' })).toBe(false);
  });
});

describe('toMealInput', () => {
  it('trims both fields', () => {
    expect(
      toMealInput({ key: 'a', label: '  Almoço  ', text: '  Arroz  ' })
    ).toEqual({
      label: 'Almoço',
      text: 'Arroz',
    });
  });
});
