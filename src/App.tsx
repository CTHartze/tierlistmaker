import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

type Draggable = {
  id: string;
  src: string;
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

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex gap-2">
        {draggables.map((draggable) => (
          <Draggable key={draggable.id} draggable={draggable} />
        ))}
      </div>
    </div>
  );
}

function Draggable({ draggable }: { draggable: Draggable }) {
  const { id, src } = draggable;
  const { setNodeRef, listeners, attributes } = useDraggable({ id });
  return (
    <button
      className="cursor-pointer"
      ref={setNodeRef}
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
