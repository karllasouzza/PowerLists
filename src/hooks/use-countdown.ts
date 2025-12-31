import { useEffect, useState } from 'react';

/**
 * Hook customizado para criar um contador regressivo.
 * Calcula o tempo restante até uma data/hora alvo e atualiza a cada segundo.
 *
 * @param targetDate - A data/hora alvo para o countdown (Date, timestamp em ms, ou null)
 * @returns Um objeto contendo { timeLeft: tempo em ms, formattedTime: string formatada "M:SS" }
 */
export const useCountdown = (targetDate: Date | number | null) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Helper function to calculate time remaining
    const calculateTimeLeft = () => {
      if (!targetDate) return 0;
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;
      return difference > 0 ? difference : 0;
    };

    // Set initial time immediately (only if different to avoid infinite loops)
    const initialTime = calculateTimeLeft();
    setTimeLeft((prev) => (prev !== initialTime ? initialTime : prev));

    // If no target date or already expired, don't set up interval
    if (!targetDate || initialTime <= 0) return;

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      // Clear interval when countdown reaches zero
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup interval on unmount or when targetDate changes
    return () => clearInterval(interval);
  }, [targetDate]);

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return { timeLeft, formattedTime };
};
