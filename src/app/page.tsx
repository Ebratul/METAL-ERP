import { redirect } from "next/navigation";

/** The app entry point is the command centre. */
export default function Home() {
  redirect("/dashboard");
}
