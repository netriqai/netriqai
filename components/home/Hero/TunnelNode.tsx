import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { NodeData, TUNNEL_DEPTH } from './types';
import { NodeContent } from './NodeContent';
import { triggerHaptic } from '@/lib/haptic';

interface TunnelNodeProps {
  data: NodeData;
  isOrdered: boolean;
  onHover: (id: number | null) => void;
  isAutoHovered?: boolean;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function TunnelNode({ data, isOrdered, onHover, isAutoHovered }: TunnelNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = isHovered || isAutoHovered;
  const targetOpacity = Math.max(0.1, 1 - (Math.abs(data.orderZ) / TUNNEL_DEPTH));

  const secondaryConnections = useMemo(() => {
    return Array.from({ length: 3 + Math.floor(seededRandom(data.id) * 3) }).map((_, i) => ({
      angleZ: seededRandom(data.id + i * 10) * 360,
      angleY: (seededRandom(data.id + i * 20) - 0.5) * 80,
      length: 100 + seededRandom(data.id + i * 30) * 200
    }));
  }, [data.id]);
  
  return (
    <motion.div
      onHoverStart={() => { 
        setIsHovered(true); 
        onHover(data.id); 
        triggerHaptic('light');
      }}
      onHoverEnd={() => { setIsHovered(false); onHover(null); }}
      className="absolute top-1/2 left-1/2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-crosshair z-50"
      initial={{ 
        x: data.chaosX, y: data.chaosY, z: data.chaosZ,
        opacity: 0, scale: 2
      }}
      animate={{
        x: isOrdered ? data.orderX : data.chaosX, 
        y: isOrdered ? data.orderY : data.chaosY, 
        z: isOrdered ? data.orderZ : data.chaosZ,
        opacity: isOrdered ? (active ? 1 : targetOpacity) : 0,
        scale: isOrdered ? (active ? 1.15 : 1) : 2
      }}
      transition={{
        x: { duration: 3 + data.swarmSpeed, ease: "circOut" },
        y: { duration: 3 + data.swarmSpeed, ease: "circOut" },
        opacity: { duration: 3, ease: "circOut" },
        scale: { duration: 1.0, ease: "circOut" }
      }}
    >
      {isOrdered && active && secondaryConnections.map((conn, i) => {
        const bend = 40 + (seededRandom(data.id + i) * 60);
        return (
          <motion.div
            key={i}
            className="absolute left-[50%] top-[50%] origin-left z-0"
            style={{ rotateZ: conn.angleZ }}
          >
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: bend, opacity: 0.8 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="h-[1px] bg-[rgb(var(--accent-blue))] shadow-[0_0_10px_rgb(var(--accent-blue))]"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute w-1 h-1 bg-white"
              style={{ left: bend - 2, top: -2 }}
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: conn.length - bend, opacity: 0.8 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "circOut" }}
              className="absolute w-[1px] bg-[rgb(var(--accent-blue))] shadow-[0_0_10px_rgb(var(--accent-blue))]"
              style={{ left: bend, top: 0 }}
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.6 }}
              className="absolute w-2 h-2 border border-[rgb(var(--accent-blue))] bg-background flex items-center justify-center"
              style={{ left: bend - 4, top: conn.length - bend }}
            >
              <div className="w-1 h-1 bg-[rgb(var(--accent-blue))]" />
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div
        animate={{ scale: active ? 1.15 : 1, filter: active ? "brightness(1.5)" : "brightness(1)" }}
        transition={{ duration: 1.0 }}
        className="relative z-10"
      >
        <NodeContent variant={data.variant} iconIndex={data.iconIndex} id={data.id} isHovered={!!active} />
      </motion.div>
    </motion.div>
  );
}
