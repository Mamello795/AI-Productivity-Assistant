import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import logo from "@/assets/sassa-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Staff registration | SASSA AI Assistant" },
      { name: "description", content: "Register a SASSA staff account and select your role: Admin, Manager or Officer." },
      { property: "og:title", content: "Staff registration | SASSA AI Assistant" },
      { property: "og:description", content: "Create a SASSA staff account with role selection." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    department: "",
    office: "",
    role: "officer",
    password: "",
  });
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: form.fullName,
          department: form.department,
          office: form.office,
          role: form.role,
        },
      },
    });
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Account created. Please confirm your email, then log in.");
      void navigate({ to: "/login" });
      return;
    }
    toast.success("Account created.");
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3">
          <img src={logo} alt="SASSA emblem" width={40} height={40} className="h-10 w-10" />
          <span className="text-lg font-bold">SASSA AI Assistant</span>
        </Link>
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Create a staff account</CardTitle>
            <CardDescription>Register with your official SASSA work details and select your role.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" required value={form.fullName} onChange={set("fullName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="name@sassa.gov.za" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department / unit</Label>
                <Input id="department" value={form.department} onChange={set("department")} placeholder="Grants Administration" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="office">Regional office</Label>
                <Input id="office" value={form.office} onChange={set("office")} placeholder="Gauteng" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={form.role}
                  onChange={set("role")}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="officer">Officer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={8} value={form.password} onChange={set("password")} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account…" : "Register"}
                </Button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="font-medium underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By registering you agree to use this platform in line with POPIA and SASSA information security policy.
        </p>
      </div>
    </div>
  );
}
