import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNoteStore } from "@/stores/noteStore";
import { Search, Sparkles, FileText, Command } from "lucide-react";

export function SearchBar() {
  const { searchQuery, setSearchQuery, notes } = useNoteStore();
  const [focused, setFocused] = useState(false);

  const results = notes.filter(
    (n) =>
      searchQuery &&
      (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="relative">
      <div
        className={`relative transition-all duration-300 ${
          focused ? "scale-[1.02]" : ""
        }`}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search your second brain... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="pl-9 pr-10 h-11"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </div>

      <AnimatePresence>
        {focused && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="glass-strong border-t-0">
              <CardContent className="p-2 max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      No results found
                    </p>
                  </div>
                ) : (
                  results.slice(0, 8).map((note) => (
                    <div
                      key={note.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {note.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {note.content}
                        </p>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5">
                            {note.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
