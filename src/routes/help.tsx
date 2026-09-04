import { createFileRoute, Link } from "@tanstack/react-router";
import { PopiaNotice } from "@/components/PopiaNotice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & support | SASSA AI Assistant" },
      { name: "description", content: "Short guide to the SASSA AI tools, responsible use rules and support contacts." },
      { property: "og:title", content: "Help & support | SASSA AI Assistant" },
      { property: "og:description", content: "How to use the SASSA AI tools responsibly." },
    ],
  }),
  component: HelpPage,
});

const GUIDES = [
  ["Smart Email Generator", "Choose the document type, tone and language, add a short subject and context, then generate. Edit the draft before sending."],
  ["Meeting Notes Summariser", "Paste the transcript or rough notes. You receive a summary, decisions, action items with owners, and deadlines."],
  ["AI Task Planner", "List your tasks with rough effort. Pick daily or weekly and available hours to get a prioritised schedule."],
  ["AI Research Assistant", "Ask about a policy (e.g. Social Assistance Act) or paste a report to get a plain-language summary. Always verify against the official document."],
  ["AI Chatbot", "Answer standard beneficiary queries in English, isiZulu or Afrikaans. Never enter personal beneficiary details."],
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Help &amp; support</h1>
        <p className="text-sm text-muted-foreground">A short guide to the five AI tools and how to use them responsibly.</p>
      </div>
      <PopiaNotice />
      <div className="space-y-4">
        {GUIDES.map(([name, copy]) => (
          <Card key={name} className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base">{name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{copy}</CardContent>
          </Card>
        ))}
      </div>
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-base">Responsible AI rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Every output must be reviewed and approved by a SASSA official before use.</p>
          <p>2. Never enter beneficiary personal information; no personal data is stored by the AI.</p>
          <p>3. AI output is not an official decision on any grant application.</p>
          <p>4. Language must stay clear, inclusive and respectful in all official languages used.</p>
        </CardContent>
      </Card>
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-base">Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>SASSA toll-free: 0800 60 10 11</p>
          <p>Internal ICT service desk: log a ticket via your regional office.</p>
          <p>
            <Link to="/" className="underline">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
