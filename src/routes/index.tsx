import { createFileRoute } from "@tanstack/react-router";
import { FrameworkApp } from "@/components/framework-app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <FrameworkApp />;
}
