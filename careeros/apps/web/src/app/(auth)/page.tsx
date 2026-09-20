import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Auth - AuraCareer AI",
};

export default function AuthRootPage() {
  redirect("/login");
}
