import { useState } from "react";
import { Sparkles, Wand2, Copy, Check, MessageSquare, ImageIcon, ArrowRight, Zap, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generatePrompts, type GeneratedPrompt, type Platform } from "@/lib/promptForge";
import { PromptLibrary } from "@/components/PromptLibrary";
import { useSavedPrompts } from "@/lib/savedPrompts";

const platformOptions: { id: Platform; label: string; icon: typeof MessageSquare; desc: string }[] = [
  { id: "chatgpt", label: "ChatGPT", icon: MessageSquare, desc: "Conversational AI" },
  { id: "midjourney", label: "Midjourney", icon: ImageIcon, desc: "AI Image Generation" },
];

const examples = [
  "explain quantum computing to a 10 year old",
  "a futuristic city floating above the clouds",
  "help me write a cold email to investors",
  "a cat astronaut exploring an alien jungle",
];

const Index = () => {
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState<Platform>("chatgpt");
  const [results, setResults] = useState<GeneratedPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { save, isSaved } = useSavedPrompts();

  const handleSave = (r: GeneratedPrompt) => {
    const saved = save({ title: r.title, prompt: r.prompt, platform, tags: r.tags });
    if (saved) toast.success("Saved to library");
    else toast.info("Already in your library");
  };

  const handleForge = async () => {
    if (!idea.trim()) {
      toast.error("Drop in an idea first ✨");
      return;
    }
    setLoading(true);
    setResults([]);
    // Simulated forge delay for premium feel
    await new Promise((r) => setTimeout(r, 700));
    setResults(generatePrompts(idea, platform));
    setLoading(false);
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px] animate-float" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[140px] animate-float [animation-delay:2s]" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
            <Wand2 className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">PromptForge</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <Zap className="h-3 w-3 text-accent" />
            <span>Structured prompt engineering</span>
          </div>
          <PromptLibrary />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        {/* Hero */}
        <section className="pt-10 text-center md:pt-16">
          <div className="mx-auto inline-flex animate-fade-in items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary-glow" />
            Turn raw ideas into expert-grade prompts
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl animate-fade-in-up font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Forge prompts that <span className="text-gradient-primary">actually work</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl animate-fade-in-up text-base text-muted-foreground md:text-lg [animation-delay:120ms]">
            Drop in a rough idea. Get back structured, high-quality prompts engineered for ChatGPT and Midjourney.
          </p>
        </section>

        {/* Forge Panel */}
        <section className="mx-auto mt-12 max-w-3xl animate-scale-in [animation-delay:200ms]">
          <div className="relative rounded-3xl glass-strong p-6 md:p-8">
            <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            {/* Platform selector */}
            {/* Platform selector removed */}

            {/* Input */}
            <div className="relative">
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleForge();
                }}
                placeholder={
                  platform === "chatgpt"
                    ? "e.g. help me plan a 7-day trip to Japan for first-timers"
                    : "e.g. a samurai standing in a neon-lit cyberpunk forest"
                }
                className="min-h-[140px] resize-none rounded-2xl border-border/60 bg-background/40 p-5 text-base leading-relaxed placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {examples.slice(0, platform === "chatgpt" ? 2 : 4).filter((_, i) =>
                    platform === "chatgpt" ? i < 2 : i >= 2
                  ).concat(platform === "chatgpt" ? [examples[2]] : [examples[3]]).slice(0, 2).map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setIdea(ex)}
                      className="rounded-full border border-border/50 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleForge}
                  disabled={loading}
                  size="lg"
                  className="group relative overflow-hidden rounded-xl bg-gradient-primary text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] transition-transform hover:scale-[1.02] hover:shadow-[0_15px_50px_-10px_hsl(var(--primary)/0.8)] disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center gap-2 font-semibold">
                    {loading ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin" /> Forging...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" /> Forge Prompts
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        {(loading || results.length > 0) && (
          <section className="mx-auto mt-14 max-w-5xl">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold md:text-3xl">
                  {loading ? "Forging variations..." : "Your prompt variations"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {results.length > 0 && `${results.length} engineered approaches · pick one or remix`}
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl glass [background:linear-gradient(110deg,hsl(var(--muted)/0.3),45%,hsl(var(--muted)/0.6),55%,hsl(var(--muted)/0.3))] bg-[length:200%_100%]"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}

              {!loading &&
                results.map((r, idx) => (
                  <article
                    key={idx}
                    className="group relative flex animate-fade-in-up flex-col rounded-2xl glass-strong p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <header className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-primary-glow">
                          Variation {idx + 1}
                        </div>
                        <h3 className="mt-0.5 font-display text-lg font-semibold leading-tight">
                          {r.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSave(r)}
                          className={`rounded-lg border p-2 transition-all ${
                            isSaved(r.prompt)
                              ? "border-primary/50 bg-primary/15 text-primary-glow"
                              : "border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                          }`}
                          aria-label="Save prompt"
                        >
                          {isSaved(r.prompt) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => copy(r.prompt, idx)}
                          className="rounded-lg border border-border/60 bg-secondary/40 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                          aria-label="Copy prompt"
                        >
                          {copiedIdx === idx ? (
                            <Check className="h-4 w-4 text-accent" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </header>

                    <div className="relative flex-1 overflow-hidden rounded-xl border border-border/40 bg-background/60 p-4">
                      <pre className="mono max-h-56 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-foreground/85 scrollbar-thin">
                        {r.prompt}
                      </pre>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/90 to-transparent" />
                    </div>

                    <footer className="mt-4 flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border/50 bg-secondary/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </footer>
                  </article>
                ))}
            </div>
          </section>
        )}

        {/* Footer feature row */}
        {results.length === 0 && !loading && (
          <section className="mx-auto mt-20 grid max-w-4xl animate-fade-in gap-4 sm:grid-cols-3 [animation-delay:400ms]">
            {[
              { icon: Sparkles, title: "Engineered structure", desc: "Role, context, constraints — built in." },
              { icon: Zap, title: "Instant variations", desc: "Multiple angles per idea, ready to copy." },
              { icon: Wand2, title: "Platform aware", desc: "Tuned for ChatGPT and Midjourney syntax." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl glass p-5">
                  <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary-glow">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-base font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
