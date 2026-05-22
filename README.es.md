# Tostado 🍞

Un componente web de notificaciones toast premium, ligero y altamente personalizable construido con [Lit](https://lit.dev/).

Tostado funciona sin problemas en todos los frameworks frontend modernos (React, Vue, Angular, Svelte) y JavaScript vanilla. La versión 2.0 introduce una API programática que monta y administra automáticamente el contenedor de notificaciones de forma interna, haciendo que la implementación sea sumamente sencilla.

*Leer esto en otros idiomas: [English (Inglés)](README.md).*

<p align="center">
  <img src="./src/assets/tostado.png" alt="Vista previa de Tostado Toast" width="600" />
</p>

---

## Características

- ⚡ **Función de Utilidad Directa**: Llama a `tostado(...)` desde cualquier parte de tu código, sin configurar HTML.
- 💅 **Altamente personalizable**: Personaliza cualquier aspecto visual mediante propiedades personalizadas CSS (variables).
- 🧩 **Independiente del Framework**: Funciona en cualquier lugar, con una API programática cómoda o un componente web declarativo.
- 🦄 **Tipado Primero**: Escrito completamente en TypeScript con archivos de declaración auto-generados.
- 🎨 **Estados visuales premium**: Temas predefinidos limpios y estéticos para estados `success` (éxito), `error`, `warning` (advertencia), `info` y `default` (por defecto).
- ♿ **Accesible**: Incluye roles de accesibilidad semántica (`aria-live`, `role="status"`/`role="region"`) y botones de cierre interactivos con foco visible para teclado.

---

## Instalación

Instala el paquete utilizando tu gestor de paquetes favorito:

```bash
# npm
npm install tostado

# pnpm
pnpm add tostado

# yarn
yarn add tostado
```

---

## Uso Básico (API Programática)

La forma recomendada de usar Tostado en la versión 2.0+ es a través de la API programática `tostado`. Esta maneja automáticamente la creación del elemento contenedor en el cuerpo de la página y el estado de las notificaciones.

### 1. Mostrar un toast
Importa la función y llámala directamente. No requiere configurar etiquetas HTML.

```typescript
import { tostado } from 'tostado';

// Notificación básica
tostado('Notificación', 'Esta es una notificación por defecto.');

// Notificación con objeto de configuración
tostado({
  title: 'Notificación',
  description: 'Esta es una notificación por defecto.',
  type: 'default'
});
```

### 2. Métodos Abreviados
Tienes atajos listos para cada tipo de estado predefinido:

```typescript
import { tostado } from 'tostado';

// Usando strings
tostado.success('¡Éxito!', 'Los cambios se han guardado con éxito.');
tostado.error('¡Error!', 'Ha ocurrido un error inesperado.');
tostado.warning('¡Advertencia!', 'Por favor verifica la información.');
tostado.info('¡Info!', 'Hay una nueva versión disponible.');

// Usando un objeto de opciones
tostado.success({
  title: '¡Éxito!',
  description: 'Los cambios se han guardado con éxito.'
});
```

### 3. Descartar una notificación
La función `tostado` devuelve un identificador único que puedes usar para cerrar la notificación de manera programática en cualquier momento:

```typescript
const toastId = tostado.info('Procesando...', 'Por favor espera.');

// Cerrarla más tarde
tostado.dismiss(toastId);
```

---

## Uso Avanzado (Componente Web Declarativo)

Si prefieres tener el control total del estado en el ciclo de vida de tu aplicación o framework, puedes declarar el elemento `<tostado-toast>` de forma manual:

### 1. Registrar el componente
Simplemente importa el paquete para registrar el elemento personalizado:

```typescript
import 'tostado';
```

### 2. Incluir en tu HTML / Plantilla
Añade el elemento personalizado a tu página. Este elemento actúa como un portal que administra y muestra la lista de notificaciones flotantes.

```html
<tostado-toast id="toast-container"></tostado-toast>
```

### 3. Gestionar Toasts manualmente
Pasa las notificaciones a través de la propiedad `toasts` y escucha el evento `remove-toast` para sincronizar el estado:

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

  // Sincroniza el estado cuando un toast se cierra o expira
  container.addEventListener('remove-toast', (event) => {
    const dismissedId = event.detail.id;
    activeToasts = activeToasts.filter(toast => toast.id !== dismissedId);
    container.toasts = activeToasts;
  });
</script>
```

---

## Ejemplos de Integración

### Vue 3
```html
<script setup>
import { tostado } from 'tostado';

const notify = () => {
  tostado.success('Notificación Vue', '¡Disparada de manera programática!');
};
</script>

<template>
  <button @click="notify">Mostrar Toast</button>
</template>
```

### React
```jsx
import React from 'react';
import { tostado } from 'tostado';

export function App() {
  const notify = () => {
    tostado.success('Notificación React', '¡Disparada de manera programática!');
  };

  return (
    <button onClick={notify}>Mostrar Toast</button>
  );
}
```

---

## Referencia de la API

### Métodos Programáticos

#### `tostado(options: ToastOptions | string, description?: string): string | number`
Dispara una notificación y devuelve su ID único.
- Si se pasa un `string`, representa el título.
- Si se pasa un objeto `ToastOptions`, permite configurar en detalle la notificación.

#### `tostado.success(options: ToastOptions | string, description?: string): string | number`
Dispara una notificación de éxito (`success`).

#### `tostado.error(options: ToastOptions | string, description?: string): string | number`
Dispara una notificación de error.

#### `tostado.warning(options: ToastOptions | string, description?: string): string | number`
Dispara una notificación de advertencia.

#### `tostado.info(options: ToastOptions | string, description?: string): string | number`
Dispara una notificación de información.

#### `tostado.dismiss(id: string | number): void`
Descarta y oculta la notificación con el ID proporcionado.

---

### Propiedades del Componente Declarativo

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `toasts` | `Toast[]` | `[]` | Arreglo de notificaciones toast a renderizar. |
| `timer` | `number` | `5000` | Tiempo en milisegundos antes de que una notificación se descarte automáticamente. |

### Eventos del Componente Declarativo

| Nombre del Evento | Tipo de Detalle | Descripción |
| :--- | :--- | :--- |
| `remove-toast` | `{ id: string \| number }` | Se emite cuando un toast se cierra manualmente o expira su temporizador. **Debes** escuchar este evento y filtrar el arreglo de tu estado para remover el toast. |

### Interfaces y Tipos

```typescript
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastOptions {
  id?: number | string; // ID único opcional
  title: string;       // Título en negrita
  description?: string; // Detalle o descripción de la notificación
  type?: ToastType;    // Tema visual
}

export interface Toast {
  id: number | string; // ID único obligatorio
  title: string;
  description?: string;
  type?: ToastType;
}
```

---

## Estilos y Personalización (Variables CSS)

Tostado utiliza la encapsulación de Shadow DOM, pero expone una amplia gama de Variables CSS para que puedas personalizar la apariencia globalmente o en instancias individuales de contenedores.

### Personalización General y de Diseño

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--tostado-toast-top` | `1rem` | Margen superior del contenedor |
| `--tostado-toast-right` | `1rem` | Margen derecho del contenedor |
| `--tostado-toast-bottom` | `auto` | Margen inferior del contenedor |
| `--tostado-toast-left` | `auto` | Margen izquierdo del contenedor |
| `--tostado-toast-z-index` | `9999` | Índice Z (Z-index) del contenedor |
| `--tostado-toast-width` | `350px` | Ancho de la tarjeta del toast |
| `--tostado-toast-radius` | `0.5rem` | Radio de los bordes (border-radius) |
| `--tostado-toast-padding` | `1rem` | Relleno interno (padding) |
| `--tostado-toast-font` | `system-ui, ...` | Tipografía (font-family) |
| `--tostado-toast-shadow` | `0 10px 15px -3px ...` | Sombra de caja estándar |
| `--tostado-toast-hover-shadow` | `0 20px 25px -5px ...` | Sombra al pasar el cursor (hover) |
| `--tostado-toast-base-border` | `1px solid #e5e7eb` | Borde base de fallback para todos los estados |
| `--tostado-toast-base-bg` | `#ffffff` | Fondo base de fallback para todos los estados |
| `--tostado-toast-base-color` | `#1f2937` | Color de texto base de fallback para todos los estados |
| `--tostado-toast-description-color` | `#4b5563` | Color de descripción base de fallback |
| `--tostado-toast-close-color` | `#9ca3af` | Color del botón de cierre base de fallback |
| `--tostado-toast-close-hover-color` | `inherit` | Color del botón de cierre al pasar el cursor base de fallback |
| `--tostado-toast-close-hover-bg` | `rgba(0, 0, 0, 0.05)` | Fondo del botón de cierre al pasar el cursor base de fallback |
| `--tostado-toast-icon-color` | `inherit` | Color del icono base de fallback |

### Personalización de Estados y Temas

Para la personalización de temas específicos, las variables siguen la nomenclatura `--tostado-toast-{tipo}-{propiedad}`. Los tipos soportados son `success`, `error`, `warning`, `info` y `default`.

#### Ejemplo del Tema Éxito (Success)
- `--tostado-toast-success-bg` (Defecto: `#f0fdf4`)
- `--tostado-toast-success-border` (Defecto: `#bbf7d0`)
- `--tostado-toast-success-color` (Defecto: `#166534`)
- `--tostado-toast-success-description-color` (Defecto: `#15803d`)
- `--tostado-toast-success-icon-color` (Defecto: `#16a34a`)
- `--tostado-toast-success-close-color` (Defecto: `#86efac`)
- `--tostado-toast-success-close-hover-color` (Defecto: `#166534`)
- `--tostado-toast-success-close-hover-bg` (Defecto: `#dcfce7`)

*(El mismo patrón aplica para los estados `error`, `warning`, `info` y `default`. Echa un vistazo al código de [tostado-toast.ts](file:///Users/mkeort/projects/tostado/src/tostado-toast.ts) para ver todos los estilos.)*

---

## Desarrollo Local

Si deseas contribuir o hacer pruebas con el componente Tostado:

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Ejecuta el servidor de desarrollo local (inicia una aplicación demo interactiva en `index.html`):
   ```bash
   pnpm dev
   ```
4. Compila el paquete para distribución:
   ```bash
   pnpm build
   ```

## Licencia

MIT
