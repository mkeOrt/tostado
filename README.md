# Tostado 🍞

A premium, lightweight, highly customizable toast notification web component built with [Lit](https://lit.dev/). 

Tostado works seamlessly across all modern frontend frameworks (React, Vue, Angular, Svelte) and vanilla JavaScript.

*Read this in other languages: [Español (Spanish)](README.es.md).*

---

## Features

- 💅 **Highly Customizable**: Style everything using CSS custom properties (variables).
- 🧩 **Framework Agnostic**: Works anywhere custom elements are supported.
- 🦄 **Types First**: Fully written in TypeScript with auto-generated declaration files.
- 🎨 **Theme-aware States**: Beautiful, clean default themes for `success`, `error`, `warning`, `info`, and `default`.
- ⚡ **Performant & Lightweight**: Built on top of Lit for minimal footprint and optimal rendering speeds.
- ♿ **Accessible**: Includes basic accessibility roles (`aria-live`, `role="status"`/`role="region"`) and keyboard-focusable close buttons.

---

## Installation

Install the package via your preferred package manager:

```bash
# npm
npm install tostado

# pnpm
pnpm add tostado

# yarn
yarn add tostado
```

---

## Basic Usage

### 1. Register the component
Simply import the package to register the `<tostado-toast>` custom element:

```typescript
import 'tostado';
```

### 2. Include in your HTML / Template
Add the custom element to your page. It acts as a portal container for managing and displaying the toast notifications.

```html
<tostado-toast id="toast-container"></tostado-toast>
```

### 3. Add and Manage Toasts
The `<tostado-toast>` component receives notifications via the `toasts` property. Here is a Vanilla JS example of how to push toasts and listen for their dismissal:

```html
<script type="module">
  import 'tostado';

  const container = document.getElementById('toast-container');
  
  // Array to hold active notifications
  let activeToasts = [];

  // Function to add a toast
  function triggerToast(type, title, description) {
    const newToast = {
      id: Date.now().toString(), // Must be unique
      title,
      description,
      type // 'success', 'error', 'warning', 'info', or 'default'
    };

    activeToasts = [...activeToasts, newToast];
    container.toasts = activeToasts;
  }

  // MUST listen to the 'remove-toast' event to update your state
  container.addEventListener('remove-toast', (event) => {
    const dismissedId = event.detail.id;
    activeToasts = activeToasts.filter(toast => toast.id !== dismissedId);
    container.toasts = activeToasts;
  });

  // Example trigger:
  triggerToast('success', 'Changes Saved!', 'Your workspace has been successfully synced.');
</script>
```

---

## Integration Examples

### Vue 3
```html
<script setup>
import { ref } from 'vue';
import 'tostado';

const toasts = ref([]);

const showNotification = (type) => {
  toasts.value = [...toasts.value, {
    id: crypto.randomUUID(),
    title: 'Success!',
    description: 'Action completed successfully.',
    type
  }];
};

const handleRemove = (event) => {
  toasts.value = toasts.value.filter(t => t.id !== event.detail.id);
};
</script>

<template>
  <tostado-toast :toasts="toasts" @remove-toast="handleRemove"></tostado-toast>
  <button @click="showNotification('success')">Show success</button>
</template>
```

### React
```jsx
import React, { useState, useEffect, useRef } from 'react';
import 'tostado';

export function App() {
  const [toasts, setToasts] = useState([]);
  const containerRef = useRef(null);

  const addToast = (type) => {
    setToasts(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        title: 'New Event',
        description: 'Something happened!',
        type
      }
    ]);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.toasts = toasts;
    }
  }, [toasts]);

  useEffect(() => {
    const container = containerRef.current;
    
    const handleRemove = (event) => {
      setToasts(prev => prev.filter(t => t.id !== event.detail.id));
    };

    if (container) {
      container.addEventListener('remove-toast', handleRemove);
    }
    return () => {
      if (container) {
        container.removeEventListener('remove-toast', handleRemove);
      }
    };
  }, []);

  return (
    <div>
      <tostado-toast ref={containerRef}></tostado-toast>
      <button onClick={() => addToast('info')}>Show Info</button>
    </div>
  );
}
```

---

## API Reference

### Component Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `toasts` | `Toast[]` | `[]` | The array of toast notifications to render. |
| `timer` | `number` | `5000` | Duration in milliseconds before a toast is auto-dismissed. |

### Component Events

| Event Name | Detail Type | Description |
| :--- | :--- | :--- |
| `remove-toast` | `{ id: string \| number }` | Fired when a toast is closed manually or its auto-dismiss timer expires. You **must** listen to this and filter your state's array to fully remove the toast. |

### The `Toast` Interface

```typescript
export interface Toast {
  id: number | string; // Unique identifier (crucial for transitions)
  title: string;       // Bold text title
  description: string; // Detail description text
  type?: 'success' | 'error' | 'warning' | 'info' | 'default'; // Theme styling type
}
```

---

## Styling & Customization (CSS Variables)

Tostado uses CSS Shadow DOM encapsulation but exposes a wide range of CSS Variables that you can customize globally or per container instance.

### Global / Layout Customization

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `--tostado-toast-top` | `1rem` | Top spacing of container |
| `--tostado-toast-right` | `1rem` | Right spacing of container |
| `--tostado-toast-bottom` | `auto` | Bottom spacing of container |
| `--tostado-toast-left` | `auto` | Left spacing of container |
| `--tostado-toast-z-index` | `9999` | Z-index of container |
| `--tostado-toast-width` | `350px` | Toast block width |
| `--tostado-toast-radius` | `0.5rem` | Border radius |
| `--tostado-toast-padding` | `1rem` | Interior padding |
| `--tostado-toast-font` | `system-ui, ...` | Text Font family |
| `--tostado-toast-shadow` | `0 10px 15px -3px ...` | Standard box-shadow |
| `--tostado-toast-hover-shadow` | `0 20px 25px -5px ...` | Box-shadow on hover |
| `--tostado-toast-border` | `1px solid #e5e7eb` | Standard border |
| `--tostado-toast-bg` | `#ffffff` | Standard background |
| `--tostado-toast-color` | `#1f2937` | Standard text color |

### State & Type Customization

For type customization, the variables follow the pattern `--tostado-toast-{type}-{property}`. Supported types are `success`, `error`, `warning`, `info`, and `default`.

#### Success Theme Example
- `--tostado-toast-success-bg` (Default: `#f0fdf4`)
- `--tostado-toast-success-border` (Default: `#bbf7d0`)
- `--tostado-toast-success-color` (Default: `#166534`)
- `--tostado-toast-success-description-color` (Default: `#15803d`)
- `--tostado-toast-success-icon-color` (Default: `#16a34a`)
- `--tostado-toast-success-close-color` (Default: `#86efac`)
- `--tostado-toast-success-close-hover-color` (Default: `#166534`)
- `--tostado-toast-success-close-hover-bg` (Default: `#dcfce7`)

#### Error Theme Example
- `--tostado-toast-error-bg` (Default: `#fef2f2`)
- `--tostado-toast-error-border` (Default: `#fee2e2`)
- `--tostado-toast-error-color` (Default: `#991b1b`)
- `--tostado-toast-error-description-color` (Default: `#b91c1c`)
- `--tostado-toast-error-icon-color` (Default: `#dc2626`)
- `--tostado-toast-error-close-color` (Default: `#fca5a5`)
- `--tostado-toast-error-close-hover-color` (Default: `#991b1b`)
- `--tostado-toast-error-close-hover-bg` (Default: `#fee2e2`)

*(The same pattern applies to `warning`, `info`, and `default` states. Feel free to inspect [tostado-toast.ts](file:///Users/mkeort/projects/tostado/src/tostado-toast.ts) to view all styles.)*

---

## Development

If you want to contribute or experiment with Tostado:

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server (renders the interactive demo in `index.html`):
   ```bash
   pnpm dev
   ```
4. Build the npm package files:
   ```bash
   pnpm build
   ```

## License

MIT
