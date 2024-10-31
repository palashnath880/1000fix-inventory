import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../components/shared/TopBar";
import JobEntryGraph from "../../components/home/JobEntryGraph";

export const Route = createFileRoute("/csc/")({
  component: () => (
    <>
      <Header title="Home" />

      <JobEntryGraph />
    </>
  ),
});
