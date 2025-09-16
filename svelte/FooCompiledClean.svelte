<!-- Compiled from Foo.tsx - ZERO runtime overhead, NO DOM comments -->
<script lang="ts">
  // Pure Svelte component - no JSX processing at runtime
</script>

<div class="Boo">
  <a href="https://google.com">Google</a>
  <div>123</div>
  <span>span</span>
</div>

<style>
  .Boo {
    padding: 1rem;
    border: 2px solid #42b883;
    border-radius: 8px;
    margin: 1rem 0;
    font-family: system-ui;
  }

  .Boo a {
    color: #42b883;
    text-decoration: none;
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }

  .Boo a:hover {
    text-decoration: underline;
  }

  .Boo div {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    color: #0369a1;
    padding: 0.5rem;
    margin: 0.25rem 0;
    border-radius: 4px;
    display: inline-block;
  }

  .Boo span {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #15803d;
    padding: 0.5rem;
    margin: 0.25rem 0;
    border-radius: 4px;
    display: inline-block;
  }
</style>