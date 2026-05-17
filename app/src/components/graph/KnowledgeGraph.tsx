import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNoteStore } from "@/stores/noteStore";
import { Share2 } from "lucide-react";

const nodeColors: Record<string, string> = {
  note: "#7C3AED",
  tag: "#06B6D4",
  entity: "#F59E0B",
};

const nodeStyle = (type: string, isSelected: boolean): React.CSSProperties => ({
  background: `rgba(${type === "note" ? "124, 58, 237" : type === "tag" ? "6, 182, 212" : "245, 158, 11"}, ${isSelected ? 0.25 : 0.15})`,
  border: `1px solid rgba(${type === "note" ? "124, 58, 237" : type === "tag" ? "6, 182, 212" : "245, 158, 11"}, ${isSelected ? 0.5 : 0.3})`,
  color: "#fff",
  borderRadius: "12px",
  padding: type === "note" ? "12px 20px" : "8px 14px",
  fontSize: type === "note" ? "14px" : "12px",
  fontWeight: type === "note" ? 600 : 500,
  backdropFilter: "blur(12px)",
});

const XY_SPREAD = 250;
const TAG_RADIUS = 180;

export function KnowledgeGraph() {
  const { notes } = useNoteStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const addedTags = new Set<string>();
    const addedEntities = new Set<string>();
    const noteIds = new Set<string>();

    notes.forEach((note, i) => {
      const angle = (2 * Math.PI * i) / notes.length - Math.PI / 2;
      const cx = Math.cos(angle) * XY_SPREAD;
      const cy = Math.sin(angle) * XY_SPREAD;

      const noteId = `note-${note.id}`;
      noteIds.add(note.id);

      nodes.push({
        id: noteId,
        type: "default",
        data: { label: note.title.length > 25 ? note.title.slice(0, 25) + "..." : note.title },
        position: { x: cx, y: cy },
        style: nodeStyle("note", false),
      });

      note.tags.forEach((tag) => {
        const tagId = `tag-${tag}`;
        if (!addedTags.has(tag)) {
          const tagAngle = Math.random() * 2 * Math.PI;
          nodes.push({
            id: tagId,
            type: "default",
            data: { label: tag },
            position: {
              x: cx + Math.cos(tagAngle) * TAG_RADIUS,
              y: cy + Math.sin(tagAngle) * TAG_RADIUS,
            },
            style: nodeStyle("tag", false),
          });
          addedTags.add(tag);
        }
        edges.push({
          id: `e-${noteId}-${tagId}`,
          source: noteId,
          target: tagId,
          animated: true,
          style: { stroke: "rgba(6, 182, 212, 0.3)", strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(6, 182, 212, 0.3)" },
        });
      });

      note.entities.forEach((entity) => {
        const entityId = `entity-${entity}`;
        if (!addedEntities.has(entity)) {
          const entAngle = Math.random() * 2 * Math.PI;
          nodes.push({
            id: entityId,
            type: "default",
            data: { label: entity },
            position: {
              x: cx + Math.cos(entAngle) * TAG_RADIUS * 1.3,
              y: cy + Math.sin(entAngle) * TAG_RADIUS * 1.3,
            },
            style: nodeStyle("entity", false),
          });
          addedEntities.add(entity);
        }
        edges.push({
          id: `e-${noteId}-${entityId}`,
          source: noteId,
          target: entityId,
          style: { stroke: "rgba(245, 158, 11, 0.3)", strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(245, 158, 11, 0.3)" },
        });
      });

      note.connections.forEach((conn) => {
        const connId = `conn-${conn}`;
        const connAngle = Math.random() * 2 * Math.PI;
        nodes.push({
          id: connId,
          type: "default",
          data: { label: conn },
          position: {
            x: cx + Math.cos(connAngle) * TAG_RADIUS * 1.6,
            y: cy + Math.sin(connAngle) * TAG_RADIUS * 1.6,
          },
          style: nodeStyle("entity", false),
        });
        edges.push({
          id: `e-${noteId}-${connId}`,
          source: noteId,
          target: connId,
          style: { stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1 },
          animated: true,
        });
      });
    });

    if (notes.length === 0) {
      nodes.push({
        id: "empty",
        type: "default",
        data: { label: "No notes yet" },
        position: { x: 0, y: 0 },
        style: {
          background: "rgba(124, 58, 237, 0.1)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          color: "#fff",
          borderRadius: "12px",
          padding: "16px 24px",
          fontSize: "14px",
          fontWeight: 500,
          backdropFilter: "blur(12px)",
          opacity: 0.6,
        },
      });
    }

    return { nodes, edges };
  }, [notes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          background: n.id === node.id
            ? `rgba(124, 58, 237, 0.25)`
            : (n.style?.background as string)?.replace(/0\.\d+\)$/, "0.15)") || n.style?.background,
          border: n.id === node.id
            ? "1px solid rgba(124, 58, 237, 0.5)"
            : (n.style?.border as string)?.replace(/0\.\d+\)$/, "0.3)") || n.style?.border,
        },
      }))
    );
  }, [selectedNode, setNodes]);

  const totalNotes = notes.length;
  const totalTags = new Set(notes.flatMap((n) => n.tags)).size;
  const totalEntities = new Set(notes.flatMap((n) => n.entities)).size;

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Knowledge Graph</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            See how your ideas connect
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Notes ({totalNotes})
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Tags ({totalTags})
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Entities ({totalEntities})
          </Badge>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
            minZoom={0.2}
            maxZoom={2}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="rgba(255,255,255,0.05)"
            />
            <Controls
              showInteractive={false}
              className="glass rounded-lg border-border"
            />
            <MiniMap
              nodeColor={(node) => {
                if (node.id.startsWith("note-")) return "#7C3AED";
                if (node.id.startsWith("tag-")) return "#06B6D4";
                return "#F59E0B";
              }}
              maskColor="rgba(0,0,0,0.6)"
              className="glass rounded-lg border-border"
            />
          </ReactFlow>
        </CardContent>
      </Card>
    </div>
  );
}
