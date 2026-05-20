import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface Toast {
  id: number | string;
  title: string;
  description: string;
  type?: ToastType;
}

@customElement('tostado-toast')
export class TostadoToast extends LitElement {
  @property({ type: Array })
  toasts: Toast[] = [];

  @property({ type: Number })
  timer: number = 5000;

  @state()
  private _internalToasts: Toast[] = [];

  private toastTimers = new Map<string | number, number>();

  protected willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('toasts')) {
      const externalIds = new Set(this.toasts.map(t => t.id));
      let updatedInternal = this._internalToasts.filter(t => externalIds.has(t.id));

      const internalIds = new Set(updatedInternal.map(t => t.id));
      const newToasts = this.toasts.filter(toast => !internalIds.has(toast.id));

      if (newToasts.length > 0) {
        updatedInternal = [...updatedInternal, ...newToasts];
      }

      this._internalToasts = updatedInternal;
    }
  }

  protected updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    this._internalToasts.forEach(toast => {
      if (!this.toastTimers.has(toast.id)) {
        const timerId = window.setTimeout(() => {
          this.removeToast(toast.id);
        }, this.timer);
        this.toastTimers.set(toast.id, timerId);
      }
    });
  }

  static styles = css`
    :host {
      display: block;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    .toast-container {
      position: fixed;
      top: var(--tostado-toast-top, 1rem);
      right: var(--tostado-toast-right, 1rem);
      bottom: var(--tostado-toast-bottom, auto);
      left: var(--tostado-toast-left, auto);
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: var(--tostado-toast-z-index, 9999);
      max-width: 100%;
    }

    .toast {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      pointer-events: auto;
      box-shadow: var(--tostado-toast-shadow, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
      padding: var(--tostado-toast-padding, 1rem);
      border: var(--tostado-toast-border, 1px solid #e5e7eb);
      border-radius: var(--tostado-toast-radius, 0.5rem);
      background: var(--tostado-toast-bg, #ffffff);
      color: var(--tostado-toast-color, #1f2937);
      width: var(--tostado-toast-width, 350px);
      max-width: 100%;
      font-family: var(--tostado-toast-font, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      overflow-wrap: anywhere;
      word-break: break-word;
      transition: box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
    }

    .toast:hover {
      box-shadow: var(--tostado-toast-hover-shadow, 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08));
    }

    .toast-body {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      width: 100%;
    }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 0.05rem;
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .toast-title {
      flex: 1;
      font-weight: var(--tostado-toast-title-weight, 600);
      font-size: var(--tostado-toast-title-size, 0.875rem);
      line-height: var(--tostado-toast-title-line-height, 1.25rem);
      color: var(--tostado-toast-title-color, inherit);
    }

    .toast-description {
      margin: 0;
      font-weight: var(--tostado-toast-description-weight, 400);
      font-size: var(--tostado-toast-description-size, 0.875rem);
      line-height: var(--tostado-toast-description-line-height, 1.25rem);
      color: var(--tostado-toast-description-color, #4b5563);
    }

    .close-button {
      background: transparent;
      border: none;
      color: var(--tostado-toast-close-color, #9ca3af);
      cursor: pointer;
      padding: 0.25rem;
      margin: -0.25rem;
      border-radius: 0.375rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background-color 0.2s;
    }

    .close-button:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Success Toast Styles */
    .toast.toast-success {
      background: var(--tostado-toast-success-bg, #f0fdf4);
      border-color: var(--tostado-toast-success-border, #bbf7d0);
      color: var(--tostado-toast-success-color, #166534);
    }
    .toast.toast-success .toast-description {
      color: var(--tostado-toast-success-description-color, #15803d);
    }
    .toast.toast-success .close-button {
      color: var(--tostado-toast-success-close-color, #86efac);
    }
    .toast.toast-success .close-button:hover {
      color: var(--tostado-toast-success-close-hover-color, #166534);
      background-color: var(--tostado-toast-success-close-hover-bg, #dcfce7);
    }
    .toast.toast-success .toast-icon {
      color: var(--tostado-toast-success-icon-color, #16a34a);
    }

    /* Error Toast Styles */
    .toast.toast-error {
      background: var(--tostado-toast-error-bg, #fef2f2);
      border-color: var(--tostado-toast-error-border, #fee2e2);
      color: var(--tostado-toast-error-color, #991b1b);
    }
    .toast.toast-error .toast-description {
      color: var(--tostado-toast-error-description-color, #b91c1c);
    }
    .toast.toast-error .close-button {
      color: var(--tostado-toast-error-close-color, #fca5a5);
    }
    .toast.toast-error .close-button:hover {
      color: var(--tostado-toast-error-close-hover-color, #991b1b);
      background-color: var(--tostado-toast-error-close-hover-bg, #fee2e2);
    }
    .toast.toast-error .toast-icon {
      color: var(--tostado-toast-error-icon-color, #dc2626);
    }

    /* Warning Toast Styles */
    .toast.toast-warning {
      background: var(--tostado-toast-warning-bg, #fffbeb);
      border-color: var(--tostado-toast-warning-border, #fef3c7);
      color: var(--tostado-toast-warning-color, #92400e);
    }
    .toast.toast-warning .toast-description {
      color: var(--tostado-toast-warning-description-color, #b45309);
    }
    .toast.toast-warning .close-button {
      color: var(--tostado-toast-warning-close-color, #fcd34d);
    }
    .toast.toast-warning .close-button:hover {
      color: var(--tostado-toast-warning-close-hover-color, #92400e);
      background-color: var(--tostado-toast-warning-close-hover-bg, #fef3c7);
    }
    .toast.toast-warning .toast-icon {
      color: var(--tostado-toast-warning-icon-color, #d97706);
    }

    /* Info Toast Styles */
    .toast.toast-info {
      background: var(--tostado-toast-info-bg, #eff6ff);
      border-color: var(--tostado-toast-info-border, #dbeafe);
      color: var(--tostado-toast-info-color, #1e40af);
    }
    .toast.toast-info .toast-description {
      color: var(--tostado-toast-info-description-color, #1d4ed8);
    }
    .toast.toast-info .close-button {
      color: var(--tostado-toast-info-close-color, #93c5fd);
    }
    .toast.toast-info .close-button:hover {
      color: var(--tostado-toast-info-close-hover-color, #1e40af);
      background-color: var(--tostado-toast-info-close-hover-bg, #dbeafe);
    }
    .toast.toast-info .toast-icon {
      color: var(--tostado-toast-info-icon-color, #2563eb);
    }

    /* Default Toast Styles */
    .toast.toast-default {
      background: var(--tostado-toast-default-bg, #ffffff);
      border-color: var(--tostado-toast-default-border, #e5e7eb);
      color: var(--tostado-toast-default-color, #1f2937);
    }
    .toast.toast-default .toast-description {
      color: var(--tostado-toast-default-description-color, #4b5563);
    }
    .toast.toast-default .close-button {
      color: var(--tostado-toast-default-close-color, #9ca3af);
    }
    .toast.toast-default .close-button:hover {
      color: var(--tostado-toast-default-close-hover-color, #1f2937);
      background-color: var(--tostado-toast-default-close-hover-bg, #f3f4f6);
    }
    .toast.toast-default .toast-icon {
      color: var(--tostado-toast-default-icon-color, #6b7280);
    }
  `;

  private getIcon(type?: string) {
    switch (type) {
      case 'success':
        return html`
          <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        `;
      case 'error':
        return html`
          <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
      case 'warning':
        return html`
          <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        `;
      case 'info':
        return html`
          <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        `;
      case 'default':
      default:
        return html`
          <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        `;
    }
  }

  render() {
    return html`
      <div class="toast-container" role="region" aria-label="Notifications">
        ${repeat(
      this._internalToasts,
      (toast) => toast.id,
      (toast) => html`
            <div class="toast toast-${toast.type || 'default'}" role="status" aria-live="polite" data-toast-id="${toast.id}">
              <div class="toast-body">
                ${this.getIcon(toast.type)}
                <div class="toast-content">
                  <div class="toast-header">
                    <span class="toast-title">${toast.title}</span>
                    <button
                      class="close-button"
                      aria-label="Close notification"
                      title="Close notification"
                      @click=${() => this.removeToast(toast.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  ${toast.description ? html`<p class="toast-description">${toast.description}</p>` : ''}
                </div>
              </div>
            </div>
          `
    )}
      </div>
    `;
  }

  public removeToast(id: number | string) {
    if (this.toastTimers.has(id)) {
      clearTimeout(this.toastTimers.get(id));
      this.toastTimers.delete(id);
    }

    const toastElement = this.shadowRoot?.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;

    if (!toastElement) {
      this.dispatchEvent(new CustomEvent('remove-toast', { detail: { id }, bubbles: true, composed: true }));
      return;
    }

    const animation = toastElement.animate(
      [
        { opacity: 1, transform: 'translateX(0) scale(1)' },
        { opacity: 0, transform: 'translateX(100%) scale(0.9)' }
      ],
      {
        duration: 250,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    );

    animation.onfinish = () => {
      this.dispatchEvent(
        new CustomEvent('remove-toast', {
          detail: { id },
          bubbles: true,
          composed: true
        })
      );
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tostado-toast': TostadoToast;
  }
}
