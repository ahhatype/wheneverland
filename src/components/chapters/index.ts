import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const registry: Record<string, ComponentType> = {
  Chapter1: dynamic(() => import("./ChapterOneViz")),
  ChapterOneViz: dynamic(() => import("./ChapterOneViz")),
  Chapter2: dynamic(() => import("./ChapterTwoViz")),
  ChapterTwoViz: dynamic(() => import("./ChapterTwoViz")),
  Chapter3: dynamic(() => import("./ChapterThreeViz")),
  ChapterThreeViz: dynamic(() => import("./ChapterThreeViz")),
  Chapter4: dynamic(() => import("./ChapterFourViz")),
  ChapterFourViz: dynamic(() => import("./ChapterFourViz")),
  Chapter5: dynamic(() => import("./ChapterFiveViz")),
  ChapterFiveViz: dynamic(() => import("./ChapterFiveViz")),
};

export function getChapterComponent(name: string): ComponentType | null {
  return registry[name] ?? null;
}
