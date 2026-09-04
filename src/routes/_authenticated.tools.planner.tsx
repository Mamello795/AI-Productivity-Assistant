import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { OutputPanel } from "@/components/OutputPanel";
import { useAiTool } from "@/hooks/useAiTool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/tools/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | SASSA AI Assistant" },
      { name: "description", content: "Generate prioritised daily or weekly schedules from your SASSA task list." },
      { property: "og:title", content: "AI Task Planner | SASSA AI Assistant" },
      { property: "og:description", content: "Prioritised schedules for SASSA staff workloads." },
    ],
  }),
  component: PlannerTool,
});

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function PlannerTool() {
  const { output, setOutput, loading, generate } = useAiTool();
  const [horizon, setHorizon] = useState("Daily");
  const [hours, setHours] = useState("7");
  const [tasks, setTasks] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate(
      "You are a workload planner for SASSA officials. Return markdown with a prioritised schedule table (Time block, Task, Priority, Why), then 'Deferred / delegate' and 'Notes'. Respect statutory turnaround expectations and build in short breaks.",
      `Planning horizon: ${horizon}
Available working hours: ${hours}
Task list:
${tasks}`,
    );
  };

  return (
    <ToolShell
      title="AI Task Planner"
      description="Prioritised daily or weekly schedules from your task list."
      icon={<ListChecks className="h-5 w-5" />}
    >
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="horizon">Horizon</Label>
              <select id="horizon" className={SELECT_CLASS} value={horizon} onChange={(e) => setHorizon(e.target.value)}>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Available hours</Label>
              <Input id="hours" type="number" min={1} max={60} value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea id="tasks" required rows={10} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"Verify 40 outstanding SRD reviews\nPrepare regional backlog report\nRespond to 15 escalated queries"} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Planning…" : "Generate schedule"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <OutputPanel
        title={`${horizon} work plan`}
        toolKey="planner"
        prompt={tasks}
        output={output}
        loading={loading}
        onClear={() => setOutput("")}
      />
    </ToolShell>
  );
}
