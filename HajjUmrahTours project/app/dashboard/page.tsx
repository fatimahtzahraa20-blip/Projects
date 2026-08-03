import type { Metadata } from "next";import { ClientDashboard } from "@/components/client-dashboard";
export const metadata:Metadata={title:"Client Dashboard",robots:{index:false,follow:false}};
export default function Dashboard(){return <section className="min-h-screen bg-[#f5f3ed] pb-20 pt-32"><div className="container-pad"><ClientDashboard/></div></section>}
