// components/SigmaGraph.tsx
import React, { useEffect, useRef } from "react";
import { Sigma } from "sigma";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";

const SigmaGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // グラフの生成
    const graph = new Graph();
    graph.addNode("Node 1", { label: "Node 1", size: 10, color: "#FF5733" });
    graph.addNode("Node 2", { label: "Node 2", size: 10, color: "#33FF57" });
    graph.addNode("Node 3", { label: "Node 3", size: 10, color: "#3357FF" });
    graph.addNode("Node 4", { label: "Node 4", size: 10, color: "#FF57FF" });
    graph.addEdge("Node 1", "Node 2", { label: "Edge 1" });
    graph.addEdge("Node 1", "Node 3", { label: "Edge 2" });
    graph.addEdge("Node 2", "Node 3", { label: "Edge 3" });
    graph.addEdge("Node 2", "Node 4", { label: "Edge 4" });

    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
    });

    const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
    layout.start();
    // Sigmaインスタンスを生成
    const sigma = new Sigma(graph, containerRef.current);

    //
    // Drag'n'drop feature
    // ~~~~~~~~~~~~~~~~~~~
    //

    // State for drag'n'drop
    let draggedNode: string | null = null;
    let isDragging = false;

    // On mouse down on a node
    //  - we enable the drag mode
    //  - save in the dragged node in the state
    //  - highlight the node
    //  - disable the camera so its state is not updated
    sigma.on("downNode", (e) => {
      isDragging = true;
      draggedNode = e.node;
      graph.setNodeAttribute(draggedNode, "highlighted", true);
      if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
    });

    // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
    sigma.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = sigma.viewportToGraph(event);

    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
  });

  // On mouse up, we reset the dragging mode
  const handleUp = () => {
    if (draggedNode) {
    graph.removeNodeAttribute(draggedNode, "highlighted");
    }
      isDragging = false;
      draggedNode = null;
    };
    sigma.on("upNode", handleUp);
    sigma.on("upStage", handleUp);

    return () => {
      sigma.kill(); // クリーンアップ
    };
  }, []);

  return <div ref={containerRef} style={{ height: "600px", width: "100%" }} />;
};
export default SigmaGraph;