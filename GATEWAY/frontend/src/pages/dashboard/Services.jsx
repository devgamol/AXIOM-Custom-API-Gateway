// src/pages/dashboard/Services.jsx
import React, { useEffect, useState } from "react";
import { useServices } from "../../hooks/useServices";
import { formatLatency } from "../../utils/formatters";

export default function Services() {
  // Use the central hook (single source of truth)
  const {
    services,
    isLoadingServices,
    servicesError,
    refetchServices,
    createService,
    deleteService,
    isCreating,
    isDeleting
  } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: "",
    name: "",
    baseUrl: "",
    healthPath: "/",
    description: "",
  });

  // Debug: show what the hook returns (this will instantly tell us if hook is empty/structured differently)
  useEffect(() => {
    console.log("[Services Page] services length:", Array.isArray(services) ? services.length : "(not array)", services);
    console.log("[Services Page] isLoadingServices:", isLoadingServices, "error:", servicesError);
  }, [services, isLoadingServices, servicesError]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // createService is mutate from your hook: mutate(variables, options)
      createService(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ apiKey: "", name: "", baseUrl: "", healthPath: "/", description: "" });
          // ensure we ask the hook to re-fetch (safe even if hook already invalidates)
          if (typeof refetchServices === "function") {
            refetchServices();
          }
        },
        onError: (err) => {
          console.error("createService failed:", err);
          alert("Failed to create service: " + (err?.message || "unknown"));
        }
      });
    } catch (err) {
      console.error("createService threw:", err);
    }
  };

  const handleDelete = (id) => {
    try {
      deleteService(id, {
        onSuccess: () => {
          if (typeof refetchServices === "function") refetchServices();
        },
        onError: (err) => {
          console.error("deleteService failed:", err);
          alert("Failed to delete service");
        }
      });
    } catch (err) {
      console.error("deleteService threw:", err);
    }
  };

  if (isLoadingServices) return <div className="p-6 text-white">Loading services...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Backend Services ({(services || []).length})</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          + Add Service
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
        <table className="w-full text-left text-gray-300 min-w-[800px]">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 w-1/5">Name</th>
              <th className="px-6 py-3 w-1/4">Base URL</th>
              <th className="px-6 py-3 w-24">Status</th>
              <th className="px-6 py-3 w-24">Latency</th>
              <th className="px-6 py-3 w-1/6">Last Checked</th>
              <th className="px-6 py-3 w-24">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {(services || []).map((service) => (
              <tr key={service._id || service.id || service.uuid}>
                <td className="px-6 py-4 text-white">{service.name}</td>
                <td className="px-6 py-4 text-blue-400" title={service.baseUrl}>{service.baseUrl}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                      service.status === "UP" ? "bg-green-900 text-green-300"
                      : service.status === "DOWN" ? "bg-red-900 text-red-300"
                      : "bg-gray-700 text-gray-400"}`}>
                    {service.status || "UNKNOWN"}
                  </span>
                </td>
                <td className="px-6 py-4">{formatLatency(service.latency)}</td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {service.lastChecked ? new Date(service.lastChecked).toLocaleString() : "Never"}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(service._id || service.id)} className="text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!services || services.length === 0) && (
              <tr><td colSpan={6} className="px-6 py-8 text-gray-400">No services found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-white mb-4">Add Service</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input placeholder="API Key" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.apiKey}
                onChange={e => setFormData({ ...formData, apiKey: e.target.value })} required />
              <input placeholder="Service Name" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <input placeholder="Base URL" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.baseUrl}
                onChange={e => setFormData({ ...formData, baseUrl: e.target.value })} required />
              <input placeholder="Health Path" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.healthPath}
                onChange={e => setFormData({ ...formData, healthPath: e.target.value })} />
              <textarea placeholder="Description" className="w-full bg-gray-700 text-white p-2 rounded" value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-300">Cancel</button>
                <button type="submit" disabled={isCreating} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
