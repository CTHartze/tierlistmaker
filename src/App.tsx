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
  dz?: string;
};

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "brave.png", dz: "droppable" },
  { id: crypto.randomUUID(), src: "chrome.png", dz: "droppable" },
  { id: crypto.randomUUID(), src: "edge.png", dz: "droppable" },
  { id: crypto.randomUUID(), src: "explorer.png", dz: "droppable" },
  { id: crypto.randomUUID(), src: "firefox.png", dz: "droppable" },
  { id: crypto.randomUUID(), src: "opera.png", dz: undefined },
  { id: crypto.randomUUID(), src: "safari.png", dz: undefined },
  { id: crypto.randomUUID(), src: "tor.png", dz: undefined },
  { id: crypto.randomUUID(), src: "uc.png", dz: undefined },
  { id: crypto.randomUUID(), src: "vivaldi.png", dz: undefined },
  { id: crypto.randomUUID(), src: "yandex.png", dz: undefined },
];

const activeDraggableAtom = atom<Draggable>();

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);
  const [activeDraggable, setActiveDraggable] = useAtom(activeDraggableAtom);

  const handleDragStart = (e: DragStartEvent) => {
    const activeDraggable = draggables.find(
      (draggable) => draggable.id === e.active.id,
    );
    setActiveDraggable(activeDraggable);
  };

  const handleDragOver = (e: DragOverEvent) => {
    if (!e.over) return;
    const overId = e.over.id as string;
    const activeDraggableId = e.active.id as string;

    setDraggables((prev) => {
      const overDraggable = prev.find((draggable) => draggable.id === overId);
      const overDroppable = !!overDraggable?.dz;
      const oldIndex = prev.findIndex(
        (draggable) => draggable.id === activeDraggableId,
      );
      const newIndex = prev.findIndex((draggable) => draggable.id === overId);

      if (oldIndex === newIndex) return prev;

      const shiftedItems = arrayMove(prev, oldIndex, newIndex);
      shiftedItems[newIndex] = {
        ...shiftedItems[newIndex],
        dz: overDroppable ? "droppable" : undefined,
      };
      return shiftedItems;
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDraggable(undefined);
  };

  const freeDraggables = draggables.filter((draggables) => !draggables.dz);

  return (
    <div className="w-screen h-screen flex flex-col gap-16 justify-center items-center">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Droppable draggables={draggables} />
        <SortableContext
          items={freeDraggables.map((draggables) => draggables.id)}
        >
          <div className="flex gap-2">
            {freeDraggables.map((draggable) => (
              <Draggable key={draggable.id} draggable={draggable} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeDraggable && (
            <DraggableContent draggable={activeDraggable} isDragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Droppable({ draggables }: { draggables: Draggable[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: "droppable" });

  const style = {
    backgroundColor: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-white bg-[#333] h-30 w-full flex gap-4"
    >
      <SortableContext items={draggables.map((draggable) => draggable.id)}>
        {draggables
          .filter((draggable) => draggable.dz)
          .map((draggable) => (
            <Draggable key={draggable.id} draggable={draggable} />
          ))}
      </SortableContext>
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
