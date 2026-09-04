import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { FileDown, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloseButton } from "@/components/CloseButton";
import { downloadPdf, downloadWord } from "@/lib/export";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Output history | SASSA AI Assistant" },
      { name: "description", content: "Review, export and delete your saved AI-generated SASSA outputs." },
      { property: "og:title", content: "Output history | SASSA AI Assistant" },
      { property: "og:description", content: "Your saved AI outputs, exportable as PDF or Word." },
    ],
  }),
  component: HistoryPage,
});

type Row = { id: string; title: string; tool: string; output: string; created_at: string };

function HistoryPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("ai_outputs")
      .select("id, title, tool, output, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("ai_outputs").delete().eq("id", id);
    if (error) toast.error("Could not delete this entry.");
    else {
      toast.success("Deleted.");
      void load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-xl gradient-gold px-5 py-4 card-elevated">
        <div>
          <h1 className="text-xl font-bold text-gold-foreground">Output history</h1>
          <p className="text-sm text-gold-foreground/80">Everything you saved from the AI tools.</p>
        </div>
        <CloseButton label="Close history and return to dashboard" className="text-gold-foreground/70" />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!loading && rows.length === 0 && <p className="text-sm text-muted-foreground">No saved outputs yet.</p>}

      <div className="space-y-4">
        {rows.map((row) => (
          <Card key={row.id} className="card-elevated">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{row.title}</CardTitle>
                <p className="text-xs capitalize text-muted-foreground">
                  {row.tool} · {new Date(row.created_at).toLocaleString("en-ZA")}
                </p>
              </div>
              <CloseButton onClose={() => void remove(row.id)} label="Delete this saved output" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="md-body max-h-64 overflow-auto rounded-lg border p-3">
                <ReactMarkdown>{row.output}</ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadPdf(row.title, row.output)}>
                  <FileDown className="mr-2 h-4 w-4" /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadWord(row.title, row.output)}>
                  <FileText className="mr-2 h-4 w-4" /> Word
                </Button>
                <Button variant="outline" size="sm" onClick={() => void remove(row.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
