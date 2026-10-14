# Tier List Maker

A clean, fully functional tier list application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **dnd-kit**.

Users can drag items into tier rows, reorder them within a tier, move them between tiers, and drop them into empty rows—with smooth drag-and-drop interactions.

## Features

- Drag and drop items using [dnd-kit](https://docs.dndkit.com/)
- Sort items within the same tier
- Move items between different tier rows
- Drop items into empty tiers
- Visual feedback while hovering over a drop zone
- Smooth drag animations using `DragOverlay`
- Responsive, modern UI styled with Tailwind CSS
- Type-safe data models with TypeScript

## Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| React            | UI library                        |
| TypeScript       | Static typing                     |
| Vite             | Development server and build tool |
| Tailwind CSS     | Utility-first styling             |
| dnd-kit          | Drag-and-drop functionality       |
| dnd-kit/sortable | Sorting and reordering items      |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/CTHartze/tierlistmaker.git
cd tierlistmaker
npm install
```

### Run the Development Server

```bash
npm run dev
```

Then open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Project Structure

```text
src/
├── assets/          # Item images
├── components/      # Reusable UI and drag-and-drop components
├── types/           # TypeScript types
├── App.tsx          # Main application layout and drag logic
├── main.tsx         # React entry point
└── index.css        # Global styles and Tailwind imports
```

## How It Works

The app uses two core dnd-kit concepts:

- **Draggables**: Individual tier-list items that users can pick up and move.
- **Droppables**: Tier rows that accept dragged items.

The `DndContext` manages drag events such as:

- `onDragStart`
- `onDragOver`
- `onDragEnd`

When an item is dropped, the application updates React state to assign the item to the correct tier. The `SortableContext` enables items to be reordered within a tier.

## Tier Colors

The application uses a conventional tier-list color scheme:

| Tier | Color  | Meaning       |
| ---- | ------ | ------------- |
| S    | Red    | Best          |
| A    | Orange | Excellent     |
| B    | Yellow | Good          |
| C    | Green  | Average       |
| D    | Blue   | Below average |

## Customization

### Add New Items

Add new entries to the default items array, including a unique `id` and image source:

```ts
const defaultItems: TierItem[] = [
  {
    id: "item-1",
    src: "/assets/item-1.png",
    tier: undefined,
  },
];
```

### Change Tier Labels

Update the tier configuration to add, remove, or rename tiers.

### Change Colors

Update the tier color map:

```ts
export const tierColorMap: Record<Tier, string> = {
  S: "#FF5C5C",
  A: "#FFA24C",
  B: "#FFD84D",
  C: "#9BDB5A",
  D: "#57C7E8",
};
```

## Useful Resources

- [dnd-kit documentation](https://docs.dndkit.com/)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vitejs.dev/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
