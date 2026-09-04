import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  BookOpen,
  MessagesSquare,
  FileCheck2,
  Clock,
  CircleAlert,
  Sparkles,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseButton } from "@/components/CloseButton";
import { PopiaNotice } from "@/components/PopiaNotice";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | SASSA AI Assistant" },
      { name: "description", content: "Daily grant workload metrics, pending actions and quick access to the five SASSA AI tools." },
      { property: "og:title", content: "Dashboard | SASSA AI Assistant" },
      { property: "og:description", content: "Metrics, action items and AI tools for SASSA staff." },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  { to: "/tools/email", label: "Email Generator", icon: Mail },
  { to: "/tools/summarizer", label: "Meeting Summariser", icon: NotebookPen },
  { to: "/tools/planner", label: "Task Planner", icon: ListChecks },
  { to: "/tools/research", label: "Research Assistant", icon: BookOpen },
  { to: "/tools/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

type ActionItem = { id: string; title: string; done: boolean; due_date: string | null };
type OutputRow = { id: string; title: string; tool: string; created_at: string };

function Dashboard() {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState({ processed: 0, pendingApps: 0, outputs: 0 });
  const [items, setItems] = useState<ActionItem[]>([]);
  const [outputs, setOutputs] = useState<OutputRow[]>([]);
  const [newItem, setNewItem] = useState("");
  const [panels, setPanels] = useState({ actions: true, activity: true, quick: true });

  const load = async () => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [processed, pendingApps, itemRows, outputRows] = await Promise.all([
      supabase
        .from("grant_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "processed")
        .gte("processed_at", today.toISOString()),
      supabase.from("grant_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("action_items").select("id, title, done, due_date").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
      supabase.from("ai_outputs").select("id, title, tool, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
    ]);

    setMetrics({
      processed: processed.count ?? 0,
      pendingApps: pendingApps.count ?? 0,
      outputs: outputRows.data?.length ?? 0,
    });
    setItems((itemRows.data as ActionItem[]) ?? []);
    setOutputs((outputRows.data as OutputRow[]) ?? []);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItem.trim()) return;
    const { error } = await supabase.from("action_items").insert({ user_id: user.id, title: newItem.trim() });
    if (error) toast.error("Could not add the action item.");
    else {
      setNewItem("");
      void load();
    }
  };

  const toggle = async (item: ActionItem) => {
    await supabase.from("action_items").update({ done: !item.done }).eq("id", item.id);
    void load();
  };

  const outstanding = items.filter((i) => !i.done).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl gradient-gold px-5 py-4 card-elevated">
        <h1 className="text-xl font-bold text-gold-foreground">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-gold-foreground/80">
          {profile?.office ? `${profile.office} regional office · ` : ""}Here is today's workload.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={FileCheck2} label="Grants processed today" value={metrics.processed} tone="gold" />
        <Metric icon={Clock} label="Pending applications" value={metrics.pendingApps} tone="alert" />
        <Metric icon={CircleAlert} label="Outstanding action items" value={outstanding} tone="alert" />
        <Metric icon={Sparkles} label="Recent AI outputs" value={metrics.outputs} tone="gold" />
      </div>

      <PopiaNotice />

      {panels.quick && (
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <CardTitle className="text-base">Quick actions</CardTitle>
            <CloseButton onClose={() => setPanels((p) => ({ ...p, quick: false }))} label="Close quick actions panel" />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex flex-col items-start gap-2 rounded-lg border bg-card p-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                <action.icon className="h-5 w-5 text-gold" />
                {action.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {panels.actions && (
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <CardTitle className="text-base">Action items</CardTitle>
              <CloseButton onClose={() => setPanels((p) => ({ ...p, actions: false }))} label="Close action items panel" />
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={addItem} className="flex gap-2">
                <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add an action item" />
                <Button type="submit" size="icon" aria-label="Add action item">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              {items.length === 0 && <p className="text-sm text-muted-foreground">No action items yet.</p>}
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
                    <Checkbox checked={item.done} onCheckedChange={() => void toggle(item)} />
                    <span className={item.done ? "text-muted-foreground line-through" : ""}>{item.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {panels.activity && (
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CloseButton onClose={() => setPanels((p) => ({ ...p, activity: false }))} label="Close recent activity panel" />
            </CardHeader>
            <CardContent>
              {outputs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing yet — generate something with an AI tool.</p>
              ) : (
                <ul className="space-y-2">
                  {outputs.map((row) => (
                    <li key={row.id} className="rounded-md border px-3 py-2 text-sm">
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {row.tool} · {new Date(row.created_at).toLocaleString("en-ZA")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3">
                <Link to="/history" className="text-sm underline">
                  View full history
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {(!panels.actions || !panels.activity || !panels.quick) && (
        <Button variant="outline" size="sm" onClick={() => setPanels({ actions: true, activity: true, quick: true })}>
          Restore closed panels
        </Button>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof FileCheck2;
  label: string;
  value: number;
  tone: "gold" | "alert";
}) {
  return (
    <Card className="card-elevated">
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`rounded-lg p-2 ${tone === "gold" ? "bg-success/25 text-success-foreground" : "bg-alert/35 text-alert-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
