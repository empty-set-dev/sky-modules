import type { Action } from 'svelte/action';

interface AsChildParams {
  class?: string;
  disabled?: boolean;
  type?: string;
  [key: string]: any;
}

/**
 * Svelte action for asChild pattern.
 * Применяет атрибуты и обработчики к переданному элементу.
 */
export const asChild: Action<HTMLElement, AsChildParams> = (node, params = {}) => {
  let current = params;

  function apply() {
    const { class: cls, disabled, type, ...attrs } = current;

    // атрибуты
    Object.entries(attrs).forEach(([k, v]) => {
      if (v != null) node.setAttribute(k, String(v));
      else node.removeAttribute(k);
    });

    // class
    if (cls) node.className = cls;

    // disabled
    if (disabled) {
      node.setAttribute('disabled', '');
      node.setAttribute('aria-disabled', 'true');
      node.style.pointerEvents = 'none';
    } else {
      node.removeAttribute('disabled');
      node.removeAttribute('aria-disabled');
      node.style.pointerEvents = '';
    }
  }

  apply();

  return {
    update(newParams: AsChildParams) {
      current = newParams;
      apply();
    },
    destroy() {
      // очистка при размонтировании
    }
  };
};
