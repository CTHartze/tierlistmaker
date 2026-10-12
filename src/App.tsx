import {
  DndContext,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { atom, useAtom, useAtomValue } from "jotai";
import { useState } from "react";

type Draggable = {
  id: string;
  src: string;
  dp?: string;
};

type Droppable = {
  id: string;
  draggables: string[];
};

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "brave.png" },
  { id: crypto.randomUUID(), src: "chrome.png" },
  { id: crypto.randomUUID(), src: "edge.png" },
  { id: crypto.randomUUID(), src: "explorer.png" },
  { id: crypto.randomUUID(), src: "firefox.png" },
  { id: crypto.randomUUID(), src: "opera.png" },
  { id: crypto.randomUUID(), src: "safari.png" },
  { id: crypto.randomUUID(), src: "tor.png" },
  { id: crypto.randomUUID(), src: "uc.png" },
  { id: crypto.randomUUID(), src: "vivaldi.png" },
  { id: crypto.randomUUID(), src: "yandex.png" },
];

const defaultDroppables: Droppable[] = [
  { id: "droppable", draggables: [] },
  {
    id: "free",
    draggables: defaultDraggables.map((draggable) => draggable.id),
  },
];

const droppableIds = defaultDroppables.map((dp) => dp.id);

const activeDraggableAtom = atom<Draggable>();

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);
  const [droppables, setDroppables] = useState<Droppable[]>(defaultDroppables);
  const [activeDraggable, setActiveDraggable] = useAtom(activeDraggableAtom);

  const handleDragStart = (e: DragStartEvent) => {
    const activeDraggable = draggables.find(
      (draggable) => draggable.id === e.active.id,
    );
    setActiveDraggable(activeDraggable);
  };

  const handleDragOver = (e: DragOverEvent) => {
    if (!e.over || !activeDraggable) return;
    const overId = e.over.id as string;
    const activeDraggableId = e.active.id as string;

    setDroppables((prev) => {
      const currentDroppable = droppables.find((dp) =>
        dp.draggables.some((draggable) => draggable === activeDraggableId),
      );
      if (!currentDroppable) return;
      const currentDroppableId = currentDroppable.id;

      // Case #1: If hovering over the empty space in Droppable
      if (droppableIds.includes(overId)) {
        const droppable = prev.find((dp) => dp.id === overId)!;
        const newDraggables = [
          ...droppable.draggables.filter(
            (draggable) => draggable !== activeDraggableId,
          ),
          activeDraggableId,
        ];
        return prev.map((dp) => {
          // If not old or new then return
          if (dp.id !== overId && dp.id !== currentDroppableId) return dp;

          // Remove from old one IF went across rows
          if (dp.id === currentDroppableId && currentDroppableId !== overId)
            return {
              ...dp,
              draggables: dp.draggables.filter(
                (draggable) => draggable !== activeDraggableId,
              ),
            };

          // Add to new one
          return { ...dp, draggables: newDraggables };
        });
      }

      // Case #2: If re-arranging items in the same droppable
      if (
        currentDroppable.draggables.some((draggable) => draggable === overId)
      ) {
        const oldIndex = currentDroppable.draggables.findIndex(
          (draggable) => draggable === activeDraggableId,
        );
        const newIndex = currentDroppable.draggables.findIndex(
          (draggable) => draggable === overId,
        );

        if (oldIndex === newIndex) return prev;

        const newDraggables = arrayMove(
          currentDroppable.draggables,
          oldIndex,
          newIndex,
        );

        return prev.map((dp) => {
          if (dp.id !== currentDroppableId) return dp;
          return { ...dp, draggables: newDraggables };
        });
      }

      // Case #3: If re-arranging between 2 different droppables

      return prev;
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDraggable(undefined);
  };

  const freeDraggables = draggables.filter((draggables) => !draggables.dp);

  return (
    <div className="w-screen h-screen flex flex-col gap-16 justify-center items-center">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {droppables.map((dp) => (
          <Droppable droppable={dp} />
        ))}
        <DragOverlay>
          {activeDraggable && (
            <DraggableContent draggable={activeDraggable} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Droppable({ droppable }: { droppable: Droppable }) {
  const { id, draggables } = droppable;
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    backgroundColor: isOver ? "green" : undefined,
  };

  return (
    <div
      style={style}
      className="border border-white bg-[#333] h-30 w-full flex"
    >
      <div className="flex gap-4">
        <SortableContext items={draggables}>
          {draggables.map((draggableId) => {
            const draggable = defaultDraggables.find(
              (draggable) => draggable.id === draggableId,
            );
            if (!draggable) return null;
            return <Draggable key={draggableId} draggable={draggable} />;
          })}
        </SortableContext>
      </div>
      <div ref={setNodeRef} className="bg-amber-300 flex-1" />
    </div>
  );
}

function Draggable({ draggable }: { draggable: Draggable }) {
  const { id } = draggable;
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <button
      className="cursor-pointer"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <DraggableContent draggable={draggable} />
    </button>
  );
}

function DraggableContent({
  draggable,
  isDragging,
}: {
  draggable: Draggable;
  isDragging?: boolean;
}) {
  const { id, src } = draggable;
  const activeDraggableId = useAtomValue(activeDraggableAtom)?.id;
  return (
    <img
      src={`/src/assets/${src}`}
      style={{ opacity: isDragging || activeDraggableId !== id ? 1 : 0.25 }}
      className="max-h-30 aspect-square object-cover"
    />
  );
}
