import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
export interface Controller {
  onChange(callback: () => void): void;
  dispose(): void | PromiseLike<void>;
}
export default function useController<T extends Controller>(): [T | null, (controller: T) => void] {
  const [update, setUpdate] = createSignal(false);
  const [controller, setController] = createSignal(null);
  onMount(() => {
    const updateComponent = (): void => setUpdate(!update());
    controller()?.onChange(updateComponent);
  });
  createEffect(() => { onCleanup(() => {
    controller()?.dispose();
  }); });
  return [controller, setController];
}