import { motion } from 'framer-motion';
import { NodeData } from './types';

interface NodeConnectorProps {
  start: NodeData;
  end: NodeData;
  opacity?: number;
}

export function NodeConnector({ start, end, opacity = 0.4 }: NodeConnectorProps) {
  const dx = end.orderX - start.orderX;
  const dy = end.orderY - start.orderY;
  const dz = end.orderZ - start.orderZ;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 origin-top-left pointer-events-none"
      style={{
        transformStyle: 'preserve-3d',
        x: start.orderX, y: start.orderY, z: start.orderZ,
      }}
    >
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: Math.abs(dx) }}
        className="h-[1px] bg-[rgb(var(--accent-blue))] absolute"
        transition={{ duration: 1.0, ease: "circOut" }}
        style={{ 
          transform: `rotateY(${dx > 0 ? 0 : 180}deg)`,
          boxShadow: '0 0 10px rgb(var(--accent-blue))',
          filter: 'drop-shadow(0 0 5px rgb(var(--accent-blue)))'
        }}
      />
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: Math.abs(dy) }}
        className="w-[1px] bg-[rgb(var(--accent-blue))] absolute"
        transition={{ delay: 0.2, duration: 1.0 }}
        style={{ 
          transform: `translateX(${dx}px) rotateX(${dy > 0 ? 0 : 180}deg)`,
          boxShadow: '0 0 10px rgb(var(--accent-blue))' 
        }}
      />
      <motion.div 
        initial={{ scaleZ: 0 }}
        animate={{ scaleZ: 1 }}
        className="w-[1px] h-[1px] bg-[rgb(var(--accent-blue))] absolute"
        transition={{ delay: 0.4, duration: 1.0 }}
        style={{ 
          transform: `translate3d(${dx}px, ${dy}px, 0px)`,
          height: Math.abs(dz),
          transformOrigin: 'top',
          rotateX: 90,
          scaleY: dz > 0 ? 1 : -1,
          boxShadow: '0 0 10px rgb(var(--accent-blue))' 
        }}
      />
    </motion.div>
  );
}
