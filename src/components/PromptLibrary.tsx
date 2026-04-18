import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Library, Copy, Check, Trash2, Pencil, MessageSquare, ImageIcon, X } from "lucide-react";
import { useSavedPrompts } from "@/lib/savedPrompts";
import { toast } from "sonner";

const platformMeta = {
  chatgpt: { label: "Write", Icon: MessageSquare },
  midjourney: { label: "Visualize", Icon: ImageIcon },
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function PromptLibrary() {
  const { items, remove, rename } = useSavedPrompts();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setDraft(current);
  };

  const commitEdit = (id: string) => {
    const t = draft.trim();
    if (t) {
      rename(id, t);
      toast.success("Renamed");
    }
    setEditingId(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground hover:border-primary/40">
          <Library className="h-3.5 w-3.5 text-primary-glow" />
          Library
          {items.length > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary/20 px-1 text-[10px] font-semibold text-primary-glow">
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-l border-border/60 bg-background/80 p-0 backdrop-blur-2xl sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border/60 p-6">
            <SheetTitle className="flex items-center gap-2 font-display text-xl">
              <Library className="h-5 w-5 text-primary-glow" />
              Saved Prompts
            </SheetTitle>
            <SheetDescription>
              {items.length === 0
                ? "Save prompts from results to revisit them anytime."
                : `${items.length} prompt${items.length === 1 ? "" : "s"} stored locally on this device.`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="mt-16 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl glass">
                  <Library className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No saved prompts yet.</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Hit the bookmark icon on any result to save it.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => {
                  const Meta = platformMeta[item.platform];
                  const Icon = Meta.Icon;
                  const isEditing = editingId === item.id;
                  return (
                    <li
                      key={item.id}
                      className="group animate-fade-in rounded-2xl glass p-4 transition-colors hover:border-primary/40"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <Input
                                autoFocus
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitEdit(item.id);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                onBlur={() => commitEdit(item.id)}
                                className="h-8 rounded-lg border-primary/40 bg-background/60 text-sm"
                              />
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                                aria-label="Cancel"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <h3 className="truncate font-display text-sm font-semibold">{item.title}</h3>
                          )}
                          <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Icon className="h-3 w-3 text-primary-glow" />
                              {Meta.label}
                            </span>
                            <span>·</span>
                            <span>{timeAgo(item.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(item.id, item.title)}
                              className="rounded-md border border-border/60 bg-secondary/30 p-1.5 text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                              aria-label="Rename"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => copy(item.id, item.prompt)}
                            className="rounded-md border border-border/60 bg-secondary/30 p-1.5 text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                            aria-label="Copy"
                          >
                            {copiedId === item.id ? (
                              <Check className="h-3.5 w-3.5 text-accent" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              remove(item.id);
                              toast.success("Deleted");
                            }}
                            className="rounded-md border border-border/60 bg-secondary/30 p-1.5 text-muted-foreground transition-all hover:border-destructive/60 hover:text-destructive"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="relative max-h-32 overflow-hidden rounded-lg border border-border/40 bg-background/60 p-3">
                        <pre className="mono whitespace-pre-wrap text-[11px] leading-relaxed text-foreground/80">
                          {item.prompt}
                        </pre>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/95 to-transparent" />
                      </div>

                      {item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border/50 bg-secondary/30 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border/60 p-4">
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm("Delete all saved prompts? This cannot be undone.")) {
                    items.forEach((i) => remove(i.id));
                    toast.success("Library cleared");
                  }
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
