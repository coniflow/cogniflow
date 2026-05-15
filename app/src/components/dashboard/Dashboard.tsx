import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  Link2,
  Lightbulb,
  BarChart3,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";

const insights = [
  {
    id: "1",
    type: "stats",
    title: "Weekly Activity",
    description: "47 thoughts captured this week, 23% more than last week",
    icon: BarChart3,
  },
  {
    id: "2",
    type: "trend",
    title: "Emerging Theme",
    description: 'Your notes about "machine learning" are growing. Consider exploring this deeper.',
    icon: TrendingUp,
  },
  {
    id: "3",
    type: "connection",
    title: "New Connection Found",
    description: '"Project Alpha" is connected to "Team sync" — 3 overlapping concepts detected.',
    icon: Link2,
  },
  {
    id: "4",
    type: "suggestion",
    title: "AI Suggestion",
    description: "Based on your recent notes, you might enjoy reading about systems thinking.",
    icon: Lightbulb,
  },
];

const recentNotes = [
  { id: "1", title: "Project Alpha Ideas", tags: ["work", "ideas"], time: "2h ago" },
  { id: "2", title: "Book: Thinking in Systems", tags: ["reading", "learning"], time: "5h ago" },
  { id: "3", title: "Meeting Notes - Product Review", tags: ["work", "meeting"], time: "1d ago" },
];

export function Dashboard() {
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

  const stats = [
    { label: "Total Notes", value: "342", icon: BookOpen, color: "text-purple-400" },
    { label: "Connections", value: "1,247", icon: Link2, color: "text-cyan-400" },
    { label: "Focus Hours", value: "89", icon: Clock, color: "text-green-400" },
    { label: "AI Insights", value: "56", icon: Sparkles, color: "text-yellow-400" },
  ];

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Daily Dashboard</h1>
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
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="mt-0.5">
                    <insight.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
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
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium">{note.title}</p>
                      <div className="flex gap-1.5 mt-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{note.time}</span>
                  </div>
                ))}
              </div>
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
            <div className="h-48 rounded-lg bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-border/50 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Activity chart loading...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
