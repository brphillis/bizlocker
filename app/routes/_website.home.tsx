import { type V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export default function Home() {
  return <div className="h-[800px]">content</div>;
}
