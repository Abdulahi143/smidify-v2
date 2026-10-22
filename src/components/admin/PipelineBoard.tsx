"use client";

import clsx from "clsx";
import { useMemo, useOptimistic, useState, useTransition } from "react";
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

type Move = { id: string; stage: PipelineStage; index: number };

const COLUMN_PREFIX = "column:";

function inColumn(items: PipelineItem[], stage: PipelineStage) {
  return items.filter((i) => i.stage === stage).sort((a, b) => a.sort - b.sort);
}

/** Returns items with `move` applied and the destination column renumbered. */
function applyMove(items: PipelineItem[], { id, stage, index }: Move): PipelineItem[] {
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
      <p className="text-[15px] leading-[22px] font-semibold">{item.name}</p>
      <p className="text-ink/70 mt-[5px] text-[13px] leading-5">{meta(item)}</p>
    </>
  );
}

function ItemCard({ item }: { item: PipelineItem }) {
  const drag = useDraggable({ id: item.id });
  const drop = useDroppable({ id: item.id });

  return (
    <Card
      ref={(node: HTMLDivElement | null) => {
        drag.setNodeRef(node);
        drop.setNodeRef(node);
      }}
      {...drag.attributes}
      {...drag.listeners}
      className={clsx(
        "cursor-grab p-[15px]",
        drag.isDragging && "opacity-45",
        drop.isOver && !drag.isDragging && "ring-2 ring-cyan ring-inset",
      )}
    >
      <CardBody item={item} />
    </Card>
  );
}

function Column({ stage, items }: { stage: (typeof PROCESS_STAGES)[number]; items: PipelineItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `${COLUMN_PREFIX}${stage.key}` });
  return (
    <section aria-label={stage.name} className="min-w-[170px]">
      <h3 className="meta text-ink flex justify-between pb-[15px] text-[13px] font-normal">
        <span>
          {stage.num} {stage.name}
        </span>
        <span className="text-ink/70">{items.length}</span>
      </h3>
      <div
        ref={setNodeRef}
        className={clsx(
          "flex min-h-[80px] flex-col gap-[10px] rounded-md",
          isOver && "bg-cyan-100/60",
        )}
      >
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export function PipelineBoard({ items }: { items: PipelineItem[] }) {
  const [optimistic, addMove] = useOptimistic(items, applyMove);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const columns = useMemo(
    () => PROCESS_STAGES.map((stage) => ({ stage, items: inColumn(optimistic, stage.key) })),
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
      const column = inColumn(optimistic, target.stage).filter((i) => i.id !== id);
      const overIndex = column.findIndex((i) => i.id === overId);
      // Dragging down within a column lands after the card it was dropped on.
      const after = from.stage === target.stage && from.sort < target.sort;
      move = { id, stage: target.stage, index: overIndex + (after ? 1 : 0) };
    }

    const { stage } = move;
    const index = Math.min(move.index, inColumn(optimistic, stage).filter((i) => i.id !== id).length);
    startTransition(async () => {
      addMove({ id, stage, index });
      await moveStage(id, stage, index);
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
      <div className="overflow-x-auto pb-[10px]">
        <div className="grid min-w-[1190px] grid-cols-7 gap-[15px]">
          {columns.map(({ stage, items: col }) => (
            <Column key={stage.key} stage={stage} items={col} />
          ))}
        </div>
      </div>
      <DragOverlay>
        {active ? (
          <Card className="cursor-grabbing p-[15px] shadow-md">
            <CardBody item={active} />
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
