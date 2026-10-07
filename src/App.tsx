import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";

type Draggable = {
  id: string;
  src: string;
  dz?: string;
};

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "brave.png", dz: undefined },
  { id: crypto.randomUUID(), src: "chrome.png", dz: undefined },
  { id: crypto.randomUUID(), src: "edge.png", dz: undefined },
  { id: crypto.randomUUID(), src: "explorer.png", dz: undefined },
  { id: crypto.randomUUID(), src: "firefox.png", dz: undefined },
  { id: crypto.randomUUID(), src: "opera.png", dz: undefined },
  { id: crypto.randomUUID(), src: "safari.png", dz: undefined },
  { id: crypto.randomUUID(), src: "tor.png", dz: undefined },
  { id: crypto.randomUUID(), src: "uc.png", dz: undefined },
  { id: crypto.randomUUID(), src: "vivaldi.png", dz: undefined },
  { id: crypto.randomUUID(), src: "yandex.png", dz: undefined },
];

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);

  const handleDragEnd = (e: DragEndEvent) => {
    console.log(e);
    if (!e.over) return;
    const DroppableId = e.over.id as string;
    const activeDraggableId = e.active.id as string;
    setDraggables((prev) =>
      prev.map((draggable) =>
        draggable.id !== activeDraggableId
          ? draggable
          : { ...draggable, dz: DroppableId },
      ),
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-16 justify-center items-center">
      <DndContext onDragEnd={handleDragEnd}>
        <Droppable draggables={draggables} />
        <div className="flex gap-2">
          {draggables
            .filter((draggable) => !draggable.dz)
            .map((draggable) => (
              <Draggable key={draggable.id} draggable={draggable} />
            ))}
        </div>
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
      {draggables
        .filter((draggable) => draggable.dz)
        .map((draggable) => (
          <Draggable key={draggable.id} draggable={draggable} />
        ))}
    </div>
  );
}

function Draggable({ draggable }: { draggable: Draggable }) {
  const { id, src } = draggable;
  const { setNodeRef, listeners, attributes, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <button
      className="cursor-pointer"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <img
        src={`/src/assets/${src}`}
        className="max-h-30 aspect-square object-cover"
      />
    </button>
  );
}
