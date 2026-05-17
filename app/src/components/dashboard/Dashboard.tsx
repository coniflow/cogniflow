import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/stores/noteStore";
import { useFocusStore } from "@/stores/focusStore";
import { formatDate } from "@/lib/utils";
import {
  Brain,
  TrendingUp,
  Link2,
  Lightbulb,
  BarChart3,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  FileText,
  Timer,
} from "lucide-react";

interface DashboardProps {
  onNewNote: () => void;
}

export function Dashboard({ onNewNote }: DashboardProps) {
  const { totalNotes, weeklyNotes, totalConnections, recentNotes } = useNoteStore();
  const { currentSession } = useFocusStore();

  const stats = useMemo(
    () => [
      { label: "Total Notes", value: totalNotes().toString(), icon: BookOpen, color: "text-purple-400" },
      { label: "Connections", value: totalConnections().toString(), icon: Link2, color: "text-cyan-400" },
      { label: "Focus Sessions", value: currentSession.toString(), icon: Timer, color: "text-green-400" },
      { label: "This Week", value: weeklyNotes().toString(), icon: BarChart3, color: "text-yellow-400" },
    ],
    [totalNotes(), weeklyNotes(), totalConnections(), currentSession]
  );

  const recents = recentNotes(5);
  const hasNotes = totalNotes() > 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Daily Dashboard</h1>
          </div>
          <Button variant="gradient" size="sm" onClick={onNewNote}>
            <Plus className="w-4 h-4 mr-1" /> New Note
          </Button>
        </div>
        <p className="text-muted-foreground">Your second brain, summarized.</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasNotes ? (
                <>
                  <div className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="mt-0.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weekly Activity</p>
                      <p className="text-xs text-muted-foreground">
                        {weeklyNotes()} thoughts captured this week
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="mt-0.5">
                      <Link2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Knowledge Connections</p>
                      <p className="text-xs text-muted-foreground">
                        {totalConnections()} connections mapped across your notes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="mt-0.5">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">AI Suggestion</p>
                      <p className="text-xs text-muted-foreground">
                        Connect to Ollama for AI-powered tagging and summarization
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Start capturing to see insights here
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={onNewNote}>
                    <Plus className="w-4 h-4 mr-1" /> Create your first note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Recent Thoughts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasNotes ? (
                <div className="space-y-3">
                  {recents.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{note.title}</p>
                        <div className="flex gap-1.5 mt-1">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatDate(note.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No notes yet. Start capturing your thoughts!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Thinking Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasNotes ? (
              <div className="space-y-3">
                {Array.from(new Set(useNoteStore.getState().notes.flatMap((n) => n.tags))).slice(0, 8).map((tag) => {
                  const count = useNoteStore.getState().notes.filter((n) => n.tags.includes(tag)).length;
                  const maxCount = Math.max(
                    1,
                    ...Array.from(new Set(useNoteStore.getState().notes.flatMap((n) => n.tags))).map((t) =>
                      useNoteStore.getState().notes.filter((n) => n.tags.includes(t)).length
                    )
                  );
                  return (
                    <div key={tag} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 truncate">{tag}</span>
                      <div className="flex-1 h-2 rounded-full bg-secondary/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 rounded-lg bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-border/50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Add notes to see your thinking patterns</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
