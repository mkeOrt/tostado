# Tostado 🍞

A premium, lightweight, highly customizable toast notification library built with [Lit](https://lit.dev/).

Tostado works seamlessly across all modern frontend frameworks (React, Vue, Angular, Svelte) and vanilla JavaScript. Version 2.0 introduces a programmatic utility function that automatically mounts and manages the notification container under the hood, making implementation extremely plug-and-play.

*Read this in other languages: [Español (Spanish)](README.es.md).*

<p align="center">
  <img src="./src/assets/tostado.png" alt="Tostado Toast Preview" width="600" />
</p>

---

## Features

- ⚡ **Plug-and-play Utility**: Call `tostado(...)` from anywhere—no HTML setup required!
- 💅 **Highly Customizable**: Style everything using CSS custom properties (variables).
- 🧩 **Framework Agnostic**: Works anywhere, with a programmatic API and a declarative Web Component.
- 🦄 **Types First**: Fully written in TypeScript with auto-generated declaration files.
- 🎨 **Theme-aware States**: Beautiful, clean default themes for `success`, `error`, `warning`, `info`, and `default`.
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

## Basic Usage (Programmatic API)

The recommended way to use Tostado in version 2.0+ is through the programmatic `tostado` API. It automatically handles mounting the container to the document body and managing notification state.

### 1. Show a toast
Import the function and call it. It automatically handles the container setup.

```typescript
import { tostado } from 'tostado';

// Simple toast
tostado('Notification', 'This is a default notification.');

// Customizable options toast
tostado({
  title: 'Notification',
  description: 'This is a default notification.',
  type: 'default'
});
```

### 2. Shorthand Helpers
Shorthands are available for all built-in types:

```typescript
import { tostado } from 'tostado';

// Using strings
tostado.success('Success!', 'Your changes have been saved.');
tostado.error('Error!', 'An unexpected error occurred.');
tostado.warning('Warning!', 'Please check your input.');
tostado.info('Info!', 'A new version is available.');

// Using configuration objects
tostado.success({
  title: 'Success!',
  description: 'Your changes have been saved.'
});
```

### 3. Dismissing a toast
Calling `tostado` returns a unique ID that you can use to dismiss the toast programmatically at any time:

```typescript
const toastId = tostado.info('Processing...', 'Please wait.');

// Dismiss it later
tostado.dismiss(toastId);
```

---

## Advanced Usage (Declarative Web Component)

If you prefer to manage the notification state yourself in your framework's state, you can declare the `<tostado-toast>` element manually:

### 1. Import to register the component
Simply import the package to register the `<tostado-toast>` custom element:

```typescript
import 'tostado';
```

### 2. Include in your HTML / Template
Add the custom element to your page. It acts as a portal container for managing and displaying the toast notifications.

```html
<tostado-toast id="toast-container"></tostado-toast>
```

### 3. Manage State manually
Pushes toasts via the `toasts` property and listen for the `remove-toast` event to sync your array:

```html
<script type="module">
  import 'tostado';

  const container = document.getElementById('toast-container');
  let activeToasts = [];

  function triggerToast(type, title, description) {
    const newToast = {
      id: Date.now().toString(),
      title,
      description,
      type
    };

    activeToasts = [...activeToasts, newToast];
    container.toasts = activeToasts;
  }

  // Sync state when a toast is closed or times out
  container.addEventListener('remove-toast', (event) => {
    const dismissedId = event.detail.id;
    activeToasts = activeToasts.filter(toast => toast.id !== dismissedId);
    container.toasts = activeToasts;
  });
</script>
```

---

## Integration Examples

### Vue 3
```html
<script setup>
import { tostado } from 'tostado';

const notify = () => {
  tostado.success('Vue Notification', 'Triggered programmatically!');
};
</script>

<template>
  <button @click="notify">Show Toast</button>
</template>
```

### React
```jsx
import React from 'react';
import { tostado } from 'tostado';

export function App() {
  const notify = () => {
    tostado.success('React Notification', 'Triggered programmatically!');
  };

  return (
    <button onClick={notify}>Show Toast</button>
  );
}
```

---

## API Reference

### Programmatic Functions

#### `tostado(options: ToastOptions | string, description?: string): string | number`
Triggers a toast and returns its unique ID.
- If passed a `string`, it represents the title.
- If passed a `ToastOptions` object, you can configure the toast details.

#### `tostado.success(options: ToastOptions | string, description?: string): string | number`
Triggers a success style toast.

#### `tostado.error(options: ToastOptions | string, description?: string): string | number`
Triggers an error style toast.

#### `tostado.warning(options: ToastOptions | string, description?: string): string | number`
Triggers a warning style toast.

#### `tostado.info(options: ToastOptions | string, description?: string): string | number`
Triggers an info style toast.

#### `tostado.dismiss(id: string | number): void`
Dismisses the toast with the given ID.

---

### Declarative Component Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `toasts` | `Toast[]` | `[]` | The array of toast notifications to render. |
| `timer` | `number` | `5000` | Duration in milliseconds before a toast is auto-dismissed. |

### Declarative Component Events

| Event Name | Detail Type | Description |
| :--- | :--- | :--- |
| `remove-toast` | `{ id: string \| number }` | Fired when a toast is closed manually or its auto-dismiss timer expires. You **must** listen to this and filter your state's array to fully remove the toast. |

### Interfaces & Types

```typescript
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastOptions {
  id?: number | string; // Optional unique ID
  title: string;       // Bold title text
  description?: string; // Detail description text
  type?: ToastType;    // Toast theme
}

export interface Toast {
  id: number | string; // Unique ID (required)
  title: string;
  description?: string;
  type?: ToastType;
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
| `--tostado-toast-width` | `350px` | Toast card width |
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

*(The same pattern applies to `error`, `warning`, `info`, and `default` states. Feel free to inspect [tostado-toast.ts](file:///Users/mkeort/projects/tostado/src/tostado-toast.ts) to view all styles.)*

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
