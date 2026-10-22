import type { Metadata } from "next";
import { ServiceEditor } from "@/components/admin";
import { getAdminServices } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getAdminServices();
  return (
    <div className="flex flex-col gap-[40px]">
      <h1 className="text-[44px] leading-[52px]">Services</h1>
      {services.map((s) => (
        <ServiceEditor key={s.id} service={s} />
      ))}
    </div>
  );
}
