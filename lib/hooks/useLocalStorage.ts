'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  useEffect(() => {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    // Parse stored json or if none return initialValue
    if (item) {
      try {
        setStoredValue(JSON.parse(item));
      } catch (error) {
        console.error(`Error parsing stored data for key "${key}":`, error);
        setStoredValue(initialValue);
      }
    }
  }, [key, initialValue]);
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}