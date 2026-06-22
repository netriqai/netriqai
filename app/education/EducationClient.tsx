'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  MessageSquare, 
  Cpu, 
  Award, 
  Trophy, 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Edit2, 
  Check, 
  BookOpen, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  X,
  VolumeX
} from 'lucide-react';
import clsx from 'clsx';
import GlowButton from '@/components/ui/GlowButton';

// Data types
interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Course {
  id: string;
  title: string;
  duration: string;
  badgeId: string;
  badgeName: string;
  badgeDesc: string;
  xpReward: number;
  description: string;
  objectives: string[];
  videoTitle: string;
  youtubeId: string;
  icon: any;
  accentColor: string;
  visualType: 'pipeline' | 'chatbot' | 'agent';
  questions: Question[];
}

// Predefined Badges
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

const BADGES: Badge[] = [
  {
    id: 'automation-scout',
    name: 'Automation Scout',
    description: 'Mastered CRM integrations and zero-touch lead qualify pipelines.',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'cognitive-specialist',
    name: 'Cognitive Specialist',
    description: 'Mastered synchronizing internal knowledge bases with responsive customer chatbots.',
    icon: MessageSquare,
    color: 'from-cyan-400 to-teal-500',
  },
  {
    id: 'systems-architect',
    name: 'Systems Architect',
    description: 'Mastered autonomous multi-agent pipelines and human-in-the-loop validation.',
    icon: Cpu,
    color: 'from-purple-400 to-pink-500',
  },
];

