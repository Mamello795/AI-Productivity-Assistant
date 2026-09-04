import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, BookOpen, MessagesSquare, ShieldCheck } from "lucide-react";
import logo from "@/assets/sassa-logo.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SASSA AI Productivity Assistant | Staff Workspace" },
      {
        name: "description",
        content:
          "Secure AI assistant for SASSA staff: draft letters, summarise meetings, plan tasks, research policy and answer beneficiary queries.",
      },
      { property: "og:title", content: "SASSA AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate repetitive admin work and respond to beneficiaries faster — responsibly.",
      },
    ],
  }),
  component: Landing,
});

const TOOLS = [
  { icon: Mail, name: "Smart Email Generator", copy: "Formal letters, beneficiary responses and internal memos with tone and language options." },
  { icon: NotebookPen, name: "Meeting Notes Summariser", copy: "Turn transcripts into decisions, action items, owners and deadlines." },
  { icon: ListChecks, name: "AI Task Planner", copy: "Prioritised daily or weekly schedules built from your task list." },
  { icon: BookOpen, name: "AI Research Assistant", copy: "Summarise policy such as the Social Assistance Act and simplify reports." },
  { icon: MessagesSquare, name: "AI Chatbot", copy: "Answer standard beneficiary queries in English, isiZulu or Afrikaans." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SASSA emblem" width={40} height={40} className="h-10 w-10" />
            <div>
              <p className="font-bold leading-tight">SASSA AI Assistant</p>
              <p className="text-xs text-muted-foreground">South African Social Security Agency</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/help" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">
              Help
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-alert/40 px-3 py-1 text-xs font-semibold text-alert-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> POPIA-aligned · staff review required
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              An AI productivity assistant built for SASSA service delivery
            </h1>
            <p className="mt-4 text-muted-foreground">
              Automate repetitive administration, respond to beneficiaries faster and keep internal
              workflows moving — with five AI tools designed for the high-volume, high-stakes world
              of social grant management.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/register">Create a staff account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl gradient-gold p-8 card-elevated">
            <img src={logo} alt="SASSA emblem" width={512} height={512} className="mx-auto h-52 w-52" />
          </div>
        </section>

        <section className="border-t bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-bold">Five tools, one workspace</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => (
                <div key={tool.name} className="rounded-xl border bg-card p-5 card-elevated">
                  <tool.icon className="h-6 w-6 text-gold" />
                  <h3 className="mt-3 font-semibold">{tool.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Disclaimer</p>
          <p>
            This platform supports SASSA staff with drafting and summarising. AI output is not an
            official decision, must be reviewed by a SASSA official, and no beneficiary personal
            information should be entered or is stored by the AI.
          </p>
          <p>
            Support: SASSA toll-free 0800 60 10 11 · internal ICT service desk ·{" "}
            <Link to="/help" className="underline">
              Help &amp; guides
            </Link>
          </p>
          <p>© {new Date().getFullYear()} South African Social Security Agency.</p>
        </div>
      </footer>
    </div>
  );
}
