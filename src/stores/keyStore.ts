import { createStore, useStore } from "zustand";

export interface KeyState {
  forwardPressed: boolean;
  backPressed: boolean;
  leftPressed: boolean;
  rightPressed: boolean;
}

export const keyStore = createStore<KeyState>()(() => ({
  forwardPressed: false,
  backPressed: false,
  leftPressed: false,
  rightPressed: false,
}));

/**
 *  Wraps zustand's `useStore` with the game store context.
 */
export function useKeyStore<T>(selector: (state: KeyState) => T): T {
  return useStore(keyStore, selector);
}
