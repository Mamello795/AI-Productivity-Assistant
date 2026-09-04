import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, FileDown, FileText, Loader2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloseButton } from "@/components/CloseButton";
import { downloadPdf, downloadWord } from "@/lib/export";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  title: string;
  toolKey: string;
  output: string;
  prompt?: string;
  loading: boolean;
  onClear: () => void;
};

export function OutputPanel({ title, toolKey, output, prompt = "", loading, onClear }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  if (!loading && !output) return null;

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("ai_outputs").insert({
      user_id: user.id,
      tool: toolKey,
      title,
      prompt,
      output,
    });
    setSaving(false);
    if (error) toast.error("Could not save to history.");
    else toast.success("Saved to your history.");
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle className="text-base">AI output</CardTitle>
        <CloseButton onClose={onClear} label="Close output panel" />
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating with Lovable AI…
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 rounded-md border border-alert/60 bg-alert/20 px-3 py-2 text-xs text-alert-foreground">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Accuracy check required: verify facts, amounts and policy references before sending.
              </span>
            </div>
            <div className="md-body rounded-lg border bg-card p-4">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard.");
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadPdf(title, output)}>
                <FileDown className="mr-2 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadWord(title, output)}>
                <FileText className="mr-2 h-4 w-4" /> Word
              </Button>
              <Button size="sm" onClick={() => void save()} disabled={saving}>
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save to history"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
