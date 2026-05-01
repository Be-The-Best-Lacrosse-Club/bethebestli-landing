import type { Gender } from "@/types"
import type { FieldDiagramSpec } from "@/components/academy/FieldDiagram"

// ─── TYPES ────────────────────────────────────────────────────────────

export type AgeTier = "youth" | "middle" | "high"
export type Pillar = "game" | "leadership" | "team"

export type QuizQuestionKind = "knowledge" | "scenario"

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  kind?: QuizQuestionKind
  scenario?: string // extra context for scenario questions
}

export interface AcademyLesson {
  id: string
  lessonNumber: number
  title: string
  topic: "Fundamentals" | "Lacrosse IQ" | "Mental Game" | "Character"
  pillar: Pillar
  description: string
  videoUrl?: string
  diagrams?: FieldDiagramSpec[]
  keyTakeaways?: string[]
  questions: QuizQuestion[]
}

export interface AcademyCourse {
  id: string
  tier: AgeTier
  tierLabel: string
  ageRange: string
  gradYears: string
  description: string
  gender: Gender
  lessons: AcademyLesson[]
}

export interface WallOfFameEntry {
  name: string
  gender: "boys" | "girls"
  tier: AgeTier
  completedAt: string
}

// ─── PILLAR CONFIG ───────────────────────────────────────────────────

export const PILLAR_CONFIG: Record<Pillar, { label: string; description: string }> = {
  game: { label: "The Game", description: "Learn fundamentals, positions, strategy, and how to play at the next level." },
  leadership: { label: "Leadership", description: "Develop the habits, mindset, and character that set leaders apart." },
  team: { label: "Team", description: "Understand what makes teams win — trust, sacrifice, and competing together." },
}

export const PILLAR_ORDER: Pillar[] = ["game", "leadership", "team"]

// ─── WALL OF FAME ─────────────────────────────────────────────────────

const WOF_KEY = "btb-wall-of-fame"

const SEED_WALL: WallOfFameEntry[] = [
  { name: "Jake Morrison", gender: "boys", tier: "middle", completedAt: "2026-02-22" },
  { name: "Sophia Marino", gender: "girls", tier: "youth", completedAt: "2026-03-03" },
  { name: "Liam O'Brien", gender: "boys", tier: "high", completedAt: "2026-03-10" },
  { name: "Ava Rodriguez", gender: "girls", tier: "middle", completedAt: "2026-03-14" },
]

