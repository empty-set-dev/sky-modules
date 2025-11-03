import { onCleanup } from 'solid-js';
import { useState, useRef, useEffect } from 'react';
export interface Controller {
  onChange(callback: () => void): void;
  dispose(): void | PromiseLike<void>;
}
export default function useController<T extends Controller>(): [T | null, (controller: T) => void] {
  const [update, setUpdate] = useState(false);
  const [controller, setController] = useState<T | null>(null);
  useEffect(() => {
    const updateComponent = (): void => setUpdate(!update);
    controller?.onChange(updateComponent);
    onCleanup(() => {
      controller?.dispose();
    }, []);
  });
  return [controller, setController];
}