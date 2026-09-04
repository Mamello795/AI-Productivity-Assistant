import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  BookOpen,
  MessagesSquare,
  History,
  User as UserIcon,
  LifeBuoy,
  LogOut,
  Menu,
  Bell,
} from "lucide-react";
import logo from "@/assets/sassa-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/CloseButton";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tools/email", label: "Email Generator", icon: Mail },
  { to: "/tools/summarizer", label: "Meeting Summariser", icon: NotebookPen },
  { to: "/tools/planner", label: "Task Planner", icon: ListChecks },
  { to: "/tools/research", label: "Research Assistant", icon: BookOpen },
  { to: "/tools/chat", label: "AI Chatbot", icon: MessagesSquare },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/help", label: "Help", icon: LifeBuoy },
] as const;

function AuthenticatedLayout() {
  const { user, loading, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("action_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("done", false)
      .then(({ count }) => setPending(count ?? 0));
  }, [user, pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="SASSA emblem" width={32} height={32} className="h-8 w-8" />
              <span className="font-bold">SASSA AI Assistant</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="relative" aria-label={`${pending} pending action items`}>
              <Bell className="h-5 w-5 text-muted-foreground" />
              {pending > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--close-red)] px-1 text-[11px] font-bold text-white">
                  {pending}
                </span>
              )}
            </Link>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{profile?.full_name || user.email}</p>
              <p className="text-xs capitalize text-muted-foreground">{role ?? "officer"}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                void navigate({ to: "/login" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside
          className={`${open ? "block" : "hidden"} fixed inset-x-0 top-[61px] z-20 border-b bg-background p-4 lg:static lg:block lg:w-60 lg:shrink-0 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {open && (
            <div className="mb-2 flex justify-end lg:hidden">
              <CloseButton onClose={() => setOpen(false)} label="Close navigation" />
            </div>
          )}
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
