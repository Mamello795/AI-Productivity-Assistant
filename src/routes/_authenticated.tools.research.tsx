import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { OutputPanel } from "@/components/OutputPanel";
import { useAiTool } from "@/hooks/useAiTool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tools/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | SASSA AI Assistant" },
      { name: "description", content: "Summarise policy such as the Social Assistance Act and simplify complex reports for SASSA staff." },
      { property: "og:title", content: "AI Research Assistant | SASSA AI Assistant" },
      { property: "og:description", content: "Policy summaries and plain-language explanations." },
    ],
  }),
  component: ResearchTool,
});

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function ResearchTool() {
  const { output, setOutput, loading, generate } = useAiTool();
  const [mode, setMode] = useState("Summarise a policy");
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate(
      "You support SASSA staff with policy research. Return markdown with: Plain-language summary, Key points, What it means for frontline staff, Open questions to verify. Where you rely on general knowledge of South African social assistance law, say so and advise confirming against the official gazette or policy document.",
      `Mode: ${mode}
Topic or question: ${topic}
${source ? `Source material provided:\n${source}` : "No source material provided — rely on general knowledge and flag uncertainty."}`,
    );
  };

  return (
    <ToolShell
      title="AI Research Assistant"
      description="Policy summaries and simplified reports."
      icon={<BookOpen className="h-5 w-5" />}
    >
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <form onSubmit={submit} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <select id="mode" className={SELECT_CLASS} value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Summarise a policy</option>
                <option>Simplify a report</option>
                <option>Compare grant requirements</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input id="topic" required value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Eligibility criteria under the Social Assistance Act" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source material (optional)</Label>
              <Textarea id="source" rows={8} value={source} onChange={(e) => setSource(e.target.value)} placeholder="Paste the report or policy extract here." />
            </div>
            <div>
              <Button type="submit" disabled={loading}>
                {loading ? "Researching…" : "Generate summary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <OutputPanel
        title={topic || "Policy summary"}
        toolKey="research"
        prompt={topic}
        output={output}
        loading={loading}
        onClear={() => setOutput("")}
      />
    </ToolShell>
  );
}
