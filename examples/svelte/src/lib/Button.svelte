<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let asChild: boolean = false;
  export let variant: 'primary' | 'secondary' | 'outline' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';

  const dispatch = createEventDispatcher();

  // CSS классы на основе пропов
  $: classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : ''
  ].filter(Boolean).join(' ');

  function handleClick(event: MouseEvent) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    dispatch('click', event);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dispatch('click', event);
    }
    dispatch('keydown', event);
  }
</script>

{#if asChild}
  <slot
    class={classes}
    disabled={disabled}
    type={type}
    role="button"
    tabindex={disabled ? -1 : 0}
    click={handleClick}
    keydown={handleKeydown}
  />
{:else}
  <button
    class={classes}
    {disabled}
    {type}
    data-variant={variant}
    data-size={size}
    on:click={handleClick}
    on:keydown={handleKeydown}
  >
    <slot />
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid transparent;
  }
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  .btn-sm {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
  .btn-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
  .btn-primary {
    background-color: #2563eb;
    color: white;
  }
  .btn-primary:hover:not(.btn-disabled) {
    background-color: #1e40af;
  }
  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }
  .btn-secondary:hover:not(.btn-disabled) {
    background-color: #4b5563;
  }
  .btn-outline {
    background-color: transparent;
    border-color: #374151;
    color: #374151;
  }
  .btn-outline:hover:not(.btn-disabled) {
    background-color: #f3f4f6;
  }
</style>
