import { uuid } from "@/utils/uuid";
import { formatRelativeTime } from "@/utils/date";
import type { PromptCategory } from "@/types/domain";
import type { PromptTemplate } from "./types";

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

/**
 * Canonical seed prompts for all 6 categories + subcategories.
 * Each template is a fully-formed reference prompt with variables in {{VAR}} form.
 * Phase 5 ships this as read-only data. Phase 6/7 will make them AI-editable.
 */
export const SEED_PROMPTS: PromptTemplate[] = [
  // ---- PERSONAL ----
  {
    id: uuid(),
    category: "personal",
    subcategory: "My Snippets",
    title: "Daily journaling prompt",
    description: "Structured daily reflection with gratitude, wins, and blockers.",
    referencePrompt:
      "Act as my daily journal coach. Each morning, prompt me with:\n1. One thing I'm grateful for\n2. My top 3 priorities for today\n3. One potential blocker and how I'll handle it\n\nEach evening, prompt me with:\n1. What did I accomplish?\n2. What challenged me?\n3. What would I do differently?",
    tags: ["journaling", "reflection", "daily", "gratitude"],
    favorite: true,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: uuid(),
    category: "personal",
    subcategory: "My Snippets",
    title: "Weekly review template",
    description: "End-of-week retrospective with metrics and next-week planning.",
    referencePrompt:
      "Guide me through a structured weekly review:\n- Accomplishments (quantified where possible)\n- Metrics / KPIs tracked\n- Energy drains vs. energy gains\n- Decisions made and their outcomes\n- 3 priorities for next week\n- One experiment to run",
    tags: ["review", "planning", "metrics", "weekly"],
    favorite: false,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
  },
  {
    id: uuid(),
    category: "personal",
    subcategory: "Favorites",
    title: "Habit formation coach",
    description: "Build sustainable habits using cue-routine-reward loop.",
    referencePrompt:
      "You are a habit formation coach using the cue-routine-reward framework. For my goal of {{GOAL}}:\n1. Identify a specific cue (time, location, preceding action)\n2. Design a 2-minute starter routine\n3. Define an immediate reward\n4. Plan for missed days (implementation intention)\n5. Set a 30-day tracking method\n\nGoal: {{GOAL}}",
    tags: ["habits", "behavior", "coaching"],
    favorite: true,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    id: uuid(),
    category: "personal",
    subcategory: "Drafts",
    title: "Decision journal entry",
    description: "Record decisions with reasoning for later calibration.",
    referencePrompt:
      "Log this decision for future calibration:\n- Decision: {{DECISION}}\n- Context & constraints\n- Alternatives considered\n- Reasoning & confidence level (1-10)\n- Expected outcome & timeline\n- Review date: {{REVIEW_DATE}}",
    tags: ["decisions", "journaling", "calibration"],
    favorite: false,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(15),
  },

  // ---- PROGRAMMING ----
  {
    id: uuid(),
    category: "programming",
    subcategory: "Debugging",
    title: "Systematic debugging assistant",
    description: "Step-by-step debugging framework for any codebase.",
    referencePrompt:
      "You are a senior debugging partner. Given an error, symptom, or failing test:\n1. Reproduce: ask for minimal reproduction steps\n2. Hypothesize: list 3 most likely root causes with reasoning\n3. Instrument: suggest specific logging / breakpoints to validate\n4. Isolate: binary-search the change that introduced regression\n5. Fix & verify: propose minimal fix + test to prevent recurrence\n\nAlways ask clarifying questions before proposing fixes.",
    tags: ["debugging", "systematic", "pair-programming"],
    favorite: true,
    createdAt: daysAgo(1),
    updatedAt: now.toISOString(),
  },
  {
    id: uuid(),
    category: "programming",
    subcategory: "Debugging",
    title: "Production incident investigator",
    description: "Post-mortem style debugging for live issues.",
    referencePrompt:
      "You are an incident commander. Given a production alert:\n1. User-visible impact (scope, severity)\n2. Recent deployments / config changes (last 4h)\n3. Dependency health (databases, queues, 3rd parties)\n4. Leading hypothesis + verification query\n5. Mitigation steps (rollback, feature flag, scale) + rollback plan\n6. Stakeholder communication template\n\nOutput a runbook-style checklist.",
    tags: ["production", "incident", "on-call", "runbook"],
    favorite: true,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
  },
  {
    id: uuid(),
    category: "programming",
    subcategory: "Refactoring",
    title: "Strangler Fig migration planner",
    description: "Plan incremental legacy → modern migrations.",
    referencePrompt:
      "Design a Strangler Fig migration plan for: {{LEGACY_SYSTEM}}\n\nDeliver:\n1. Domain boundary map (what to extract first)\n2. Proxy / facade layer design\n3. Data synchronization strategy\n4. Feature flag rollout sequence\n5. Rollback criteria per phase\n6. Team ownership & timeline estimate\n\nPrioritize low-risk, high-value extractions first.",
    tags: ["refactoring", "legacy", "migration", "architecture"],
    favorite: false,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(5),
  },
  {
    id: uuid(),
    category: "programming",
    subcategory: "Refactoring",
    title: "Extract service boundary",
    description: "Define clean service boundaries from a monolith module.",
    referencePrompt:
      "Given this monolith module: {{MODULE_DESCRIPTION}}\n\nPropose a service extraction plan:\n- Bounded context name & responsibilities\n- API contract (REST/gRPC) with schemas\n- Data ownership & migration strategy\n- Shared library vs. duplication tradeoffs\n- Observability requirements (traces, metrics, logs)\n- Deployment topology",
    tags: ["microservices", "boundaries", "architecture"],
    favorite: false,
    createdAt: daysAgo(21),
    updatedAt: daysAgo(10),
  },
  {
    id: uuid(),
    category: "programming",
    subcategory: "New Features",
    title: "Feature spec → implementation plan",
    description: "Turn a product spec into a technical implementation plan.",
    referencePrompt:
      "You are a tech lead. Given this feature spec: {{SPEC}}\n\nProduce an implementation plan:\n1. API design (endpoints, contracts, error model)\n2. Data model changes (migrations, indexes)\n3. Component breakdown (frontend + backend)\n4. Integration points & contracts\n5. Test strategy (unit, integration, e2e)\n6. Rollout plan (feature flags, canary, rollback)\n7. Effort estimate with confidence intervals",
    tags: ["planning", "spec", "tech-lead"],
    favorite: true,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: uuid(),
    category: "programming",
    subcategory: "Code Review",
    title: "Senior code reviewer persona",
    description: "Review PRs with focus on correctness, maintainability, security.",
    referencePrompt:
      "Review this PR as a senior engineer. Check:\n- Correctness: solves the stated problem?\n- Edge cases: nulls, empty arrays, concurrency, timeouts\n- Security: injection, authz, secrets, PII\n- Maintainability: naming, coupling, testability\n- Performance: N+1, allocations, caching opportunities\n- Tests: coverage of new logic, contract tests\n\nOutput: categorized comments (blocking / suggestion / nit) with code snippets.",
    tags: ["code-review", "senior", "security", "performance"],
    favorite: true,
    createdAt: daysAgo(2),
    updatedAt: now.toISOString(),
  },

  // ---- BUSINESS ----
  {
    id: uuid(),
    category: "business",
    subcategory: "Strategy",
    title: "OKR drafting assistant",
    description: "Write measurable Objectives and Key Results.",
    referencePrompt:
      "Help me draft OKRs for {{TEAM}} in {{QUARTER}}.\n\nContext: {{CONTEXT}}\n\nFor each Objective, give me:\n- 3-5 Key Results (measurable, time-bound)\n- Leading vs. lagging indicator mix\n- Confidence score (1-10)\n- Dependencies & risks\n- Owner assignment",
    tags: ["okr", "strategy", "planning", "kpi"],
    favorite: true,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(7),
  },
  {
    id: uuid(),
    category: "business",
    subcategory: "Email",
    title: "Executive update email",
    description: "Concise, high-signal updates for leadership.",
    referencePrompt:
      "Write an executive update email for {{TOPIC}}.\n\nAudience: {{AUDIENCE}}\nKey message: {{KEY_MESSAGE}}\n\nStructure:\n- BLUF (Bottom Line Up Front) — 1 sentence\n- What happened (3 bullets max)\n- Impact & metrics\n- Decisions needed / asks\n- Next steps & timeline\n\nTone: professional, concise, action-oriented. Under 200 words.",
    tags: ["email", "executive", "communication", "updates"],
    favorite: false,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
  },
  {
    id: uuid(),
    category: "business",
    subcategory: "Reports",
    title: "Monthly business review deck outline",
    description: "Structure for a metrics-driven monthly review.",
    referencePrompt:
      "Create a Monthly Business Review deck outline for {{MONTH}} {{YEAR}}.\n\nSections:\n1. Executive summary (3 bullets)\n2. North star metric trend + drivers\n3. Department scorecards (sales, product, eng, ops)\n4. Top 3 risks & mitigations\n5. Strategic initiatives progress\n6. Resource asks / decisions needed\n\nEach slide: title, key metric, insight, action.",
    tags: ["reports", "review", "metrics", "deck"],
    favorite: false,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(30),
  },
  {
    id: uuid(),
    category: "business",
    subcategory: "Planning",
    title: "Quarterly planning workshop facilitator",
    description: "Run a structured quarterly planning session.",
    referencePrompt:
      "Facilitate a quarterly planning workshop for {{TEAM}}.\n\nAgenda:\n1. Retro: What worked / didn't last quarter (15m)\n2. Strategy alignment: company OKRs → team OKRs (20m)\n3. Ideation: big bets & quick wins (30m)\n4. Prioritization: RICE / ICE scoring (20m)\n5. Commitment: draft OKRs + owners (15m)\n6. Risks & dependencies (10m)\n\nOutput: shared doc with prioritized initiatives + owners.",
    tags: ["planning", "workshop", "facilitation", "okr"],
    favorite: false,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(45),
  },

  // ---- WRITING ----
  {
    id: uuid(),
    category: "writing",
    subcategory: "Drafting",
    title: "Technical blog post structure",
    description: "Outline → draft → polish workflow for dev articles.",
    referencePrompt:
      "Write a technical blog post about {{TOPIC}}.\n\nTarget audience: {{AUDIENCE}}\n\nStructure:\n1. Hook: why this matters (1 paragraph)\n2. Context: what reader needs to know first\n3. Solution: step-by-step with code snippets\n4. Tradeoffs / gotchas\n5. Related patterns / further reading\n6. TL;DR summary\n\nTone: practical, code-first, humble. ~1500 words.",
    tags: ["blogging", "technical-writing", "content"],
    favorite: true,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(3),
  },
  {
    id: uuid(),
    category: "writing",
    subcategory: "Editing",
    title: "Clarity & concision editor",
    description: "Tighten prose without losing nuance.",
    referencePrompt:
      "Edit this text for clarity and concision:\n\n{{TEXT}}\n\nRules:\n- Prefer active voice\n- Cut filler words (actually, basically, really)\n- One idea per sentence\n- Replace jargon with plain English\n- Preserve technical accuracy\n\nReturn: edited version + 3-sentence summary of changes.",
    tags: ["editing", "clarity", "conciseness"],
    favorite: true,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(6),
  },
  {
    id: uuid(),
    category: "writing",
    subcategory: "Summarizing",
    title: "Executive summary generator",
    description: "Condense long docs into decision-ready summaries.",
    referencePrompt:
      "Summarize this document for an executive audience:\n\n{{DOCUMENT}}\n\nOutput:\n- BLUF (Bottom Line Up Front) — 1 sentence\n- 3 key takeaways (bulleted)\n- Metrics / numbers that matter\n- Decisions / actions required\n- Risks / open questions\n\nMax 200 words. No fluff.",
    tags: ["summarizing", "executive", "decision-making"],
    favorite: false,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(10),
  },
  {
    id: uuid(),
    category: "writing",
    subcategory: "Outlining",
    title: "Workshop agenda designer",
    description: "Create time-boxed agendas with clear outcomes.",
    referencePrompt:
      "Design a workshop agenda for: {{TOPIC}}\n\nDuration: {{DURATION}}\nParticipants: {{PARTICIPANTS}}\nDesired outcome: {{OUTCOME}}\n\nFormat:\n- Time-boxed blocks with purpose\n- Facilitation technique per block\n- Pre-work for participants\n- Materials needed\n- Decision points marked\n- Parking lot for off-topic items",
    tags: ["outlining", "workshop", "facilitation", "agenda"],
    favorite: false,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(18),
  },

  // ---- EDUCATION ----
  {
    id: uuid(),
    category: "education",
    subcategory: "Tutoring",
    title: "Feynman technique tutor",
    description: "Learn by teaching — explain simply, find gaps.",
    referencePrompt:
      "You are a Feynman technique tutor for {{TOPIC}}.\n\nProcess:\n1. Ask me to explain {{TOPIC}} in plain English\n2. Identify gaps / hand-waving\n3. Provide the missing piece with an analogy\n4. Have me re-explain incorporating the fix\n5. Repeat until I can teach it to a 5-year-old\n\nStart by asking for my current explanation.",
    tags: ["tutoring", "feynman", "learning", "explanation"],
    favorite: true,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    id: uuid(),
    category: "education",
    subcategory: "Summaries",
    title: "Paper / article summarizer",
    description: "Extract key claims, evidence, and limitations.",
    referencePrompt:
      "Summarize this research paper / article:\n\n{{TEXT}}\n\nExtract:\n- Core claim (1 sentence)\n- Methodology (2-3 bullets)\n- Key findings with numbers\n- Limitations acknowledged by authors\n- Implications for practice\n- Questions I should ask\n\nFormat as a structured brief for a practitioner.",
    tags: ["summaries", "research", "papers", "evidence"],
    favorite: false,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(8),
  },
  {
    id: uuid(),
    category: "education",
    subcategory: "Flashcards",
    title: "Anki card generator",
    description: "Turn concepts into cloze / basic / reverse cards.",
    referencePrompt:
      "Generate Anki cards for: {{TOPIC}}\n\nCreate 3 card types per concept:\n1. Basic: Q: {{Question}} A: {{Answer}}\n2. Cloze: {{Sentence with {{c1::keyword}}}}\n3. Reverse: Q: {{Answer}} A: {{Question}}\n\nOutput as CSV: Front, Back, Tags, CardType\nTarget: 20 cards covering fundamentals to advanced.",
    tags: ["flashcards", "anki", "spaced-repetition", "memorization"],
    favorite: false,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(20),
  },
  {
    id: uuid(),
    category: "education",
    subcategory: "Explanations",
    title: "Analogy-based explainer",
    description: "Explain complex topics using familiar analogies.",
    referencePrompt:
      "Explain {{TOPIC}} using an analogy from {{DOMAIN}} (e.g., cooking, sports, city planning).\n\nStructure:\n1. The core concept in one sentence\n2. The analogy mapping (concept → domain element)\n3. Walkthrough of the analogy\n4. Where the analogy breaks down\n5. Technical reality check\n\nTone: engaging, precise, not oversimplified.",
    tags: ["explanations", "analogies", "teaching"],
    favorite: true,
    createdAt: daysAgo(18),
    updatedAt: daysAgo(9),
  },

  // ---- AI SPECIFIC ----
  {
    id: uuid(),
    category: "ai-specific",
    subcategory: "Chain-of-Thought",
    title: "Zero-shot CoT reasoner",
    description: "Force step-by-step reasoning before answering.",
    referencePrompt:
      "{{QUESTION}}\n\nLet's think step by step.\n\n1. Restate the problem in your own words\n2. Identify key variables and constraints\n3. Break into sub-problems\n4. Solve each sub-problem\n5. Synthesize final answer\n6. Verify: does this make sense?",
    tags: ["chain-of-thought", "reasoning", "zero-shot", "cot"],
    favorite: true,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    id: uuid(),
    category: "ai-specific",
    subcategory: "Roleplay",
    title: "Adversarial red-teamer",
    description: "Stress-test prompts and model outputs.",
    referencePrompt:
      "You are a red-teamer. Given this prompt: {{PROMPT}}\n\nGenerate 10 adversarial inputs designed to:\n- Elicit harmful / biased / incorrect outputs\n- Bypass safety controls\n- Expose hallucination tendencies\n- Test edge cases & distributional shift\n\nFor each, explain the attack vector and expected failure mode.",
    tags: ["red-teaming", "safety", "adversarial", "testing"],
    favorite: true,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
  },
  {
    id: uuid(),
    category: "ai-specific",
    subcategory: "Metaprompts",
    title: "Prompt optimizer (metaprompt)",
    description: "Improve a prompt using prompt engineering best practices.",
    referencePrompt:
      "Optimize this prompt using best practices:\n\n{{ORIGINAL_PROMPT}}\n\nApply:\n- Clear role & context\n- Explicit constraints & format\n- Few-shot examples (add 2-3)\n- Chain-of-thought trigger\n- Negative constraints (what NOT to do)\n- Output format specification\n\nReturn: optimized prompt + changelog of improvements.",
    tags: ["metaprompt", "optimization", "prompt-engineering"],
    favorite: true,
    createdAt: daysAgo(2),
    updatedAt: now.toISOString(),
  },
  {
    id: uuid(),
    category: "ai-specific",
    subcategory: "Routing",
    title: "Intent classifier → specialist router",
    description: "Classify user intent and route to specialized sub-prompts.",
    referencePrompt:
      "Classify the user's intent and route:\n\n{{USER_INPUT}}\n\nIntents:\n- coding: route to {{CODING_PROMPT}}\n- writing: route to {{WRITING_PROMPT}}\n- analysis: route to {{ANALYSIS_PROMPT}}\n- creative: route to {{CREATIVE_PROMPT}}\n- question: route to {{QA_PROMPT}}\n\nOutput: { intent, confidence, routed_prompt }",
    tags: ["routing", "intent-classification", "multi-agent", "orchestration"],
    favorite: false,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(6),
  },
];