// Course list definition
const COURSES: Course[] = [
  {
    id: 'crm-pipeline',
    title: 'CRM Lead Qualification Pipeline',
    duration: '3m 45s',
    badgeId: 'automation-scout',
    badgeName: 'Automation Scout',
    badgeDesc: 'Mastered CRM integrations and zero-touch lead qualify pipelines.',
    xpReward: 100,
    description: 'Build a zero-touch lead pipeline that qualified inbound web form submissions using LLMs, categorizes lead size, drafts custom response proposals, and syncs data to HubSpot/Salesforce automatically.',
    objectives: [
      'Understand inbound webhooks and data parsing.',
      'Construct qualification prompt templates for LLMs.',
      'Deploy automated router paths for high vs. low priority leads.',
      'Synchronize lead qualification state with CRM APIs.'
    ],
    videoTitle: 'Episode 1: Zero-Touch Qualify & CRM Ingest',
    youtubeId: 'DS4QbTpbVKw',
    icon: Zap,
    accentColor: 'text-amber-400 border-amber-400/20 bg-amber-400/5 hover:border-amber-400/40',
    visualType: 'pipeline',
    questions: [
      {
        text: 'What is the main purpose of qualifying incoming leads with AI before inserting them into a CRM database?',
        options: [
          'To save storage space by deleting all low-budget leads instantly.',
          'To filter out spam and prioritize high-value leads automatically, saving hours of manual sales triage.',
          'To bypass the CRM entirely and communicate via plain email.',
          'To increase the monthly subscription cost of the CRM software.'
        ],
        correctAnswer: 1
      },
      {
        text: 'Which technology is recommended for connecting customer web forms to CRM endpoints without writing custom database drivers?',
        options: [
          'Static Photoshop assets.',
          'Visual workflow automation systems like Make.com or n8n.',
          'Custom server racks in a local basement.',
          'Excel spreadsheet macro modules running locally.'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'chatbot-integration',
    title: 'Cognitive Document Chatbots',
    duration: '4m 20s',
    badgeId: 'cognitive-specialist',
    badgeName: 'Cognitive Specialist',
    badgeDesc: 'Mastered synchronizing internal knowledge bases with responsive customer chatbots.',
    xpReward: 150,
    description: 'Connect internal documentation, product sheets, and service guides directly to website chat widgets. Implement semantic indexes to provide instant answers with correct citations.',
    objectives: [
      'Understand vector embeddings and semantic search indexes.',
      'Chunk document data without losing context.',
      'Configure system boundaries to prevent chatbot hallucination.',
      'Provide visual citations and product links in AI answers.'
    ],
    videoTitle: 'Episode 2: Synchronizing Internal Files with Live Chatbot Widgets',
    youtubeId: 'kBG5dQe394s',
    icon: MessageSquare,
    accentColor: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/40',
    visualType: 'chatbot',
    questions: [
      {
        text: 'What does RAG (Retrieval-Augmented Generation) do in custom company chatbots?',
        options: [
          'It forces the chatbot to reply with pre-written static statements.',
          'It fetches relevant snippets from uploaded files first, then feeds them to the LLM as context to ensure accurate answers.',
          'It translates the chat automatically to 45 different languages.',
          'It restricts the website chat widget to only load on desktop computers.'
        ],
        correctAnswer: 1
      },
      {
        text: 'Why is providing sources/citations critical in automated B2B customer support chatbots?',
        options: [
          'It increases page layout complexity for design purposes.',
          'It allows customers to verify facts from technical manuals, building trust and reducing follow-up requests.',
          'It forces users to buy more products.',
          'It hides the chatbot’s internal prompts.'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'agent-systems',
    title: 'Multi-Agent Collaborative Systems',
    duration: '5m 12s',
    badgeId: 'systems-architect',
    badgeName: 'Systems Architect',
    badgeDesc: 'Mastered autonomous multi-agent pipelines and human-in-the-loop validation.',
    xpReward: 200,
    description: 'Orchestrate teams of specialized AI agents that pass tasks between one another—such as a researcher agent drafting copy, a reviewer agent checking guidelines, and a human providing final approval.',
    objectives: [
      'Define individual agent roles and prompt scopes.',
      'Configure agent-to-agent feedback loops.',
      'Implement human-in-the-loop checkpoints for critical events (e.g. sending payments/emails).',
      'Deploy execution monitors to prevent infinite agent feedback loops.'
    ],
    videoTitle: 'Episode 3: Orchestrating Autonomous Agent Workforces',
    youtubeId: 'juiWBu5m-Jg',
    icon: Cpu,
    accentColor: 'text-purple-400 border-purple-400/20 bg-purple-400/5 hover:border-purple-400/40',
    visualType: 'agent',
    questions: [
      {
        text: 'What does "Human-in-the-Loop" refer to in autonomous AI agent systems?',
        options: [
          'Humans rewriting the agent algorithms in real-time.',
          'Halting the agent pipeline at a critical juncture (like publishing or invoicing) until a human manager approves or edits the draft.',
          'Ensuring agents only run when a human is physically typing on the keyboard.',
          'A system that replaces all humans with loop circuits.'
        ],
        correctAnswer: 1
      },
      {
        text: 'How do specialized agents coordinate tasks inside an autonomous team structure?',
        options: [
          'By logging into their own individual Slack channels and chatting.',
          'By exchanging structured JSON payloads and executing prompts based on status codes.',
          'They do not coordinate; they execute identical tasks in isolation.',
          'By calling phone numbers via virtual VoIP networks.'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export default function EducationClient() {
  // Gamified States
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(3);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('SMB Tech Leader');
  const [editingName, setEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userCompany, setUserCompany] = useState<string>('');

  // Lead Modal States
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadCompany, setLeadCompany] = useState<string>('');
  const [leadName, setLeadName] = useState<string>('');
  const [leadError, setLeadError] = useState<string>('');
  const [submittingLead, setSubmittingLead] = useState<boolean>(false);

  // Course & Video Player States
  const [activeCourseId, setActiveCourseId] = useState<string>(COURSES[0].id);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoSpeed, setVideoSpeed] = useState<number>(1);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);
  const [videoCompleted, setVideoCompleted] = useState<boolean>(false);

  // Interactive Quiz States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [quizErrors, setQuizErrors] = useState<Record<string, boolean>>({});

  // UI Notification Toast States
  const [badgeToast, setBadgeToast] = useState<{ show: boolean; badge: Badge | null }>({ show: false, badge: null });
  const [xpToast, setXpToast] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Get active course object
  const activeCourse = COURSES.find(c => c.id === activeCourseId) || COURSES[0];

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedXp = localStorage.getItem('netriq_academy_xp');
      const savedStreak = localStorage.getItem('netriq_academy_streak');
      const savedLessons = localStorage.getItem('netriq_academy_lessons');
      const savedBadges = localStorage.getItem('netriq_academy_badges');
      const savedName = localStorage.getItem('netriq_academy_name');
      const savedEmail = localStorage.getItem('netriq_academy_email');
      const savedCompany = localStorage.getItem('netriq_academy_company');

      if (savedXp) setXp(parseInt(savedXp, 10));
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
      if (savedLessons) {
        try {
          setCompletedLessons(JSON.parse(savedLessons));
        } catch (_) {}
      }
      if (savedBadges) {
        try {
          setUnlockedBadges(JSON.parse(savedBadges));
        } catch (_) {}
      }
      if (savedName) {
        setUserName(savedName);
        setNameInput(savedName);
        setLeadName(savedName);
      } else {
        setNameInput(userName);
        setLeadName(userName);
      }
      if (savedEmail) setUserEmail(savedEmail);
      if (savedCompany) {
        setUserCompany(savedCompany);
        setLeadCompany(savedCompany);
      }
    }
  }, []);

  // Save changes to local storage helper
  const saveState = (newXp: number, newLessons: string[], newBadges: string[]) => {
    localStorage.setItem('netriq_academy_xp', newXp.toString());
    localStorage.setItem('netriq_academy_lessons', JSON.stringify(newLessons));
    localStorage.setItem('netriq_academy_badges', JSON.stringify(newBadges));
  };

  // Handle userName change
  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setLeadName(nameInput.trim());
      localStorage.setItem('netriq_academy_name', nameInput.trim());
      setEditingName(false);
    }
  };

  // Rank name lookup
  const getRank = (currentXp: number) => {
    if (currentXp < 100) return { title: 'AI Novice', color: 'text-text-muted', badge: 'Novice' };
    if (currentXp < 250) return { title: 'Workflow Scout', color: 'text-amber-400', badge: 'Scout' };
    if (currentXp < 500) return { title: 'Automation Specialist', color: 'text-cyan-400', badge: 'Specialist' };
    if (currentXp < 750) return { title: 'Systems Architect', color: 'text-purple-400', badge: 'Architect' };
    return { title: 'AI Champion 👑', color: 'text-teal-400 font-extrabold', badge: 'Champion' };
  };

  const userRank = getRank(xp);
  const xpNeededForNext = xp < 100 ? 100 : xp < 250 ? 250 : xp < 500 ? 500 : xp < 750 ? 750 : 1000;
  const xpPrevLevel = xp < 100 ? 0 : xp < 250 ? 100 : xp < 500 ? 250 : xp < 750 ? 500 : 750;
  const levelProgressPercent = Math.min(100, Math.max(0, ((xp - xpPrevLevel) / (xpNeededForNext - xpPrevLevel)) * 100));

  // Canvas-based futuristic visualizer animation matching course visualType
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 340);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 340;
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation variables
    let frame = 0;
    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number; color: string }> = [];

    const drawPipelineVisual = () => {
      // Clear
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Tech grid background lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw nodes
      const nodeX1 = 80;
      const nodeX2 = width / 2;
      const nodeX3 = width - 80;
      const nodeY = height / 2;

      // Draw connection lines
      ctx.strokeStyle = videoPlaying ? '#069494' : '#3b424c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(nodeX1, nodeY);
      ctx.lineTo(nodeX3, nodeY);
      ctx.stroke();

      // Flow pulses
      if (videoPlaying && frame % 15 === 0) {
        particles.push({
          x: nodeX1,
          y: nodeY,
          speed: 2.5 * videoSpeed,
          size: 4,
          alpha: 1,
          color: '#069494',
        });
      }

      // Draw dynamic pulse particles
      particles.forEach((p, idx) => {
        p.x += p.speed;
        if (p.x > nodeX3) {
          particles.splice(idx, 1);
          return;
        }
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Render Nodes
      const drawNode = (x: number, y: number, label: string, desc: string, active: boolean) => {
        ctx.fillStyle = active ? '#1a1a1a' : '#151515';
        ctx.strokeStyle = active ? '#069494' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(x - 60, y - 40, 120, 55, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = active ? '#f0f0f0' : '#808080';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 15);

        ctx.fillStyle = '#8090a0';
        ctx.font = '9px monospace';
        ctx.fillText(desc, x, y + 5);
      };

      drawNode(nodeX1, nodeY, 'INBOUND LEAD', 'Webhook qualify', videoPlaying);
      drawNode(nodeX2, nodeY, 'GEMINI AGENT', 'Prompt filter', videoPlaying && videoProgress > 25);
      drawNode(nodeX3, nodeY, 'HUBSPOT CRM', 'Router update', videoPlaying && videoProgress > 65);
    };

    const drawChatbotVisual = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Chat Interface Mockup
      ctx.fillStyle = '#16191d';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 150, 40, 300, 260, 12);
      ctx.fill();
      ctx.stroke();

      // Chat Header
      ctx.fillStyle = '#1e2329';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 150, 40, 300, 40, [12, 12, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#f0f0f0';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Cognitive Bot v2.4', width / 2 - 130, 65);

      // Green active dot
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(width / 2 + 130, 60, 4, 0, Math.PI * 2);
      ctx.fill();

      // Messages (Simulate conversation flow)
      const drawBubble = (y: number, text: string, isBot: boolean) => {
        const x = isBot ? width / 2 - 130 : width / 2 - 50;
        const w = isBot ? 210 : 180;
        ctx.fillStyle = isBot ? '#1f2937' : '#069494';
        ctx.beginPath();
        ctx.roundRect(x, y, w, 40, 8);
        ctx.fill();

        ctx.fillStyle = '#f0f0f0';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(text.substring(0, 30), x + 10, y + 18);
        ctx.fillText(text.substring(30, 60), x + 10, y + 30);
      };

      if (videoProgress > 10) {
        drawBubble(100, 'User: How do I scale CRM pipeline?', false);
      }
      if (videoProgress > 45) {
        drawBubble(160, 'Bot: Fetching HubSpot manuals... RAG match found:', true);
      }
      if (videoProgress > 80) {
        ctx.fillStyle = 'rgba(6, 148, 148, 0.1)';
        ctx.strokeStyle = '#069494';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 130, 215, 210, 30, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#069494';
        ctx.font = '9px monospace';
        ctx.fillText('Source: doc_lead_sync.pdf#L123', width / 2 - 120, 233);
      }
    };

    const drawAgentVisual = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Starfield / Node Connection Mesh
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const nodes = [
        { x: width / 2, y: 70, name: 'Coordinator' },
        { x: width / 2 - 120, y: 180, name: 'Researcher' },
        { x: width / 2 + 120, y: 180, name: 'Writer' },
        { x: width / 2, y: 270, name: 'Human Approver' }
      ];

      // Draw connection lines
      ctx.strokeStyle = videoPlaying ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.stroke();

      // Pulse traveling around nodes
      if (videoPlaying) {
        const timeFactor = (frame * 0.02 * videoSpeed) % 4;
        let pulseX = 0;
        let pulseY = 0;

        const startNode = nodes[Math.floor(timeFactor)];
        const endNode = nodes[(Math.floor(timeFactor) + 1) % 4];
        const interpolator = timeFactor % 1;

        pulseX = startNode.x + (endNode.x - startNode.x) * interpolator;
        pulseY = startNode.y + (endNode.y - startNode.y) * interpolator;

        ctx.fillStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      nodes.forEach((n, idx) => {
        const isCurrent = videoPlaying && Math.floor((frame * 0.02 * videoSpeed) % 4) === idx;
        ctx.fillStyle = isCurrent ? '#2c1e3b' : '#141416';
        ctx.strokeStyle = isCurrent ? '#a855f7' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f0f0f0';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y + 45);

        // Subtext status
        if (isCurrent) {
          ctx.fillStyle = '#a855f7';
          ctx.font = '8px monospace';
          ctx.fillText('RUNNING', n.x, n.y + 5);
        } else {
          ctx.fillStyle = '#808080';
          ctx.font = '8px monospace';
          ctx.fillText('IDLE', n.x, n.y + 5);
        }
      });
    };

    const render = () => {
      frame++;
      if (activeCourse.visualType === 'pipeline') {
        drawPipelineVisual();
      } else if (activeCourse.visualType === 'chatbot') {
        drawChatbotVisual();
      } else if (activeCourse.visualType === 'agent') {
        drawAgentVisual();
      }
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [activeCourseId, videoPlaying, videoSpeed, videoProgress]);

  // Video progress controller
  useEffect(() => {
    if (videoPlaying) {
      progressInterval.current = setInterval(() => {
        setVideoProgress(prev => {
          const increment = 1.5 * videoSpeed;
          if (prev + increment >= 100) {
            setVideoPlaying(false);
            setVideoCompleted(true);
            if (progressInterval.current) clearInterval(progressInterval.current);
            return 100;
          }
          return prev + increment;
        });
      }, 300);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [videoPlaying, videoSpeed]);

  // Reset video player when changing courses
  const handleCourseSelect = (id: string) => {
    setActiveCourseId(id);
    setVideoPlaying(false);
    setVideoProgress(0);
    setVideoCompleted(false);
  };

  // Video play control toggle
  const togglePlay = () => {
    if (videoCompleted) {
      setVideoProgress(0);
      setVideoCompleted(false);
    }
    setVideoPlaying(!videoPlaying);
  };

  // Skip video helper to allow fast test testing
  const skipVideo = () => {
    setVideoPlaying(false);
    setVideoProgress(100);
    setVideoCompleted(true);
  };

  // Answer selection handler
  const handleAnswerSelect = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted[activeCourse.id]) return; // locked after submit

    setSelectedAnswers(prev => {
      const current = prev[activeCourse.id] ? [...prev[activeCourse.id]] : [];
      current[questionIdx] = optionIdx;
      return { ...prev, [activeCourse.id]: current };
    });

    // Clear error style if they tap a new choice
    setQuizErrors(prev => ({ ...prev, [activeCourse.id]: false }));
  };

  // Complete quiz state updates and background API logging
  const completeQuizAndLog = (name: string, email: string, company: string, skipApiPost = false) => {
    const isFirstTime = !completedLessons.includes(activeCourse.id);
    const newLessons = isFirstTime ? [...completedLessons, activeCourse.id] : completedLessons;

    let xpEarned = 0;
    let badgeObj: Badge | null = null;
    let newBadges = [...unlockedBadges];

    if (isFirstTime) {
      xpEarned = activeCourse.xpReward;
      const matchingBadge = BADGES.find(b => b.id === activeCourse.badgeId);
      if (matchingBadge && !unlockedBadges.includes(matchingBadge.id)) {
        newBadges.push(matchingBadge.id);
        badgeObj = matchingBadge;
      }
    }

    const updatedXP = xp + xpEarned;
    setXp(updatedXP);
    setCompletedLessons(newLessons);
    setUnlockedBadges(newBadges);

    // Set submission flags
    setQuizSubmitted(prev => ({ ...prev, [activeCourse.id]: true }));

    // Save to localStorage
    saveState(updatedXP, newLessons, newBadges);
    localStorage.setItem('netriq_academy_email', email);
    localStorage.setItem('netriq_academy_company', company);
    localStorage.setItem('netriq_academy_name', name);
    
    setUserName(name);
    setUserEmail(email);
    setUserCompany(company);

    // Trigger alerts
    if (xpEarned > 0) {
      setXpToast({ show: true, amount: xpEarned });
      setTimeout(() => setXpToast({ show: false, amount: 0 }), 3000);
    }

    if (badgeObj) {
      setTimeout(() => {
        setBadgeToast({ show: true, badge: badgeObj });
      }, 800);
    }

    // Call API in background if not already submitted by the modal
    if (!skipApiPost) {
      fetch('/api/academy/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          courseId: activeCourse.id,
          courseTitle: activeCourse.title,
          badgeName: activeCourse.badgeName,
          xpReward: xpEarned
        })
      }).catch(err => console.error('Background lead log failed:', err));
    }
  };

  // Submit Lead from Form Modal
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');

    if (!leadName.trim() || !leadEmail.trim() || !leadCompany.trim()) {
      setLeadError('Please fill in all fields.');
      return;
    }

    if (!leadEmail.includes('@') || !leadEmail.includes('.')) {
      setLeadError('Please enter a valid email address.');
      return;
    }

    setSubmittingLead(true);

    try {
      const isFirstTime = !completedLessons.includes(activeCourse.id);
      const xpEarned = isFirstTime ? activeCourse.xpReward : 0;
      
      const res = await fetch('/api/academy/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim(),
          company: leadCompany.trim(),
          courseId: activeCourse.id,
          courseTitle: activeCourse.title,
          badgeName: activeCourse.badgeName,
          xpReward: xpEarned
        })
      });

      if (!res.ok) {
        throw new Error('Verification failed');
      }

      // Close modal
      setShowLeadModal(false);

      // Award XP & Badge
      completeQuizAndLog(leadName.trim(), leadEmail.trim(), leadCompany.trim(), true);

    } catch (err) {
      console.error(err);
      setLeadError('Failed to verify with the Netriq Bridge. Please check connection and try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  // Quiz submission handler
  const handleQuizSubmit = () => {
    const answers = selectedAnswers[activeCourse.id] || [];
    const questions = activeCourse.questions;

    // Verify all answered
    if (answers.length < questions.length || answers.includes(undefined as any)) {
      setQuizErrors(prev => ({ ...prev, [activeCourse.id]: true }));
      return;
    }

    // Check correctness
    const results = questions.map((q, idx) => answers[idx] === q.correctAnswer);
    const allCorrect = results.every(r => r === true);

    if (allCorrect) {
      if (!userEmail) {
        // Show lead gate modal to claim badge/XP
        setShowLeadModal(true);
        return;
      }
      
      // If already registered, complete instantly + background API log
      completeQuizAndLog(userName, userEmail, userCompany);
    } else {
      // Shake animation trigger
      setQuizErrors(prev => ({ ...prev, [activeCourse.id]: true }));
      setTimeout(() => {
        setQuizErrors(prev => ({ ...prev, [activeCourse.id]: false }));
      }, 500);
    }
  };

  // Reset quiz for retry
  const handleQuizReset = () => {
    setSelectedAnswers(prev => ({ ...prev, [activeCourse.id]: [] }));
    setQuizSubmitted(prev => ({ ...prev, [activeCourse.id]: false }));
    setQuizErrors(prev => ({ ...prev, [activeCourse.id]: false }));
  };

  return (
    <div className="min-h-screen bg-background tech-grid pb-24 pt-28">
      {/* Dynamic Toast Alerts */}
      {/* XP Toast */}
      {xpToast.show && (
        <div className="fixed bottom-10 right-10 z-50 flex items-center gap-3 px-6 py-4 glass-card border-accent-blue/30 rounded-xl shadow-lg shadow-accent-blue/10 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold font-mono">
            XP
          </div>
          <div>
            <p className="font-bold text-sm text-text-primary">XP GAINED!</p>
            <p className="text-xs text-accent-blue font-mono font-bold">+{xpToast.amount} Experience Points</p>
          </div>
        </div>
      )}

      {/* Badge Unlock Modal Overlay */}
      {badgeToast.show && badgeToast.badge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-1 border border-accent-blue/40 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-accent-blue/10">
            {/* Holographic glowing orb background */}
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-accent-blue/15 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />

            <button 
              onClick={() => setBadgeToast({ show: false, badge: null })}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-accent-blue/30 to-purple-500/30 flex items-center justify-center border border-accent-blue/40 shadow-inner mb-6 relative">
              <badgeToast.badge.icon className="w-10 h-10 text-accent-blue animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-30" />
            </div>

            <span className="font-mono text-[10px] text-accent-blue font-bold uppercase tracking-[0.3em]">ACHIEVEMENT UNLOCKED</span>
            <h3 className="text-2xl font-bold text-text-primary mt-2">{badgeToast.badge.name}</h3>
            <p className="text-sm text-text-secondary mt-3 px-4 leading-relaxed">
              {badgeToast.badge.description}
            </p>

            <div className="mt-8 border-t border-border-strong/10 pt-6">
              <p className="font-mono text-[11px] text-text-muted">Rank: {userRank.title}</p>
              <GlowButton 
                onClick={() => setBadgeToast({ show: false, badge: null })}
                variant="primary" 
                size="sm" 
                className="mt-4 w-full rounded-full"
              >
                DISMISS
              </GlowButton>
            </div>
          </div>
        </div>
      )}

      {/* Lead Capture Modal Overlay */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-1 border border-accent-blue/40 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-accent-blue/10">
            {/* Holographic glowing orb background */}
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-accent-blue/15 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />

            <button 
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue mb-4">
              <Award className="w-7 h-7" />
            </div>

            <span className="font-mono text-[10px] text-accent-blue font-bold uppercase tracking-[0.3em]">CLAIM YOUR REWARDS</span>
            <h3 className="text-xl font-bold text-text-primary mt-2">Claim Progress & Unlock Badge</h3>
            <p className="text-xs text-text-secondary mt-2 px-4 leading-relaxed">
              Enter your email and company name to save your **+{activeCourse.xpReward} XP** progress, unlock the **{activeCourse.badgeName}** badge, and link to the leaderboard.
            </p>

            <form onSubmit={handleLeadSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-background border border-border-strong/30 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue transition-colors"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">Business Email</label>
                <input 
                  type="email" 
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-background border border-border-strong/30 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue transition-colors"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-background border border-border-strong/30 rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue transition-colors"
                />
              </div>

              {leadError && (
                <p className="text-[11px] text-red-500 font-mono mt-1">{leadError}</p>
              )}

              <button 
                type="submit"
                disabled={submittingLead}
                className="w-full mt-2 bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-50 text-white font-sans font-bold text-xs tracking-wider py-3.5 rounded-full shadow-lg shadow-accent-blue/10 uppercase transition-all flex items-center justify-center gap-1.5"
              >
                {submittingLead ? 'Verifying with Netriq Bridge...' : 'Unlock Badge & Reward'}
                {!submittingLead && <ChevronRight size={14} />}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Page Header */}
        <div className="mb-12">
          <div className="tech-badge mb-4">NETRIQ ACADEMY</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-text-primary">
            Master B2B Automation & <span className="text-accent-blue">Earn Rewards</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mt-4 text-sm md:text-base leading-relaxed">
            Gamified technical masterclasses designed to guide SMB leaders in building, deploying, and auditing cutting-edge AI architectures. Watch lessons, ace quizzes, and climb the leaderboard.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* User Profile Card */}
          <div className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-blue/5 blur-2xl" />
            
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={nameInput} 
                          onChange={(e) => setNameInput(e.target.value)}
                          className="bg-surface-2 border border-border-strong rounded px-2 py-1 text-sm text-text-primary font-mono outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                        <button onClick={handleSaveName} className="text-accent-blue hover:text-white">
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg text-text-primary">{userName}</h3>
                        <button onClick={() => setEditingName(true)} className="text-text-muted hover:text-accent-blue transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  <p className={clsx("font-mono text-xs uppercase tracking-wider mt-1", userRank.color)}>
                    Rank: {userRank.title}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs rounded-full">
                  <Flame size={12} className="fill-orange-400/20" />
                  <span>{streak}d Streak</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mt-8">
                <div className="flex justify-between text-xs font-mono text-text-muted mb-2">
                  <span>Progress to Next Rank</span>
                  <span>{xp} / {xpNeededForNext} XP</span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-blue to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-lg shadow-accent-blue/30"
                    style={{ width: `${levelProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border-strong/10 pt-4 flex items-center justify-between text-xs text-text-muted">
              <span>Modules completed:</span>
              <span className="font-mono font-bold text-text-primary">{completedLessons.length} / {COURSES.length}</span>
            </div>
          </div>

          {/* Badges Showcase Card */}
          <div className="glass-card rounded-2xl p-6 border-white/5 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-text-primary mb-1">Badge Collection</h3>
              <p className="text-xs text-text-secondary mb-6">Complete course quizzes with 100% accuracy to unlock tech certification badges.</p>
              
              <div className="grid grid-cols-3 gap-4">
                {BADGES.map(badge => {
                  const isUnlocked = unlockedBadges.includes(badge.id);
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={badge.id}
                      className={clsx(
                        "rounded-xl border p-4 flex flex-col items-center text-center transition-all duration-300 relative",
                        isUnlocked 
                          ? "bg-surface-2/20 border-accent-blue/30 shadow-md shadow-accent-blue/5 scale-100" 
                          : "bg-surface-1/10 border-white/5 opacity-50 grayscale"
                      )}
                    >
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                        isUnlocked ? "bg-gradient-to-br " + badge.color + "/20 border border-white/10" : "bg-surface-2"
                      )}>
                        <Icon className={clsx("w-6 h-6", isUnlocked ? "text-text-primary" : "text-text-muted")} />
                      </div>
                      <h4 className="text-xs font-bold text-text-primary truncate w-full">{badge.name}</h4>
                      <p className="text-[9px] text-text-muted mt-1 leading-snug hidden md:block">{badge.description}</p>
                      
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <Lock size={10} className="text-text-muted" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Syllabus Course List - Left Side */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="font-bold text-lg text-text-primary tracking-tight mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-accent-blue" />
              <span>Syllabus Modules</span>
            </h3>

            {COURSES.map(course => {
              const isSelected = activeCourse.id === course.id;
              const isCompleted = completedLessons.includes(course.id);
              const CourseIcon = course.icon;

              return (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className={clsx(
                    "w-full text-left rounded-xl border p-5 transition-all duration-300 flex items-start gap-4",
                    isSelected 
                      ? "bg-surface-2 border-accent-blue shadow-lg shadow-accent-blue/5" 
                      : "bg-surface-1/40 hover:bg-surface-1/70 border-white/5"
                  )}
                >
                  <div className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-300",
                    isSelected ? "bg-accent-blue/15 border-accent-blue text-accent-blue scale-105" : "bg-surface-2 border-white/10 text-text-muted"
                  )}>
                    <CourseIcon size={18} />
                  </div>

                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">{course.duration}</span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[10px] text-teal-400 font-mono font-bold">
                          <CheckCircle2 size={11} />
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-text-primary mt-1 truncate">{course.title}</h4>
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Player & Quiz - Center / Right Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Custom Interactive visualizer Player mockup */}
            <div className="glass-card rounded-2xl border-white/5 overflow-hidden shadow-2xl relative">
              
              {/* Visualizer Canvas Area */}
              <div className="relative bg-black w-full h-[340px] flex items-center justify-center overflow-hidden border-b border-border-strong/10">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
                
                {/* Embed YouTube video overlay if playing */}
                {(videoPlaying || (videoProgress > 0 && !videoCompleted)) && (
                  <iframe
                    className="absolute inset-0 w-full h-full z-10 border-0"
                    src={`https://www.youtube.com/embed/${activeCourse.youtubeId}?autoplay=1&rel=0&controls=1`}
                    title={activeCourse.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                
                {/* Visual Overlay if not playing and progress is 0 */}
                {!videoPlaying && videoProgress === 0 && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 transition-all">
                    <button 
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-accent-blue hover:bg-accent-blue-hover text-white flex items-center justify-center shadow-lg shadow-accent-blue/30 hover:scale-110 transition-all duration-300 mb-4"
                    >
                      <Play size={24} className="ml-1 fill-white" />
                    </button>
                    <span className="font-mono text-[10px] text-accent-blue tracking-widest uppercase">INTERACTIVE DEMO</span>
                    <h3 className="text-xl font-bold mt-1 max-w-md text-text-primary px-4">{activeCourse.videoTitle}</h3>
                    <p className="text-xs text-text-muted mt-2 max-w-xs leading-relaxed">
                      Watch the automated pipeline flow logic visualizer in action to unlock the module quiz.
                    </p>
                  </div>
                )}

                {/* Simulated Floating Code Logs */}
                {videoPlaying && (
                  <div className="absolute top-4 left-4 font-mono text-[9px] text-accent-blue bg-black/40 backdrop-blur-md px-3 py-1.5 border border-accent-blue/20 rounded pointer-events-none transition-opacity duration-300">
                    <p className="font-bold">STATUS: PIPELINE_EXEC</p>
                    <p className="text-text-muted mt-0.5">Frame: {Math.floor(videoProgress * 3.4)} | Speed: {videoSpeed}x</p>
                  </div>
                )}

                {/* Completed Prompt */}
                {videoCompleted && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500 flex items-center justify-center text-teal-400 mb-4 animate-pulse">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="font-mono text-[10px] text-teal-400 tracking-widest uppercase font-bold">DEMO FINISHED</span>
                    <h3 className="text-xl font-bold mt-1 text-text-primary">Module Comprehension Quiz Unlocked!</h3>
                    <p className="text-xs text-text-secondary mt-2 max-w-xs leading-relaxed">
                      Scroll down to the quiz challenge below to test your understanding and claim **{activeCourse.xpReward} XP**!
                    </p>
                    <div className="mt-5 flex gap-4">
                      <button 
                        onClick={() => { setVideoProgress(0); setVideoCompleted(false); setVideoPlaying(true); }}
                        className="px-4 py-2 bg-surface-2 hover:bg-surface-1 text-text-primary text-xs font-mono rounded-full border border-white/5 transition-all"
                      >
                        REPLAY VIDEO
                      </button>
                      <a 
                        href="#quiz-section"
                        className="px-5 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                      >
                        START QUIZ
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls bar */}
              <div className="bg-surface-1/90 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={togglePlay}
                    disabled={videoCompleted}
                    className="text-text-primary hover:text-accent-blue disabled:opacity-50 transition-colors"
                  >
                    {videoPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button 
                    onClick={() => { setVideoProgress(0); setVideoCompleted(false); }}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    title="Reset Player"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <div className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer" onClick={() => setVideoMuted(!videoMuted)}>
                    {videoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </div>

                  <span className="font-mono text-xs text-text-muted">
                    {Math.floor(videoProgress * activeCourse.questions.length * 1.5) ? 'QUALIFYING' : 'IDLE'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex-1 w-full mx-2">
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = (clickX / rect.width) * 100;
                    setVideoProgress(pct);
                    if (pct >= 100) {
                      setVideoCompleted(true);
                      setVideoPlaying(false);
                    } else {
                      setVideoCompleted(false);
                    }
                  }}>
                    <div 
                      className="h-full bg-accent-blue rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted">SPEED</span>
                    <select 
                      value={videoSpeed} 
                      onChange={(e) => setVideoSpeed(parseFloat(e.target.value))}
                      className="bg-surface-2 border border-white/5 rounded-md px-2 py-1 text-xs font-mono text-text-primary outline-none"
                    >
                      <option value="1">1.0x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2.0x</option>
                    </select>
                  </div>

                  {/* Dev skip button */}
                  <button 
                    onClick={skipVideo}
                    className="text-[9px] font-mono border border-border-strong/20 px-2 py-1 rounded bg-surface-2 hover:bg-surface-1 text-text-muted hover:text-text-primary transition-all"
                  >
                    DEV_SKIP
                  </button>
                </div>
              </div>
            </div>

            {/* Course objectives list */}
            <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
              <h3 className="font-bold text-lg text-text-primary">What You Will Learn</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCourse.objectives.map((obj, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-accent-blue/15 border border-accent-blue flex items-center justify-center text-accent-blue shrink-0 mt-0.5 font-mono text-[9px] font-bold">
                      {idx + 1}
                    </div>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* STATEFUL INTERACTIVE QUIZ SECTION */}
            <div id="quiz-section" className="scroll-mt-24">
              <div className={clsx(
                "glass-card rounded-2xl p-6 border-white/5 transition-all duration-300 relative",
                !videoCompleted && !completedLessons.includes(activeCourse.id) ? "opacity-60 pointer-events-none select-none bg-surface-1/10" : "opacity-100 border-accent-blue/20",
                quizErrors[activeCourse.id] && "animate-shake border-red-500/40"
              )}>
                {/* Lock Overlay if video not completed */}
                {!videoCompleted && !completedLessons.includes(activeCourse.id) && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center text-text-muted mb-3">
                      <Lock size={16} />
                    </div>
                    <h4 className="font-bold text-sm text-text-primary">Quiz Locked</h4>
                    <p className="text-[11px] text-text-secondary mt-1 max-w-xs">
                      Finish watching the visualizer demo to unlock this module's validation questions.
                    </p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border-strong/10 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                      <Award size={18} className="text-accent-blue" />
                      <span>Comprehension Quiz Challenge</span>
                    </h3>
                    <p className="text-xs text-text-muted mt-1">Answer all questions correctly to claim {activeCourse.xpReward} XP & your badge.</p>
                  </div>

                  {completedLessons.includes(activeCourse.id) && (
                    <span className="font-mono font-bold text-xs bg-teal-500/10 border border-teal-500/20 text-teal-400 px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={12} />
                      XP & BADGE CLAIMED
                    </span>
                  )}
                </div>

                {/* Questions Grid */}
                <div className="space-y-6">
                  {activeCourse.questions.map((q, qIdx) => {
                    const selectedOpt = selectedAnswers[activeCourse.id]?.[qIdx];
                    const isSubmitted = quizSubmitted[activeCourse.id];

                    return (
                      <div key={qIdx} className="space-y-3">
                        <h4 className="font-bold text-sm text-text-primary flex items-start gap-2">
                          <span className="font-mono text-accent-blue text-xs mt-0.5">Q{qIdx + 1}.</span>
                          <span>{q.text}</span>
                        </h4>

                        <div className="grid grid-cols-1 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            const isCorrect = q.correctAnswer === optIdx;
                            
                            let optionStyle = "border-white/5 bg-surface-1/40 text-text-secondary hover:bg-surface-1/70";
                            if (isSelected) {
                              if (isSubmitted) {
                                optionStyle = isCorrect 
                                  ? "border-teal-500 bg-teal-500/10 text-teal-400 font-semibold" 
                                  : "border-red-500 bg-red-500/10 text-red-400";
                              } else {
                                optionStyle = "border-accent-blue bg-accent-blue/10 text-text-primary font-semibold";
                              }
                            } else if (isSubmitted && isCorrect) {
                              // Reveal correct answer if wrong
                              optionStyle = "border-teal-500/30 bg-teal-500/5 text-teal-400/80";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerSelect(qIdx, optIdx)}
                                disabled={isSubmitted}
                                className={clsx(
                                  "w-full text-left p-3.5 text-xs rounded-lg border transition-all duration-200",
                                  optionStyle
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{opt}</span>
                                  {isSubmitted && isSelected && (
                                    <span>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Controls */}
                <div className="mt-8 border-t border-border-strong/10 pt-5 flex items-center justify-between gap-4">
                  {quizSubmitted[activeCourse.id] ? (
                    <div className="flex items-center gap-4 w-full">
                      <p className="text-xs text-text-secondary flex-1">
                        You scored 100% on this module!
                      </p>
                      <button
                        onClick={handleQuizReset}
                        className="px-4 py-2 border border-border-strong/20 hover:border-text-primary rounded-full text-xs font-mono text-text-muted hover:text-text-primary transition-all shrink-0"
                      >
                        RESET ANSWERS
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <p className="text-[10px] font-mono text-text-muted uppercase">
                        {selectedAnswers[activeCourse.id]?.filter(a => a !== undefined).length || 0} OF {activeCourse.questions.length} ANSWERED
                      </p>
                      <button
                        onClick={handleQuizSubmit}
                        className="px-6 py-2.5 bg-accent-blue hover:bg-accent-blue-hover text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-accent-blue/10 flex items-center gap-1.5"
                      >
                        SUBMIT ANSWERS
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global competitive SMB Leaderboard Grid */}
        <div className="mt-20">
          <div className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">Australian SMB Leaderboard</h3>
                <p className="text-xs text-text-secondary mt-0.5">Top-performing operators qualifying their team operations.</p>
              </div>
            </div>

            {/* Leaderboard Entries */}
            <div className="divide-y divide-border-strong/10">
              {[
                { rank: 1, name: 'Oliver K. (E-com Director, Sydney)', xp: 650, streak: 5 },
                { rank: 2, name: 'Sarah M. (Operations VP, Melbourne)', xp: 550, streak: 2 },
                { rank: 3, name: `${userName} (${userCompany || 'You'})`, xp: xp, streak: streak, isUser: true },
                { rank: 4, name: 'Jackson D. (Founder, Brisbane)', xp: 400, streak: 0 },
                { rank: 5, name: 'Chloe T. (Logistics Mgr, Perth)', xp: 350, streak: 4 }
              ]
                .sort((a, b) => b.xp - a.xp)
                .map((row, idx) => {
                  return (
                    <div 
                      key={idx}
                      className={clsx(
                        "py-3.5 flex items-center justify-between text-xs font-mono transition-colors",
                        row.isUser ? "bg-accent-blue/5 px-3 -mx-3 rounded-lg border-y border-accent-blue/10" : ""
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={clsx(
                          "w-5 font-bold text-center",
                          idx === 0 ? "text-amber-400" : idx === 1 ? "text-text-secondary" : idx === 2 ? "text-orange-400" : "text-text-muted"
                        )}>
                          #{idx + 1}
                        </span>

                        <span className={clsx("font-sans", row.isUser ? "font-bold text-accent-blue" : "text-text-primary")}>
                          {row.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        {row.streak > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-orange-400">
                            <Flame size={10} className="fill-orange-400/20" />
                            <span>{row.streak}d</span>
                          </div>
                        )}
                        <span className="font-bold text-text-primary">{row.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
