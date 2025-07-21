import { createFileRoute, redirect } from "@tanstack/react-router";
import dayjs from "dayjs";

export const Route = createFileRoute("/")({
  loader: () => {
    const today = dayjs();
    throw redirect({
      to: "/menu/$date",
      params: {date: today.format("YYYY-MM-DD")},
    });
  },
});