import { LucideIcon, Cpu, Network, Zap, Shield, Database, Activity, Code2, Monitor, Cloud, Terminal, GitBranch, Workflow, Layers, Settings } from 'lucide-react';

export const ICONS: LucideIcon[] = [Cpu, Network, Zap, Shield, Database, Activity, Code2, Monitor, Cloud, Terminal, GitBranch, Workflow, Layers, Settings];
export type Variant = 'dot' | 'icon' | 'label' | 'hud'; 
export const VARIANTS: Variant[] = ['dot', 'icon', 'label', 'hud', 'icon', 'label']; 

export const NODE_COUNT = 25; // Reduced from 40 — saves ~37% GPU work with no visible quality difference
export const TUNNEL_DEPTH = 3200;

export type NodeData = {
  id: number;
  variant: Variant;
  iconIndex: number;
  chaosX: number;
  chaosY: number;
  chaosZ: number;
  orderX: number;
  orderY: number;
  orderZ: number;
  baseAngle: number;
  swarmSpeed: number;
  swarmRadius: number;
  neighbors: number[];
};
