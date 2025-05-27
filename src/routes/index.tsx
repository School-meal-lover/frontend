import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Hello, world!</h2>
    </div>
  );
}
