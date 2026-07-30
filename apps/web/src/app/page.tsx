import { redirect } from "next/navigation";

const RootPage = (): never => {
  redirect("/login");
};

export default RootPage;
