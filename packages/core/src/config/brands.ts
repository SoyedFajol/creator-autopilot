import { Brand, RenderProfile } from '../types/index.js';

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'brand-stack-simple',
    name: 'Stack Simple',
    slug: 'stack-simple',
    niche: 'business software tutorials and comparisons for US freelancers and small business owners',
    active: true,
    paused: false,
    voiceId: 'kokoro-am-michael',
    colors: {
      primary: '#2563EB', // Vibrant Blue
      secondary: '#0F172A', // Deep Slate
      accent: '#10B981', // Emerald Green
      background: '#F8FAFC',
      text: '#1E293B',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    motionStyle: 'clean_minimal',
    profile: {
      targetViewer: 'US freelancers and small business owners (1-10 employees) who need software but hate evaluating it.',
      problemSolved: 'Choosing between dozens of SaaS tools wastes hours; most reviews are sponsored, bloated, and biased.',
      promise: 'We research it and show you the free tier so you can decide for yourself.',
      contentPillars: [
        'Head-to-head comparisons (Tool A vs Tool B) based on documented features and free-tier walkthroughs',
        'Best for use case roundups compiled from published reviews and official specs',
        'Free-tier screen recording walkthroughs showing real setup and daily workflows',
        'Is it worth paying for? free-vs-paid breakdowns using transparent published pricing',
      ],
      recurringSeries: [
        'Tool of the Week (research-backed feature breakdown)',
        'Free Tier Friday (screen recording walkthrough of a free tool)',
        'Stack Teardown (what tools real businesses use)',
      ],
      tone: 'Friendly, no-nonsense, slightly skeptical. Your research-obsessed friend who reads every spec sheet so you do not have to.',
      differentiator:
        'Focus on solo and small-team use cases. Shows real screen recordings of free tiers without sponsored bias. Every claim cites sources. Full affiliate disclosure.',
      requiredDisclaimer:
        'Educational and review content only. Contains affiliate links that support the channel at no extra cost to you.',
      ymylRisk: 'low',
    },
    cadence: {
      longVideosPerWeek: 2,
      shortsPerWeek: 3,
      publishTimesUtc: {
        youtube: '15:00', // 10:00 AM EST (US morning)
        instagram: '17:00',
        facebook: '18:00',
        tiktok: '19:00',
      },
    },
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z',
  },
  {
    id: 'brand-worth-the-upgrade',
    name: 'Worth the Upgrade',
    slug: 'worth-the-upgrade',
    niche: 'tech buying guides for US shoppers',
    active: true,
    paused: false,
    voiceId: 'kokoro-am-adam',
    colors: {
      primary: '#EA580C', // Tech Orange
      secondary: '#18181B', // Dark Zinc
      accent: '#EAB308', // Gold Alert
      background: '#09090B',
      text: '#FAFAFA',
    },
    fonts: {
      heading: 'Cabinet Grotesk',
      body: 'Inter',
      mono: 'Space Mono',
    },
    motionStyle: 'bold_punchy',
    profile: {
      targetViewer: 'US shoppers aged 25-45 deciding whether a tech product is actually worth buying.',
      problemSolved: 'Tech reviews are either too technical or heavily sponsored by brands.',
      promise: 'Research-based buying guides that answer one question: is it worth your money?',
      contentPillars: [
        'Worth it? verdicts based on published reviews, spec sheets, and aggregated user reports',
        'Budget vs premium comparisons using manufacturer specs and benchmark tests',
        'Best under $X buyer guides compiled across multiple verified review sources',
        'Skip or buy seasonal guides evaluating genuine upgrades vs marketing refresh',
      ],
      recurringSeries: [
        'Worth the Upgrade? (research-based verdict)',
        'Best Under $100 (compiled buyer guide)',
        'Holiday Buyer Guide',
        'Review Roundup (what 5+ published reviews agree on)',
      ],
      tone: 'Enthusiastic but honest. Always states comparisons are research-based, not hands-on, unless marked otherwise.',
      differentiator:
        'Decision-first: the verdict is delivered in the first 15 seconds. Cites official press kits and specs. Never hardcodes Amazon prices.',
      requiredDisclaimer:
        'Editorial commentary and research only. Not officially sponsored by mentioned manufacturers. Affiliate links disclosed.',
      ymylRisk: 'low',
    },
    cadence: {
      longVideosPerWeek: 2,
      shortsPerWeek: 3,
      publishTimesUtc: {
        youtube: '16:00',
        instagram: '17:30',
        facebook: '18:30',
        tiktok: '19:30',
      },
    },
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z',
  },
  {
    id: 'brand-first-dollar-plan',
    name: 'First Dollar Plan',
    slug: 'first-dollar-plan',
    niche: 'personal finance for US adults aged 22 to 35',
    active: false,
    paused: true,
    voiceId: 'kokoro-af-sarah',
    colors: {
      primary: '#059669',
      secondary: '#064E3B',
      accent: '#F59E0B',
      background: '#F0FDF4',
      text: '#064E3B',
    },
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter',
    },
    motionStyle: 'clean_minimal',
    profile: {
      targetViewer: 'US adults aged 22-35, early career, feeling behind on money.',
      problemSolved: 'Online personal finance is either patronizing or hyper-advanced.',
      promise: 'One clear money move you can make this week.',
      contentPillars: [
        'First foundational steps (emergency buffer, first HYSA, first Roth IRA)',
        'Debt-crushing strategies (avalanche vs snowball)',
        'Income boosters (negotiation scripts and verified side incomes)',
        'Money psychology and anti-lifestyle inflation habits',
      ],
      recurringSeries: ['This Week Money Move', 'Paycheck Breakdown', 'Debt-Free Diary'],
      tone: 'Encouraging, realistic, zero judgment. Speaks like a supportive older sibling.',
      differentiator: 'One specific action per video with animated math and zero get-rich-quick claims.',
      requiredDisclaimer:
        'This content is for educational purposes only and does not constitute financial, investment, or tax advice. Always consult a licensed professional.',
      ymylRisk: 'high',
    },
    cadence: {
      longVideosPerWeek: 1,
      shortsPerWeek: 2,
      publishTimesUtc: { youtube: '15:00' },
    },
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z',
  },
  {
    id: 'brand-keys-and-numbers',
    name: 'Keys and Numbers',
    slug: 'keys-and-numbers',
    niche: 'real estate and mortgages for US first-time buyers',
    active: false,
    paused: true,
    voiceId: 'kokoro-am-michael',
    colors: {
      primary: '#0D9488',
      secondary: '#134E4A',
      accent: '#F97316',
      background: '#F0FDFA',
      text: '#134E4A',
    },
    fonts: {
      heading: 'Outfit',
      body: 'Inter',
    },
    motionStyle: 'editorial',
    profile: {
      targetViewer: 'US first-time homebuyers, ages 25-40, overwhelmed by closing costs and mortgages.',
      problemSolved: 'Home buying is fraught with high-pressure sales pitches and confusing terminology.',
      promise: 'Every step of buying your first home, explained like a friend who just did it.',
      contentPillars: [
        'Mortgage fundamentals and loan comparisons (Conventional vs FHA vs VA)',
        'The step-by-step homebuying roadmap',
        'Hidden closing fees, PMI, and inspection pitfalls',
        'Affordability calculations based on actual income scenarios',
      ],
      recurringSeries: ['Mortgage Monday', 'First-Timer Mistake', 'Homebuyer Checklist'],
      tone: 'Calm, reassuring, data-driven. Never creates artificial urgency.',
      differentiator: 'Zero realtor pitch. Interactive visual breakdowns of amortization and hidden costs.',
      requiredDisclaimer:
        'For educational purposes only. Not a licensed mortgage broker, real estate agent, or lender.',
      ymylRisk: 'high',
    },
    cadence: {
      longVideosPerWeek: 1,
      shortsPerWeek: 2,
      publishTimesUtc: { youtube: '16:00' },
    },
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z',
  },
  {
    id: 'brand-covered-simply',
    name: 'Covered Simply',
    slug: 'covered-simply',
    niche: 'insurance explained for US families',
    active: false,
    paused: true,
    voiceId: 'kokoro-af-nicole',
    colors: {
      primary: '#4F46E5',
      secondary: '#1E1B4B',
      accent: '#06B6D4',
      background: '#EEF2FF',
      text: '#1E1B4B',
    },
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter',
    },
    motionStyle: 'clean_minimal',
    profile: {
      targetViewer: 'US families navigating complex health, life, auto, and home insurance choices.',
      problemSolved: 'Insurance policies are intentionally obscure; families are either over-paying or under-covered.',
      promise: 'Insurance explained so clearly that you know exactly what you need and what you pay for.',
      contentPillars: [
        'Do I need this? coverage explainers (Term Life vs Whole Life, Collision vs Comprehensive)',
        'How to compare insurance quotes without getting spammed',
        'The exact claims process roadmap when accidents occur',
        'Fine print clauses that deny legitimate claims',
      ],
      recurringSeries: ['Coverage Check', 'Claim or No Claim?', 'Fine Print Friday'],
      tone: 'Patient, empathetic, objective. Like a trusted consumer advocate.',
      differentiator: 'Does not sell insurance. Visual side-by-side policy teardowns.',
      requiredDisclaimer:
        'Educational analysis only. Not an insurance broker or underwriter. Consult your policy documentation.',
      ymylRisk: 'high',
    },
    cadence: {
      longVideosPerWeek: 1,
      shortsPerWeek: 2,
      publishTimesUtc: { youtube: '17:00' },
    },
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z',
  },
  {
    id: 'brand-law-in-plain-words',
    name: 'Law in Plain Words',
    slug: 'law-in-plain-words',
    niche: 'common legal situations explained for ordinary Americans',
    active: false,
    paused: true,
    voiceId: 'kokoro-am-george',
    colors: {
      primary: '#B45309',
      secondary: '#451A03',
      accent: '#2563EB',
      background: '#FFFBEB',
      text: '#451A03',
    },
    fonts: {
      heading: 'Newsreader',
      body: 'Inter',
    },
    motionStyle: 'editorial',
    profile: {
      targetViewer: 'Ordinary Americans facing everyday legal queries (tenancy, small claims, workplace disputes).',
      problemSolved: 'Legal jargon is alienating and standard legal consultations are out of reach for small matters.',
      promise: 'Common legal situations explained in words you actually understand.',
      contentPillars: [
        'Know-your-rights breakdowns (tenancy rights, security deposits, consumer protection)',
        'What happens if... scenarios (small claims procedures, demand letters)',
        'DIY legal steps you can handle without expensive retainers',
        'When you absolutely MUST hire an attorney',
      ],
      recurringSeries: ['Rights You Did Not Know You Had', 'Legal or Not?', 'Small Claims 101'],
      tone: 'Clear, authoritative, measured, calm.',
      differentiator: 'Decision-tree animated diagrams showing legal flowcharts with strict jurisdiction caveats.',
      requiredDisclaimer:
        'This content provides legal education and general information, NOT legal advice. Laws vary by state. No attorney-client relationship is formed.',
      ymylRisk: 'very_high',
    },
    cadence: {
      longVideosPerWeek: 1,
      shortsPerWeek: 2,
      publishTimesUtc: { youtube: '16:00' },
    },
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z',
  },
];

export const RENDER_PROFILES: Record<string, RenderProfile> = {
  long_landscape: {
    id: 'profile-long-landscape',
    name: '16:9 Landscape Full HD',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    fps: 30,
    maxDurationSec: 900, // 15 mins
    safeZones: {
      top: 80,
      bottom: 120,
      left: 100,
      right: 100,
    },
  },
  short_portrait: {
    id: 'profile-short-portrait',
    name: '9:16 Vertical Short Full HD',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 60,
    safeZones: {
      top: 220, // avoid platform UI icons
      bottom: 340, // avoid caption and audio pill
      left: 70,
      right: 140, // avoid right side action buttons
    },
  },
};
