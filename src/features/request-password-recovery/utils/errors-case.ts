import { showToast } from '@/services';

export const errorsCase = (error: unknown): void => {
  switch (error) {
    case 'email-required':
      showToast({
        type: 'error',
        title: 'O email é obrigatório!',
        subtitle: 'Por favor, insira seu email.',
      });
    case 'email-invalid':
      showToast({
        type: 'error',
        title: 'O email é inválido!',
        subtitle: 'Por favor, insira um email válido.',
      });
    case 'one-email-per-minute':
      showToast({
        type: 'error',
        title: 'Espere um minuto para re-enviar!',
        subtitle: 'Você pode enviar apenas um email por minuto.',
      });
    case 'five-emails-per-hour':
      showToast({
        type: 'error',
        title: 'Espere mais uma hora para re-enviar!',
        subtitle: 'Você pode enviar apenas 5 emails por hora.',
      });
    case 'email-not-found':
      showToast({
        type: 'error',
        title: 'Email não encontrado!',
        subtitle: 'Por favor, insira um email válido.',
      });
    default:
      showToast({
        type: 'error',
        title: 'Algo de errado aconteceu!',
        subtitle: 'Tente novamente mais tarde.',
      });
  }
};