export function getWallOfFame(): WallOfFameEntry[] {
  try {
    const raw = localStorage.getItem(WOF_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(WOF_KEY, JSON.stringify(SEED_WALL))
    return SEED_WALL
  } catch {
    return SEED_WALL
  }
}

export function addToWallOfFame(name: string, gender: Gender, tier: AgeTier): WallOfFameEntry[] {
  const entries = getWallOfFame()
  const entry: WallOfFameEntry = {
    name,
    gender,
    tier,
    completedAt: new Date().toISOString().split("T")[0],
  }
  const updated = [...entries, entry]
  localStorage.setItem(WOF_KEY, JSON.stringify(updated))
  return updated
}

// ─── PROGRESS TRACKING ────────────────────────────────────────────────

const PROGRESS_KEY = "btb-academy-progress"

interface AcademyProgress {
  [courseId: string]: {
    completedLessons: string[]
    completedAt?: string
  }
}

export function getAcademyProgress(): AcademyProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function markLessonComplete(courseId: string, lessonId: string): void {
  const progress = getAcademyProgress()
  if (!progress[courseId]) {
    progress[courseId] = { completedLessons: [] }
  }
  if (!progress[courseId].completedLessons.includes(lessonId)) {
    progress[courseId].completedLessons.push(lessonId)
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function markCourseComplete(courseId: string): void {
  const progress = getAcademyProgress()
  if (!progress[courseId]) {
    progress[courseId] = { completedLessons: [] }
  }
  progress[courseId].completedAt = new Date().toISOString().split("T")[0]
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

// ─── COURSE DATA ──────────────────────────────────────────────────────

const TIERS: { tier: AgeTier; label: string; ageRange: string; gradYears: string }[] = [
  { tier: "youth", label: "Youth", ageRange: "Ages 8–10", gradYears: "Grad Years 2034–2036" },
  { tier: "middle", label: "Middle School", ageRange: "Ages 11–13", gradYears: "Grad Years 2031–2033" },
  { tier: "high", label: "High School", ageRange: "Ages 14–17", gradYears: "Grad Years 2027–2030" },
]

// ─── BOYS LESSONS ─────────────────────────────────────────────────────

const BOYS_YOUTH_LESSONS: AcademyLesson[] = [
  {
    id: "boys-youth-l1",
    videoUrl: "https://www.youtube.com/watch?v=qXhkg0wEKDY",
    lessonNumber: 1,
    title: "Welcome to Lacrosse",
    topic: "Fundamentals",
    pillar: "game",
    description: `Lacrosse is the fastest game on two feet, and it's been called the "Creator's Game" because of its Native American origins. The sport combines elements of soccer, hockey, and basketball into one fast-paced game.\n\nYou play with a stick called a "crosse" that has a head and a pocket. You use it to catch, carry, and throw a small rubber ball. The goal is simple: put the ball in the other team's net.\n\nIn boys lacrosse, you wear a helmet, gloves, and pads because the game is physical. You can check sticks and bodies (when you're old enough). Each team has 10 players on the field — 3 attackmen, 3 midfielders, 3 defensemen, and 1 goalie.\n\nThe game is played in 4 quarters. The team with the most goals at the end wins. You can score from anywhere on the field, but most goals come from up close to the net.\n\nLacrosse rewards effort. The kids who hustle, who chase ground balls, and who work hard in practice are the ones who get better fastest. Skill takes time — but effort is a choice you make every day.`,
    questions: [
      {
      question: "How many players from each team are on the field?",
      options: [
        "8",
        "9",
        "10",
        "11"
      ],
      correctAnswer: 2,
      explanation: "10 players: 3 attack, 3 midfield, 3 defense, 1 goalie.",
    },
      {
      question: "What is the lacrosse stick called?",
      options: [
        "A shaft",
        "A racket",
        "A crosse",
        "A pole"
      ],
      correctAnswer: 2,
      explanation: "The stick is a 'crosse' — that's where the sport gets its name.",
    },
      {
      question: "Which group of players run both offense and defense?",
      options: [
        "Attackmen",
        "Midfielders",
        "Defensemen",
        "Goalies"
      ],
      correctAnswer: 1,
      explanation: "Midfielders cover the whole field. Attack stays low, defense stays back.",
    },
      {
      question: "How long does a typical youth lacrosse game last?",
      options: [
        "1 quarter",
        "2 quarters",
        "3 quarters",
        "4 quarters"
      ],
      correctAnswer: 3,
      explanation: "Lacrosse is played in 4 quarters. Highest score at the end wins.",
    },
      {
      question: "It's tryouts. Coach is watching from the sideline. Two players are equally skilled. What separates one from the other in the coach's notebook?",
      options: [
        "Newer stick and gear",
        "Hustles to every ground ball",
        "Shoots the hardest",
        "Talks the most"
      ],
      correctAnswer: 1,
      explanation: "Effort is a choice anyone can make — and it's what coaches notice first when skill is tied.",
      kind: "scenario",
      scenario: "Tryout day. Coach has 30 spots and 45 kids. He's watching how players move when they don't have the ball as much as when they do.",
    },
    ],
    keyTakeaways: [
      "Lacrosse is the fastest game on two feet — called the Creator's Game (Native American origins).",
      "Boys field 10: 3 attack, 3 midfield, 3 defense, 1 goalie. 4 quarters, most goals wins.",
      "You play with a crosse — a stick with a head and pocket for catching, carrying, throwing.",
      "Skill takes years. Effort is the choice you make every day — and it's what coaches notice first.",
    ],
    diagrams: [
      {
        title: "Boys Lacrosse — Where Everyone Plays",
        view: "men-full",
        caption: "Three attackmen (red circles) stay on the offensive end. Three middies (yellow) run the whole field. Three defensemen (blue squares) and the goalie (green) stay back to defend.",
        players: [
          {
            x: 30,
            y: 80,
            role: "attack",
            label: "A"
          },
          {
            x: 50,
            y: 88,
            role: "attack",
            label: "A"
          },
          {
            x: 70,
            y: 80,
            role: "attack",
            label: "A"
          },
          {
            x: 30,
            y: 60,
            role: "midfield",
            label: "M"
          },
          {
            x: 50,
            y: 60,
            role: "midfield",
            label: "M"
          },
          {
            x: 70,
            y: 60,
            role: "midfield",
            label: "M"
          },
          {
            x: 30,
            y: 40,
            role: "defense",
            label: "D"
          },
          {
            x: 50,
            y: 40,
            role: "defense",
            label: "D"
          },
          {
            x: 70,
            y: 40,
            role: "defense",
            label: "D"
          },
          {
            x: 50,
            y: 18,
            role: "goalie",
            label: "G"
          },
        ],
        legend: [
          {
            label: "Attack",
            color: "#D22630",
            shape: "circle"
          },
          {
            label: "Midfield",
            color: "#EAB308",
            shape: "circle"
          },
          {
            label: "Defense",
            color: "#2563EB",
            shape: "square"
          },
          {
            label: "Goalie",
            color: "#10B981",
            shape: "square"
          },
        ]
      },
    ],
  },
  {
    id: "boys-youth-l2",
    videoUrl: "https://www.youtube.com/watch?v=a4fWOtC8C7Q",
    lessonNumber: 2,
    title: "How to Hold and Cradle Your Stick",
    topic: "Fundamentals",
    pillar: "game",
    description: `Cradling is how you keep the ball in your stick while you run. If you can't cradle, the ball falls out — it's that simple. This is the foundation of every lacrosse skill.\n\nHOW TO CRADLE — STEP BY STEP\n\n1. Grip the Stick\nTop hand near the head of the stick, bottom hand near the butt end. Top hand grips firmly — it does most of the work. Bottom hand grips loosely — it's just a guide.\n\n2. The Motion\nThe cradle is a small wrist roll — like turning a doorknob back and forth. Don't swing your whole arm. Keep the motion tight and controlled. The ball stays in the pocket because of centripetal force (the spinning motion keeps it pressed to the side).\n\n3. Stick Protection Position\nWhen running, keep your top hand near your ear and the stick close to your body. This is called "stick protection position." It makes it much harder for defenders to throw checks and knock the ball out.\n\n4. Switching Hands\nTo switch: loosen your bottom hand, move the stick across your body, slide your bottom hand up, release your top hand and regrip. Your old bottom hand becomes your new top hand. Start learning this early! The more comfortable you are in both hands, the better player you'll be.\n\n5. Cradling While Running\nAs you get faster, the cradle has to get tighter. Don't let the stick bounce around. Smooth, controlled, close to your body. Practice running at full speed while cradling — it should feel natural.\n\nCOACHING POINTS\n- Practice cradling everywhere — walking around the house, watching TV, in the backyard\n- If you cradle too fast, the ball pops out. If you cradle too slow, it falls out. Find the rhythm.\n- The best players in the world cradle without thinking about it. That only comes from reps.`,
    questions: [
      {
      question: "Which hand controls the cradle?",
      options: [
        "Bottom hand — it grips harder",
        "Top hand — near the head of the stick",
        "Both hands work equally",
        "Neither — it's all elbow"
      ],
      correctAnswer: 1,
      explanation: "Top hand near the head does the cradling. Bottom hand is a loose guide.",
    },
      {
      question: "What kind of motion is a cradle?",
      options: [
        "A full arm swing forward",
        "A wrist roll like turning a doorknob",
        "A snapping shoulder rotation",
        "A bouncing stick movement"
      ],
      correctAnswer: 1,
      explanation: "Cradling is small wrist motion. Big arm motion drops the ball.",
    },
      {
      question: "What is 'stick protection position'?",
      options: [
        "Stick low and away from your body",
        "Stick across your chest, head down",
        "Top hand near ear, stick close to body",
        "Stick parallel to the ground sideways"
      ],
      correctAnswer: 2,
      explanation: "Top hand near your ear with the stick tight to your body makes it hard to check.",
    },
      {
      question: "Where should you practice cradling?",
      options: [
        "Only on a lacrosse field",
        "Only with a coach watching",
        "Anywhere — backyard, driveway, around the house",
        "Only at scheduled practices"
      ],
      correctAnswer: 2,
      explanation: "Reps build muscle memory. The best cradlers practice constantly, not just at practice.",
    },
      {
      question: "You're running up the wing on a fast break. A defender closes in from your stick side. What do you do with your stick?",
      options: [
        "Drop it lower for a quicker shot",
        "Switch to your weak hand mid-stride",
        "Bring top hand to your ear, body between you and the D",
        "Hold the stick parallel to the ground"
      ],
      correctAnswer: 2,
      explanation: "Stick protection — top hand near ear, body shielding — keeps the ball away from the defender's check.",
      kind: "scenario",
      scenario: "3rd quarter, you've got a step on the defender on your right. He's closing fast. The shot is 5 yards away.",
    },
    ],
    keyTakeaways: [
      "Top hand near the head, bottom near the butt-end. Top hand does the work; bottom guides.",
      "Cradle = small wrist roll, like turning a doorknob. Centripetal force keeps the ball in.",
      "Stick protection: top hand near your ear, body shielding the stick from the defender.",
      "Practice cradling everywhere — walking around the house counts. Reps until it's automatic.",
    ],
    diagrams: [
      {
        title: "Stick Protection While Cradling",
        view: "men-half-offensive",
        caption: "Top hand near your ear, body between defender and stick. Wrist-rolls keep the ball in — small, controlled motion. Don't swing your whole arm.",
        players: [
          {
            x: 50,
            y: 55,
            role: "offense",
            label: "1",
            ball: true,
            highlight: true
          },
          {
            x: 38,
            y: 60,
            role: "defender",
            label: "D"
          },
        ],
        labels: [
          {
            x: 60,
            y: 48,
            text: "Stick high, near ear",
            size: "xs"
          },
          {
            x: 50,
            y: 75,
            text: "Body shields stick",
            size: "xs"
          },
        ],
        legend: [
          {
            label: "Offense (with ball)",
            color: "#D22630",
            shape: "circle"
          },
          {
            label: "Defender",
            color: "#2563EB",
            shape: "square"
          },
        ]
      },
    ],
  },
  {
    id: "boys-youth-l3",
    videoUrl: "https://www.youtube.com/watch?v=4iOD3TjV6D8",
    lessonNumber: 3,
    title: "Catching and Throwing",
    topic: "Fundamentals",
    pillar: "game",
    description: `Catching and throwing — also called "passing and receiving" — is the most important skill in lacrosse. If you can catch and throw, you can play. If you can't, the game gets very hard very fast.\n\nHOW TO THROW — STEP BY STEP\n\n1. Grip and Position\nTop hand near the head, bottom hand near the butt end. Bring the stick back behind your ear.\n\n2. Step Toward Your Target\nStep with your opposite foot (right-handed throw = step with left foot). This is the same as throwing a baseball.\n\n3. Snap and Follow Through\nPoint your top hand toward your target. Snap your wrist as you release — the stick does the work, not your arm. Follow through so the stick finishes pointing at your target.\n\nHOW TO CATCH — STEP BY STEP\n\n1. Give a Soft Target\nHold your stick out with the pocket facing the passer. This tells your teammate exactly where to throw.\n\n2. Absorb the Ball\nAs the ball arrives, "give" with your stick — pull it slightly back and down. This cushions the catch. If you keep the stick stiff (called "stabbing"), the ball bounces right out.\n\n3. Catch and Cradle\nThe second you catch, start cradling. It should be one fluid motion — catch, cradle, go.\n\nWALL BALL — THE SECRET TO EVERYTHING\nFind a wall. Throw the ball against it. Catch it as it comes back. Repeat. Do it with both hands.\n- Start with 25 per hand per day\n- Work up to 50, then 100\n- The pros do thousands\n- This is the single best thing you can do to improve your stick skills\n\nCOACHING POINTS\n- Soft hands, not stiff hands — absorb the ball on every catch\n- Always practice both hands, even if your off-hand feels terrible\n- Wall ball every single day. No excuses. This is how you get better.`,
    questions: [
      {
      question: "When you throw with your right hand on top, which foot steps forward?",
      options: [
        "Right foot",
        "Left foot",
        "Either foot",
        "Both feet jump together"
      ],
      correctAnswer: 1,
      explanation: "Step with the opposite foot — same as throwing a baseball.",
    },
      {
      question: "What does 'absorbing the ball' mean when catching?",
      options: [
        "Stab the stick at the ball quickly",
        "Hold the stick rigid as ball arrives",
        "Pull stick back slightly to cushion the catch",
        "Catch with the back of the head"
      ],
      correctAnswer: 2,
      explanation: "Soft hands give as the ball arrives — that's what keeps it in the pocket.",
    },
      {
      question: "What is wall ball?",
      options: [
        "A team game with two goalies",
        "Throwing and catching against a wall solo",
        "A drill only goalies use",
        "A shooting drill without a target"
      ],
      correctAnswer: 1,
      explanation: "Wall ball is the gold-standard solo drill — throw, catch, repeat. Both hands.",
    },
      {
      question: "What's the minimum daily wall-ball reps to start improving fast?",
      options: [
        "10 per hand",
        "25 per hand",
        "Whenever you feel like it",
        "Only on practice days"
      ],
      correctAnswer: 1,
      explanation: "Start at 25 per hand and build to 100. The pros do thousands. Daily reps = fast progress.",
    },
      {
      question: "Your friend is 8 yards away calling for a pass. You're running. Your stick is in your right hand. They're on your left. What do you do?",
      options: [
        "Throw it across your body righty",
        "Switch to lefty, then throw with both hands",
        "Stop and turn before throwing",
        "Yell and keep running yourself"
      ],
      correctAnswer: 1,
      explanation: "Pass with the hand on the same side as your target. Switching hands fast is why we practice both sides every day.",
      kind: "scenario",
      scenario: "Mid-game. Defender is on your right shoulder. Open teammate is breaking toward the goal on your left, 8 yards away.",
    },
    ],
    keyTakeaways: [
      "Throw: step with the opposite foot, snap the wrist, follow through pointing at the target.",
      "Catch: give a soft target with your stick, then 'absorb' — pull stick back as ball arrives.",
      "Wall ball is the single best stick-skill drill. Both hands. Daily.",
      "Stiff hands = drops. Soft hands = clean catches. Cushion the ball every time.",
    ],
  },
  {
    id: "boys-youth-l4",
    videoUrl: "https://www.youtube.com/watch?v=UI-ZteQ8JGU",
    lessonNumber: 4,
    title: "Being a Great Teammate",
    topic: "Character",
    pillar: "team",
    description: `Lacrosse is a team sport. You can't win alone, no matter how good you are. The best players in the world are also the best teammates — and that's not a coincidence.\n\nBeing a great teammate means three things:\n\nFirst, encourage others. When a teammate scores, celebrate with them. When they mess up, pick them up. Don't make fun of anyone for missing a pass or having a bad day. Everyone has bad days — it's how teammates respond that matters.\n\nSecond, listen to your coaches. When the coach talks, you stop talking. You look at them. You listen. Coaches are trying to help you get better, and the kids who listen are the kids who improve. Eye rolls, side conversations, and complaints make you a worse teammate AND a worse player.\n\nThird, hustle for everyone. When you sprint to a ground ball, you're not just helping yourself — you're helping your team. When you back up a shot, you're saving your goalie a goal. When you run hard in transition, you're making it easier for your midfielder to make the next play.\n\nAt BTB, we say "the standard is the standard." That means everyone is expected to bring their best every day. Not because someone is watching, but because your teammates deserve it.`,
    questions: [
      {
      question: "A teammate drops an easy pass. What do you do?",
      options: [
        "Yell at them to focus",
        "Tell the coach to bench them",
        "Say 'shake it off, get the next one'",
        "Refuse to pass to them again"
      ],
      correctAnswer: 2,
      explanation: "Pick teammates up after mistakes. Trust gets built when teammates know you have their back.",
    },
      {
      question: "When the coach is giving instructions, what does a great teammate do?",
      options: [
        "Keep stretching to stay loose",
        "Look at the coach, listen, no side talk",
        "Wait for the part that matters most",
        "Repeat what coach said to a friend"
      ],
      correctAnswer: 1,
      explanation: "Eyes up, mouth shut. Side conversations cost you info AND respect.",
    },
      {
      question: "Why does hustle matter when you don't have the ball?",
      options: [
        "It doesn't really — only ball-side counts",
        "Coaches just like to see you tired",
        "It backs up shots and makes the team better",
        "It makes the other team angry"
      ],
      correctAnswer: 2,
      explanation: "Off-ball hustle wins ground balls, backs up shots, and creates second chances.",
    },
      {
      question: "What does 'the standard is the standard' mean at BTB?",
      options: [
        "The best player sets the bar",
        "Coaches grade you on a curve",
        "Everyone is expected to bring their best, every day",
        "Only games count, practice is optional"
      ],
      correctAnswer: 2,
      explanation: "Standards apply to everyone equally. No one gets a pass.",
    },
      {
      question: "Practice is dragging. It's hot. The drill is repetitive. Half the kids are walking between reps. What do you do?",
      options: [
        "Walk too — match the energy",
        "Sprint between reps and pick up balls",
        "Ask coach to end practice early",
        "Take a knee until coach yells"
      ],
      correctAnswer: 1,
      explanation: "Energy is contagious. One player setting the standard pulls the whole group with them.",
      kind: "scenario",
      scenario: "Tuesday practice in late August. 90°. You've done the same shooting drill four times. Coach is on the other side of the field.",
    },
    ],
    keyTakeaways: [
      "Encourage teammates after mistakes. Everyone has bad days — your reaction matters.",
      "When the coach talks, you stop talking. Eyes up, mouth shut. That's respect AND learning.",
      "Hustle helps the team even when you don't have the ball — back up shots, chase ground balls.",
      "The standard is the standard. Everyone is expected to bring their best every day.",
    ],
  },
  {
    id: "boys-youth-l5",
    lessonNumber: 5,
    title: "Where to Be on the Field",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Lacrosse field awareness — also called "lacrosse IQ" — is knowing where to be on the field. It's the difference between players who run around chasing the ball and players who actually help their team.\n\nThe field has zones. There's the offensive end (where you score), the defensive end (where the other team tries to score), and midfield. Each zone has rules about where you should be and what you should do.\n\nWhen your team has the ball, you should "spread out." Don't all run to the ball. Spread the defense by getting wide and giving your teammate with the ball options to pass to. If you're bunched up, the defense can guard everyone with fewer players.\n\nWhen the other team has the ball, you should "compress." Get tighter, help each other, and don't let the offense have easy passes. Communicate — yell to your teammates so everyone knows who they're guarding.\n\nThe simplest rule for young players: if you're not sure where to be, get to where you can help. If a teammate has the ball, get open for a pass. If a teammate is being pressured, run to help. If a teammate misses a shot, run to back it up. There's almost always something useful to do.`,
    questions: [
      {
      question: "Your team has the ball. Where should off-ball players go?",
      options: [
        "All run to the ball carrier",
        "Stand still and wait for a pass",
        "Spread out — give passing options",
        "Run to the goal in a clump"
      ],
      correctAnswer: 2,
      explanation: "Spread out so the defense has to cover the whole field, not just one spot.",
    },
      {
      question: "The other team has the ball. What does YOUR team do?",
      options: [
        "Spread out wide",
        "Compress and tighten up to help each other",
        "Stand on the sideline",
        "Run back to your own goal only"
      ],
      correctAnswer: 1,
      explanation: "On defense, compress — be close enough to help, far enough to cover your man.",
    },
      {
      question: "What is 'lacrosse IQ'?",
      options: [
        "How fast you run",
        "How hard your shot is",
        "Knowing where to be and what to do",
        "How tall and strong you are"
      ],
      correctAnswer: 2,
      explanation: "IQ is awareness — anticipating plays, finding open space, helping when needed.",
    },
      {
      question: "If you genuinely don't know where to be, what's the best move?",
      options: [
        "Stand on the sideline until coach calls",
        "Run to the goal regardless of the play",
        "Find a spot where you can help — backup, slide, get open",
        "Stay where you started no matter what"
      ],
      correctAnswer: 2,
      explanation: "When in doubt, get to where you can help. Movement with purpose beats freezing.",
    },
      {
      question: "Your teammate is dodging from behind the goal. Defense is collapsing on him. You're at the top of the offensive zone with no defender on you. What do you do?",
      options: [
        "Cut hard to the goal expecting a pass",
        "Stand still — don't move",
        "Run back to defense",
        "Yell for the ball but don't move"
      ],
      correctAnswer: 0,
      explanation: "When the defense collapses, the off-ball man is open. Cut to the goal — your teammate sees you.",
      kind: "scenario",
      scenario: "You're on offense at the top of the zone. Your teammate dodges from X. All three slides commit to him. You're suddenly unguarded.",
    },
    ],
    keyTakeaways: [
      "When YOUR team has the ball: spread out so the defense can't cover everyone.",
      "When the OTHER team has the ball: compress, get tight, communicate.",
      "If you don't know where to be, find a spot where you can help — back up a shot, get open, slide.",
      "Lacrosse IQ = knowing where to be BEFORE the play needs you there.",
    ],
    diagrams: [
      {
        title: "Spread Out on Offense",
        view: "men-half-offensive",
        caption: "Stay 5+ yards apart. If you bunch up, the defense covers everyone with fewer players. Spacing creates passing lanes and dodging room.",
        zones: [
          {
            shape: "rect",
            x: 12,
            y: 30,
            w: 76,
            h: 35,
            color: "#FACC15",
            label: "Stay 5+ yds apart"
          },
        ],
        players: [
          {
            x: 18,
            y: 40,
            role: "offense",
            label: "1"
          },
          {
            x: 50,
            y: 32,
            role: "offense",
            label: "2"
          },
          {
            x: 82,
            y: 40,
            role: "offense",
            label: "3"
          },
          {
            x: 35,
            y: 60,
            role: "offense",
            label: "4"
          },
          {
            x: 65,
            y: 60,
            role: "offense",
            label: "5"
          },
          {
            x: 50,
            y: 88,
            role: "offense",
            label: "X",
            ball: true
          },
        ],
        legend: [
          {
            label: "Offense",
            color: "#D22630",
            shape: "circle"
          },
        ]
      },
    ],
  },
  {
    id: "boys-youth-l6",
    videoUrl: "https://www.youtube.com/watch?v=l-gQLqv9f4o",
    lessonNumber: 6,
    title: "The BTB Standard",
    topic: "Mental Game",
    pillar: "leadership",
    description: `The BTB Standard is what makes our program different. It's not about being the most talented kid — it's about being the kind of player coaches and teammates want around.\n\nThe Standard has three parts:\n\nEffort — You bring 100% every time you step on the field. Not 80% because you're tired. Not 60% because it's hot. 100%. If you're going to be on the field, you owe it to your teammates to give your best.\n\nAttitude — You show up ready to learn. You don't roll your eyes. You don't argue with coaches. You don't blame teammates. When something goes wrong, you say "my fault, I'll get the next one." When something goes right, you congratulate the teammates who helped.\n\nPreparation — You take care of your gear. You practice on your own time. You watch lacrosse on TV when you can. You ask questions when you don't understand. You're always trying to learn more.\n\nIf you do these three things, you'll improve faster than the kids who don't. That's a guarantee. Skill takes time, but the Standard is something you choose every day. And the kids who choose it become the players coaches remember forever.`,
    questions: [
      {
      question: "What are the three parts of the BTB Standard?",
      options: [
        "Speed, strength, skill",
        "Effort, attitude, preparation",
        "Goals, assists, ground balls",
        "Helmet, gloves, stick"
      ],
      correctAnswer: 1,
      explanation: "Effort + attitude + preparation — three choices anyone can make.",
    },
      {
      question: "How much effort does the BTB Standard require on the field?",
      options: [
        "80% to save energy for games",
        "Match what your teammates give",
        "100% every time — no excuses",
        "Whatever your coach asks for"
      ],
      correctAnswer: 2,
      explanation: "100% is the deal. Anything less, you owe your teammates an explanation.",
    },
      {
      question: "You make a bad pass that turns into a goal against you. What's the right response?",
      options: [
        "Blame the receiver",
        "Argue with the ref",
        "'My fault, I'll get the next one'",
        "Walk off the field"
      ],
      correctAnswer: 2,
      explanation: "Own it, reset, compete on the next play. That's BTB attitude.",
    },
      {
      question: "What's an example of preparation?",
      options: [
        "Buying new cleats every season",
        "Wall ball on your own time, gear in order, watching games",
        "Showing up exactly on time",
        "Doing only what the coach assigns"
      ],
      correctAnswer: 1,
      explanation: "Preparation is the work you do when nobody's making you.",
    },
      {
      question: "Saturday morning. Game at 9. You wake up at 7 — alarm didn't go off as planned. What does a BTB-Standard player do FIRST?",
      options: [
        "Check social media to wake up",
        "Check gear, eat, hydrate, mentally prep — get to game ready",
        "Text the coach you'll be late",
        "Skip warmups and go straight to the bench"
      ],
      correctAnswer: 1,
      explanation: "Preparation isn't just the day before. Game-day routine matters: gear check, hydrate, mental prep.",
      kind: "scenario",
      scenario: "Game day. You woke up later than planned but still have 90 minutes. The team is meeting at 8:15 for warmups.",
    },
    ],
    keyTakeaways: [
      "BTB Standard = Effort + Attitude + Preparation.",
      "Effort: 100% every time. Not 80% because you're tired. 100%.",
      "Attitude: own mistakes ('my fault, next one'), no eye-rolls, no blame.",
      "Preparation: care for gear, practice on your own, watch lacrosse, ask questions.",
    ],
  },
  {
    id: "boys-youth-l7",
    videoUrl: "https://www.youtube.com/watch?v=l5-EwrhsMzY",
    lessonNumber: 7,
    title: "Leading by Example",
    topic: "Character",
    pillar: "leadership",
    description: `You don't have to be the best player on your team to be a leader. You don't have to be the loudest kid on the field. Leadership at your age is simple: do the right thing when nobody is making you.\n\nLeading by example means showing up and doing the work. You're the kid who sprints when the coach says "jog." You're the kid who picks up the balls without being asked. You're the kid who stays after practice to get extra reps on the wall.\n\nHere's a secret most kids don't learn until they're older: people watch what you DO, not what you SAY. If you tell your teammates to hustle but you walk between drills, nobody listens. If you sprint every rep and never complain, your teammates start doing the same thing — without you saying a word.\n\nThe best leaders also show up on the bad days. When it's raining, when it's cold, when you're tired — those are the days that matter most. Anyone can lead when things are easy. Real leaders bring the same energy when everything is working against them.\n\nAt BTB, we believe leadership starts young. You don't have to wait until you're a captain or a senior. Start right now. Be the kid who does more than what's expected, every single day. That's what leading by example means.`,
    questions: [
      {
      question: "Do you have to be the best player on the team to lead?",
      options: [
        "Yes, only stars lead",
        "Only if you're a captain",
        "No — leadership is action, not skill",
        "Only the oldest kids can lead"
      ],
      correctAnswer: 2,
      explanation: "Leadership is a choice anyone makes. Action over status.",
    },
      {
      question: "What matters more — what you say or what you do?",
      options: [
        "What you say — words motivate",
        "What you do — people watch actions",
        "Both equal — they're tied together",
        "Only what the coach says"
      ],
      correctAnswer: 1,
      explanation: "Tell teammates to hustle while you walk and nobody listens. Sprint without a word and they follow.",
    },
      {
      question: "When does leadership matter most?",
      options: [
        "When the team is winning",
        "When practice is easy",
        "On bad days — rain, cold, tired",
        "Only at championship games"
      ],
      correctAnswer: 2,
      explanation: "Anyone can lead when things are easy. Real leaders bring it when conditions are bad.",
    },
      {
      question: "What's one specific 'lead by example' action you can do tomorrow?",
      options: [
        "Wear team colors off the field",
        "Sprint between drills and pick up balls",
        "Tell teammates to hustle",
        "Show up exactly on time"
      ],
      correctAnswer: 1,
      explanation: "Sprint and pick up balls — visible effort that pulls others up.",
    },
      {
      question: "First practice of the season. Half the team is jogging the warmup laps. The captain isn't there yet. What do you do?",
      options: [
        "Match the team's pace — fit in",
        "Run faster — the rest will catch up to your example",
        "Wait for the captain to set the pace",
        "Ask the coach what speed to go"
      ],
      correctAnswer: 1,
      explanation: "Leadership is showing up first and setting the tempo. You don't need a title to set the standard.",
      kind: "scenario",
      scenario: "Day 1 of fall ball. Coach said 'two laps to warm up'. Most kids are jogging. The captain is in the bathroom.",
    },
    ],
    keyTakeaways: [
      "Leadership doesn't require being the best player or wearing a 'C'.",
      "Lead by example: sprint when others jog, pick up balls, stay after for extra reps.",
      "Real leaders show up the same on bad days — rain, cold, tired — as on good days.",
      "People watch what you DO, not what you SAY. Actions set the standard.",
    ],
  },
  {
    id: "boys-youth-l8",
    videoUrl: "https://www.youtube.com/watch?v=dCVlRFWOjgE",
    lessonNumber: 8,
    title: "Respecting the Game",
    topic: "Character",
    pillar: "leadership",
    description: `Lacrosse has been around for hundreds of years. Native Americans played it long before any of us were born, and it will be here long after we're gone. When you play lacrosse, you're part of something bigger than yourself — and that deserves respect.\n\nRespecting the game starts with how you treat your opponents. They're not your enemies — they're the people who make you better. Without competition, you never improve. Shake hands before the game. Shake hands after the game. Whether you win or lose, show the other team respect.\n\nRespecting the game means accepting the refs' calls. Refs make mistakes — that's part of sports. Arguing, whining, or throwing your stick doesn't change the call. It just makes you look bad and hurts your team. Play through it and compete on the next play.\n\nRespecting the game means taking care of your equipment. Your stick, your helmet, your pads — they're the tools of your sport. Don't throw them. Don't leave them in the rain. Take care of them the way a carpenter takes care of their tools.\n\nRespecting the game means giving it your full attention. When you're on the field, be on the field. Don't goof off during drills. Don't have side conversations when the coach is talking. The time you spend on the field is short — make every minute count.\n\nPlayers who respect the game earn respect from coaches, teammates, opponents, and parents. It's one of the best habits you can build at your age.`,
    questions: [
      {
      question: "How should you treat opponents?",
      options: [
        "Like enemies — beat them down",
        "With respect — they push you to improve",
        "Ignore them between whistles",
        "Only if they're nice first"
      ],
      correctAnswer: 1,
      explanation: "Without good opponents, you don't grow. Respect is what real competitors give.",
    },
      {
      question: "Ref makes a bad call against your team. Best response?",
      options: [
        "Yell loud enough that he reverses it",
        "Argue calmly until he sees it",
        "Accept it, compete on the next play",
        "Throw your stick to show frustration"
      ],
      correctAnswer: 2,
      explanation: "Refs miss calls. Arguing hurts your focus. Next-play mentality is what wins.",
    },
      {
      question: "You leave your stick out in the rain overnight. What does that say about you?",
      options: [
        "Nothing — it's just a stick",
        "You don't respect your tools or the game",
        "It's the parents' job to handle that",
        "Sticks don't get damaged that easily"
      ],
      correctAnswer: 1,
      explanation: "Your gear is the tools of your sport. Respecting it shows you respect the game.",
    },
      {
      question: "What does 'respecting the game' actually cover?",
      options: [
        "Just winning with class",
        "Opponents, refs, gear, and practice time",
        "Saying the right things to coaches",
        "Wearing the team uniform proudly"
      ],
      correctAnswer: 1,
      explanation: "Respect is total — for everyone and everything connected to the sport.",
    },
      {
      question: "Final whistle. You lost 8-7 on a goal you think was offside. Ref didn't call it. The other team is celebrating. What do you do?",
      options: [
        "Walk off without shaking hands",
        "Confront the ref about the call",
        "Line up and shake hands cleanly",
        "Stand and stare at the celebration"
      ],
      correctAnswer: 2,
      explanation: "Win or lose, you line up and shake hands. That's how you show the game respect — and the game pays you back over time.",
      kind: "scenario",
      scenario: "Tough loss. Final goal looked offside but wasn't called. The handshake line is forming. Your teammates are watching how you react.",
    },
    ],
    keyTakeaways: [
      "Opponents make you better — shake hands before and after every game.",
      "Refs miss calls. Arguing wastes energy and hurts your team. Compete on the next play.",
      "Take care of your gear — sticks, helmets, pads aren't toys.",
      "Be fully present at practice. Phones away, focus up. Time on the field is short.",
    ],
  },
  {
    id: "boys-youth-l9",
    videoUrl: "https://www.youtube.com/watch?v=S02D9QzDe4s",
    lessonNumber: 9,
    title: "Why Teams Win",
    topic: "Mental Game",
    pillar: "team",
    description: `Here's something that might surprise you: the best team doesn't always have the best players. Sometimes the team with less talent wins because they play better TOGETHER.\n\nThink about it like this. If you have five amazing players who all want to score and none of them pass, they might lose to a team of average players who move the ball, play defense together, and fight for every ground ball as a group.\n\nTeams win because every player does their job. The attackman finishes the shot. The midfielder runs hard in transition. The defenseman slides on time. The goalie communicates. When everyone does their piece — not trying to do someone else's job — the team works.\n\nTeams win because they trust each other. When you trust your teammate to be in the right spot, you make the pass without hesitating. When you trust your slide will come, you play your man tight. Trust makes everyone braver and faster.\n\nTeams win because they pick each other up. When a teammate drops a ball, you don't groan — you clap and say "next one." When someone misses a shot, you back it up. When someone gets beat on defense, you slide. Every mistake is a chance for the TEAM to respond.\n\nNo one remembers the kid who scored the most goals on a losing team. Everyone remembers the team that fought together and won something nobody expected them to win. That's the power of playing as a team.`,
    questions: [
      {
      question: "Does the most talented team always win?",
      options: [
        "Yes — talent wins championships",
        "Only in the playoffs",
        "No — teamwork beats talent often",
        "Only if the talent is older"
      ],
      correctAnswer: 2,
      explanation: "Teams that move the ball, slide on time, and trust each other beat more talented teams regularly.",
    },
      {
      question: "What does 'doing your job' on a team mean?",
      options: [
        "Trying to score every play you can",
        "Playing your position, trusting teammates",
        "Doing the coach's job better than him",
        "Switching positions when bored"
      ],
      correctAnswer: 1,
      explanation: "Every position depends on the others. When everyone does their part, it works.",
    },
      {
      question: "How does trust get built between teammates?",
      options: [
        "By talking about it in team meetings",
        "By hanging out off the field",
        "Through reps — reliable effort over time",
        "Through senior leadership only"
      ],
      correctAnswer: 2,
      explanation: "Trust is the residue of repetition. Show up, do your job, build the bank.",
    },
      {
      question: "Teammate misses a wide-open shot. The team's reaction?",
      options: [
        "Groan and shake heads at him",
        "Yell for the next play",
        "Clap, say 'next one' — pick him up",
        "Tell coach to bench him"
      ],
      correctAnswer: 2,
      explanation: "How a team responds to mistakes is a team's identity. Pick teammates up — always.",
    },
      {
      question: "Down 4-0 in the second quarter. The other team is bigger and faster. Two of your teammates are starting to drop their heads. What's the team-first move?",
      options: [
        "Drop your head too — match the energy",
        "Sprint to the next ground ball harder than ever",
        "Ask coach to call timeout to vent",
        "Tell teammates to stop trying so hard"
      ],
      correctAnswer: 1,
      explanation: "Energy is a choice. One player setting the tempo can flip a team. Compete on the next play, score doesn't matter.",
      kind: "scenario",
      scenario: "12 minutes in. You're down 4-0. The other team has bigger, older kids. Two of your teammates are starting to drag.",
    },
    ],
    keyTakeaways: [
      "The most talented team doesn't always win — the team that plays together does.",
      "Doing your job means trusting teammates to do theirs. Don't try to play 3 positions.",
      "Trust is built rep by rep. Every right pass and on-time slide adds to the bank.",
      "Pick teammates up after mistakes — it's how teams respond to errors that decides games.",
    ],
  },
  {
    id: "boys-youth-l10",
    lessonNumber: 10,
    title: "Competing Together",
    topic: "Mental Game",
    pillar: "team",
    description: `Every team faces hard moments. You'll play games in the rain. You'll lose to teams you thought you'd beat. You'll have practices where nothing goes right. What matters isn't whether hard things happen — it's how your team responds.\n\nCompeting together means nobody gives up. If you're down 5-0 in the first half, you don't stop trying. You fight just as hard on the last ground ball as the first. Why? Because your teammates are watching. If you quit, it tells them it's OK to quit too. If you keep competing, it lifts everyone up.\n\nCompeting together means celebrating each other's wins. When your teammate scores, you celebrate like YOU scored. When your goalie makes a big save, the whole team reacts. When your defenseman causes a turnover, everyone lets them know it mattered. Energy is contagious — and the team that celebrates together plays harder together.\n\nCompeting together means handling losses like a group. After a tough loss, you don't point fingers. You don't blame one person. You say "we'll get better" and you mean it. The best teams learn from losses and come back stronger at the next practice.\n\nHere's the truth about competing: it's supposed to be hard. If it were easy, everyone would do it. The teams that embrace the hard stuff — the cold games, the tough opponents, the long practices — those are the teams that build something special. And you'll remember competing with those teammates for the rest of your life.`,
    questions: [
      {
      question: "Down 5-0 in the first half. What's the right mindset?",
      options: [
        "Conserve energy for the next game",
        "Compete on every play — score doesn't change effort",
        "Blame the goalie for letting them in",
        "Walk through plays quietly"
      ],
      correctAnswer: 1,
      explanation: "Effort is independent of the scoreboard. Your teammates are watching your response.",
    },
      {
      question: "Teammate scores a beautiful goal. Best team reaction?",
      options: [
        "Standard nod and run back",
        "Celebrate like YOU scored — energy spreads",
        "Wait to see if it counts first",
        "Save the celebration for the end of the game"
      ],
      correctAnswer: 1,
      explanation: "Celebrating loudly together feeds momentum. Quiet teams play tight.",
    },
      {
      question: "After a tough loss, what does the team do?",
      options: [
        "Find someone to blame",
        "Pretend it didn't happen",
        "Own it together — 'we'll fix it' — and mean it",
        "Skip the next practice to recover"
      ],
      correctAnswer: 2,
      explanation: "Tough losses are growth moments — if the team owns them together.",
    },
      {
      question: "What's the difference between competing and winning?",
      options: [
        "Same thing",
        "Competing means giving full effort regardless of score",
        "Competing only matters in the playoffs",
        "Competing is what coaches say when you lose"
      ],
      correctAnswer: 1,
      explanation: "You can compete and lose. You can't grow without competing. Competing is the choice — winning is the byproduct.",
    },
      {
      question: "It's pouring rain, you're tied, 30 seconds left. Your team has to clear the ball under heavy ride pressure. The crowd is loud. What do you focus on?",
      options: [
        "The scoreboard ticking down",
        "The crowd noise to get hyped",
        "Your job: my outlet target, my spacing, my next pass",
        "Whether the rain is letting up"
      ],
      correctAnswer: 2,
      explanation: "Pressure narrows focus. Big moments demand small thinking — do your job, the next 5 seconds, then the next 5.",
      kind: "scenario",
      scenario: "Tied 6-6, 30 seconds left, rain pouring, your team has the ball at your own goal line. Goalie just made a save. The other team is riding aggressively.",
    },
    ],
    keyTakeaways: [
      "Hard moments are inevitable — what matters is how the team responds.",
      "When down big, don't quit. Your effort affects every teammate watching.",
      "Celebrate teammates' wins like they're yours. Energy is contagious.",
      "After tough losses: 'we'll get better' — and mean it. No finger-pointing.",
    ],
  },
]

const BOYS_MIDDLE_LESSONS: AcademyLesson[] = [
  {
    id: "boys-middle-l1",
    lessonNumber: 1,
    title: "Positions and Their Roles",
    topic: "Fundamentals",
    pillar: "game",
    description: `By middle school, you should understand what every position on the field does. This knowledge makes you a smarter player no matter where you play, because lacrosse is a team game where every position depends on every other.\n\nAttackmen play in front of the opposing goal and almost never cross midfield. Their job is to score and feed (pass to set up goals). Good attackmen have great stick skills, can dodge from X (behind the goal), and read defenses. They live in the offensive end.\n\nMidfielders play the whole field — offense and defense. They're the most athletic players on the team because they run constantly. A good middie can dodge, shoot, defend, and play transition. There are usually 6 midfielders on a team who rotate in shifts of 3.\n\nDefensemen play in front of their own goal. They use long sticks (called "long poles") to disrupt the offense. They throw checks, force turnovers, and clear the ball up to the offense. Good defensemen are physical, smart, and great communicators.\n\nGoalies are the last line of defense. They wear extra padding and use a stick with a much bigger head. They have to be brave (the ball is hard and comes fast), have great hand-eye coordination, and be loud — they're in charge of the defense and direct the slide packages.\n\nUnderstanding what every position does helps you play yours better. When you know what your defenseman is supposed to do, you can help them. When you know what your goalie sees, you can position yourself correctly.`,
    questions: [
      {
      question: "Which position runs both offense and defense?",
      options: [
        "Attackman",
        "Long-pole defenseman",
        "Midfielder",
        "Goalie"
      ],
      correctAnswer: 2,
      explanation: "Midfielders cover the whole field. They sub off in shifts.",
    },
      {
      question: "Where does an attackman primarily play?",
      options: [
        "All over the field",
        "Behind their own goal mostly",
        "Around the opposing goal — rarely cross midfield",
        "Wherever there's an open lane"
      ],
      correctAnswer: 2,
      explanation: "Attackmen stay in the offensive end. They don't usually cross midfield.",
    },
      {
      question: "Why must goalies be loud communicators?",
      options: [
        "The fans need to hear them",
        "Refs require it for clears",
        "They direct the defense and call slides",
        "It intimidates the offense"
      ],
      correctAnswer: 2,
      explanation: "Goalies see the whole field. They run defensive communication.",
    },
      {
      question: "What is an LSM (long-stick midfielder)?",
      options: [
        "A goalie's backup",
        "A midfielder using a long defensive stick",
        "An attackman with a longer stick",
        "A faceoff specialist"
      ],
      correctAnswer: 1,
      explanation: "LSMs play midfield with a long pole — disruption + clearing.",
    },
      {
      question: "Coach moves you from middie to attack mid-season. You've never played attack. What's your first move?",
      options: [
        "Argue — you're better at midfield",
        "Watch attackmen on film, learn the spots and dodges",
        "Refuse to dodge in games until comfortable",
        "Quit the team"
      ],
      correctAnswer: 1,
      explanation: "Position changes are growth opportunities. Film + reps. The kids who adapt earn more roles.",
      kind: "scenario",
      scenario: "Mid-season your coach pulls you aside: he needs an attackman. You've played midfield your whole life.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=UGRkkLFv-Vw",
    keyTakeaways: [
      "Attack stays on offense (3 players). Midfield runs both ways (3). Defense stays back (3). Goalie (1).",
      "Long sticks (defensemen + LSM) check, force turnovers, clear ball.",
      "Midfielders are the most athletic — sub off in shifts to stay fresh.",
      "Goalies direct the defense — they're the loudest player on the field.",
    ],
    diagrams: [
      {
        title: "Men's Field — All 10 Positions",
        view: "men-full",
        caption: "Three attackmen below midfield. Three midfielders cover the whole field. Three defensemen + goalie stay back. Long-poles can ride into the offensive end on certain plays.",
        players: [
          {
            x: 30,
            y: 80,
            role: "attack",
            label: "A"
          },
          {
            x: 50,
            y: 88,
            role: "attack",
            label: "A"
          },
          {
            x: 70,
            y: 80,
            role: "attack",
            label: "A"
          },
          {
            x: 30,
            y: 60,
            role: "midfield",
            label: "M"
          },
          {
            x: 50,
            y: 60,
            role: "midfield",
            label: "M"
          },
          {
            x: 70,
            y: 60,
            role: "midfield",
            label: "M"
          },
          {
            x: 30,
            y: 40,
            role: "defense",
            label: "D"
          },
          {
            x: 50,
            y: 40,
            role: "defense",
            label: "D"
          },
          {
            x: 70,
            y: 40,
            role: "defense",
            label: "D"
          },
          {
            x: 50,
            y: 18,
            role: "goalie",
            label: "G"
          },
        ],
        legend: [
          {
            label: "Attack",
            color: "#D22630",
            shape: "circle"
          },
          {
            label: "Midfield",
            color: "#EAB308",
            shape: "circle"
          },
          {
            label: "Defense (long pole)",
            color: "#2563EB",
            shape: "square"
          },
          {
            label: "Goalie",
            color: "#10B981",
            shape: "square"
          },
        ]
      },
    ],
  },
  {
    id: "boys-middle-l2",
    lessonNumber: 2,
    title: "Dodging Fundamentals",
    topic: "Fundamentals",
    pillar: "game",
    description: `A dodge is how you beat your defender to create space — for a shot, a pass, or a chance to drive to the goal. Every offensive player needs to dodge. There are three main types you should master.\n\nThe Split Dodge is the most common. You run at your defender hard, plant one foot, and explode the opposite direction while switching your stick from one hand to the other. The key is selling the first direction with your body — your defender has to believe you're going right before you cut left. Speed and a quick hand switch make it work.\n\nThe Roll Dodge is for when a defender plays you tight. You drive into the defender, plant your inside foot, and roll backwards (away from them) protecting your stick. As you roll, you keep your stick high and wrap around your body. When you finish the roll, you should be facing the goal with the defender behind you. This is how you beat aggressive defenders.\n\nThe Face Dodge is a quick fake without changing hands. You bring your stick across your face like you're going to switch hands, but you don't — you keep the same hand. The defender reaches for the fake and you blow by. This is fastest because you don't lose any speed.\n\nThe most important thing about dodging isn't the move itself — it's the change of speed. You have to go from slow to fast in one step. If you dodge at one speed, the defender will recover. If you dodge with an explosive change of pace, you create separation.`,
    questions: [
      {
      question: "What's the most important element of any dodge?",
      options: [
        "How fancy the move looks",
        "Change of speed — slow to fast in one step",
        "How loud you yell during it",
        "Switching hands as fast as possible"
      ],
      correctAnswer: 1,
      explanation: "Change of pace creates separation. A flashy dodge at one speed doesn't work.",
    },
      {
      question: "In a split dodge you switch hands. In a face dodge you...",
      options: [
        "Switch hands twice",
        "Keep the same hand but fake the switch",
        "Drop the stick mid-dodge",
        "Spin all the way around"
      ],
      correctAnswer: 1,
      explanation: "Face dodge fakes the switch — fastest because you don't lose any speed.",
    },
      {
      question: "When is a roll dodge most useful?",
      options: [
        "Wide open field, no defender",
        "Against a defender playing you very tight",
        "When you're tired and slow",
        "Only against goalies stepping out"
      ],
      correctAnswer: 1,
      explanation: "Roll dodges work when defenders are right on you — protect stick, roll past.",
    },
      {
      question: "What's the mistake most middle-schoolers make when dodging?",
      options: [
        "Switching hands too fast",
        "Running at one speed the whole time",
        "Bringing the stick too high",
        "Calling for the ball mid-dodge"
      ],
      correctAnswer: 1,
      explanation: "One-speed dodges let the defender recover. Explosive change of pace is the key.",
    },
      {
      question: "Defender is tight on your right hip, mirroring your every step. You can't get separation. What dodge?",
      options: [
        "Split dodge — switch hands and go opposite",
        "Face dodge — fake the switch and blow by",
        "Roll dodge — plant, roll backwards, protect stick",
        "Slow down and pass it back"
      ],
      correctAnswer: 2,
      explanation: "Tight, mirroring defender = roll dodge. Plant the inside foot, roll away, stick protected.",
      kind: "scenario",
      scenario: "1v1 from up top. Defender is glued to your right hip. Every move you make, he mirrors. You need to create space NOW.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=vQfmOqWZa_o",
    keyTakeaways: [
      "Three core dodges: split, roll, face. Each beats a different defender posture.",
      "Split dodge: switch hands, change direction. The change of pace is what beats them.",
      "Roll dodge: against tight defenders — plant inside foot, roll backwards, protect stick.",
      "Face dodge: fake the switch but keep the same hand — fastest because no speed loss.",
    ],
    diagrams: [
      {
        title: "Split Dodge — Path",
        view: "men-half-offensive",
        caption: "Attack right at the defender's chest, plant inside foot, switch hands, explode the opposite direction. The change of pace creates separation.",
        players: [
          {
            x: 50,
            y: 35,
            role: "offense",
            label: "1",
            ball: true,
            highlight: true
          },
          {
            x: 50,
            y: 48,
            role: "defender",
            label: "D"
          },
          {
            x: 30,
            y: 65,
            role: "offense",
            label: "2"
          },
          {
            x: 70,
            y: 65,
            role: "offense",
            label: "3"
          },
        ],
        arrows: [
          {
            from: {
              x: 50,
              y: 35
            },
            to: {
              x: 50,
              y: 50
            },
            kind: "run",
            label: "1. Attack"
          },
          {
            from: {
              x: 50,
              y: 50
            },
            to: {
              x: 30,
              y: 70
            },
            kind: "run",
            curve: -8,
            label: "2. Split & go"
          },
        ],
        legend: [
          {
            label: "Offense (with ball)",
            color: "#D22630",
            shape: "circle"
          },
          {
            label: "Defender",
            color: "#2563EB",
            shape: "square"
          },
        ]
      },
    ],
  },
  {
    id: "boys-middle-l3",
    lessonNumber: 3,
    title: "Defensive Footwork and Positioning",
    topic: "Fundamentals",
    pillar: "game",
    description: `Good defense in lacrosse starts with footwork. Most young defenders try to swing their stick at the ball — that's a mistake. The best defenders move their feet, stay in position, and force the offense into bad spots.\n\nDEFENSIVE FUNDAMENTALS\n\n1. Breakdown Position\nKnees bent, weight on the balls of your feet, hips low, stick out in front. This is your defensive stance. From here you can move in any direction instantly. Standing tall means you're already beat.\n\n2. Footwork: Slide-Step, Never Cross\nWhen the offense moves, you shuffle. Slide left, slide right — always keeping your hips square to the ball carrier. NEVER cross your feet. Crossing = losing balance = getting beat.\n\n3. The Approach\nWhen closing out on a ball carrier, don't run straight at him. Take an angle that forces him to one side. Take away the middle of the field and push him toward the sideline or toward your help.\n\n4. Stick Checks\nUse quick "poke checks" — a short jab toward the hands or stick head. These are more effective than wild, swinging checks. The goal isn't to take the ball away every time. The goal is to disrupt, force a bad decision, and slow the dodger down so your slide can arrive.\n\nDEFENSIVE COMMUNICATION\nDefense is a talking game. Every defender needs these calls:\n- "I got ball!" — I'm on the ball carrier\n- "I got two!" or "I'm hot!" — I'm the first slide\n- "I got three!" — I'm the second slide\n- "Check!" — The ball carrier picked up his stick to pass — tighten up\n- "Fire! Fire!" — Slide NOW\n\nTHE CARDINAL RULE\nStay between your man and the goal. If you're between your man and the goal, you've already won most of the battle. If he gets past you, your team is scrambling.\n\nCOACHING POINTS\n- Defense is 80% footwork, 20% stick work\n- Poke checks > wild swings. Controlled, quick, directed.\n- The player who communicates on defense is worth more than the player who just checks hard`,
    questions: [
      {
      question: "What's the cardinal rule of defense?",
      options: [
        "Always check hard",
        "Stay between your man and the goal",
        "Run to the ball carrier first",
        "Stand tall to look bigger"
      ],
      correctAnswer: 1,
      explanation: "Body position between man and goal is the foundation.",
    },
      {
      question: "Defensive footwork basic rule:",
      options: [
        "Cross feet for max speed",
        "Stand flat-footed for balance",
        "Slide-step, never cross feet",
        "Jump backwards to keep cushion"
      ],
      correctAnswer: 2,
      explanation: "Crossing feet = losing balance = getting beat.",
    },
      {
      question: "Goal of a poke check?",
      options: [
        "Take the ball away every time",
        "Disrupt and slow the dodger down",
        "Get the ref to throw a flag",
        "Knock the helmet off"
      ],
      correctAnswer: 1,
      explanation: "Poke checks force bad decisions and buy slide time. They rarely win the ball.",
    },
      {
      question: "How should you approach a ball carrier?",
      options: [
        "Run straight at him full speed",
        "Take an angle that pushes him to the sideline",
        "Stand still and wait for him to come",
        "Reach with your stick before approaching"
      ],
      correctAnswer: 1,
      explanation: "Angle takes away the middle and pushes him into help.",
    },
      {
      question: "Attackman driving from your right wing. He's heading toward the middle of the field. You're guarding him. What do you do?",
      options: [
        "Reach with your stick to slow him",
        "Slide-step to cut off his middle path, force him sideline",
        "Run past him to the goalie's position",
        "Drop your stick down and brace for contact"
      ],
      correctAnswer: 1,
      explanation: "Cut off the middle. Force him to the sideline where help is — and where the angle to score gets bad.",
      kind: "scenario",
      scenario: "Right wing dodge from up top. The attackman is faster than you and trying to get to the middle for an inside roll.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=UGRkkLFv-Vw",
    keyTakeaways: [
      "Defense is 80% footwork, 20% stick work. Move feet, not stick.",
      "Slide-step (never cross feet) — keep hips square to the ball carrier.",
      "Stay between man and goal — that's the cardinal rule.",
      "Poke checks > wild swings. Disrupt and force bad decisions, don't always go for the ball.",
    ],
    diagrams: [
      {
        title: "Defensive Stance + Approach Angle",
        view: "men-half-defensive",
        caption: "Stay between man and goal. Force the dodger to the sideline (away from the middle). Slide-step — never cross your feet. Push him into your help.",
        players: [
          {
            x: 60,
            y: 50,
            role: "offense",
            label: "O",
            ball: true,
            highlight: true
          },
          {
            x: 60,
            y: 60,
            role: "defender",
            label: "D"
          },
          {
            x: 50,
            y: 80,
            role: "goalie",
            label: "G"
          },
        ],
        zones: [
          {
            shape: "rect",
            x: 35,
            y: 60,
            w: 30,
            h: 22,
            color: "#D22630",
            label: "Take away middle"
          },
        ],
        arrows: [
          {
            from: {
              x: 60,
              y: 50
            },
            to: {
              x: 80,
              y: 70
            },
            kind: "run",
            curve: 5,
            label: "Push to sideline"
          },
        ],
        legend: [
          {
            label: "Offense",
            color: "#D22630",
            shape: "circle"
          },
          {
            label: "Defender",
            color: "#2563EB",
            shape: "square"
          },
        ]
      },
    ],
  },
  {
    id: "boys-middle-l4",
    lessonNumber: 4,
    title: "Reading the Field — Lacrosse IQ",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Reading the field means understanding what's happening BEFORE it happens. The best lacrosse players don't react — they anticipate. This is what separates good middle schoolers from great ones.\n\nWhen you have the ball, scan the field. Where are your teammates? Where is open space? Where is the defense weakest? You should know all this before you make your move, not after. The best players see the whole field at once.\n\nWhen you don't have the ball, watch the player with the ball and the defenders. Anticipate where the ball is going next. If a teammate is being doubled, get open for an outlet pass. If the defense is sliding to your teammate, expect that you might be left open — be ready to receive.\n\nOn defense, watch the ball carrier's body language. Are they going to dodge? Are they passing? Where are their eyes looking? A player's eyes usually tell you where they're going to throw. If you can read that, you can intercept passes.\n\nLacrosse IQ comes from two things: experience (the more you play, the more patterns you recognize) and film study (watching games and analyzing what good players do). Start watching college and pro lacrosse on YouTube. Pause when something interesting happens and ask: why did they do that? Where was the open space? What did the defense do wrong?\n\nThe best way to improve your IQ at this age is just to watch the game with curiosity. Don't just watch the ball — watch the players without the ball. That's where you learn the most.`,
    questions: [
      {
      question: "What separates good players from great ones in IQ?",
      options: [
        "Greats run faster",
        "Greats are taller and stronger",
        "Greats anticipate, not just react",
        "Greats have nicer gear"
      ],
      correctAnswer: 2,
      explanation: "Anticipation — seeing the play before it happens — is the IQ marker.",
    },
      {
      question: "Watching film, what should you focus on?",
      options: [
        "Just the ball at all times",
        "Just the goalie's saves",
        "Off-ball movement — that's the lesson",
        "The scoreboard and time"
      ],
      correctAnswer: 2,
      explanation: "Off-ball movement teaches positioning, anticipation, team play.",
    },
      {
      question: "On defense, what tells you where the ball carrier will pass?",
      options: [
        "Their feet and stride",
        "Their eyes — they look where they're throwing",
        "Their helmet number",
        "How they hold their stick"
      ],
      correctAnswer: 1,
      explanation: "Eyes telegraph passes. Reading them = interceptions.",
    },
      {
      question: "When you have the ball, what should you do BEFORE you make your move?",
      options: [
        "Run as fast as possible",
        "Scan: teammates, space, weak defender",
        "Yell for a pick",
        "Wait until coach calls a play"
      ],
      correctAnswer: 1,
      explanation: "Great players scan first, commit second. That's how openings are seen.",
    },
      {
      question: "You catch the ball topside. As you turn, you see the crease defender step toward you — clearly preparing to slide. What do you do?",
      options: [
        "Dodge harder, ignore the slide",
        "Pass to the crease attackman the slider just left",
        "Pass back to where you got the ball",
        "Shoot from where you are"
      ],
      correctAnswer: 1,
      explanation: "Slide left a man open. Pass to him — that's a layup. Forcing the dodge into the slide is a turnover.",
      kind: "scenario",
      scenario: "You catch a feed up top. As you load to dodge, you see the crease defender's hips turn toward you — he's about to slide.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=4LHsrseSKak",
    keyTakeaways: [
      "Lacrosse IQ = anticipating, not just reacting.",
      "With ball: scan teammates, open space, weakest defender BEFORE you commit.",
      "Off-ball: watch ball carrier + defenders, get to where the ball is going next.",
      "Eyes telegraph passes. Read where the ball carrier is looking.",
    ],
    diagrams: [
      {
        title: "Reading the Slide",
        view: "men-half-offensive",
        caption: "Before committing, find the slide. If the slider leaves their man, pass to that player — they're now open. If no slide comes, dodge hard and finish.",
        players: [
          {
            x: 25,
            y: 60,
            role: "offense",
            label: "1",
            ball: true,
            highlight: true
          },
          {
            x: 50,
            y: 75,
            role: "offense",
            label: "2"
          },
          {
            x: 75,
            y: 60,
            role: "offense",
            label: "3"
          },
          {
            x: 28,
            y: 65,
            role: "defender",
            label: "Da"
          },
          {
            x: 52,
            y: 80,
            role: "defender",
            label: "Db"
          },
          {
            x: 73,
            y: 65,
            role: "defender",
            label: "Dc"
          },
        ],
        arrows: [
          {
            from: {
              x: 25,
              y: 60
            },
            to: {
              x: 35,
              y: 75
            },
            kind: "run",
            curve: -3,
            label: "1. Dodge"
          },
          {
            from: {
              x: 52,
              y: 80
            },
            to: {
              x: 38,
              y: 75
            },
            kind: "run",
            label: "2. Slide leaves"
          },
          {
            from: {
              x: 25,
              y: 60
            },
            to: {
              x: 50,
              y: 75
            },
            kind: "pass",
            curve: -3,
            label: "3. Skip to 2"
          },
        ],
        legend: [
          {
            label: "Offense",
            color: "#D22630",
            shape: "circle"
          },
          {
            label: "Defender",
            color: "#2563EB",
            shape: "square"
          },
        ]
      },
    ],
  },
  {
    id: "boys-middle-l5",
    lessonNumber: 5,
    title: "Mental Toughness Under Pressure",
    topic: "Mental Game",
    pillar: "team",
    description: `Mental toughness is what keeps you playing your best when things get hard. Every player has good games. The toughest players have good games AND bad games — and they fight just as hard in both.\n\nHere's what mental toughness actually looks like in middle school lacrosse:\n\nWhen you make a mistake, you reset. You don't dwell on it. You don't drop your head. You don't look at the bench like "sorry coach." You take a breath, refocus, and play the next play. The hardest thing in sports is letting go of a mistake fast. Mentally tough players let it go in seconds.\n\nWhen the ref makes a bad call, you don't argue. You don't whine. You play harder on the next play. Refs make mistakes — it's part of the game. Players who complain about refs lose focus and play worse. Players who shake it off and compete are the ones who win.\n\nWhen you're tired, you push through. The fourth quarter is when games are won. Most players slow down when they're tired. The mentally tough player speeds up — because they know everyone else is slowing down. That's your edge.\n\nWhen you're losing, you don't quit. Down 6-0? You compete on every ground ball like it's 0-0. You play defense like every save matters. Mentally tough players don't care about the score — they care about the next play. You can't change the score, but you can change how hard you play right now.\n\nMental toughness is a muscle. The more you practice it in small moments — finishing one extra rep, running one more sprint, staying focused after a bad play — the stronger it gets.`,
    questions: [
      {
      question: "After a mistake, what's the tough-player move?",
      options: [
        "Argue with the ref about the play",
        "Drop your head until the next sub",
        "Reset fast — focus on the next play",
        "Find a teammate to blame"
      ],
      correctAnswer: 2,
      explanation: "Mentally tough players let go of mistakes in seconds.",
    },
      {
      question: "When does mental toughness actually get tested?",
      options: [
        "When you're winning easy",
        "When everything is going well",
        "When tired, losing, or frustrated",
        "Only at championship games"
      ],
      correctAnswer: 2,
      explanation: "Toughness is built and shown in adversity.",
    },
      {
      question: "Down 7-1 in the third. What's the right mindset?",
      options: [
        "Conserve energy for next game",
        "Compete on every play — score doesn't change effort",
        "Try to score 6 yourself to catch up",
        "Take it easy to avoid injury"
      ],
      correctAnswer: 1,
      explanation: "Effort is independent of the scoreboard.",
    },
      {
      question: "Why do tough players get FASTER in the 4th quarter?",
      options: [
        "They're in better shape than everyone",
        "Most opponents are slowing down — that's the edge",
        "Coaches force them to sprint",
        "The whistle motivates them"
      ],
      correctAnswer: 1,
      explanation: "If you're holding pace while opponents slow, you've gained relative speed. That's the gap.",
    },
      {
      question: "Bad call costs you a goal. Crowd is yelling at the ref. Your teammates are arguing. 30 seconds later, the ball is loose at midfield. What do you do?",
      options: [
        "Yell at the ref about the bad call",
        "Stand and wait for someone else to get it",
        "Sprint to the ground ball — next play",
        "Walk over to argue with coach"
      ],
      correctAnswer: 2,
      explanation: "Tough players play through bad calls. Sprint to the ball — that's how you flip momentum.",
      kind: "scenario",
      scenario: "Late 3rd quarter. Bad call wiped out your team's goal. The crowd is angry, your teammates are arguing. Then: ground ball at midfield.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=l5-EwrhsMzY",
    keyTakeaways: [
      "Mistakes are inevitable. Tough players reset in seconds — don't dwell.",
      "When tired, push HARDER — everyone else is slowing down. That's your edge.",
      "Don't argue with refs. It costs focus and rarely changes the call.",
      "Score doesn't dictate effort. Compete play to play, not based on the scoreboard.",
    ],
  },
  {
    id: "boys-middle-l6",
    lessonNumber: 6,
    title: "Becoming a Leader on Your Team",
    topic: "Character",
    pillar: "leadership",
    description: `Leadership in middle school lacrosse doesn't mean wearing a "C" on your jersey. It doesn't mean being the loudest kid in the huddle. Real leadership is about how you act when nobody is paying attention.\n\nThe biggest myth about leadership is that you have to be the best player. You don't. Some of the best leaders on great teams are bench players who bring incredible energy at practice every day. Leadership is a choice — anyone can do it if they choose to.\n\nHere's what middle school leadership looks like:\n\nYou show up early. You stay late. You're the one who picks up balls without being told. You sprint hard in conditioning even though no one is watching the back of the line. You set the standard with your actions.\n\nYou pick up teammates. When a teammate makes a mistake, you're the first one to say "shake it off, I got you." When a teammate scores, you're the first to celebrate with them. When practice is grinding and everyone is tired, you're the one who picks up the energy.\n\nYou don't talk behind anyone's back. Real leaders don't gossip about teammates, complain about coaches to their friends, or make excuses. If you have a problem, you talk directly to the person and try to fix it. Leaders build trust — and trust is built by being honest and reliable.\n\nYou take coaching well. Leaders don't argue with feedback. They say "got it, coach" and apply it on the next rep. When teammates see you take coaching, they learn to do the same.\n\nIf you do these things, your coaches will notice. Your teammates will notice. And one day, when there's a hard moment in a game and the team needs someone to step up, everyone will look at you — because you've already been leading the whole time.`,
    questions: [
      {
      question: "Do you need to be a starter to be a leader?",
      options: [
        "Yes — only starters lead",
        "Only if you wear a captain's C",
        "No — leadership is a choice anyone can make",
        "Only seniors lead"
      ],
      correctAnswer: 2,
      explanation: "Effort and example don't require status.",
    },
      {
      question: "Real leaders handle teammate problems by...",
      options: [
        "Talking behind their backs",
        "Telling other teammates first",
        "Going directly to the person to fix it",
        "Letting it stay unresolved"
      ],
      correctAnswer: 2,
      explanation: "Direct, honest communication builds trust. Gossip destroys it.",
    },
      {
      question: "Biggest leadership tell at practice?",
      options: [
        "Being the loudest in huddle",
        "Setting the standard with action — first, focused",
        "Wearing the best gear",
        "Being friends with the coach"
      ],
      correctAnswer: 1,
      explanation: "Actions are visible. Words alone don't lead.",
    },
      {
      question: "Coach gives you tough feedback in front of the team. Best response?",
      options: [
        "Defend yourself with explanations",
        "Roll your eyes and take it later",
        "'Got it, coach' — apply it on the next rep",
        "Argue calmly until coach agrees"
      ],
      correctAnswer: 2,
      explanation: "Taking coaching well shows the team how to handle it. Big leadership signal.",
    },
      {
      question: "You're a sophomore. A senior teammate is loafing through warm-ups. Captain isn't on the field yet. What's the leadership move?",
      options: [
        "Match the senior's energy — fit in",
        "Sprint and stay ready — your example pulls others",
        "Tell the coach about the senior",
        "Wait for the captain to handle it"
      ],
      correctAnswer: 1,
      explanation: "Leadership doesn't wait for permission. Set the standard with your effort — others follow.",
      kind: "scenario",
      scenario: "Saturday warm-ups. Senior teammate is jogging at 50%. Captain is in the bathroom. Coach is at the other end of the field.",
    },
    ],
    keyTakeaways: [
      "You don't need a 'C' to lead. Leadership is action, not status.",
      "Show up early, stay late, pick up balls — set the standard with your behavior.",
      "Pick teammates up after mistakes. Be the first voice they hear.",
      "Take coaching well. Saying 'got it' and applying feedback fast is contagious.",
    ],
  },
  {
    id: "boys-middle-l7",
    lessonNumber: 7,
    title: "Finding Your Voice",
    topic: "Character",
    pillar: "leadership",
    description: `By middle school, lacrosse becomes a talking game. The teams that communicate win. The teams that stay silent lose. Finding your voice on the field is one of the most important things you can do at this age.\n\nWHAT TO SAY AND WHEN\n\nOn Defense:\n- "I got ball!" — You're guarding the ball carrier\n- "I'm hot!" or "I got two!" — You're the first slide\n- "I got three!" — You're the second slide\n- "Help left!" / "Help right!" — You're one pass away and ready to slide from that direction\n- "Fire! Fire!" — Slide NOW, the ball carrier is driving\n- "Check!" — The ball carrier is looking to pass, tighten up\n\nOn Offense:\n- "I'm open!" — You're free for a pass\n- "Switch!" — Trade assignments or positions\n- "Time!" — You have time, don't rush the play\n- "Shot!" — Telling everyone you're about to shoot so they can crash for the rebound\n\nIn Transition:\n- "Break!" — We have a numbers advantage, push it\n- "Slow it down!" — We don't have numbers, settle into offense\n- "Back!" — Get back on defense\n\nThe hardest part about finding your voice is that it feels awkward at first. You might feel weird yelling on the field if you've never done it. Here's the truth: nobody judges you for communicating. Your coaches WANT you to talk. Your teammates NEED you to talk.\n\nStart small. Pick one call per practice — just "Ball!" when you're sliding on defense. Once that feels natural, add another. Then another. Before long, you'll be one of the loudest players on the field.\n\nCOACHING POINTS\n- Talking when you're tired is the real test — if you can communicate tired, you can communicate any time\n- Verbal leadership is just as important as physical leadership\n- The best communicators make everyone around them better`,
    questions: [
      {
      question: "Good on-field communication sounds like:",
      options: [
        "Random shouting",
        "Specific calls — 'I got ball', 'Slide', 'Cutter'",
        "Whispered to nearest teammate",
        "Only after coach yells first"
      ],
      correctAnswer: 1,
      explanation: "Specific, timely info that helps teammates make decisions.",
    },
      {
      question: "On defense, what does 'I'm hot' mean?",
      options: [
        "I'm shooting next",
        "I'm covering the ball",
        "I'm the first slide",
        "I want a sub"
      ],
      correctAnswer: 2,
      explanation: "'I'm hot' or 'I got two' = I'm the first slide.",
    },
      {
      question: "When should an offensive player yell 'Shot!'",
      options: [
        "After the ball goes in",
        "Before the shot, so teammates crash for rebound",
        "Only on missed shots",
        "Whenever they touch the ball"
      ],
      correctAnswer: 1,
      explanation: "Calling shot lets teammates crash the crease for the backup.",
    },
      {
      question: "If communicating feels awkward at first, what's the move?",
      options: [
        "Skip it — wait until you're older",
        "Pick one call and practice it until it's natural",
        "Only talk in games, not practice",
        "Wait for a captain to start"
      ],
      correctAnswer: 1,
      explanation: "Start small. One call at a time builds the habit.",
    },
      {
      question: "Late in the game. You're on D. Your man cuts behind the goal. The defenseman next to you is now responsible — but he's looking the wrong way. What do you yell?",
      options: [
        "Just stay quiet — let him figure it out",
        "'Switch! Your man, behind!'",
        "'Coach! Sub!'",
        "'I got him' even though you don't"
      ],
      correctAnswer: 1,
      explanation: "Specific, urgent call. Teammate gets the info he needs RIGHT NOW. Silence = goal.",
      kind: "scenario",
      scenario: "Late 4th quarter. Your man cuts behind the goal — you can't follow because of the slide rules. The next defenseman is responsible but staring at the ball.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=XLpXy_AOCfg",
    keyTakeaways: [
      "Lacrosse is a talking game. Quiet teams lose.",
      "Defense calls: 'I got ball', 'I'm hot' (1st slide), 'I got two' (2nd slide), 'Fire!'",
      "Offense calls: 'I'm open', 'Switch', 'Time', 'Shot' (so teammates crash for rebound).",
      "Talking when tired is the real test. If you can talk tired, you can talk anytime.",
    ],
  },
  {
    id: "boys-middle-l8",
    lessonNumber: 8,
    title: "Owning Your Role",
    topic: "Character",
    pillar: "leadership",
    description: `Not every player on a team is the star scorer. Not every player starts. But every player has a role — and the teams that win are the ones where every kid OWNS their role completely.\n\nMaybe you're the defensive midfielder who disrupts the other team's transition. Maybe you're the short-stick defensive middie who takes the faceoffs. Maybe you're the second-line midfielder who brings energy off the bench every time you sub in. Whatever your role is, commit to it fully.\n\nOwning your role means two things. First, understand what your coaches need from you. If you're a defenseman, your job isn't to score — it's to shut down the other team's best attackman. If you're a backup goalie, your job in practice is to make the starters better by competing in every drill. Ask your coach: "What do you need from me?" That question alone shows maturity.\n\nSecond, maximize your role. Don't just accept it — dominate it. If you're a role player, be the BEST role player. If you only get 5 minutes of playing time, make those 5 minutes the hardest 5 minutes the other team sees. If you're on the sideline, be the loudest voice cheering your teammates on.\n\nHere's what coaches notice: the kid who does his job without complaining, without needing credit, without looking at the bench after every play. That kid earns more responsibility over time. The kid who complains about his role, refuses to do the little things, or sulks when he doesn't start? That kid stays where he is.\n\nGreat teams need every player to buy in. Not everyone can score 5 goals. But everyone can do their job at 100%.`,
    questions: [
      {
      question: "If you're not a starter, what's the right approach?",
      options: [
        "Complain until you start",
        "Own your role and maximize it",
        "Ask to switch teams",
        "Stop trying as hard"
      ],
      correctAnswer: 1,
      explanation: "Maximize what you're given. That's how you earn more.",
    },
      {
      question: "Best question to ask your coach?",
      options: [
        "'Why am I not starting?'",
        "'Can I play a different position?'",
        "'What do you need from me?'",
        "'When can I leave practice?'"
      ],
      correctAnswer: 2,
      explanation: "Asking what the team needs shows maturity and earns trust.",
    },
      {
      question: "What do coaches notice about role players?",
      options: [
        "Only the ones who score",
        "Only the tallest kids",
        "The ones who do their job fully without needing credit",
        "The ones who complain loudly"
      ],
      correctAnswer: 2,
      explanation: "Coaches reward players who commit to their role fully.",
    },
      {
      question: "What does a 'best role player' look like in practice?",
      options: [
        "Same speed as starters in every drill",
        "Coasts because their reps don't matter",
        "Goes harder than starters, makes them better",
        "Only competes when scouts are there"
      ],
      correctAnswer: 2,
      explanation: "Bench players who push starters in practice make the whole team better.",
    },
      {
      question: "You only play 5 minutes a game. Coach has rotations set. What's the move?",
      options: [
        "Sulk on the bench until your shift",
        "Make those 5 minutes the hardest 5 minutes the other team sees",
        "Ask to play a different position",
        "Stop trying as hard in practice"
      ],
      correctAnswer: 1,
      explanation: "5 minutes of full-throttle effort earns more minutes. Sulking earns less. Coaches see the difference.",
      kind: "scenario",
      scenario: "Mid-season. You've gotten 5-6 minutes a game while teammates start. The matchup tonight is winnable. Coach rotates you in.",
    },
    ],
    keyTakeaways: [
      "Every player has a role. Owning it fully is what coaches reward.",
      "Ask coach: 'What do you need from me?' — best question you can ask.",
      "Maximize your role. Best role player > complaining starter.",
      "Coaches notice the kid who does his job without complaining. That kid earns more over time.",
    ],
  },
  {
    id: "boys-middle-l9",
    lessonNumber: 9,
    title: "Trust on the Field",
    topic: "Mental Game",
    pillar: "team",
    description: `Trust is the foundation of every great team. When you trust your teammates, you play faster, harder, and smarter. When you don't trust them, you hesitate, try to do everything yourself, and the team falls apart.\n\nWhat does trust look like on a lacrosse field?\n\nOn offense, trust means making the extra pass. When you see a teammate cutting to the goal, you throw the ball because you trust them to catch it and finish. If you don't trust them, you hold the ball and try to score yourself. One way makes the team better. The other makes you a ball hog.\n\nOn defense, trust means sliding hard. When you slide to help a teammate who got beat, you're leaving your own man open. You do it because you trust the next defender to rotate and fill your spot. If everyone trusts the system, the slides work perfectly. If one person hesitates because they don't trust the rotation, the whole defense breaks.\n\nTrust is built in practice — not in games. Every rep where you make the right pass and your teammate catches it builds trust. Every rep where the slide comes on time builds trust. Every practice where everyone shows up on time, works hard, and does their job builds trust. Trust is just repetition plus reliability.\n\nThe opposite of trust is trying to do everything yourself. We've all seen the kid who dodges every time he gets the ball because he doesn't trust anyone else to score. That player might score a few goals, but his team will never be great. The best players make everyone around them better — and that starts with trusting your teammates.`,
    questions: [
      {
      question: "How is trust between teammates built?",
      options: [
        "Through team meetings",
        "Through hanging out off the field",
        "Through reps — reliable effort over time",
        "Through the captain's leadership alone"
      ],
      correctAnswer: 2,
      explanation: "Trust is the residue of repetition.",
    },
      {
      question: "Trust on offense looks like:",
      options: [
        "Dodging every time you touch the ball",
        "Making the extra pass to the open man",
        "Passing only to the best player",
        "Holding the ball to control tempo"
      ],
      correctAnswer: 1,
      explanation: "Trusting teammates means sharing the ball — even if you could shoot.",
    },
      {
      question: "What happens when a defense doesn't trust each other?",
      options: [
        "They become more aggressive",
        "Players hesitate on slides, defense breaks",
        "Goalie has to make more saves",
        "It doesn't really affect performance"
      ],
      correctAnswer: 1,
      explanation: "Hesitation on slides = open shots = goals against.",
    },
      {
      question: "Sign that a team has high trust?",
      options: [
        "Loud captain in every huddle",
        "Ball moves fast — extra passes for better shots",
        "Coach yells less in games",
        "Wearing matching cleats"
      ],
      correctAnswer: 1,
      explanation: "Quick ball movement = trust. Players believe the next guy will catch and shoot.",
    },
      {
      question: "You're 1 vs 1, top of the zone. You see your crease attackman wide open inside. You also have a tight shot at the cage from where you are. The trust move?",
      options: [
        "Take your shot — you have it",
        "Skip it inside to the wide-open crease attackman",
        "Pass it back to the midfielder behind you",
        "Hold the ball and wait for clarity"
      ],
      correctAnswer: 1,
      explanation: "Wide-open inside > tight outside shot every time. Make the trust pass — your team gets a layup.",
      kind: "scenario",
      scenario: "Top of the zone, 1v1. You're a decent shooter from there. But your crease attackman has slipped his man and is wide open.",
    },
    ],
    videoUrl: "https://www.youtube.com/watch?v=7uDxcG8BXZ8",
    keyTakeaways: [
      "Trust = playing fast and hard because you believe teammates will do their job.",
      "On offense: trust = making the extra pass. Without trust, players try to do it all alone.",
      "On defense: trust = sliding aggressively. Without trust, slides come late and break down.",
      "Trust is built in practice — every right pass, every on-time slide adds to the bank.",
    ],
  },
  {
    id: "boys-middle-l10",
    lessonNumber: 10,
    title: "Winning and Losing Together",
    topic: "Mental Game",
    pillar: "team",
    description: `Great teams handle wins and losses the same way — as a group. No one player wins a game, and no one player loses one. The sooner you understand this, the better teammate you'll be.\n\nWhen you win, celebrate together. Don't let one kid take all the credit. The goal scorer needed the assist. The assist needed the ground ball. The ground ball needed the ride. Every goal is the result of multiple players doing their jobs. Make sure everyone feels like they contributed — because they did.\n\nWhen you lose, own it together. This is harder. After a tough loss, it's tempting to say "if he didn't miss that shot" or "if the goalie saved that one." Stop. The game was decided by hundreds of plays, not just one. Your team lost together — maybe the defense got beat in transition, maybe the offense turned it over in the 3rd quarter, maybe the rides weren't aggressive enough. Everybody contributed to the loss, so everybody owns it.\n\nThe worst thing a team can do after a loss is blame one person. That destroys trust faster than anything. When one kid becomes the scapegoat, the whole team stops taking risks because nobody wants to be "that guy" next time. Fear of blame makes teams play tight and cautious — the opposite of what you want.\n\nThe best thing a team can do after a loss is be honest, stay positive, and work harder at the next practice. Say "we'll fix it" and then actually fix it. That's how good teams become great teams — they don't run from tough moments, they grow through them.`,
    questions: [
      {
      question: "After a tough loss, who should take the blame?",
      options: [
        "The goalie if shots got in",
        "The kid who missed the last shot",
        "Nobody alone — the team owns it together",
        "The coach for not adjusting"
      ],
      correctAnswer: 2,
      explanation: "Games are decided by hundreds of plays. Blaming one person destroys trust.",
    },
      {
      question: "Why is blaming one teammate after a loss so harmful?",
      options: [
        "It's not really that bad",
        "It makes the team afraid to take risks",
        "Coaches don't notice",
        "Only matters if it happens repeatedly"
      ],
      correctAnswer: 1,
      explanation: "Fear of being the scapegoat makes teams play tight and cautious.",
    },
      {
      question: "Best response to a tough loss?",
      options: [
        "Quit the team",
        "Pretend it didn't happen",
        "Be honest, stay positive, work harder next practice",
        "Argue about which call cost the game"
      ],
      correctAnswer: 2,
      explanation: "Own it, learn, fix it. That's how teams grow.",
    },
      {
      question: "After a big win, the ideal team response is:",
      options: [
        "The top scorer takes the credit",
        "Spread credit — every goal needed an assist needed a GB",
        "Tell the losing team what they did wrong",
        "Post highlights immediately"
      ],
      correctAnswer: 1,
      explanation: "Wins are collective. Make sure everyone feels they contributed — because they did.",
    },
      {
      question: "Right after a tough overtime loss, your starting goalie is in tears. Two teammates are blaming the defense out loud. What do you do?",
      options: [
        "Go to the goalie — 'we win as a team, lose as a team'",
        "Agree with the teammates blaming defense",
        "Walk to the parking lot quickly",
        "Yell at everyone to stop"
      ],
      correctAnswer: 0,
      explanation: "Pick up your goalie. Shut down the blame. The team's identity is set in moments like these.",
      kind: "scenario",
      scenario: "Overtime loss, 9-8. Your goalie is in tears — they think the last goal was their fault. Two teammates nearby are blaming the defense out loud.",
    },
    ],
    keyTakeaways: [
      "Wins and losses are team outcomes — no individual wins or loses one.",
      "After wins: spread credit. The shot needed the assist needed the ground ball.",
      "After losses: own it together. Don't blame one player — that destroys trust.",
      "Best response to a tough loss: 'we'll fix it' — and actually fix it next practice.",
    ],
  },
]

const BOYS_HIGH_LESSONS: AcademyLesson[] = [
  {
    id: "boys-high-l1",
    lessonNumber: 1,
    title: "Advanced Offensive Sets",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `By high school, you need to understand offensive systems — not just how to score on your own, but how your team creates scoring chances together through sets, motion, and ball reversal.\n\nOFFENSIVE SETS\n\n1. 2-2-2 Formation\nTwo attackmen up top, two midfielders on the wings, two attackmen low (one at each side of the crease/GLE). This is a balanced formation that gives you scoring threats from every angle.\n\n2. 1-4-1 Formation\nOne player at the top (called "the point"), four spread across the middle, one behind the goal at X. This set stretches the defense horizontally and creates isolation dodge opportunities.\n\n3. 3-3 Formation\nThree attackmen across the top, three forming the bottom arc. This is the classic look — good for ball movement and off-ball picks.\n\nKEY CONCEPTS\n\nMotion: Off-ball players are constantly moving — cutting, screening, repositioning. Good motion is hard to defend because the defense can never settle. The keys are timing and spacing (5+ yards apart so defenses can't double-team).\n\nBall Reversal: Moving the ball from one side of the field to the other. Defenses are designed to slide toward the ball. When you reverse quickly (topside to X, X to the other wing), the defense has to scramble — that's when openings appear.\n\nPick the Picker: A concept where the player who just set a pick immediately gets a pick set for them. The defense is still recovering from the first action when the second one hits. This is a staple of elite offenses.\n\nReading Slides: Don't dodge into help. Before you commit to a dodge, look for the slide. If you see it coming early, pass to the player the slider left. If you don't see help, dodge hard and finish. Patience creates better shots than forced 1v1 dodges.\n\nCOACHING POINTS\n- Watch film of college offenses running 2-2-2 and 1-4-1 — pause and study the off-ball movement\n- The best offenses don't need highlight-reel dodges — they move the ball and find the open man\n- "Throw it forward, look inside" — move the ball up the field, then find the player cutting to the crease`,
    questions: [
      {
        question: "What is a 2-2-2 offensive set?",
        options: [
          "Two players in three lines",
          "Two attack up top, two midfielders, two attack low",
          "A drill name",
          "A defensive set",
        ],
        correctAnswer: 1,
        explanation: "2-2-2 is two players at each level — top, middle, and behind the goal.",
      },
      {
        question: "What does 'reversing the ball' do to a defense?",
        options: [
          "Confuses the offense",
          "Makes the defense scramble to slide the other way",
          "Nothing",
          "Causes a penalty",
        ],
        correctAnswer: 1,
        explanation: "Quick ball reversal forces the defense to chase, creating openings.",
      },
      {
        question: "When dodging, what should you look for first?",
        options: [
          "Empty net",
          "The slide — if you see it coming, pass to the open player",
          "The fans",
          "Your shoes",
        ],
        correctAnswer: 1,
        explanation: "Reading slides is the difference between a great dodge and a bad turnover.",
      },
    ],
  },
  {
    id: "boys-high-l2",
    lessonNumber: 2,
    title: "Slide Packages and Team Defense",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Team defense at the high school level requires every player to understand the slide package — the system your team uses to help each other when an offensive player beats his man. If you don't know the slide package, you're a liability.\n\nSLIDE SYSTEMS\n\n1. Adjacent Slide\nWhen the on-ball defender gets beat, the player adjacent (next to him) slides to stop the dodger. The next defender "fills" — rotating to cover the player the slider left. Everyone moves together like a chain reaction. This is the most common system.\n\n2. Crease Slide\nThe slide comes from a defender near the crease — whoever is guarding the offensive player closest to the goal. This slide arrives earlier (the crease defender is closest to the dodger) but leaves the most dangerous area open, requiring perfect rotations.\n\n3. Recovery\nAfter the slide stops the ball, everyone has to recover. The slider gets back to his man, the fill gets back to his man, and the defense resets. The whole sequence — slide, stop, fill, recover — should take 2-3 seconds.\n\nCOMMUNICATION\nSlides don't work without talking. Your goalie is the quarterback:\n- "Fire!" — Slide NOW\n- "Hold!" — Stay on your man, don't slide yet\n- "Two!" — I'm the second slide if we need it\n- "Crank!" — Check sticks, the ball carrier is winding up to shoot\n- "Clear!" — We have the ball, push it out\n\nThe biggest mistake: hesitating. If you're the slider, GO. Don't wait to see if the on-ball defender recovers. Late slides are worse than no slides — the defense is out of position AND the ball carrier has a head of steam.\n\nSSDM DEFENSE\nShort-Stick Defensive Middie — the midfielder who plays lockdown defense on the other team's best offensive middie. This player has to be able to guard in space, communicate slides, and play team defense at an elite level. Some of the best SSDM defenders in college are the smartest players on the field, not the biggest.\n\nCOACHING POINTS\n- Practice slides in 3v2, 4v3, and 5v4 situations\n- Every player — including attackmen — should know the slide package for rides and transition\n- Film study: watch how the defense rotates after the initial slide. That recovery is where most breakdowns happen`,
    questions: [
      {
        question: "In an adjacent slide package, who slides when the on-ball defender gets beat?",
        options: [
          "The goalie",
          "The defender right next to (adjacent to) the on-ball defender",
          "The farthest defender",
          "Nobody — they recover on their own",
        ],
        correctAnswer: 1,
        explanation: "Adjacent slides come from the player right next to the on-ball defender.",
      },
      {
        question: "Should attackmen learn the team's slide package?",
        options: [
          "No, only defensemen",
          "Yes — they need it for rides and transition",
          "Only goalies",
          "Only captains",
        ],
        correctAnswer: 1,
        explanation: "Every position should know team defense — it matters for rides, transition, and team awareness.",
      },
      {
        question: "What's worse than no slide?",
        options: [
          "A perfect slide",
          "A late slide — by then it's too late",
          "An early slide",
          "No slide at all",
        ],
        correctAnswer: 1,
        explanation: "Late slides leave the defender out of position and let the offense pass to the open man easily.",
      },
    ],
  },
  {
    id: "boys-high-l3",
    lessonNumber: 3,
    title: "How to Watch Film",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Film study is the biggest separator at the high school level. The players who watch film correctly improve dramatically faster than those who don't. But most players don't know HOW to watch film — they just stare at it.\n\nHere's how to watch film with purpose:\n\nFirst, watch with a question in mind. Don't just watch — watch FOR something. Examples: "How does my defender position himself when I dodge?" "Where are the slides coming from?" "What does my team do well in transition?" Having a question keeps you focused.\n\nSecond, watch off-ball. Most players watch the ball. The ball doesn't teach you anything — you already know what happens with the ball. What teaches you is what happens AWAY from the ball. Watch the slides developing. Watch the cuts. Watch how good players move when they don't have it.\n\nThird, pause and rewind. Don't watch film in real time only. When something happens, pause it. Look at every player on the field. Where was the open space? Why did the defender go where he did? What would you have done differently? Rewind and watch again.\n\nFourth, watch yourself critically. When you're watching your own film, don't look for highlights. Look for mistakes. Where did you turn the ball over? What did you miss? Where could you have cut better? Brutal self-honesty is how you fix problems.\n\nFifth, take notes. Write down 3 things you noticed and 3 things you want to work on. Bring those notes to the next practice. Film study without action is just watching TV.\n\nThe best players in college and the pros watch film daily. If you start now, by the time you're a senior, you'll be miles ahead of every player who relies only on practice.`,
    questions: [
      {
        question: "What's the best way to watch film?",
        options: [
          "In real time without stopping",
          "With a question in mind, pausing and rewinding to study details",
          "Only watching highlights",
          "On mute",
        ],
        correctAnswer: 1,
        explanation: "Active film study with focused questions is what makes you better.",
      },
      {
        question: "When watching your own film, what should you look for?",
        options: [
          "Only your highlights",
          "Mistakes and things to fix",
          "Your hairstyle",
          "How loud the crowd was",
        ],
        correctAnswer: 1,
        explanation: "Critical self-review is how film study leads to improvement.",
      },
      {
        question: "Why should you watch off-ball more than the ball?",
        options: [
          "It's more exciting",
          "Off-ball movement teaches you positioning, slides, and team concepts",
          "Coaches make you",
          "It's not — watch the ball",
        ],
        correctAnswer: 1,
        explanation: "The ball is obvious. Off-ball is where the lessons are hidden.",
      },
    ],
  },
  {
    id: "boys-high-l4",
    lessonNumber: 4,
    title: "The College Recruiting Process",
    topic: "Mental Game",
    pillar: "game",
    description: `If you want to play college lacrosse, you need to understand the recruiting process. Many players miss out not because they aren't talented — but because they didn't know how the process works. Here's what you need to know.\n\nRecruiting starts EARLY now. Coaches identify prospects in 8th and 9th grade. By 10th grade, top prospects are getting verbal offers. By 11th grade, most Division I rosters are largely set. This means you need to be on coaches' radar by your sophomore year if you're aiming for D1.\n\nGrades matter — A LOT. Most colleges won't even consider a player who can't get in academically. Your GPA and test scores open doors that lacrosse alone can't. Aim for the highest grades you can. The better your grades, the more options you have.\n\nYou have to do your own outreach. Don't wait for coaches to find you. Email college coaches starting freshman year — introduce yourself, share your highlight tape, list your tournaments. Be professional, polite, and brief. Most coaches won't reply but they ARE reading.\n\nGet to college camps and showcase tournaments. This is where coaches actually see you play. Pick events where the schools you want to attend will be coaching or scouting. Camps at colleges are especially valuable because the coach gets to see you up close.\n\nUse a recruiting profile (Sportsforce, NCSA, or BTB's own profile) so coaches can find your stats, video, grades, and contact info in one place.\n\nMost importantly: don't fixate on D1. There are 200+ great college lacrosse programs across D1, D2, D3, and NAIA. Many D3 programs have better player development, smaller class sizes, and just as competitive lacrosse. Find the right FIT, not just the highest division.`,
    questions: [
      {
        question: "When should you start the recruiting process?",
        options: [
          "Senior year",
          "Junior year",
          "Freshman/sophomore year — earlier than most realize",
          "After college",
        ],
        correctAnswer: 2,
        explanation: "Top D1 programs identify prospects in 8th-9th grade — start early.",
      },
      {
        question: "How important are grades in college recruiting?",
        options: [
          "Not important",
          "Slightly important",
          "Very important — they open or close doors",
          "Only for D3",
        ],
        correctAnswer: 2,
        explanation: "Grades determine what schools will even consider you, regardless of lacrosse skill.",
      },
      {
        question: "What's the right approach to D1 vs D3?",
        options: [
          "D1 is always better",
          "Find the best fit, not just the highest division",
          "Only consider D1",
          "Only consider D3",
        ],
        correctAnswer: 1,
        explanation: "Fit matters more than division. Many D3 programs are excellent.",
      },
    ],
  },
  {
    id: "boys-high-l5",
    lessonNumber: 5,
    title: "Elite Mental Game",
    topic: "Mental Game",
    pillar: "leadership",
    description: `By high school, mental game becomes one of the biggest differences between good and great players. Physical talent gets you to the team. Mental game determines how far you go.\n\nHere are the mental skills the best high school players develop:\n\nVisualization. Before games, the best players visualize themselves succeeding. They picture making the dodge, hitting the shot, making the play. This isn't woo-woo nonsense — it's a science. Visualization actually programs your nervous system to execute when the moment comes. Spend 5 minutes the night before a game visualizing yourself playing your best.\n\nThe 5-second reset. When something bad happens — a turnover, a missed shot, a bad call — give yourself 5 seconds to feel the frustration. Then physically reset (breath, touch your stick, refocus your eyes) and go play the next play. The 5-second rule works because emotions only last seconds if you don't feed them. Players who hold onto frustration for whole quarters destroy their own performance.\n\nProcess over outcome. Outcome thinking ("I have to score") creates pressure. Process thinking ("I'm going to attack hard and trust my training") creates flow. Focus on what you can control — your effort, your reads, your execution. The score takes care of itself.\n\nGratitude for the opportunity. Sounds soft, but it works. The best players remember that getting to play this game is a privilege. When you appreciate the chance to compete, the pressure goes down and the joy goes up. Tense players play tight. Loose players play free. Gratitude keeps you loose.\n\nMental skills are like physical skills — they have to be practiced. Most players never train them. The ones who do separate themselves quickly.`,
    questions: [
      {
        question: "What's the '5-second reset'?",
        options: [
          "A type of shot",
          "Giving yourself 5 seconds to feel frustration, then physically resetting and refocusing",
          "A defensive drill",
          "A penalty timer",
        ],
        correctAnswer: 1,
        explanation: "The 5-second reset prevents emotions from destroying your next play.",
      },
      {
        question: "What does 'process over outcome' mean?",
        options: [
          "Focusing on the score",
          "Focusing on what you can control — effort, reads, execution",
          "Letting the coach decide everything",
          "Thinking about winning",
        ],
        correctAnswer: 1,
        explanation: "Process focus creates flow. Outcome focus creates pressure.",
      },
      {
        question: "Does visualization actually help athletic performance?",
        options: [
          "No — it's just woo-woo",
          "Yes — it programs the nervous system for execution",
          "Only in basketball",
          "Only for goalies",
        ],
        correctAnswer: 1,
        explanation: "Visualization is backed by sports science — the brain rehearses what the body will do.",
      },
    ],
  },
  {
    id: "boys-high-l6",
    lessonNumber: 6,
    title: "Captaincy and Senior Leadership",
    topic: "Character",
    pillar: "leadership",
    description: `Senior leadership is the most important thing on any high school team. The best teams aren't always the most talented — they're the ones with seniors who set the standard for everyone else. If you want to be a captain, here's what real captaincy looks like.\n\nA captain is the bridge between coaches and players. When the coach has a message, the captain reinforces it in the locker room. When players have concerns, the captain brings them to the coach respectfully. You speak both languages.\n\nA captain holds people accountable — even friends. This is the hardest part. When your best friend is going half-speed in practice, you have to say something. Not in a mean way. Not by yelling. But honestly: "Hey, I need you locked in. We need you." Real captains care more about the team than about being liked.\n\nA captain runs the locker room. The energy in your locker room is your responsibility. If players are quiet and tight before games, you change that. If players are too loose and unfocused, you change that too. The captain sets the temperature.\n\nA captain takes losses harder than wins. After a loss, captains don't blame coaches, refs, or teammates. They take responsibility, talk about what went wrong, and lead the response in the next practice. Wins are easy. Losses are when leadership shows.\n\nA captain develops younger players. Every team has freshmen and sophomores looking up to the seniors. Spend time with them. Teach them. Encourage them. Make them feel like they belong. The captains who do this leave the program better than they found it — and that's the highest form of leadership.\n\nNot every senior will be a captain. But every senior should lead. The senior class sets the culture for the whole program. Take that responsibility seriously, and your team will be one nobody forgets.`,
    questions: [
      {
        question: "What's a captain's role between coaches and players?",
        options: [
          "Take sides",
          "Be a bridge — reinforce coach messages and bring player concerns up respectfully",
          "Stay silent",
          "Replace the coach",
        ],
        correctAnswer: 1,
        explanation: "Captains translate between coaches and players, creating trust on both sides.",
      },
      {
        question: "How does a real captain handle a friend who's slacking?",
        options: [
          "Ignore it",
          "Yell at them publicly",
          "Talk to them directly and honestly — caring more about the team than being liked",
          "Tell on them",
        ],
        correctAnswer: 2,
        explanation: "Direct, honest accountability is how captains earn respect — even from friends.",
      },
      {
        question: "When do captains' leadership skills matter most?",
        options: [
          "When winning easy",
          "After losses — taking responsibility and leading the response",
          "Only at practice",
          "Never",
        ],
        correctAnswer: 1,
        explanation: "Anyone can lead when you're winning. Real leaders show up when things are hard.",
      },
    ],
  },
  {
    id: "boys-high-l7",
    lessonNumber: 7,
    title: "Leading Without a Title",
    topic: "Character",
    pillar: "leadership",
    description: `Most teams have 2-3 captains. But the best teams have leadership throughout the entire roster. You don't need a "C" on your jersey to lead. In fact, some of the most impactful leaders on championship teams were never named captain.\n\nLeading without a title means setting the standard every day — at practice, in the weight room, in the film room. You're the junior who's first to every drill. You're the sophomore who stays after to work on his off-hand. You're the underclassman who knows the plays cold because you studied them on your own.\n\nIt also means holding people accountable when it's uncomfortable. When your friend is going 70% in a drill, leading without a title means pulling him aside and saying "I need more from you." Not loudly. Not in front of everyone. Just directly and honestly. Most people avoid these conversations. Leaders have them.\n\nLeading without a title means doing the unglamorous work. Picking up cones. Setting up the field. Carrying the ball bag. Making sure freshmen feel welcome. These small acts build culture more than any speech. The seniors and captains notice — and they trust you more because of it.\n\nHere's the reality: coaches don't name captains based on one moment. They watch all season. They notice who leads in October, not just in May. If you want to be a captain someday, start leading right now — title or not. By the time the vote happens, everyone will already know you're a leader.`,
    questions: [
      {
        question: "Do you need to be named captain to lead?",
        options: ["Yes, you need the title", "No — leadership is about actions, not titles", "Only seniors lead", "Coaches assign leadership"],
        correctAnswer: 1,
        explanation: "The best teams have leaders at every level. Titles are earned by leading first.",
      },
      {
        question: "How do coaches decide who to name captain?",
        options: ["Best player gets it", "Random selection", "They watch who leads all season — in October, not just May", "Popularity vote only"],
        correctAnswer: 2,
        explanation: "Captaincy is earned through consistent leadership over the whole season.",
      },
      {
        question: "What's the most impactful type of 'leading without a title'?",
        options: ["Making speeches", "Doing the unglamorous work and holding people accountable", "Scoring the most goals", "Being the loudest"],
        correctAnswer: 1,
        explanation: "Culture is built through small acts — picking up cones, welcoming freshmen, having honest conversations.",
      },
    ],
  },
  {
    id: "boys-high-l8",
    lessonNumber: 8,
    title: "Team Chemistry",
    topic: "Mental Game",
    pillar: "team",
    description: `Team chemistry is the difference between a group of talented individuals and a championship team. It's the invisible force that makes teammates play harder for each other, communicate without thinking, and refuse to let each other down.\n\nChemistry doesn't happen by accident. It's built intentionally through shared experiences — hard practices where everyone pushes through together, team dinners where guys get to know each other off the field, bus rides to tournaments where inside jokes start, and tough losses where nobody points fingers.\n\nThe best teams have a simple trait: they genuinely like each other. Not just tolerate — actually enjoy being around each other. That doesn't mean everyone is best friends. It means everyone respects each other and wants to compete for each other. When you like your teammates, you sprint harder on defense because you don't want to let them down. You make the extra effort on a ride because you know they'd do the same for you.\n\nBuilding chemistry takes vulnerability. You have to be willing to be honest in the film room. You have to admit when you messed up. You have to accept coaching from a teammate without getting defensive. Teams where everyone protects their ego never develop real chemistry.\n\nAs an upperclassman, you can build chemistry by including everyone. The freshmen sitting alone at lunch? Invite them over. The quiet kid who doesn't say much? Find out what he's about. The more connected your team is as people, the more connected you'll be on the field. Chemistry can't be coached — but it can be cultivated.`,
    questions: [
      {
        question: "How is team chemistry built?",
        options: ["It just happens naturally", "Intentionally — through shared hard experiences, honesty, and connection off the field", "Only by winning", "Coaches create it"],
        correctAnswer: 1,
        explanation: "Chemistry is built through shared experiences and genuine connection — not luck.",
      },
      {
        question: "What role does vulnerability play in team chemistry?",
        options: ["None — vulnerability is weakness", "It's essential — admitting mistakes and accepting feedback builds trust", "Only coaches need to be vulnerable", "It's overrated"],
        correctAnswer: 1,
        explanation: "Ego kills chemistry. Vulnerability — owning mistakes, taking coaching — builds real trust.",
      },
      {
        question: "How can upperclassmen help build chemistry?",
        options: ["Only hang out with other seniors", "Include everyone — freshmen, quiet kids, new players", "Let the coach handle it", "Focus only on the best players"],
        correctAnswer: 1,
        explanation: "Connection off the field translates to chemistry on the field. Include everyone.",
      },
    ],
  },
  {
    id: "boys-high-l9",
    lessonNumber: 9,
    title: "Sacrifice for the Team",
    topic: "Mental Game",
    pillar: "team",
    description: `At the high school level, the best teams are built on sacrifice. Sacrifice means putting what the team needs ahead of what you want — and doing it without complaining.\n\nSacrifice shows up in real moments:\n\nYou're an attackman who averages 3 goals a game. The coach asks you to play midfield because the team needs your athleticism in transition. You don't argue. You learn the position and give it everything because the team needs you there.\n\nYou're a senior who's earned the starting spot at close defense. The coach wants to rotate a sophomore in during the second half to develop him. You mentor the kid, teach him the slide package, and cheer him on — even though it costs you minutes.\n\nYour legs are dead in the fourth quarter of a playoff game. Your body wants to jog. But the team needs one more stop, one more clear, one more sprint in transition. You push through the pain because your teammates are counting on you.\n\nSacrifice isn't dramatic. It's not a speech. It's the daily choice to put the team above yourself. It's riding the bus to an away game you know you won't play much in, but bringing energy from the sideline. It's doing the extra conditioning rep because the coach said "team" reps, and you won't let your teammates down.\n\nThe greatest players in any sport — the ones people remember — aren't remembered for stats. They're remembered for what they gave up for the team. And the funny thing is: the players who sacrifice the most often end up getting more back. Coaches trust them. Teammates love them. And they win.`,
    questions: [
      {
        question: "A coach asks you to switch positions for the team's benefit. What's the right response?",
        options: ["Refuse — you earned your spot", "Complain to your parents", "Accept it and give the new role everything you have", "Quit the team"],
        correctAnswer: 2,
        explanation: "Sacrifice for the team is what winners do. The team's needs come first.",
      },
      {
        question: "What does daily sacrifice look like on a team?",
        options: ["Big dramatic moments", "Quiet choices — extra reps, bringing energy from the sideline, mentoring younger players", "It doesn't exist", "Only captains sacrifice"],
        correctAnswer: 1,
        explanation: "Sacrifice is daily, unglamorous, and often unnoticed — but it builds championships.",
      },
      {
        question: "Why do players who sacrifice often end up getting MORE from the sport?",
        options: ["They don't", "Coaches trust them, teammates love them, and they win more", "They get lucky", "Only in the movies"],
        correctAnswer: 1,
        explanation: "Sacrifice earns trust and respect. These players become the heart of winning teams.",
      },
    ],
  },
  {
    id: "boys-high-l10",
    lessonNumber: 10,
    title: "The Legacy You Leave",
    topic: "Mental Game",
    pillar: "team",
    description: `Every team eventually becomes a memory. The seniors graduate. The roster turns over. The only thing that survives is the culture you built — and that culture becomes the legacy you leave behind.\n\nLegacy isn't about your stats. Nobody remembers how many goals you scored in 10 years. They remember how you made people feel. They remember whether you were the kind of teammate who lifted others up or tore them down. They remember the culture you created.\n\nThe best legacy you can leave is a team that's better AFTER you leave. That means you didn't just play hard — you taught the younger players how to play hard. You didn't just show up on time — you taught the underclassmen why showing up early matters. You passed down the standard.\n\nThink about the seniors who were on your team when you were a freshman. What did they teach you? How did they make you feel? Did they make you feel welcome or excluded? Did they push you to be better or ignore you? Whatever you answer — that's their legacy. Now ask yourself: what will YOUR freshmen say about you in three years?\n\nEvery practice is a chance to build your legacy. Every interaction with a younger player. Every time you pick someone up after a mistake. Every time you set the tone in conditioning. Every time you hold yourself to the standard when it would be easier to coast.\n\nWhen you're done playing, you won't remember the score of that Tuesday practice. But you'll remember the guys you competed with. You'll remember what it felt like to be part of something bigger than yourself. And the younger players who watched you will carry forward what you showed them. That's legacy — and it's the most important thing you'll build in your entire lacrosse career.`,
    questions: [
      {
        question: "What is a player's legacy?",
        options: ["Their stats", "The culture and standard they leave behind for the next group", "Their highlight reel", "How many wins they had"],
        correctAnswer: 1,
        explanation: "Legacy is the culture you created and the players you developed — not stats.",
      },
      {
        question: "How do you build a lasting legacy?",
        options: ["Score the most goals", "Teach younger players the standard, lift others up, build culture every day", "Win a championship", "Get recruited"],
        correctAnswer: 1,
        explanation: "Legacy is built daily — through mentorship, effort, and passing down the standard.",
      },
      {
        question: "Why should you care about what freshmen think of you?",
        options: ["You shouldn't", "Because they will carry forward whatever you showed them — your culture lives through them", "Only if they're talented", "Freshmen don't matter"],
        correctAnswer: 1,
        explanation: "The younger players are watching everything. What you model becomes the program's future.",
      },
    ],
  },
]

// ─── GIRLS LESSONS ────────────────────────────────────────────────────

const GIRLS_YOUTH_LESSONS: AcademyLesson[] = [
  {
    id: "girls-youth-l1",
    lessonNumber: 1,
    title: "Welcome to Girls Lacrosse",
    topic: "Fundamentals",
    pillar: "game",
    description: `Girls lacrosse is one of the fastest-growing sports in the world. It's a beautiful, fast-paced game that combines speed, skill, and smart decision-making. While it shares roots with boys lacrosse, the girls game has its own rules, style, and feel.\n\nGirls lacrosse is a non-contact sport (compared to boys). You don't wear pads or a helmet — just goggles, a mouthguard, and your stick. Stick checking is allowed but it's controlled and limited. The emphasis is on skill, footwork, positioning, and clean play. Players who try to play physically usually get fouls called against them.\n\nThe field is bigger than boys lacrosse, and there are 12 players per team — 11 field players plus a goalie. Positions are attack, midfield, defense, and goalie. The ball is the same size and shape as boys lacrosse, and the goal is the same — score by getting the ball into the opposing net.\n\nThe game is played in two halves with a clock. Goals can be scored from anywhere on the field, but most happen close to the net.\n\nWhat makes girls lacrosse special is the speed of the decisions. Because you can't bash people around, the game is about reading the field, timing your cuts, and using smart footwork to get open. The best players are the ones who think the fastest — not necessarily the strongest.\n\nWelcome to the game. There's no better sport to learn how to compete, communicate, and grow as both an athlete and a person.`,
    questions: [
      {
        question: "How many players are on the field per team in girls lacrosse?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "12 players per team — 11 field players plus a goalie.",
      },
      {
        question: "What protective equipment do girls lacrosse players wear?",
        options: [
          "Helmets and pads like boys",
          "Goggles, mouthguard, and a stick — that's it for field players",
          "Just gloves",
          "Full body armor",
        ],
        correctAnswer: 1,
        explanation: "Girls lacrosse is non-contact — goggles and a mouthguard are the main protection.",
      },
      {
        question: "What's the most important quality in girls lacrosse players?",
        options: [
          "Being the strongest",
          "Being the tallest",
          "Thinking and reacting fast — smart decision-making",
          "Having the newest stick",
        ],
        correctAnswer: 2,
        explanation: "Speed of decision-making is what separates the best players.",
      },
    ],
  },
  {
    id: "girls-youth-l2",
    videoUrl: "https://www.youtube.com/watch?v=a4fWOtC8C7Q",
    lessonNumber: 2,
    title: "Cradling and Stick Control",
    topic: "Fundamentals",
    pillar: "game",
    description: `Cradling is how you keep the ball in your stick while you move. In girls lacrosse, the pockets are shallower than the boys game — which means your cradling technique has to be smooth and controlled.\n\nHOW TO CRADLE — STEP BY STEP\n\n1. Grip the Stick Correctly\nYour top hand (closest to the head) grips firmly. Your bottom hand (near the butt end) grips loosely — it's a guide, not a clamp. Think relaxed hands. Tight grip = stiff cradle = dropped ball.\n\n2. Start the Motion\nThe cradle is a small, smooth wrist roll — like turning a key in a lock. Your top hand does most of the work. Don't swing your whole arm. The motion should be small enough that someone watching from far away barely notices it.\n\n3. Stick Protection Position\nAs you run, keep your top hand near your ear. This is called "stick protection position." It keeps the ball away from defenders and makes it much harder to check.\n\n4. Shielding\nWhen a defender is nearby, cradle on the side of your body AWAY from them. Defender on your right? Cradle left. This is called "shielding" — using your body as a wall between the defender and your stick.\n\n5. Switching Hands\nTo switch hands: loosen your bottom hand, move the stick across your body (like a knight sheathing a sword), slide your bottom hand up to meet your top hand, release your top hand and regrip. Your new top hand takes over cradling. Start learning this early — the more comfortable you are with both hands, the better.\n\nCOACHING POINTS\n- Practice cradling everywhere — walking around the house, watching TV, in the backyard\n- Start with your dominant hand, but work on your off-hand every day\n- The best players cradle without thinking about it — that only comes from reps`,
    questions: [
      {
        question: "What's different about girls lacrosse cradling vs boys?",
        options: [
          "It's the same",
          "Pockets are shallower so cradling has to be smoother",
          "Girls cradle with one hand",
          "Girls don't cradle",
        ],
        correctAnswer: 1,
        explanation: "Shallower pockets mean smoother, more controlled cradles to keep the ball in.",
      },
      {
        question: "Where should your top hand be when running with the ball?",
        options: ["Near your knee", "Behind your back", "Near your ear — stick protection position", "On the head"],
        correctAnswer: 2,
        explanation: "Top hand near the ear protects the stick from defenders.",
      },
      {
        question: "What is 'shielding'?",
        options: [
          "A type of pass",
          "Using your body to protect the stick from defenders",
          "Wearing extra pads",
          "A penalty",
        ],
        correctAnswer: 1,
        explanation: "Shielding means cradling on the side away from the defender, using your body as protection.",
      },
    ],
  },
  {
    id: "girls-youth-l3",
    videoUrl: "https://www.youtube.com/watch?v=4iOD3TjV6D8",
    lessonNumber: 3,
    title: "Passing and Catching",
    topic: "Fundamentals",
    pillar: "game",
    description: `Passing and catching — also called "throwing and receiving" — is the most important skill in girls lacrosse. If you can pass and catch, you can play. If you can't, the game gets very hard.\n\nHOW TO THROW — STEP BY STEP\n\n1. Grip and Position\nTop hand near the head of the stick, bottom hand near the butt end. Bring the stick back behind your ear with both hands.\n\n2. Step and Throw\nStep toward your target with your opposite foot (if your top hand is your right, step with your left). Point your top hand toward your target and snap your wrist as you release. Follow through — your stick should finish pointing at your target.\n\n3. Off-Hand Throwing\nOnce you're comfortable throwing with your dominant hand, start practicing with your other hand. Do the same steps. It will feel awkward at first — that's normal. The players who can throw with both hands are twice as dangerous.\n\nHOW TO CATCH — STEP BY STEP\n\n1. Give a Target\nHold your stick out with the pocket facing the passer. This is called "showing your target" or "giving a soft target." Your teammate should be able to see where to throw.\n\n2. Absorb the Ball\nAs the ball arrives, "give" with your stick by pulling it slightly back. This cushions the catch. If you keep your stick stiff, the ball bounces out.\n\n3. Transition to Cradle\nThe second you catch, start cradling immediately. Catch and cradle is one motion, not two.\n\nCOACHING POINTS\n- Wall ball is the #1 way to improve. Throw against a wall, catch it, repeat. Start with 25 per hand per day. Work up to 50.\n- "Soft hands" means absorbing the ball — don't stab at it\n- Always practice both hands — even if one side feels terrible at first`,
    questions: [
      {
        question: "When throwing, which foot should you step with?",
        options: ["Same foot as your top hand", "Opposite foot from your top hand", "Either foot", "Both"],
        correctAnswer: 1,
        explanation: "Step with your opposite foot — same as throwing a baseball.",
      },
      {
        question: "What does 'soft hands' mean in catching?",
        options: [
          "Wearing gloves",
          "Letting the stick give back as the ball arrives, absorbing it",
          "Catching with one hand",
          "Closing your eyes",
        ],
        correctAnswer: 1,
        explanation: "Soft hands absorb the ball through 'give' — preventing bounces and drops.",
      },
      {
        question: "How can you build stick skills the fastest?",
        options: [
          "Only at team practice",
          "Wall ball — daily reps against a wall",
          "Stretching",
          "Watching games on TV",
        ],
        correctAnswer: 1,
        explanation: "Wall ball is the #1 way to build stick skills. Every great player does it.",
      },
    ],
  },
  {
    id: "girls-youth-l4",
    videoUrl: "https://www.youtube.com/watch?v=UI-ZteQ8JGU",
    lessonNumber: 4,
    title: "Being a Great Teammate",
    topic: "Character",
    pillar: "team",
    description: `Lacrosse is a team sport, and the best teams aren't built on talent alone — they're built on great teammates. Being a great teammate is a skill, just like cradling or shooting. You can practice it every day.\n\nGreat teammates encourage each other. When a teammate makes a great play, you celebrate with her. When she makes a mistake, you pick her up. You never make fun of anyone for missing a pass or having a bad day. Everyone has bad days — and how you respond to a teammate's mistake says everything about you.\n\nGreat teammates listen to coaches. When the coach is talking, you stop talking. You look at her. You take in what she's saying. You don't roll your eyes. You don't whisper to your friend. You don't argue. You listen, say "got it," and try to apply what she said.\n\nGreat teammates hustle for everyone. Sprinting after a ground ball isn't just for you — it helps the team. Backing up a shot isn't glamorous, but it might save a goal. Running hard in transition makes the next play easier for your teammates. Hustle is the most contagious thing in sports. When one player hustles, others follow.\n\nGreat teammates celebrate each other. When a teammate scores, you sprint to celebrate with her — even if you wish it was you. When a teammate has a great game, you tell her. When a teammate is having a hard time, you pull her aside and check in.\n\nThe best teams BTB has ever had weren't always the most talented. They were the ones where everyone genuinely cared about each other. That bond doesn't happen by accident. It happens because every player chooses to be a great teammate every day.`,
    questions: [
      {
        question: "What should you do when a teammate makes a mistake?",
        options: [
          "Make fun of her",
          "Get angry",
          "Pick her up and encourage her — it could be you next time",
          "Tell the coach",
        ],
        correctAnswer: 2,
        explanation: "Great teammates lift each other up. Everyone has bad days.",
      },
      {
        question: "What's the right response when a coach is correcting you?",
        options: [
          "Argue with her",
          "Roll your eyes",
          "Say 'got it' and try to apply it",
          "Walk away",
        ],
        correctAnswer: 2,
        explanation: "Coachability is one of the most important traits in any athlete.",
      },
      {
        question: "Why does hustle matter so much?",
        options: [
          "It doesn't",
          "It's contagious — when one player hustles, others follow",
          "It only matters in the playoffs",
          "Coaches don't notice",
        ],
        correctAnswer: 1,
        explanation: "Hustle spreads through a team and lifts everyone's effort.",
      },
    ],
  },
  {
    id: "girls-youth-l5",
    videoUrl: "https://www.youtube.com/watch?v=pgJzzpjrdFA",
    lessonNumber: 5,
    title: "Where to Be on the Field",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `The lacrosse field can feel confusing at first, but understanding where to be is what separates players who chase the ball from players who actually help their team.\n\nBASIC FIELD AWARENESS\n\n1. Spread Out on Offense\nWhen your team has the ball, don't all run to the ball carrier. Spread out! Get wide. This forces the defense to cover more ground and gives your teammate with the ball options to pass to. If you're all bunched up, one defender can guard two players.\n\n2. Compress on Defense\nWhen the other team has the ball, get tighter together. Help each other. Communicate — "I've got ball!" "Help right!" "Help left!" Every call gives your teammates information.\n\n3. Understand Shooting Space\nIn girls lacrosse, there's a critical rule: the area in front of the goal is called "shooting space." You cannot run through it or stand in it unless you have the ball or are marking someone. This rule protects the goalie and keeps the area safe. Understanding shooting space is key to not getting whistled for fouls.\n\n4. The Simple Rule\nIf you're not sure where to be: get to where you can help. Teammate has the ball? Get open for a pass. Teammate is being pressured? Move to give her an outlet. Shot goes off? Crash for the rebound. There's always something useful to do.\n\nCOACHING POINTS\n- On offense: spacing is everything. Stay 5+ yards apart from teammates\n- On defense: communicate CONSTANTLY. "Ball!" "Help!" "Crash!"\n- Know the shooting space rule — it's unique to girls lacrosse and gets called a lot`,
    questions: [
      {
        question: "When your team has the ball, you should...",
        options: [
          "All run to the ball",
          "Spread out to create passing options",
          "Stand still",
          "Run to the goalie",
        ],
        correctAnswer: 1,
        explanation: "Spreading out forces defenders to cover more ground and creates space.",
      },
      {
        question: "What's the key to playing good defense?",
        options: [
          "Being the fastest",
          "Communication and teamwork",
          "Hitting hard",
          "Standing still",
        ],
        correctAnswer: 1,
        explanation: "Defense is a team effort — communication is the foundation.",
      },
      {
        question: "If you're not sure where to be, what should you do?",
        options: [
          "Stand still",
          "Hustle to where you can help your team — back up shots, get open, help on D",
          "Walk off",
          "Yell at the coach",
        ],
        correctAnswer: 1,
        explanation: "When in doubt, get to a spot where you can help your team.",
      },
    ],
  },
  {
    id: "girls-youth-l6",
    videoUrl: "https://www.youtube.com/watch?v=l-gQLqv9f4o",
    lessonNumber: 6,
    title: "The BTB Standard",
    topic: "Mental Game",
    pillar: "leadership",
    description: `The BTB Standard is what makes our program different. It's not about being the most talented — it's about being the kind of player coaches and teammates want around.\n\nThe Standard has three parts:\n\nEffort — You bring 100% every time you step on the field. Not 80% because you're tired. Not 60% because it's hot. 100%. If you're going to be on the field, you owe it to your teammates to give your best.\n\nAttitude — You show up ready to learn. You don't roll your eyes. You don't argue with coaches. You don't blame teammates. When something goes wrong, you say "my fault, I'll get the next one." When something goes right, you celebrate the teammates who helped you.\n\nPreparation — You take care of your gear. You practice on your own time. You watch lacrosse on TV when you can. You ask questions when you don't understand. You're always trying to learn more.\n\nIf you do these three things, you'll improve faster than the players who don't. That's a guarantee. Skill takes time, but the Standard is something you choose every single day. And the players who choose it become the ones coaches remember forever.\n\nAt BTB, we say "the standard is the standard." That means everyone is held to it equally — best player on the team or last player off the bench. You don't get a pass on effort because you scored three goals last game. The standard doesn't bend.`,
    questions: [
      {
        question: "What are the three parts of the BTB Standard?",
        options: [
          "Speed, strength, skill",
          "Effort, attitude, preparation",
          "Goals, assists, ground balls",
          "Goggles, stick, gloves",
        ],
        correctAnswer: 1,
        explanation: "Effort, attitude, and preparation are the three pieces of the BTB Standard.",
      },
      {
        question: "How much effort should you bring on the field?",
        options: ["50%", "75%", "Whatever feels right", "100% — you owe it to your teammates"],
        correctAnswer: 3,
        explanation: "Always 100%. Effort is the price of admission.",
      },
      {
        question: "What does it mean that 'the standard is the standard'?",
        options: [
          "Different rules for different players",
          "Everyone is held to it equally — no exceptions for star players",
          "Standards change based on the day",
          "The coach decides who follows it",
        ],
        correctAnswer: 1,
        explanation: "The standard applies to everyone equally — that's what makes it fair and powerful.",
      },
    ],
  },
  {
    id: "girls-youth-l7",
    videoUrl: "https://www.youtube.com/watch?v=l5-EwrhsMzY",
    lessonNumber: 7,
    title: "Leading by Example",
    topic: "Character",
    pillar: "leadership",
    description: `You don't have to be the fastest or the most skilled player to be a leader. Leadership at your age is about one thing: doing the right thing when nobody is making you.\n\nLeading by example means being the player who sprints when others jog. You're the one who picks up the cones without being asked. You're the one who keeps working on your off-hand after practice ends. These small things might seem like they don't matter — but everyone notices.\n\nHere's a secret: people pay more attention to what you DO than what you SAY. If you tell your teammates to work harder but then you walk through a drill, nobody listens. If you go full speed on every rep, your teammates start doing the same — even without you saying a word.\n\nLeaders also show up on the tough days. When it's raining and cold and you'd rather be inside — that's when leadership matters most. Anyone can show up when the sun is shining. Real leaders bring the same energy every single day.\n\nAt BTB, we believe leadership isn't about age or talent. It starts right now. Be the player who does more than what's expected. Be the one who lifts others up after a mistake instead of looking away. That's what it means to lead by example.`,
    questions: [
      {
        question: "Do you have to be the best player to be a leader?",
        options: ["Yes, always", "No — leadership is about actions, not skill level", "Only if you're the oldest", "Only at games"],
        correctAnswer: 1,
        explanation: "Leadership is a choice anyone can make. It's about effort and example.",
      },
      {
        question: "What matters more — what you say or what you do?",
        options: ["What you say", "What you do — people watch your actions", "Neither", "Only what the coach says"],
        correctAnswer: 1,
        explanation: "Actions speak louder than words. Lead with your effort.",
      },
      {
        question: "When is the most important time to lead by example?",
        options: ["When everything is going well", "When it's easy", "On the tough days — rain, cold, tired", "Only in big games"],
        correctAnswer: 2,
        explanation: "Real leaders bring the same energy every day, especially when it's hard.",
      },
    ],
  },
  {
    id: "girls-youth-l8",
    videoUrl: "https://www.youtube.com/watch?v=dCVlRFWOjgE",
    lessonNumber: 8,
    title: "Respecting the Game",
    topic: "Character",
    pillar: "leadership",
    description: `Girls lacrosse is one of the fastest-growing sports in the country — and it has a history that goes back hundreds of years. When you step on the field, you're part of something special. That deserves respect.\n\nRespecting the game starts with how you treat your opponents. They're not enemies — they're the competition that pushes you to get better. Shake hands before and after every game. Win with class. Lose with dignity. How you handle yourself says more about your character than the final score.\n\nRespecting the game means accepting refs' calls — even bad ones. Refs are human. They'll miss calls. Arguing doesn't change the call, but it DOES distract you from the next play. The best response to a bad call is to play harder on the next whistle.\n\nRespecting the game means taking care of your equipment. Your stick, your goggles, your cleats — treat them well. They're the tools of your sport.\n\nRespecting the game means being fully present at practice. When you're on the field, be ON the field. No side conversations during drills. No eye-rolling when the coach corrects you. Give the game your full attention because the time you spend playing is short — make every minute count.\n\nPlayers who respect the game earn respect from coaches, teammates, opponents, and families watching. It's one of the most important habits you'll ever build.`,
    questions: [
      {
        question: "How should you treat your opponents?",
        options: ["Like enemies", "With respect — they push you to get better", "Ignore them", "Try to intimidate them"],
        correctAnswer: 1,
        explanation: "Opponents are competitors who make you better. Respect them.",
      },
      {
        question: "When a ref makes a bad call, what should you do?",
        options: ["Argue loudly", "Throw your stick", "Accept it and play harder on the next play", "Tell your parents to complain"],
        correctAnswer: 2,
        explanation: "Arguing changes nothing. Competing on the next play changes the game.",
      },
      {
        question: "What does 'respecting the game' mean?",
        options: ["Just winning", "Treating opponents, refs, equipment, and practice with respect", "Playing only when it's fun", "Only caring about goals"],
        correctAnswer: 1,
        explanation: "Respect covers everything — how you treat the sport and everyone connected to it.",
      },
    ],
  },
  {
    id: "girls-youth-l9",
    videoUrl: "https://www.youtube.com/watch?v=S02D9QzDe4s",
    lessonNumber: 9,
    title: "Why Teams Win",
    topic: "Mental Game",
    pillar: "team",
    description: `Here's something important: the team with the most talented players doesn't always win. Sometimes a team with average skills but amazing teamwork beats a team of all-stars who don't play together.\n\nWhy? Because lacrosse is a team sport. You can't win alone. Your attack needs your midfield to bring the ball up. Your midfield needs your defense to stop the other team. Your defense needs your goalie. Your goalie needs everyone. When every player does their job well, the team works.\n\nTeams win because they trust each other. When you trust your teammate to be in the right spot, you pass without hesitating. When you trust your defense to slide, you play your girl tight. Trust makes everyone play faster and smarter.\n\nTeams win because they support each other. When a teammate drops a ball, you don't groan — you say "next one!" When someone misses a shot, you back it up. When someone gets beat, the team responds. Every mistake is a chance for the TEAM to step up together.\n\nTeams win because they care about each other. When you genuinely care about your teammates, you work harder. You don't want to let them down. You sprint back on defense because your goalie is counting on you. You make the extra effort because you know your teammates would do the same.\n\nBe the kind of teammate who makes the team better just by being there. That matters more than any individual skill.`,
    questions: [
      {
        question: "Does the most talented team always win?",
        options: ["Yes, always", "No — teams that play together can beat more talented teams", "Only in big games", "Talent is everything"],
        correctAnswer: 1,
        explanation: "Teamwork and trust can overcome talent differences.",
      },
      {
        question: "What should you do when a teammate makes a mistake?",
        options: ["Get mad at them", "Ignore it", "Support them — say 'next one!' and help the team respond", "Tell the coach to bench them"],
        correctAnswer: 2,
        explanation: "Great teams respond to mistakes together. Every error is a chance to support each other.",
      },
      {
        question: "Why do players who care about their teammates play harder?",
        options: ["They don't", "They don't want to let their teammates down — effort comes from caring", "Caring doesn't affect playing", "Only coaches motivate effort"],
        correctAnswer: 1,
        explanation: "When you care about your teammates, you give more effort because they're counting on you.",
      },
    ],
  },
  {
    id: "girls-youth-l10",
    lessonNumber: 10,
    title: "Competing Together",
    topic: "Mental Game",
    pillar: "team",
    description: `Every team faces hard moments. Rain games. Losing streaks. Tough practices. What makes a team special isn't avoiding those moments — it's how you get through them together.\n\nCompeting together means nobody quits. If you're down by a lot, you still play hard on every ground ball. Why? Because your teammates are watching. If you keep fighting, it tells them "we're still in this." If you give up, it tells them it's OK to stop trying. Your effort is contagious — make it positive.\n\nCompeting together means celebrating each other. When a teammate scores, you react like YOU scored. When your goalie makes a save, the whole team gets loud. When your defender causes a turnover, everyone lets her know it mattered. Energy lifts teams — and celebrating together builds that energy.\n\nCompeting together means handling losses as a group. After a tough game, don't point fingers. Don't blame one person. Say "we'll get better" and prove it at the next practice. The best teams don't break when they lose — they learn and come back stronger.\n\nHere's what makes competing together powerful: when you're older, you won't remember the scores. You'll remember your teammates. You'll remember fighting through a cold, windy game and laughing about it on the bus ride home. You'll remember the team that refused to quit. Those memories last forever.`,
    questions: [
      {
        question: "When your team is losing, what should you do?",
        options: ["Give up", "Keep competing — your effort tells teammates 'we're still in this'", "Blame someone", "Stop trying"],
        correctAnswer: 1,
        explanation: "Effort is contagious. Competing hard even when losing lifts the whole team.",
      },
      {
        question: "Why is celebrating teammates important?",
        options: ["It's not", "It builds energy that makes the whole team play harder", "Only celebrate goals", "It distracts from the game"],
        correctAnswer: 1,
        explanation: "Celebrating together builds the energy that fuels great team play.",
      },
      {
        question: "After a loss, the team should...",
        options: ["Blame the worst player", "Point fingers", "Own it together, learn, and come back stronger", "Stop practicing"],
        correctAnswer: 2,
        explanation: "Teams handle losses as a group — no blame, just growth.",
      },
    ],
  },
]

const GIRLS_MIDDLE_LESSONS: AcademyLesson[] = [
  {
    id: "girls-middle-l1",
    lessonNumber: 1,
    title: "Positions and Their Roles",
    topic: "Fundamentals",
    pillar: "game",
    description: `By middle school, every player should understand what each position does. This helps you play your own position better and helps you anticipate what teammates will do.\n\nAttack plays in front of the opposing goal. Their job is to score and create scoring chances for teammates. Good attackers have great stick skills, can dodge from any angle, and read defenses to find the open player. They live in the offensive end of the field.\n\nMidfielders play the entire field — both ends. They're the most well-rounded athletes on the team. A great midfielder can score, defend, and play in transition. They run constantly. Most teams play with multiple midfield lines that rotate to keep players fresh.\n\nDefenders play in front of their own goal. Their main job is to stop the other team from scoring by using positioning, footwork, and stick checks. Good defenders are smart, communicative, and know how to force attackers into bad spots. They also start the transition by clearing the ball up to the offense.\n\nThe goalie is the last line of defense. She wears extra protection and uses a stick with a much bigger head. Goalies need to be brave (the ball is hard and fast), have great hand-eye coordination, and most importantly — they need to be loud. The goalie sees the whole field and directs the defense.\n\nUnderstanding what every position does makes you smarter on the field. When you know what your defender's job is, you can help her. When you know what your goalie sees, you can position yourself to support.`,
    questions: [
      {
        question: "Which position runs the entire field?",
        options: ["Attack", "Midfield", "Defense", "Goalie"],
        correctAnswer: 1,
        explanation: "Midfielders play both ends and run the full field.",
      },
      {
        question: "Where do attackers spend most of their time?",
        options: [
          "All over the field",
          "In their own end",
          "Around the opposing goal",
          "Only on defense",
        ],
        correctAnswer: 2,
        explanation: "Attackers stay in the offensive end where they can score.",
      },
      {
        question: "What's one of the most important traits of a goalie?",
        options: [
          "Being short",
          "Being loud — directing the defense",
          "Running the fastest",
          "Being silent",
        ],
        correctAnswer: 1,
        explanation: "Goalies have to communicate constantly — they see the whole field.",
      },
    ],
  },
  {
    id: "girls-middle-l2",
    lessonNumber: 2,
    title: "Dodging in the Girls Game",
    topic: "Fundamentals",
    pillar: "game",
    description: `A dodge is how you beat your defender one-on-one to create space for a shot or a pass. At the middle school level, you need to master three main dodges and understand when to use each one.\n\nDODGE BREAKDOWN\n\n1. The Face Dodge\nDrive at your defender, bring your stick across your face like you're going to switch hands — but DON'T switch. The defender reaches for the fake and you blow past on the same side. This is the fastest dodge because you don't lose any speed.\n\n2. The Roll Dodge\nDrive into your defender, plant your inside foot, and roll backwards away from them — protecting your stick the whole time. As you come out of the roll, you should be facing the goal with the defender behind you. Use this when a defender is playing you tight and physical.\n\n3. The Rocker Dodge\nA hesitation move. You start to drive one direction, "rock" back (shift your weight backward as if changing direction), then explode forward past the defender. The rocker works because the defender reacts to your change of direction and gets caught flat-footed.\n\n4. The Crease Dodge\nUsed specifically around the crease (goal area). Receive the ball on one side of the crease, fake to that side, then sweep across the crease to the other side for a shot. This requires good footwork and stick protection.\n\nTHE KEY TO EVERY DODGE\nChange of speed. You MUST go from slow to fast in one explosive step. A dodge at one speed is useless — the defender just runs with you. The explosion is what creates separation.\n\nCOACHING POINTS\n- Sell the first move with your body, not just your stick\n- Attack the "top foot" of the defender — force her to turn her hips\n- Practice each dodge 10 times per hand at every practice`,
    questions: [
      {
        question: "What's the most important element of any dodge?",
        options: [
          "How fast your stick switches",
          "Change of speed — slow to explosive",
          "Being the strongest",
          "Wearing the right shoes",
        ],
        correctAnswer: 1,
        explanation: "Change of pace creates separation. A flashy dodge at one speed doesn't beat anyone.",
      },
      {
        question: "Which dodge is fastest because you don't switch hands?",
        options: ["Split Dodge", "Roll Dodge", "Face Dodge", "Behind-the-back Dodge"],
        correctAnswer: 2,
        explanation: "The Face Dodge fakes a hand switch without committing — that's why it's fastest.",
      },
      {
        question: "When should you use a Roll Dodge?",
        options: [
          "Against a defender who's far away",
          "Against a defender playing you very tight",
          "Only on offense",
          "Never",
        ],
        correctAnswer: 1,
        explanation: "Roll dodges work when a defender is right on you — you protect your stick and roll past.",
      },
    ],
  },
  {
    id: "girls-middle-l3",
    lessonNumber: 3,
    title: "Defensive Footwork",
    topic: "Fundamentals",
    pillar: "game",
    description: `Good defense in girls lacrosse starts with your feet, not your stick. The best defenders move their feet, stay in position, and force the ball carrier into bad spots.\n\nDEFENSIVE FUNDAMENTALS\n\n1. Breakdown Position\nKnees bent, weight on the balls of your feet, hips low, stick out in a "check-ready" position. This is your defensive stance. Standing upright is the worst thing a defender can do — you lose all reaction time.\n\n2. Footwork: Shuffle, Don't Cross\nWhen the attacker moves, you slide-step. Never cross your feet. Slide left, slide right, always keeping your hips square to the ball carrier. Crossing your feet means losing balance and getting beat.\n\n3. Approach Angle\nWhen closing out on a ball carrier, approach at an angle that forces her to one side. Don't run straight at her — she'll dodge around you. Take away one side and force her to the other.\n\n4. Stick Positioning\nKeep your stick in a "check-ready" position — up and active, ready for a controlled check on the stick side. In girls lacrosse, checks must be controlled and directed at the stick, not the body. Wild swings get flagged.\n\nDEFENSIVE COMMUNICATION — THE VOCABULARY\nEvery defender needs to know these calls:\n- "Ball!" — I'm defending the ball carrier\n- "Help!" or "Help right/left!" — I'm one slide away, ready to help\n- "Ball up top!" — Ball is at the top of the 12-meter\n- "Ball low!" — Ball is at X (behind the goal)\n- "Crash!" — Immediate help needed, slide NOW\n\nCOACHING POINTS\n- If you can communicate when you're tired, you can communicate any time\n- Stay between your player and the goal — that's the #1 rule of defense\n- Defense is 80% positioning, 20% stick checks`,
    questions: [
      {
        question: "What's the cardinal rule of defense?",
        options: [
          "Always swing your stick",
          "Stay between your assignment and the goal",
          "Run to the ball",
          "Stand tall",
        ],
        correctAnswer: 1,
        explanation: "Body position between your assignment and the goal is the foundation.",
      },
      {
        question: "What kind of footwork should defenders use?",
        options: [
          "Crossing feet for speed",
          "Standing flat-footed",
          "Slide-stepping without crossing feet",
          "Jumping",
        ],
        correctAnswer: 2,
        explanation: "Slide-step, never cross — crossing leads to falling behind.",
      },
      {
        question: "What's the secret weapon of great defenses?",
        options: [
          "Being the tallest",
          "Communication — talking constantly",
          "Silence",
          "Standing still",
        ],
        correctAnswer: 1,
        explanation: "Constant communication is what holds team defenses together.",
      },
    ],
  },
  {
    id: "girls-middle-l4",
    lessonNumber: 4,
    title: "Reading the Field — Lacrosse IQ",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Lacrosse IQ — your ability to read the field — is what separates good players from great ones. Great players don't just react to what's happening. They anticipate what's about to happen.\n\nWhen you have the ball, you should already know where every teammate and every defender is BEFORE you make your move. Scan the field as you receive the ball. Where are your teammates? Where is open space? Where is the defense weak? The best players see the whole field at once.\n\nWhen you don't have the ball, watch the player with the ball AND the defenders around her. Anticipate where the next play will go. If a teammate is being doubled, get open for an outlet pass. If the defense is sliding, expect that you might be left open — be ready.\n\nOn defense, watch the offensive player's eyes. Eyes usually telegraph where the ball is going to be passed. If you can read eyes, you can intercept passes. Body position, stick position, and shoulder angle all give clues too.\n\nLacrosse IQ comes from two things: experience (the more you play, the more patterns you recognize) and film study (watching games and analyzing what good players do). Start watching college lacrosse on YouTube — Maryland, Northwestern, North Carolina, Boston College, Syracuse all have great game film online.\n\nWatch with curiosity. Pause when something interesting happens. Why did she cut there? Why did the defender slide? Where was the open space? This kind of active watching builds your IQ faster than just playing alone.`,
    questions: [
      {
        question: "What separates good players from great ones in terms of IQ?",
        options: [
          "Great players are bigger",
          "Great players anticipate — they don't just react",
          "Great players run faster",
          "Great players have newer sticks",
        ],
        correctAnswer: 1,
        explanation: "Anticipation is the hallmark of high lacrosse IQ.",
      },
      {
        question: "When watching film, what should you watch besides the ball?",
        options: [
          "The fans",
          "The off-ball movement — cuts, slides, positioning",
          "The scoreboard",
          "Nothing else",
        ],
        correctAnswer: 1,
        explanation: "Off-ball movement teaches you positioning, anticipation, and team play.",
      },
      {
        question: "On defense, what gives away where an offensive player will pass?",
        options: ["Their stick color", "Their feet only", "Their eyes", "Their helmet"],
        correctAnswer: 2,
        explanation: "Eyes usually telegraph the pass — reading eyes is a key defensive skill.",
      },
    ],
  },
  {
    id: "girls-middle-l5",
    lessonNumber: 5,
    title: "Mental Toughness Under Pressure",
    topic: "Mental Game",
    pillar: "team",
    description: `Mental toughness is what keeps you playing your best when things get hard. Every player has good games. The mentally tough players have good games AND bad games — and they fight just as hard in both.\n\nHere's what mental toughness looks like in middle school lacrosse:\n\nWhen you make a mistake, you reset. You don't dwell on it. You don't drop your head. You don't look at the bench like "sorry coach." You take a breath, refocus, and play the next play. The hardest thing in sports is letting go of a mistake fast. The best players let go in seconds.\n\nWhen the ref makes a bad call, you don't argue. You don't whine. You play harder on the next play. Refs make mistakes — it's part of the game. Players who complain lose focus. Players who shake it off and compete are the ones who win.\n\nWhen you're tired, you push through. The end of games is when winners separate from losers. Most players slow down when they're tired. The mentally tough player speeds up — because she knows everyone else is slowing down. That's your edge.\n\nWhen you're losing, you don't quit. Down 6-0? Compete on every ground ball like it's 0-0. Play defense like every save matters. Mentally tough players don't care about the score — they care about the next play. You can't change the score, but you can change how hard you play right now.\n\nMental toughness is a muscle. The more you practice it in small moments — finishing one extra rep, running one more sprint, staying focused after a bad play — the stronger it gets. Train it like any other skill.`,
    questions: [
      {
        question: "What should you do after making a mistake in a game?",
        options: [
          "Argue with the ref",
          "Drop your head and give up",
          "Reset quickly and focus on the next play",
          "Yell at a teammate",
        ],
        correctAnswer: 2,
        explanation: "Quick reset is the foundation of mental toughness.",
      },
      {
        question: "When does mental toughness matter most?",
        options: [
          "When winning easy",
          "When everything is going well",
          "When things are hard — when tired, losing, or frustrated",
          "Only at practice",
        ],
        correctAnswer: 2,
        explanation: "Toughness shows up in adversity.",
      },
      {
        question: "What's the right mindset when losing badly?",
        options: [
          "Give up — it's over",
          "Compete on every play — score doesn't change effort",
          "Blame teammates",
          "Take it easy",
        ],
        correctAnswer: 1,
        explanation: "Tough players focus on the next play, never the scoreboard.",
      },
    ],
  },
  {
    id: "girls-middle-l6",
    lessonNumber: 6,
    title: "Becoming a Leader",
    topic: "Character",
    pillar: "leadership",
    description: `Leadership in middle school lacrosse isn't about wearing a captain's armband. It's not about being the loudest in the huddle. Real leadership is how you act when no one is paying attention.\n\nThe biggest myth about leadership is that you have to be the best player. You don't. Some of the best leaders on great teams are bench players who bring incredible energy at every practice. Leadership is a choice anyone can make.\n\nHere's what middle school leadership looks like:\n\nYou show up early. You stay late. You're the one who picks up balls without being told. You sprint hard in conditioning even when no one is watching the back of the line. You set the standard with your actions, not your words.\n\nYou pick up teammates. When a teammate makes a mistake, you're the first to say "shake it off, I got you." When she scores, you're the first to celebrate. When practice is grinding and everyone is tired, you're the one who picks up the energy.\n\nYou don't talk behind anyone's back. Real leaders don't gossip about teammates, complain about coaches, or make excuses. If you have a problem, you talk directly to the person. Leaders build trust — and trust is built through honesty.\n\nYou take coaching well. Leaders don't argue with feedback. They say "got it, coach" and apply it on the next rep. When teammates see you take coaching, they learn to do the same.\n\nDo these things and your coaches will notice. Your teammates will notice. And one day when there's a hard moment in a game and the team needs someone to step up, everyone will look at you — because you've already been leading the whole time.`,
    questions: [
      {
        question: "Do you have to be the best player to be a leader?",
        options: ["Yes", "Only if you're a captain", "No — leadership is a choice anyone can make", "Only seniors"],
        correctAnswer: 2,
        explanation: "Leadership is about effort and example, not skill level.",
      },
      {
        question: "How do real leaders handle problems with teammates?",
        options: [
          "Talk behind their back",
          "Tell other teammates",
          "Talk directly to the person and try to fix it",
          "Quit the team",
        ],
        correctAnswer: 2,
        explanation: "Direct, honest communication builds trust. Gossip destroys it.",
      },
      {
        question: "What's the biggest sign of leadership at practice?",
        options: [
          "Talking the most",
          "Setting the standard with your actions — early, focused, hustling",
          "Wearing the best gear",
          "Being the coach's favorite",
        ],
        correctAnswer: 1,
        explanation: "Actions speak louder than words. Lead by example daily.",
      },
    ],
  },
  {
    id: "girls-middle-l7",
    lessonNumber: 7,
    title: "Finding Your Voice",
    topic: "Character",
    pillar: "leadership",
    description: `By middle school, lacrosse becomes a talking game. The teams that communicate win. The teams that stay silent lose. Finding your voice on the field is one of the most important things you can do right now.\n\nWHAT TO SAY AND WHEN\n\nOn Defense:\n- "Ball!" — You're defending the ball carrier\n- "Help!" or "Help right!" / "Help left!" — You're one slide away and ready from that side\n- "Ball up top!" — Telling teammates where the ball is (top of the 12-meter)\n- "Ball low!" — Ball is at X (behind the goal)\n- "Crash!" — Immediate help needed, slide NOW\n- "Recover!" — The threat is over, get back to your player\n\nOn Offense:\n- "I'm open!" — You're free for a pass\n- "Switch!" — Trade assignments\n- "Release!" — You're cutting and want the ball\n\nOn Draws:\n- "Mine!" — You're going for the ball\n- "Crash!" — Wings: go get it\n\nThe hardest part is that it feels awkward at first. You might feel self-conscious yelling on the field. Here's what's true: nobody judges you for communicating. Your coaches WANT you to talk. Your teammates NEED you to talk. The only person who thinks it's weird is you — and that feeling goes away fast.\n\nStart small. Pick one thing to call out at every practice — just "Ball!" when you're sliding. Once that's natural, add another call. Then another. Before long you'll be one of the loudest players on the field.\n\nCOACHING POINTS\n- Talking when you're tired is the real test — if you can communicate tired, you can communicate any time\n- Communication goes beyond play calls: "Nice cut!" "Great save!" "Shake it off, you got it!"\n- The girl who communicates well makes everyone around her better`,
    questions: [
      {
        question: "What does good on-field communication sound like?",
        options: ["Yelling random things", "Specific calls — 'I got ball!' 'Cutter right!' 'Help!'", "Staying quiet", "Talking to the ref"],
        correctAnswer: 1,
        explanation: "Communication is specific, timely information that helps teammates.",
      },
      {
        question: "If talking on the field feels awkward, what should you do?",
        options: ["Never talk", "Wait until high school", "Start small — pick one call and practice it until it's natural", "Only talk in games"],
        correctAnswer: 2,
        explanation: "Start with one call. Build from there. The awkward feeling disappears fast.",
      },
      {
        question: "Why does communication help teams win?",
        options: ["It doesn't", "It gives teammates information to make better decisions", "Only goalies talk", "Coaches prefer quiet teams"],
        correctAnswer: 1,
        explanation: "Every call helps. Defense, offense, draw controls — communication fuels it all.",
      },
    ],
  },
  {
    id: "girls-middle-l8",
    lessonNumber: 8,
    title: "Owning Your Role",
    topic: "Character",
    pillar: "leadership",
    description: `Not every player is the leading scorer. Not every player starts. But every player has a role — and the teams that win are the ones where every girl OWNS her role completely.\n\nMaybe you're the defender who shuts down the other team's best player. Maybe you're the midfielder who wins draw controls. Maybe you're the sub who brings fresh energy every time you check in. Whatever your role, commit to it fully.\n\nOwning your role means two things. First, understand what your coaches need from you. If you're on defense, your job is to stop the ball — not to score. If you're a backup, your job is to push the starters in practice. Ask your coach: "What do you need from me?" That question shows maturity beyond your years.\n\nSecond, maximize your role. Don't just accept it — dominate it. If you get 5 minutes of playing time, make those 5 minutes count. If you're on the sideline, be the loudest cheerleader. If you're the role player, be the BEST role player on the team.\n\nWhat coaches notice: the player who does her job without complaining, without needing credit, without sulking. That girl earns more trust and more responsibility over time. The girl who complains about playing time, refuses the small jobs, or pouts when she doesn't start? She stays where she is.\n\nGreat teams need everyone bought in. Not everyone can score 5 goals. But everyone can do their job at 100%.`,
    questions: [
      {
        question: "If you're not a starter, what should you do?",
        options: ["Complain", "Own your role — bring energy, compete in practice, cheer loud", "Stop trying", "Ask to switch teams"],
        correctAnswer: 1,
        explanation: "Every role matters. Maximize it and earn more over time.",
      },
      {
        question: "What's a great question to ask your coach?",
        options: ["Why don't I start?", "Can I play attack?", "'What do you need from me?'", "When is practice over?"],
        correctAnswer: 2,
        explanation: "Asking what the team needs from you shows maturity and earns trust.",
      },
      {
        question: "What do coaches notice about role players?",
        options: ["Nothing", "The ones who do their job without complaining and give 100%", "Only the scorers", "The loudest players"],
        correctAnswer: 1,
        explanation: "Coaches reward commitment to the role, not complaints about it.",
      },
    ],
  },
  {
    id: "girls-middle-l9",
    lessonNumber: 9,
    title: "Trust on the Field",
    topic: "Mental Game",
    pillar: "team",
    description: `Trust is the foundation of every great team. When you trust your teammates, you play faster, smarter, and harder. When you don't, you hesitate, try to do everything alone, and the team breaks down.\n\nWhat does trust look like on a girls lacrosse field?\n\nOn offense, trust means making the extra pass. When you see a teammate cutting, you throw the ball because you TRUST her to catch and finish. If you don't trust her, you dodge again and try to score yourself. One way builds the team. The other makes you a ball hog.\n\nOn defense, trust means sliding when you need to. You leave your own player open because you trust the next defender to rotate and cover. If everyone trusts the system, the slides work. If anyone hesitates, the whole defense falls apart.\n\nOn draws, trust means everyone executing their role. The center needs her wings to crash correctly. The wings need the center to control the ball. When everyone trusts the plan, draws become consistent.\n\nTrust is built in practice, not games. Every rep where you pass and your teammate catches it builds trust. Every slide that arrives on time builds trust. Every practice where everyone shows up and works hard builds trust. It's repetition plus reliability.\n\nThe opposite of trust is trying to do everything yourself. The girl who dodges every possession because she doesn't trust anyone might score some goals — but her team will never reach its potential. The best players make everyone around them better.`,
    questions: [
      {
        question: "How is trust built on a team?",
        options: ["It just happens", "Through consistent effort in practice — showing up, working hard, being reliable", "Only in games", "By talking about it"],
        correctAnswer: 1,
        explanation: "Trust comes from daily repetition and reliability. It's earned in practice.",
      },
      {
        question: "What does trust look like on offense?",
        options: ["Dodging every time", "Making the extra pass because you trust your teammates", "Never sharing the ball", "Only passing to the best player"],
        correctAnswer: 1,
        explanation: "Trusting teammates means sharing the ball and making everyone better.",
      },
      {
        question: "What happens when a defense doesn't trust each other?",
        options: ["They play great", "Players hesitate on slides and the defense breaks down", "It doesn't matter", "They score more"],
        correctAnswer: 1,
        explanation: "Hesitation kills defense. Trust makes slides quick and rotations clean.",
      },
    ],
  },
  {
    id: "girls-middle-l10",
    lessonNumber: 10,
    title: "Winning and Losing Together",
    topic: "Mental Game",
    pillar: "team",
    description: `Great teams handle wins and losses the same way — as a group. No one player wins a game, and no one player loses one. Understanding this makes you a better teammate.\n\nWhen you win, celebrate together. The goal scorer needed the assist. The assist needed the draw control. The draw control needed the wings. Every goal is the result of multiple players doing their jobs. Make sure everyone feels like they contributed — because they did.\n\nWhen you lose, own it together. This is the hard part. After a tough loss, it's tempting to think "if she didn't miss that shot" or "if the goalie saved that one." Stop. A game is decided by hundreds of plays, not just one. The team won together or lost together — period.\n\nThe worst thing a team can do is blame one person. That destroys trust instantly. When one player becomes the scapegoat, everyone else stops taking risks because nobody wants to be blamed next. Fear makes teams play tight and timid.\n\nThe best response to a loss is simple: be honest about what went wrong, stay positive about what you're going to fix, and come back to practice ready to work. Say "we'll be better" and then actually put in the effort to be better. That's how good teams become great teams.\n\nHow a team handles adversity together defines who they are. The teams that grow through tough moments are the ones that build something nobody can take away from them.`,
    questions: [
      {
        question: "After a loss, who should take the blame?",
        options: ["The goalie", "Whoever missed the last shot", "Nobody individually — the team owns it together", "The coach"],
        correctAnswer: 2,
        explanation: "Games are decided by hundreds of plays. Blaming one player destroys trust.",
      },
      {
        question: "Why is blaming one person harmful to a team?",
        options: ["It's not", "Everyone stops taking risks — afraid to be blamed next", "It motivates players", "Only if it happens often"],
        correctAnswer: 1,
        explanation: "Fear of blame makes teams play tight and cautious. Nobody takes chances.",
      },
      {
        question: "The best response to a tough loss is...",
        options: ["Quit", "Fight with teammates", "Be honest, stay positive, and work harder at the next practice", "Pretend it didn't happen"],
        correctAnswer: 2,
        explanation: "Own it, learn from it, fix it. That's how teams grow.",
      },
    ],
  },
]

const GIRLS_HIGH_LESSONS: AcademyLesson[] = [
  {
    id: "girls-high-l1",
    lessonNumber: 1,
    title: "Advanced Offensive Concepts",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `By high school, you should understand offensive systems — not just how to score on your own, but how the team creates scoring chances together. Great high school offenses run sets, motion concepts, and ball reversals to manipulate defenses.\n\nA "set" is an organized offensive formation. The most common in girls lacrosse are the 3-3 (three players up high, three down low) and the 1-3-2 (one player up top, three across the middle, two down low). Each set creates different angles and dodging opportunities.\n\n"Motion offense" means players are constantly moving — cutting, screening, repositioning — to create openings. Good motion offenses are hard to defend because the defense can never settle. The keys are timing (cuts have to happen at the right moment) and spacing (players have to stay 5+ yards apart so defenses can't double team easily).\n\n"Ball reversal" is moving the ball from one side of the field to the other quickly. Defenses are designed to slide and help where the ball is. When you reverse the ball quickly, the defense has to scramble to get in new position — and that's when openings appear.\n\nHere's the most important advanced concept: don't dodge into help. Look for the slide before you commit. If you see help coming, pass the ball to your open teammate. If you don't see help, dodge hard and finish. Patient ball movement creates better looks than forced 1v1 dodges.\n\nThe best high school offenses have players who know their roles. The best dodgers initiate. The best shooters position for shots. The best passers create assists. Know what you're best at and play to it.`,
    questions: [
      {
        question: "What is a 3-3 offensive set?",
        options: [
          "Three players in three lines",
          "Three players up high and three down low",
          "A drill name",
          "A defensive set",
        ],
        correctAnswer: 1,
        explanation: "3-3 has three players spread up top and three spread low — one of the most common girls sets.",
      },
      {
        question: "What does 'reversing the ball' do to a defense?",
        options: [
          "Confuses the offense",
          "Forces the defense to scramble to slide the other way",
          "Nothing",
          "Causes a penalty",
        ],
        correctAnswer: 1,
        explanation: "Quick ball reversal makes the defense chase, creating openings.",
      },
      {
        question: "What's the most important rule about dodging at the high school level?",
        options: [
          "Always dodge alone",
          "Don't dodge into help — read the slide first",
          "Dodge as fast as possible",
          "Only dodge from behind the goal",
        ],
        correctAnswer: 1,
        explanation: "Reading slides before committing is what separates good dodgers from turnover machines.",
      },
    ],
  },
  {
    id: "girls-high-l2",
    lessonNumber: 2,
    title: "Team Defense and Slide Packages",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Team defense at the high school level requires every player to understand the slide package — your team's system for helping each other when a ball carrier beats her defender.\n\nSLIDE SYSTEMS\n\n1. Adjacent Slide\nWhen the on-ball defender gets beat, the defender closest to her (adjacent) slides to stop the ball carrier. The next defender rotates to fill the gap left by the slider. Everyone shifts together like a chain reaction. This is the most common system.\n\n2. Crease Slide\nThe slide comes from a defender near the crease — usually whoever is guarding the player closest to the goal. This slide arrives faster but is harder to teach because it requires perfect communication and rotations.\n\n3. Recovery After the Slide\nThe slider's job isn't just to stop the dodge — it's to recover back to her player once the threat is neutralized. Slide, stop the ball, recover. The whole defense has to rotate during this sequence and then reset.\n\nCOMMUNICATION IS NON-NEGOTIABLE\nYour goalie calls the slides. Your defenders point and communicate constantly:\n- "Ball!" — I have the ball carrier\n- "Help right!" / "Help left!" — I'm one pass away, ready to slide from this side\n- "Crash!" — Slide NOW, we need immediate help\n- "Recover!" — Get back to your player, the threat is over\n\nSilent defenses lose. If your team doesn't talk, your slides will be late, your rotations will break down, and you'll give up easy goals.\n\nTHE BIGGEST MISTAKE\nHesitating on the slide. If you're the slider, GO. Don't wait to see if the on-ball defender recovers — by then it's too late. Slide hard, slide early, trust your teammates to fill behind you. A late slide is worse than no slide at all.\n\nCOACHING POINTS\n- Every player on the field should know the slide package — not just defenders\n- Practice slides in 3v2, 4v3, and 5v4 situations before going 6v6\n- Film study: watch where the slides come from and how the defense recovers`,
    questions: [
      {
        question: "In an adjacent slide package, who slides when the on-ball defender gets beat?",
        options: [
          "The goalie",
          "The defender right next to (adjacent to) the on-ball defender",
          "The farthest defender",
          "Nobody",
        ],
        correctAnswer: 1,
        explanation: "Adjacent slides come from the player right next to the on-ball defender.",
      },
      {
        question: "Should attackers learn the team's slide package?",
        options: [
          "No, only defenders",
          "Yes — they need it for transition defense and rides",
          "Only goalies",
          "Only seniors",
        ],
        correctAnswer: 1,
        explanation: "Every position should know team defense for rides, transition, and team awareness.",
      },
      {
        question: "What's worse than not sliding at all?",
        options: [
          "Sliding perfectly",
          "Sliding late — it leaves you out of position",
          "Sliding early",
          "Yelling",
        ],
        correctAnswer: 1,
        explanation: "Late slides leave the defender out of position and let the offense pass to the open player easily.",
      },
    ],
  },
  {
    id: "girls-high-l3",
    lessonNumber: 3,
    title: "How to Watch Film",
    topic: "Lacrosse IQ",
    pillar: "game",
    description: `Film study is the biggest separator at the high school level. The players who watch film correctly improve dramatically faster than those who don't. But most players don't know HOW to watch film — they just stare at it.\n\nHere's how to watch film with purpose:\n\nFirst, watch with a question in mind. Don't just watch — watch FOR something. Examples: "How does my defender position herself when I dodge?" "Where are the slides coming from?" "What does my team do well in transition?" Having a question keeps you focused.\n\nSecond, watch off-ball. Most players watch the ball. The ball doesn't teach you anything — you already know what happens with the ball. What teaches you is what happens AWAY from the ball. Watch the slides developing. Watch the cuts. Watch how good players move when they don't have it.\n\nThird, pause and rewind. Don't watch in real time only. When something happens, pause it. Look at every player on the field. Where was the open space? Why did the defender go where she did? What would you have done differently?\n\nFourth, watch yourself critically. When you're watching your own film, don't look for highlights. Look for mistakes. Where did you turn the ball over? What did you miss? Where could you have cut better? Brutal self-honesty is how you fix problems.\n\nFifth, take notes. Write down 3 things you noticed and 3 things you want to work on. Bring those notes to the next practice. Film study without action is just watching TV.\n\nThe best players in college and the pros watch film daily. If you start now, by the time you're a senior, you'll be miles ahead of every player who relies only on practice.`,
    questions: [
      {
        question: "What's the best way to watch film?",
        options: [
          "In real time without stopping",
          "With a question in mind, pausing to study details",
          "Only watching highlights",
          "On mute",
        ],
        correctAnswer: 1,
        explanation: "Active film study with focused questions is what makes you better.",
      },
      {
        question: "When watching your own film, what should you look for?",
        options: [
          "Only your highlights",
          "Mistakes and things to fix",
          "Your hairstyle",
          "How loud the crowd was",
        ],
        correctAnswer: 1,
        explanation: "Critical self-review is how film study leads to improvement.",
      },
      {
        question: "Why watch off-ball more than the ball?",
        options: [
          "It's more exciting",
          "Off-ball movement teaches you positioning, slides, and team concepts",
          "Coaches make you",
          "It's not — watch the ball",
        ],
        correctAnswer: 1,
        explanation: "The ball is obvious. Off-ball is where the lessons are hidden.",
      },
    ],
  },
  {
    id: "girls-high-l4",
    lessonNumber: 4,
    title: "The College Recruiting Process",
    topic: "Mental Game",
    pillar: "game",
    description: `If you want to play college lacrosse, you need to understand the recruiting process. Many players miss out not because they aren't talented — but because they didn't know how the process works. Here's what you need to know.\n\nRecruiting in girls lacrosse starts EARLY. Coaches identify prospects in 8th and 9th grade. By 10th grade, top prospects are getting verbal offers. By 11th grade, most Division I rosters are largely set. This means you need to be on coaches' radar by your sophomore year if you're aiming for D1.\n\nGrades matter — A LOT. Most colleges won't even consider a player who can't get in academically. Your GPA and test scores open doors that lacrosse alone can't. Aim for the highest grades you can. The better your grades, the more options you have.\n\nYou have to do your own outreach. Don't wait for coaches to find you. Email college coaches starting freshman year — introduce yourself, share your highlight tape, list your tournaments. Be professional, polite, and brief. Most coaches won't reply but they ARE reading.\n\nGet to college camps and showcase tournaments. This is where coaches actually see you play. Pick events where the schools you want to attend will be coaching or scouting. Camps at colleges are especially valuable because the coach sees you up close.\n\nUse a recruiting profile (Sportsforce, NCSA, or BTB's own profile) so coaches can find your stats, video, grades, and contact info in one place.\n\nMost importantly: don't fixate on D1. There are 200+ great college lacrosse programs across D1, D2, D3, and NAIA. Many D3 programs offer better player development, smaller class sizes, and equally competitive lacrosse. Find the right FIT, not just the highest division. The best college experience is one where you'll play significant minutes, get great coaching, and earn a degree that opens doors after lacrosse.`,
    questions: [
      {
        question: "When should you start the recruiting process?",
        options: [
          "Senior year",
          "Junior year",
          "Freshman/sophomore year — earlier than most realize",
          "After college",
        ],
        correctAnswer: 2,
        explanation: "Top D1 programs identify prospects in 8th-9th grade — start early.",
      },
      {
        question: "How important are grades?",
        options: [
          "Not important",
          "Slightly important",
          "Very important — they open or close doors",
          "Only for D3",
        ],
        correctAnswer: 2,
        explanation: "Grades determine what schools will even consider you, regardless of lacrosse skill.",
      },
      {
        question: "What's the right approach to choosing a college?",
        options: [
          "D1 is always better",
          "Find the best fit, not just the highest division",
          "Only consider D1",
          "Pick the closest school",
        ],
        correctAnswer: 1,
        explanation: "Fit matters more than division. Many D3 programs are excellent.",
      },
    ],
  },
  {
    id: "girls-high-l5",
    lessonNumber: 5,
    title: "Elite Mental Game",
    topic: "Mental Game",
    pillar: "leadership",
    description: `By high school, mental game becomes one of the biggest differences between good and great players. Physical talent gets you to the team. Mental game determines how far you go.\n\nHere are the mental skills the best high school players develop:\n\nVisualization. Before games, the best players visualize themselves succeeding. They picture making the dodge, hitting the shot, making the play. This isn't woo-woo — it's science. Visualization actually programs your nervous system to execute when the moment comes. Spend 5 minutes the night before a game visualizing yourself playing your best.\n\nThe 5-second reset. When something bad happens — a turnover, a missed shot, a bad call — give yourself 5 seconds to feel the frustration. Then physically reset (breath, touch your stick, refocus your eyes) and play the next play. The 5-second rule works because emotions only last seconds if you don't feed them.\n\nProcess over outcome. Outcome thinking ("I have to score") creates pressure. Process thinking ("I'm going to attack hard and trust my training") creates flow. Focus on what you can control — your effort, your reads, your execution. The score takes care of itself.\n\nConfidence through preparation. The most confident players aren't the most talented — they're the most prepared. They know they've put in the work. They've taken the reps. They've watched the film. Confidence isn't something you fake — it's something you earn through preparation.\n\nGratitude for the opportunity. Sounds soft, but it works. The best players remember that getting to play this game is a privilege. When you appreciate the chance to compete, the pressure goes down and the joy goes up. Tense players play tight. Loose players play free. Gratitude keeps you loose.\n\nMental skills are like physical skills — they have to be practiced. Most players never train them. The ones who do separate themselves quickly.`,
    questions: [
      {
        question: "What's the '5-second reset'?",
        options: [
          "A type of shot",
          "Giving yourself 5 seconds to feel frustration, then resetting and refocusing",
          "A defensive drill",
          "A penalty timer",
        ],
        correctAnswer: 1,
        explanation: "The 5-second reset prevents emotions from destroying your next play.",
      },
      {
        question: "Where does real confidence come from?",
        options: [
          "Talent alone",
          "Preparation — knowing you've put in the work",
          "Trash talk",
          "Wearing the right gear",
        ],
        correctAnswer: 1,
        explanation: "Confidence is earned through preparation, not faked.",
      },
      {
        question: "Does visualization help athletic performance?",
        options: [
          "No — it's just woo-woo",
          "Yes — it programs the nervous system for execution",
          "Only in basketball",
          "Only for goalies",
        ],
        correctAnswer: 1,
        explanation: "Visualization is backed by sports science — the brain rehearses what the body will do.",
      },
    ],
  },
  {
    id: "girls-high-l6",
    lessonNumber: 6,
    title: "Captaincy and Senior Leadership",
    topic: "Character",
    pillar: "leadership",
    description: `Senior leadership is the most important thing on any high school team. The best teams aren't always the most talented — they're the ones with seniors who set the standard for everyone else. If you want to be a captain, here's what real captaincy looks like.\n\nA captain is the bridge between coaches and players. When the coach has a message, the captain reinforces it. When players have concerns, the captain brings them to the coach respectfully. You speak both languages.\n\nA captain holds people accountable — even friends. This is the hardest part. When your best friend is going half-speed, you have to say something. Not in a mean way. Not by yelling. But honestly: "Hey, I need you locked in. We need you." Real captains care more about the team than about being liked.\n\nA captain runs the locker room. The energy in your locker room is your responsibility. If players are quiet and tight before games, you change that. If players are too loose and unfocused, you change that too. The captain sets the temperature.\n\nA captain takes losses harder than wins. After a loss, captains don't blame coaches, refs, or teammates. They take responsibility, talk about what went wrong, and lead the response in the next practice. Wins are easy. Losses are when leadership shows.\n\nA captain develops younger players. Every team has freshmen and sophomores looking up to the seniors. Spend time with them. Teach them. Encourage them. Make them feel like they belong. The captains who do this leave the program better than they found it — and that's the highest form of leadership.\n\nNot every senior will be a captain. But every senior should lead. The senior class sets the culture for the whole program. Take that responsibility seriously, and your team will be one nobody forgets.`,
    questions: [
      {
        question: "What's a captain's role between coaches and players?",
        options: [
          "Take sides",
          "Be a bridge — reinforce coach messages and bring player concerns up respectfully",
          "Stay silent",
          "Replace the coach",
        ],
        correctAnswer: 1,
        explanation: "Captains translate between coaches and players, building trust on both sides.",
      },
      {
        question: "How does a real captain handle a friend who's slacking?",
        options: [
          "Ignore it",
          "Yell publicly",
          "Talk directly and honestly — caring more about the team than being liked",
          "Tell on her",
        ],
        correctAnswer: 2,
        explanation: "Direct, honest accountability is how captains earn respect.",
      },
      {
        question: "When does captain leadership matter most?",
        options: [
          "When winning easy",
          "After losses — taking responsibility and leading the response",
          "Only at practice",
          "Never",
        ],
        correctAnswer: 1,
        explanation: "Anyone can lead when winning. Real leaders show up when things are hard.",
      },
    ],
  },
  {
    id: "girls-high-l7",
    lessonNumber: 7,
    title: "Leading Without a Title",
    topic: "Character",
    pillar: "leadership",
    description: `Most teams name 2-3 captains. But the best teams have leadership running through the entire roster. You don't need a "C" on your jersey to lead — and some of the most impactful leaders on championship teams were never named captain.\n\nLeading without a title means setting the standard daily — at practice, in the weight room, in the film room. You're the junior who's first to every drill. You're the sophomore who stays after to work on her draw controls. You're the underclassman who knows the plays because she studied them on her own time.\n\nIt also means holding people accountable. When your friend is half-speed in a drill, you pull her aside and say "I need more from you." Not publicly. Not harshly. Just honestly. Most people avoid these conversations. Leaders have them.\n\nLeading without a title means doing the unglamorous work. Picking up cones. Setting up goals. Carrying the ball bag. Making sure freshmen feel welcome. These acts build culture more than any speech. The seniors notice — and they trust you for it.\n\nCoaches don't pick captains based on one moment. They watch the whole season. They notice who leads in September, not just in May. If you want to be a captain someday, start leading right now. By the time the decision comes, everyone will already know.`,
    questions: [
      {
        question: "Do you need to be named captain to lead?",
        options: ["Yes", "No — leadership is about daily actions, not a title", "Only seniors lead", "Coaches decide who leads"],
        correctAnswer: 1,
        explanation: "The best teams have leaders at every level. Lead first, title follows.",
      },
      {
        question: "How do coaches decide who becomes captain?",
        options: ["Best player gets it", "Random", "They watch who leads consistently all season — not just at the end", "Popularity"],
        correctAnswer: 2,
        explanation: "Captaincy is earned through months of consistent leadership, not one big moment.",
      },
      {
        question: "What's the most impactful way to lead without a title?",
        options: ["Make speeches", "Do the unglamorous work and hold people accountable quietly", "Score the most goals", "Be the loudest"],
        correctAnswer: 1,
        explanation: "Culture is built in small moments — the work nobody sees and the conversations that matter.",
      },
    ],
  },
  {
    id: "girls-high-l8",
    lessonNumber: 8,
    title: "Team Chemistry",
    topic: "Mental Game",
    pillar: "team",
    description: `Team chemistry is the invisible force that turns a roster into a real team. It's what makes teammates play harder for each other, communicate without thinking, and refuse to let each other down.\n\nChemistry doesn't happen by accident. It's built through shared experiences — grueling preseason workouts, team pasta dinners, long tournament weekends, and tough losses handled with grace. Every hard thing you go through together strengthens the bond.\n\nThe best teams have one simple trait: they genuinely care about each other. Not just on the field — as people. When you care about your teammates, you sprint back on defense because you don't want to let them down. You make the extra effort because you know she'd do the same for you.\n\nBuilding chemistry requires vulnerability. Being honest in the film room. Admitting when you messed up. Accepting coaching from a teammate without getting defensive. Teams where everyone protects their ego never develop real chemistry.\n\nAs an upperclassman, you build chemistry by including everyone. The freshman eating alone? Invite her over. The quiet girl who works hard but never speaks up? Tell her you notice. The more connected your team is as people, the better you'll play together on the field.\n\nGirls lacrosse teams that have real chemistry are special. The connection, the energy, the way you move as one unit — it's something you'll remember long after your playing days are over.`,
    questions: [
      {
        question: "How is team chemistry built?",
        options: ["Luck", "Intentionally — through shared experiences, vulnerability, and genuine connection", "Only by winning", "Coaches create it alone"],
        correctAnswer: 1,
        explanation: "Chemistry is intentional. Shared hard experiences and real connection build it.",
      },
      {
        question: "What role does vulnerability play in chemistry?",
        options: ["None — it's weakness", "It's essential — admitting mistakes and accepting feedback builds trust", "Only coaches are vulnerable", "It's overrated"],
        correctAnswer: 1,
        explanation: "Ego blocks chemistry. Vulnerability — owning mistakes, taking coaching — builds real bonds.",
      },
      {
        question: "How can upperclassmen build team chemistry?",
        options: ["Only hang with seniors", "Include everyone — freshmen, quiet players, newcomers", "Let it happen naturally", "Focus only on starters"],
        correctAnswer: 1,
        explanation: "Connection off the field = chemistry on the field. Include everyone.",
      },
    ],
  },
  {
    id: "girls-high-l9",
    lessonNumber: 9,
    title: "Sacrifice for the Team",
    topic: "Mental Game",
    pillar: "team",
    description: `At the high school level, the best teams are built on sacrifice — putting what the team needs above what you want, without complaining.\n\nSacrifice shows up in real moments:\n\nYou're an attacker who averages 3 goals a game. The coach asks you to play midfield because the team needs your speed in transition. You don't argue. You learn the new position and give it everything.\n\nYou're a senior who earned the starting spot. The coach rotates a sophomore in to develop her for next year. You mentor her, teach her the system, and cheer her on — even though it costs you minutes.\n\nYour legs are dead in the second half of a playoff game. Your body wants to jog. But the team needs one more stop, one more clear, one more sprint. You push through because your teammates are counting on you.\n\nSacrifice isn't dramatic speeches. It's daily choices. It's riding the bus to a game you might not play much in but bringing energy from the sideline. It's doing extra conditioning because the coach said team reps. It's passing up the shot because your teammate has a better look.\n\nThe players who sacrifice the most often get the most back. Coaches trust them. Teammates love playing with them. And they win — because they've built something bigger than themselves.`,
    questions: [
      {
        question: "Your coach asks you to switch positions for the team. What do you do?",
        options: ["Refuse", "Complain", "Accept it and give the new role everything you have", "Quit"],
        correctAnswer: 2,
        explanation: "Sacrifice for the team is what winners do. The team's needs come first.",
      },
      {
        question: "What does daily sacrifice look like?",
        options: ["Big dramatic moments", "Quiet choices — extra reps, sideline energy, mentoring younger players", "It doesn't exist", "Only captains sacrifice"],
        correctAnswer: 1,
        explanation: "Sacrifice is daily, unglamorous, and often unnoticed — but it builds championships.",
      },
      {
        question: "Why do players who sacrifice tend to get more from the sport?",
        options: ["They don't", "Coaches trust them, teammates love them, and they win more", "They get lucky", "It's a myth"],
        correctAnswer: 1,
        explanation: "Sacrifice earns trust and respect. These players become the heart of winning teams.",
      },
    ],
  },
  {
    id: "girls-high-l10",
    lessonNumber: 10,
    title: "The Legacy You Leave",
    topic: "Mental Game",
    pillar: "team",
    description: `Every team eventually becomes a memory. Seniors graduate. Rosters turn over. The only thing that survives is the culture you built — and that's your legacy.\n\nLegacy isn't your stats. In 10 years, nobody will remember how many goals you scored. They'll remember how you made people feel. They'll remember whether you were the teammate who lifted others up or tore them down. They'll remember the standard you set.\n\nThe best legacy is a team that's better AFTER you leave. That means you didn't just play hard — you taught younger players how to play hard. You didn't just show up on time — you showed underclassmen why being early matters. You passed down the culture.\n\nThink about the seniors who were there when you were a freshman. What did they teach you? How did they make you feel? Did they welcome you or freeze you out? Did they push you or ignore you? That's their legacy. Now ask: what will YOUR freshmen say about you in three years?\n\nEvery practice is a chance to build your legacy. Every time you pick someone up after a mistake. Every time you set the tone in conditioning. Every interaction with a younger player.\n\nWhen you're done playing, you'll remember your teammates more than any score. You'll remember what it felt like to be part of something bigger than yourself. And the younger players who watched you will carry forward what you showed them. That's legacy — the most important thing you'll build in your entire lacrosse career.`,
    questions: [
      {
        question: "What is a player's legacy?",
        options: ["Stats", "The culture and standard she leaves behind for the next group", "Highlight reels", "Win-loss record"],
        correctAnswer: 1,
        explanation: "Legacy is the culture you created and the players you developed — not stats.",
      },
      {
        question: "How do you build a lasting legacy?",
        options: ["Score the most goals", "Teach younger players the standard, lift others up, build culture every day", "Win a championship", "Get recruited"],
        correctAnswer: 1,
        explanation: "Legacy is built daily — through mentorship, effort, and passing down the standard.",
      },
      {
        question: "Why should you care about what freshmen think of you?",
        options: ["You shouldn't", "They will carry forward what you showed them — your culture lives through them", "Only if they're talented", "Freshmen don't matter"],
        correctAnswer: 1,
        explanation: "The younger players are watching. What you model becomes the program's future.",
      },
    ],
  },
]

// ─── COURSE BUILDERS ──────────────────────────────────────────────────

export function getAcademyCourses(gender: Gender): AcademyCourse[] {
  const lessonsByTier: Record<AgeTier, AcademyLesson[]> =
    gender === "boys"
      ? { youth: BOYS_YOUTH_LESSONS, middle: BOYS_MIDDLE_LESSONS, high: BOYS_HIGH_LESSONS }
      : { youth: GIRLS_YOUTH_LESSONS, middle: GIRLS_MIDDLE_LESSONS, high: GIRLS_HIGH_LESSONS }

  return TIERS.map((t) => ({
    id: `${gender}-${t.tier}`,
    tier: t.tier,
    tierLabel: t.label,
    ageRange: t.ageRange,
    gradYears: t.gradYears,
    description: getCourseDescription(t.tier),
    gender,
    lessons: lessonsByTier[t.tier],
  }))
}

function getCourseDescription(tier: AgeTier): string {
  switch (tier) {
    case "youth":
      return "Build the foundation. Learn fundamentals, teamwork, and the BTB Standard."
    case "middle":
      return "Level up. Master positions, dodging, defense, and lacrosse IQ."
    case "high":
      return "Compete at the highest level. Advanced systems, film study, and college prep."
  }
}
