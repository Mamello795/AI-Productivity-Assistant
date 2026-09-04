import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { OutputPanel } from "@/components/OutputPanel";
import { useAiTool } from "@/hooks/useAiTool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tools/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summariser | SASSA AI Assistant" },
      { name: "description", content: "Extract decisions, action items, responsibilities and deadlines from SASSA meeting transcripts." },
      { property: "og:title", content: "Meeting Notes Summariser | SASSA AI Assistant" },
      { property: "og:description", content: "Turn transcripts into decisions and action items." },
    ],
  }),
  component: SummarizerTool,
});

function SummarizerTool() {
  const { output, setOutput, loading, generate } = useAiTool();
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate(
      "You summarise SASSA meetings. Return markdown with these sections: Summary, Decisions, Action items (table with Action, Owner, Deadline), Risks and follow-ups. If an owner or deadline is not stated, write 'Not stated'.",
      `Meeting: ${title || "Untitled meeting"}

Transcript or notes:
${transcript}`,
    );
  };

  return (
    <ToolShell
      title="Meeting Notes Summariser"
      description="Decisions, action items, responsibilities and deadlines."
      icon={<NotebookPen className="h-5 w-5" />}
    >
      <Card className="card-elevated">
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Regional grants review — weekly" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transcript">Transcript or rough notes</Label>
              <Textarea id="transcript" required rows={12} value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste the meeting transcript here (no beneficiary personal details)." />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Summarising…" : "Summarise meeting"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OutputPanel
        title={title || "Meeting summary"}
        toolKey="summarizer"
        prompt={transcript.slice(0, 2000)}
        output={output}
        loading={loading}
        onClear={() => setOutput("")}
      />
    </ToolShell>
  );
}
