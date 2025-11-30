import { toast } from 'sonner-native';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  subtitle?: string;
  duration?: number;
}

/**
 * Exibe um toast usando sonner-native
 *
 * @param options - Opções do toast
 *
 * @example
 * ```typescript
 * showToast({
 *   type: 'success',
 *   title: 'Sucesso!',
 *   subtitle: 'Ação realizada com sucesso'
 * });
 * ```
 */
export const showToast = ({ type, title, subtitle, duration }: ToastOptions): void => {
  const description = subtitle;

  switch (type) {
    case 'success':
      toast.success(title, { description, duration });
      break;
    case 'error':
      toast.error(title, { description, duration });
      break;
    case 'info':
      toast.info(title, { description, duration });
      break;
    case 'warning':
      toast.warning(title, { description, duration });
      break;
    default:
      toast(title, { description, duration });
  }
};
