import JobEntryGraph from "../../components/home/JobEntryGraph";
import { Header } from "../../components/shared/TopBar";

export default function Home() {
  return (
    <div>
      <Header title="Home" />

      <JobEntryGraph />
    </div>
  );
}
