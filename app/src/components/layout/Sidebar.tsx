import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  LayoutDashboard,
  FileText,
  Search,
  Timer,
  Settings,
  Plus,
  Share2,
  Github,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Notes", id: "notes" },
  { icon: Search, label: "Search", id: "search" },
  { icon: Timer, label: "Focus", id: "focus" },
  { icon: Share2, label: "Graph", id: "graph" },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, setCaptureOpen, setSettingsOpen } = useAppStore();

  return (
    <motion.aside
      initial={{ width: sidebarOpen ? 240 : 64 }}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen flex flex-col glass border-r border-border/50 relative"
    >
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-base gradient-text"
          >
            CogniFlow
          </motion.span>
        )}
      </div>

      <Separator />

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "secondary" : "ghost"}
            size="sm"
            className={`w-full justify-start gap-3 ${!sidebarOpen && "justify-center px-2"}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
              >
                {item.label}
              </motion.span>
            )}
          </Button>
        ))}
      </nav>

      <Separator />

      <div className="p-2 space-y-1">
        <Button
          variant="gradient"
          size="sm"
          className={`w-full gap-2 ${!sidebarOpen && "px-2"}`}
          onClick={() => setCaptureOpen(true)}
        >
          <Plus className="w-4 h-4" />
          {sidebarOpen && <span className="text-sm">Capture</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start gap-3 ${!sidebarOpen && "justify-center px-2"}`}
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="w-4 h-4" />
          {sidebarOpen && <span className="text-sm">Settings</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
