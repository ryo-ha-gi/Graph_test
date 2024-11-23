// components/SigmaGraph.tsx
import React, { useEffect, useRef } from "react";
import { Sigma } from "sigma";
import Graph from "graphology";

const SigmaGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // グラフの生成
    const graph = new Graph();
    graph.addNode("Node 1", { label: "Node 1", x: 0, y: 0, size: 10, color: "#FF5733" });
    graph.addNode("Node 2", { label: "Node 2", x: 1, y: 1, size: 10, color: "#33FF57" });
    graph.addEdge("Node 1", "Node 2", { label: "Edge" });


    // Sigmaインスタンスを生成
    const sigma = new Sigma(graph, containerRef.current);

    return () => {
      sigma.kill(); // クリーンアップ
    };
  }, []);

  return <div ref={containerRef} style={{ height: "500px", width: "100%" }} />;
};
export default SigmaGraph;