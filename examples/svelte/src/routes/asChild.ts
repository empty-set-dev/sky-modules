import type { Action } from 'svelte/action';

/**
 * Интерфейс для параметров действия asChild
 */
interface AsChildParams {
  onClick?: (event: MouseEvent) => void;
  onKeydown?: (event: KeyboardEvent) => void;
  disabled?: boolean;
  [key: string]: any;
}

/**
 * Действие (action) для реализации паттерна asChild в Svelte
 * Применяет дополнительные атрибуты и обработчики событий к элементу
 */
export const asChild: Action<HTMLElement, AsChildParams> = (
  node: HTMLElement, 
  params: AsChildParams = {}
) => {
  let currentParams = params;
  
  function updateElement() {
    const { onClick, onKeydown, disabled, ...attributes } = currentParams;
    
    // Применяем атрибуты
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('data-') || key === 'class' || key === 'id' || key === 'role' || key === 'tabindex') {
        if (value != null) {
          node.setAttribute(key, String(value));
        } else {
          node.removeAttribute(key);
        }
      }
    });
    
    // Обрабатываем disabled состояние
    if (disabled) {
      node.setAttribute('disabled', '');
      node.setAttribute('aria-disabled', 'true');
      node.style.pointerEvents = 'none';
    } else {
      node.removeAttribute('disabled');
      node.removeAttribute('aria-disabled');
      node.style.pointerEvents = '';
    }
    
    // Добавляем обработчики событий
    if (onClick && !disabled) {
      const existingHandler = (node as any).__asChildClickHandler;
      if (existingHandler) {
        node.removeEventListener('click', existingHandler);
      }
      
      const newHandler = (event: MouseEvent) => {
        if (!disabled) {
          onClick(event);
        }
      };
      
      node.addEventListener('click', newHandler);
      (node as any).__asChildClickHandler = newHandler;
    }
    
    if (onKeydown && !disabled) {
      const existingHandler = (node as any).__asChildKeydownHandler;
      if (existingHandler) {
        node.removeEventListener('keydown', existingHandler);
      }
      
      const newHandler = (event: KeyboardEvent) => {
        if (!disabled) {
          onKeydown(event);
        }
      };
      
      node.addEventListener('keydown', newHandler);
      (node as any).__asChildKeydownHandler = newHandler;
    }
  }
  
  // Инициализация
  updateElement();
  
  return {
    update(newParams: AsChildParams) {
      currentParams = newParams;
      updateElement();
    },
    
    destroy() {
      // Очищаем обработчики событий при уничтожении
      const clickHandler = (node as any).__asChildClickHandler;
      const keydownHandler = (node as any).__asChildKeydownHandler;
      
      if (clickHandler) {
        node.removeEventListener('click', clickHandler);
      }
      if (keydownHandler) {
        node.removeEventListener('keydown', keydownHandler);
      }
    }
  };
};

/**
 * Утилитарная функция для создания пропов asChild
 */
export function createAsChildProps(props: AsChildParams) {
  return props;
}

/**
 * Компонент-хелпер для типизированного использования asChild
 */
export interface AsChildContext {
  asChild: boolean;
  props: Record<string, any>;
  handlers: Record<string, Function>;
}

/**
 * Функция для создания контекста asChild
 */
export function createAsChildContext(
  asChild: boolean,
  baseProps: Record<string, any> = {},
  handlers: Record<string, Function> = {}
): AsChildContext {
  return {
    asChild,
    props: baseProps,
    handlers
  };
}
