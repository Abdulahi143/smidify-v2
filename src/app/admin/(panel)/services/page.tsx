import type { Metadata } from "next";
import { ServiceEditor } from "@/components/admin";
import { getAdminServices } from "@/lib/queries/admin-content";
import { NewService } from "@/components/admin/NewService";

export const metadata: Metadata = { title: "Services" };

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function ServicesPage() {
  const services = await getAdminServices();
  return (
    <div className="studio-content-page">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">What you offer</p>
          <h1>Services</h1>
          <p className="studio-description">
            Manage the services on your public services page. Saving updates the
            live content.
          </p>
        </div>
      </header>
      <NewService
        nextSort={services.reduce(
          (max, service) => Math.max(max, service.sort + 1),
          0,
        )}
      />
      {services.length === 0 ? (
        <div className="studio-panel studio-empty">
          <h2>No services yet</h2>
          <p>Add your first service to start building your services page.</p>
        </div>
      ) : null}
      {services.map((s) => (
        <ServiceEditor key={s.id} service={s} />
      ))}
    </div>
  );
}
