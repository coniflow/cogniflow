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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/stores/noteStore";
import { Share2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const nodeColors: Record<string, string> = {
  note: "#7C3AED",
  tag: "#06B6D4",
  entity: "#F59E0B",
};

const defaultNodes: Node[] = [
  {
    id: "1",
    type: "default",
    data: { label: "Project Alpha" },
    position: { x: 0, y: 0 },
    style: {
      background: "rgba(124, 58, 237, 0.15)",
      border: "1px solid rgba(124, 58, 237, 0.3)",
      color: "#fff",
      borderRadius: "12px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: 600,
      backdropFilter: "blur(12px)",
    },
  },
  {
    id: "2",
    data: { label: "Machine Learning" },
    position: { x: 200, y: -100 },
    style: {
      background: "rgba(6, 182, 212, 0.15)",
      border: "1px solid rgba(6, 182, 212, 0.3)",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 16px",
      fontSize: "13px",
      fontWeight: 500,
      backdropFilter: "blur(12px)",
    },
  },
  {
    id: "3",
    data: { label: "System Design" },
    position: { x: -180, y: -80 },
    style: {
      background: "rgba(6, 182, 212, 0.15)",
      border: "1px solid rgba(6, 182, 212, 0.3)",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 16px",
      fontSize: "13px",
      fontWeight: 500,
      backdropFilter: "blur(12px)",
    },
  },
  {
    id: "4",
    data: { label: "Team Sync" },
    position: { x: 100, y: 120 },
    style: {
      background: "rgba(245, 158, 11, 0.15)",
      border: "1px solid rgba(245, 158, 11, 0.3)",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 16px",
      fontSize: "13px",
      fontWeight: 500,
      backdropFilter: "blur(12px)",
    },
  },
  {
    id: "5",
    data: { label: "Product Strategy" },
    position: { x: -120, y: 100 },
    style: {
      background: "rgba(245, 158, 11, 0.15)",
      border: "1px solid rgba(245, 158, 11, 0.3)",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 16px",
      fontSize: "13px",
      fontWeight: 500,
      backdropFilter: "blur(12px)",
    },
  },
];

const defaultEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "rgba(124, 58, 237, 0.4)", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(124, 58, 237, 0.4)" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "rgba(6, 182, 212, 0.4)", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(6, 182, 212, 0.4)" },
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
    style: { stroke: "rgba(245, 158, 11, 0.3)", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(245, 158, 11, 0.3)" },
  },
  {
    id: "e1-5",
    source: "1",
    target: "5",
    style: { stroke: "rgba(245, 158, 11, 0.3)", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(245, 158, 11, 0.3)" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    style: { stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 1 },
  },
];

export function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
  }, []);

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
            Notes
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Tags
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Entities
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
              nodeColor={(node) => nodeColors[node.data?.type as string] || "#7C3AED"}
              maskColor="rgba(0,0,0,0.6)"
              className="glass rounded-lg border-border"
            />
          </ReactFlow>
        </CardContent>
      </Card>
    </div>
  );
}
