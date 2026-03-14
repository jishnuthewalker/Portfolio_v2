import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PROJECTS, FILTERS } from "../data/projects";
import { ProjectTile } from "./ProjectTile";

export function ProjectsSection({ onOpenProject, activeFilter, onFilterChange }) {
  const [typedCmd, setTypedCmd] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [tilesVisible, setTilesVisible] = useState(false);

  const CMD = "ls ./projects --sort=featured";

  useEffect(() => {
    let cancelled = false;
    const tileTimer = setTimeout(() => setTilesVisible(true), 800);
    const startTimer = setTimeout(() => {
      let i = 0;
      function type() {
        if (cancelled) return;
        if (i < CMD.length) {
          setTypedCmd(CMD.slice(0, ++i));
          setTimeout(type, 18 + Math.random() * 16);
        } else {
          setShowCursor(false);
        }
      }
      type();
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(tileTimer);
      clearTimeout(startTimer);
    };
  }, []);

  function toggleFilter(value) {
    onFilterChange(activeFilter === value ? null : value);
  }

  function isDimmed(project) {
    if (!activeFilter) return false;
    return !project.skills.includes(activeFilter);
  }

  const featured = PROJECTS.filter((p) => p.size === "featured");
  const half = PROJECTS.filter((p) => p.size === "half");
  const small = PROJECTS.filter((p) => p.size === "small");

  return (
    <section id="projects">
      {/* Typewriter header */}
      <div className="text-[11px] text-[#888] mb-3 whitespace-nowrap overflow-hidden font-mono">
        <span style={{ color: "var(--terminal-green)" }}>❯</span>{" "}
        <span>{typedCmd}</span>
        {showCursor && (
          <span
            style={{
              color: "hsl(277,65%,32%)",
              animation: "blink 1s step-end infinite",
            }}
          >
            █
          </span>
        )}
      </div>

      {/* Filter tags */}
      <motion.div
        className="flex gap-1.5 flex-wrap mb-3"
        initial={{ opacity: 0 }}
        animate={tilesVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.value}
            onClick={() => toggleFilter(f.value)}
            className={[
              "text-[10px] font-mono border px-2 py-0.5 rounded-[2px] cursor-pointer transition-all duration-150",
              activeFilter === f.value
                ? "text-white"
                : "border-[#d0cdc6] text-[#888]",
            ].join(" ")}
            style={
              activeFilter === f.value
                ? { background: "var(--accent)", borderColor: "var(--accent)" }
                : {}
            }
            onMouseEnter={(e) => {
              if (activeFilter !== f.value) {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.background = "var(--accent-tint-04)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== f.value) {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.color = "";
                e.currentTarget.style.background = "";
              }
            }}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Featured row: large left + stacked right */}
      <div className="grid gap-[12px] mb-[12px] grid-cols-1 sm:grid-cols-[2.0fr_1fr]">
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            className="h-full"
            initial={{ opacity: 0, y: 8 }}
            animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <ProjectTile
              project={p}
              dimmed={isDimmed(p)}
              onOpen={() => onOpenProject(p.id)}
            />
          </motion.div>
        ))}
        <div className="flex flex-col gap-[12px]">
          {half.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={
                tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
              }
              transition={{
                duration: 0.35,
                delay: (featured.length + i) * 0.07,
              }}
            >
              <ProjectTile
                project={p}
                dimmed={isDimmed(p)}
                onOpen={() => onOpenProject(p.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-3 gap-[12px] mb-[12px] grid-flow-row-dense">
        {small.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: 0.35,
              delay: (featured.length + half.length + i) * 0.07,
            }}
          >
            <ProjectTile
              project={p}
              dimmed={isDimmed(p)}
              onOpen={() => onOpenProject(p.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
