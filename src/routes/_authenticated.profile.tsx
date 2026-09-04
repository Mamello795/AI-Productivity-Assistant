import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloseButton } from "@/components/CloseButton";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile | SASSA AI Assistant" },
      { name: "description", content: "View and update your SASSA staff profile details and role." },
      { property: "og:title", content: "My profile | SASSA AI Assistant" },
      { property: "og:description", content: "Manage your SASSA staff profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, role, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", department: "", office: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        department: profile.department ?? "",
        office: profile.office ?? "",
      });
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setBusy(false);
    if (error) toast.error("Could not save your profile.");
    else {
      toast.success("Profile updated.");
      await refreshProfile();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-xl gradient-gold px-5 py-4 card-elevated">
        <div>
          <h1 className="text-xl font-bold text-gold-foreground">My profile</h1>
          <p className="text-sm text-gold-foreground/80">Keep your staff details up to date.</p>
        </div>
        <CloseButton label="Close profile and return to dashboard" className="text-gold-foreground/70" />
      </div>

      <Card className="card-elevated max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">Staff details</CardTitle>
          <Badge className="capitalize">{role ?? "officer"}</Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" value={profile?.email ?? user?.email ?? ""} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department / unit</Label>
              <Input id="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="office">Regional office</Label>
              <Input id="office" value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} />
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
