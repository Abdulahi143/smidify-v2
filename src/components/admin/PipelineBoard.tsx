"use client";

import { useStudioPreview } from "./StudioPreview";

import clsx from "clsx";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr/DotsSixVertical";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Card } from "@/components/ui";
import { moveStage } from "@/lib/actions";
import { PROCESS_STAGES, type PipelineStage } from "@/lib/content/process";
import type { PipelineItem } from "@/lib/queries/pipeline";
import { PipelineItemEditor } from "./PipelineItemEditor";

type Move = { id: string; stage: PipelineStage; index: number };

const COLUMN_PREFIX = "column:";

function inColumn(items: PipelineItem[], stage: PipelineStage) {
  return items.filter((i) => i.stage === stage).sort((a, b) => a.sort - b.sort);
}

/** Returns items with `move` applied and the destination column renumbered. */
function applyMove(
  items: PipelineItem[],
  { id, stage, index }: Move,
): PipelineItem[] {
  const moved = items.find((i) => i.id === id);
  if (!moved) return items;
  const target = inColumn(items, stage).filter((i) => i.id !== id);
  target.splice(Math.min(index, target.length), 0, { ...moved, stage });
  const renumbered = new Map(target.map((i, n) => [i.id, { ...i, sort: n }]));
  return items.map((i) => renumbered.get(i.id) ?? i);
}

function meta(item: PipelineItem) {
  return [item.kind, item.due_note].filter(Boolean).join(" · ");
}

function CardBody({ item }: { item: PipelineItem }) {
  return (
    <>
      <span className="block text-[12px] leading-[22px] font-medium">
        {item.name}
      </span>
      <span className="text-ink/70 mt-[5px] block text-[10px] leading-5">
        {meta(item)}
      </span>
    </>
  );
}

type MoveItem = (id: string, stage: PipelineStage, index: number) => void;

function ItemCard({
  item,
  pending,
  onMove,
}: {
  item: PipelineItem;
  pending: boolean;
  onMove: MoveItem;
}) {
  const drag = useDraggable({ id: item.id, disabled: pending });
  const drop = useDroppable({ id: item.id });

  return (
    <Card
      ref={(node: HTMLDivElement | null) => {
        drag.setNodeRef(node);
        drop.setNodeRef(node);
      }}
      className={clsx(
        "studio-pipeline-card cursor-grab p-[15px]",
        drag.isDragging && "opacity-45",
        drop.isOver && !drag.isDragging && "ring-cyan ring-2 ring-inset",
      )}
    >
      <button
        type="button"
        className="studio-drag-handle"
        disabled={pending}
        {...drag.attributes}
        {...drag.listeners}
        aria-label={`Drag ${item.name}`}
      >
        <span>
          <CardBody item={item} />
        </span>
        <DotsSixVertical size={15} aria-hidden="true" />
      </button>
      <select
        className="studio-move-select"
        aria-label={`Stage for ${item.name}`}
        value={item.stage}
        disabled={pending}
        onChange={(event) => {
          const stage = PROCESS_STAGES.find(
            (s) => s.key === event.target.value,
          );
          if (stage) onMove(item.id, stage.key, Number.MAX_SAFE_INTEGER);
        }}
      >
        {PROCESS_STAGES.map((stage) => (
          <option key={stage.key} value={stage.key}>
            {stage.name}
          </option>
        ))}
      </select>
      <PipelineItemEditor item={item} />
    </Card>
  );
}

function Column({
  stage,
  items,
  pending,
  onMove,
}: {
  stage: (typeof PROCESS_STAGES)[number];
  items: PipelineItem[];
  pending: boolean;
  onMove: MoveItem;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${COLUMN_PREFIX}${stage.key}`,
  });
  return (
    <section
      aria-label={stage.name}
      className="studio-pipeline-column min-w-[170px]"
      data-stage={stage.key}
    >
      <h3 className="studio-pipeline-column-title">
        <span>
          <span className="studio-stage-dot" aria-hidden="true" />
          {stage.name}
        </span>
        <span className="studio-count">{items.length}</span>
      </h3>
      <div
        ref={setNodeRef}
        className={clsx(
          "studio-pipeline-drop flex min-h-[80px] flex-col gap-[10px] rounded-md",
          isOver && "bg-cyan-100/60",
        )}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            pending={pending}
            onMove={onMove}
          />
        ))}
        {items.length === 0 ? (
          <p className="studio-pipeline-empty">No projects</p>
        ) : null}
      </div>
    </section>
  );
}

export function PipelineBoard({ items }: { items: PipelineItem[] }) {
  const local = useStudioPreview();
  const [optimistic, addMove] = useOptimistic(items, applyMove);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const columns = useMemo(
    () =>
      PROCESS_STAGES.map((stage) => ({
        stage,
        items: inColumn(optimistic, stage.key),
      })),
    [optimistic],
  );
  const active = optimistic.find((i) => i.id === activeId);

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd({ active: a, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || a.id === over.id) return;
    const id = String(a.id);
    const overId = String(over.id);

    let move: Move | null = null;
    if (overId.startsWith(COLUMN_PREFIX)) {
      const stage = overId.slice(COLUMN_PREFIX.length) as PipelineStage;
      move = { id, stage, index: Number.MAX_SAFE_INTEGER };
    } else {
      const target = optimistic.find((i) => i.id === overId);
      const from = optimistic.find((i) => i.id === id);
      if (!target || !from) return;
      const column = inColumn(optimistic, target.stage).filter(
        (i) => i.id !== id,
      );
      const overIndex = column.findIndex((i) => i.id === overId);
      // Dragging down within a column lands after the card it was dropped on.
      const after = from.stage === target.stage && from.sort < target.sort;
      move = { id, stage: target.stage, index: overIndex + (after ? 1 : 0) };
    }

    moveItem(id, move.stage, move.index);
  }

  function moveItem(id: string, stage: PipelineStage, position: number) {
    if (pending || local) return;
    const index = Math.min(
      position,
      inColumn(optimistic, stage).filter((i) => i.id !== id).length,
    );
    setError("");
    startTransition(async () => {
      addMove({ id, stage, index });
      try {
        await moveStage(id, stage, index);
      } catch {
        setError(
          "Could not move the project. The board is being refreshed. Please try again.",
        );
        router.refresh();
      }
    });
  }

  return (
    <DndContext
      id="pipeline-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {error ? (
        <p role="alert" className="studio-board-message">
          {error}
        </p>
      ) : null}
      <p role="status" className="sr-only">
        {pending ? "Saving project stage…" : "Board ready"}
      </p>
      <div
        className="studio-board-scroll overflow-x-auto pb-[10px]"
        tabIndex={0}
        role="region"
        aria-label="Client pipeline board"
        aria-busy={pending}
      >
        <div className="grid min-w-[1190px] grid-cols-7 gap-[15px]">
          {columns.map(({ stage, items: col }) => (
            <Column
              key={stage.key}
              stage={stage}
              items={col}
              pending={pending || local}
              onMove={moveItem}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {active ? (
          <Card className="studio-pipeline-card cursor-grabbing p-[15px] shadow-md">
            <CardBody item={active} />
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
