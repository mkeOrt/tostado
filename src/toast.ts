import './tostado-toast.js';
import type { Toast, ToastType } from './tostado-toast.js';

export interface ToastOptions {
  id?: number | string;
  title: string;
  description?: string;
  type?: ToastType;
}

let toastsList: Toast[] = [];
let container: any = null;

function getContainer() {
  if (typeof document === 'undefined') return null;

  if (!container) {
    container = document.querySelector('tostado-toast');
    if (!container) {
      container = document.createElement('tostado-toast');
      document.body.appendChild(container);
    }

    container.addEventListener('remove-toast', (event: CustomEvent<{ id: string | number }>) => {
      const removedId = event.detail.id;
      toastsList = toastsList.filter(t => t.id !== removedId);
      if (container) {
        container.toasts = [...toastsList];
      }
    });
  }
  return container;
}

export function tostado(options: ToastOptions | string, description?: string): string | number {
  const containerElement = getContainer();
  if (!containerElement) return '';

  let toastOptions: ToastOptions;
  if (typeof options === 'string') {
    toastOptions = {
      title: options,
      description: description || '',
      type: 'default'
    };
  } else {
    toastOptions = {
      ...options,
      description: options.description || description || ''
    };
  }

  const id = toastOptions.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const toast: Toast = {
    id,
    title: toastOptions.title,
    description: toastOptions.description || '',
    type: toastOptions.type || 'default'
  };

  toastsList = [...toastsList, toast];
  containerElement.toasts = [...toastsList];

  return id;
}

tostado.success = (titleOrOptions: string | ToastOptions, description?: string) => {
  return createHelperToast('success', titleOrOptions, description);
};

tostado.error = (titleOrOptions: string | ToastOptions, description?: string) => {
  return createHelperToast('error', titleOrOptions, description);
};

tostado.warning = (titleOrOptions: string | ToastOptions, description?: string) => {
  return createHelperToast('warning', titleOrOptions, description);
};

tostado.info = (titleOrOptions: string | ToastOptions, description?: string) => {
  return createHelperToast('info', titleOrOptions, description);
};

tostado.dismiss = (id: string | number) => {
  const containerElement = getContainer();
  if (containerElement) {
    containerElement.removeToast(id);
  }
};

function createHelperToast(type: ToastType, titleOrOptions: string | ToastOptions, description?: string) {
  if (typeof titleOrOptions === 'string') {
    return tostado({ title: titleOrOptions, description: description || '', type });
  }
  return tostado({ ...titleOrOptions, type });
}

export const addToast = tostado;
