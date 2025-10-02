import { useEffect, useState, useCallback } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { TooltipConfig } from '@/types/funnel';
import { TOOLTIPS } from '@/constants/tooltips';

export function useTooltipManager() {
  const { metrics, shouldShowTooltip, dismissTooltip, setActiveTooltip, activeTooltip } = useFunnel();
  const [queue, setQueue] = useState<TooltipConfig[]>([]);

  useEffect(() => {
    const eligibleTooltips = TOOLTIPS
      .filter(tooltip => shouldShowTooltip(tooltip))
      .sort((a, b) => a.priority - b.priority);

    setQueue(eligibleTooltips);
  }, [metrics.completedSteps, shouldShowTooltip]);

  const showNextTooltip = useCallback(() => {
    if (queue.length > 0 && !activeTooltip) {
      const nextTooltip = queue[0];
      
      if (nextTooltip.delayMs) {
        setTimeout(() => {
          setActiveTooltip(nextTooltip);
        }, nextTooltip.delayMs);
      } else {
        setActiveTooltip(nextTooltip);
      }
    }
  }, [queue, activeTooltip, setActiveTooltip]);

  const handleDismiss = useCallback(() => {
    if (activeTooltip) {
      dismissTooltip(activeTooltip.id);
      setQueue(prev => prev.filter(t => t.id !== activeTooltip.id));
    }
  }, [activeTooltip, dismissTooltip]);

  return {
    activeTooltip,
    showNextTooltip,
    handleDismiss,
    hasQueuedTooltips: queue.length > 0,
  };
}
