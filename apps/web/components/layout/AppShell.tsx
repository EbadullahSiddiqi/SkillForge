import { Navbar } from "./Navbar";

type AppShellProps = {
  children: React.ReactNode;
  showNav?: boolean;
};

export function AppShell({ children, showNav = true }: AppShellProps) {
  return (
    <div className="min-h-screen mesh-bg">
      {showNav && <Navbar />}
      <div className={showNav ? "pt-16" : ""}>{children}</div>
    </div>
  );
}
