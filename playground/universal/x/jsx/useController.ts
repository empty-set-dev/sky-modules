import { useState, useRef, useEffect } from 'react';
export interface Controller {
  onChange(callback: () => void): void;
}
export default function useController<T extends Controller, C extends new (...args: A) => T, A extends unknown[]>(Controller: C, ...args: A): T {
  const [update, setUpdate] = useState(false);
  const [controller] = useState(new Controller(...args));
  onInit(() => {
    controller.onChange(() => setUpdate(!update));
  });
  return controller;
}