export type Platform = "chatgpt" | "midjourney";

export interface GeneratedPrompt {
  title: string;
  prompt: string;
  tags: string[];
}

const chatgptStyles = [
  {
    title: "Structured Expert",
    build: (idea: string) => `# Role
You are a world-class expert tasked with helping the user with the following objective.

# Objective
${capitalize(idea)}.

# Context
- Audience: assume an intelligent but non-specialist reader.
- Tone: clear, confident, and pragmatic.
- Constraints: avoid filler, prioritize actionable insight.

# Instructions
1. Begin with a 2-sentence executive summary.
2. Break the answer into clearly labeled sections with short headings.
3. Include concrete examples, numbers, or analogies where useful.
4. End with a "Next Steps" checklist of 3–5 actions.

# Output Format
Use Markdown. Keep paragraphs short. Bold key terms.`,
    tags: ["structured", "expert", "markdown"],
  },
  {
    title: "Chain-of-Thought Reasoner",
    build: (idea: string) => `You are an analytical assistant. Think step-by-step before answering.

TASK: ${capitalize(idea)}.

Process:
1. Restate the problem in your own words.
2. List the key variables, assumptions, and unknowns.
3. Reason through 2–3 possible approaches and compare their tradeoffs.
4. Choose the strongest approach and justify why.
5. Deliver the final answer in a concise, well-formatted response.

Constraints:
- Show your reasoning briefly, then the final answer in a clearly separated "## Final Answer" section.
- Cite assumptions explicitly.`,
    tags: ["reasoning", "analytical", "step-by-step"],
  },
  {
    title: "Conversational Coach",
    build: (idea: string) => `Act as a warm, encouraging coach helping me with: ${idea}.

Your style:
- Speak in second person ("you"), like a trusted mentor.
- Ask 1–2 clarifying questions before diving deep.
- Offer frameworks, not just answers.
- Use short paragraphs and the occasional rhetorical question.

Deliver:
1. A reframe of the challenge in a more empowering way.
2. 3 concrete tactics I can apply this week.
3. One reflective question to deepen my thinking.`,
    tags: ["coaching", "conversational", "friendly"],
  },
];

const midjourneyStyles = [
  {
    title: "Cinematic Photoreal",
    build: (idea: string) => `${idea}, cinematic photography, shot on ARRI Alexa 65mm, shallow depth of field, dramatic rim lighting, moody atmosphere, volumetric fog, ultra-detailed, hyperrealistic textures, 8k, golden hour, color graded like Blade Runner 2049 --ar 16:9 --style raw --v 6`,
    tags: ["photoreal", "cinematic", "16:9"],
  },
  {
    title: "Editorial Illustration",
    build: (idea: string) => `${idea}, editorial illustration, bold geometric shapes, limited palette of deep navy, coral and cream, subtle paper grain texture, flat shading with soft gradients, in the style of New Yorker magazine covers, conceptual, elegant negative space --ar 4:5 --v 6 --stylize 750`,
    tags: ["illustration", "editorial", "4:5"],
  },
  {
    title: "Surreal Dreamscape",
    build: (idea: string) => `${idea}, surreal dreamscape, floating elements, iridescent holographic surfaces, soft pastel sky melting into deep violet, glass and chrome textures, hyper-detailed, otherworldly atmosphere, inspired by Beeple and Salvador Dalí --ar 1:1 --chaos 25 --stylize 1000 --v 6`,
    tags: ["surreal", "dreamy", "1:1"],
  },
];

function capitalize(s: string) {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1).replace(/[.!?]+$/g, "");
}

export function generatePrompts(idea: string, platform: Platform): GeneratedPrompt[] {
  const cleaned = idea.trim();
  if (!cleaned) return [];

  const styles = platform === "chatgpt" ? chatgptStyles : midjourneyStyles;
  return styles.map((s) => ({
    title: s.title,
    prompt: s.build(cleaned),
    tags: s.tags,
  }));
}
