import AuthScreen from '@/features/auth/page';
import { SlideProvider } from '@/context/slides-context';

export default function IndexScreen() {
  return (
    <SlideProvider>
      <AuthScreen />
    </SlideProvider>
  );
}
