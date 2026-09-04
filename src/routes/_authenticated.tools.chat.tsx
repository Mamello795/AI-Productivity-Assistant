import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { ToolShell } from "@/components/ToolShell";
import { generateAi } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloseButton } from "@/components/CloseButton";

export const Route = createFileRoute("/_authenticated/tools/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | SASSA AI Assistant" },
      { name: "description", content: "Answer standard beneficiary queries in English, isiZulu or Afrikaans with built-in disclaimers." },
      { property: "og:title", content: "AI Chatbot | SASSA AI Assistant" },
      { property: "og:description", content: "Multilingual assistant for standard beneficiary queries." },
    ],
  }),
  component: ChatTool,
});

const SYSTEM = `You answer standard, general SASSA beneficiary queries for staff to relay (e.g. how to check a grant balance, required documents, appeal steps, payment dates in general terms).
Rules: never ask for or use personal information; never confirm a specific person's status, balance or payment; refer such cases to the SASSA toll-free line 0800 60 10 11 or the nearest local office. Answer in the language of the question (English, isiZulu or Afrikaans). Keep answers short and step-by-step.`;

const SUGGESTIONS = [
  "How do I check my grant balance?",
  "Ngingayifaka kanjani isicelo sesibonelelo sezingane?",
  "Watter dokumente is nodig vir 'n ouderdomstoelae?",
  "How do I appeal a declined SRD application?",
];

type Message = { role: "user" | "assistant"; content: string };

function ChatTool() {
  const run = useServerFn(generateAi);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const history = [...messages, { role: "user" as const, content: question }];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const transcript = history.map((m) => `${m.role === "user" ? "Staff/beneficiary" : "Assistant"}: ${m.content}`).join("\n");
      const result = await run({ data: { system: SYSTEM, prompt: transcript } });
      setMessages([...history, { role: "assistant", content: result.text }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The chatbot could not respond.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="AI Chatbot"
      description="Standard beneficiary queries in English, isiZulu or Afrikaans."
      icon={<MessagesSquare className="h-5 w-5" />}
    >
      <Card className="card-elevated">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <CardTitle className="text-base">Conversation</CardTitle>
          <CloseButton onClose={() => setMessages([])} label="Clear conversation" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="min-h-64 space-y-3 rounded-lg border bg-secondary/30 p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Try one of these questions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border bg-background px-3 py-1 text-xs transition-colors hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-card border"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="md-body">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {loading && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex gap-2"
          >
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a general beneficiary question…" />
            <Button type="submit" size="icon" disabled={loading} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Disclaimer: this chatbot gives general guidance only. It cannot confirm an individual's grant
            status, balance or payment. For personal matters call SASSA on 0800 60 10 11 or visit your
            nearest office. Staff must verify all guidance before relaying it.
          </p>
        </CardContent>
      </Card>
    </ToolShell>
  );
}
