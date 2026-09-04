import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { OutputPanel } from "@/components/OutputPanel";
import { useAiTool } from "@/hooks/useAiTool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tools/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | SASSA AI Assistant" },
      { name: "description", content: "Draft formal letters, beneficiary responses and internal memos with tone and language options." },
      { property: "og:title", content: "Smart Email Generator | SASSA AI Assistant" },
      { property: "og:description", content: "AI drafting for SASSA correspondence." },
    ],
  }),
  component: EmailTool,
});

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function EmailTool() {
  const { output, setOutput, loading, generate } = useAiTool();
  const [form, setForm] = useState({
    docType: "Beneficiary response letter",
    tone: "Formal",
    language: "English",
    subject: "",
    context: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate(
      "You draft official SASSA correspondence. Produce a complete, ready-to-edit draft with subject line, greeting, body and sign-off placeholders such as [Officer name] and [Office]. Do not invent reference numbers or amounts.",
      `Document type: ${form.docType}
Tone: ${form.tone}
Language: ${form.language}
Subject: ${form.subject}
Context and key points:
${form.context}`,
    );
  };

  return (
    <ToolShell
      title="Smart Email Generator"
      description="Formal letters, beneficiary responses and internal memos."
      icon={<Mail className="h-5 w-5" />}
    >
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="docType">Document type</Label>
              <select id="docType" className={SELECT_CLASS} value={form.docType} onChange={(e) => setForm({ ...form, docType: e.target.value })}>
                <option>Beneficiary response letter</option>
                <option>Formal outcome letter</option>
                <option>Internal memo</option>
                <option>Follow-up email</option>
                <option>Appointment / document request</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <select id="tone" className={SELECT_CLASS} value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                <option>Formal</option>
                <option>Empathetic</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select id="language" className={SELECT_CLASS} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <option>English</option>
                <option>isiZulu</option>
                <option>Afrikaans</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-3">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Outcome of Older Persons Grant application" />
            </div>
            <div className="space-y-2 sm:col-span-3">
              <Label htmlFor="context">Context and key points</Label>
              <Textarea id="context" required rows={6} value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder="What must the letter say? Use general facts only — no personal beneficiary details." />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Generating…" : "Generate draft"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <OutputPanel
        title={form.subject || "SASSA draft correspondence"}
        toolKey="email"
        prompt={form.context}
        output={output}
        loading={loading}
        onClear={() => setOutput("")}
      />
    </ToolShell>
  );
}
