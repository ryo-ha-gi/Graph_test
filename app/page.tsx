"use client"
import dynamic from "next/dynamic";

// SigmaGraph を動的にインポート（SSR無効化）
const SigmaGraph = dynamic(() => import("./sigmagraph"), { ssr: false });

export default function Home() {

  return (
      <SigmaGraph/>
  );
}
