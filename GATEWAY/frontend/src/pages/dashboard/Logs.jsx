import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";
import { useApiLogs } from "../../hooks/useApiData";
import { formatStatus, formatLatency, formatDate } from "../../utils/formatters";
import ApiSelector from "../../components/dashboard/ApiSelector";

/** ---------------------------------------------
 * Resolve URL from many possible backend fields
 * --------------------------------------------- */
function resolveLogUrl(log) {
  if (!log) return "N/A";

  const candidates = [
    log.url,
    log.originalUrl,
    log.fullUrl,
    log.path,
    log.route,
    log.endpoint,
    log.request?.url,
    log.request?.originalUrl,
    log.req?.url,
    log.req?.originalUrl,
  ];

  let value = candidates.find((v) => v && typeof v !== "object");

  if (!value) {
    // fallback stringify object
    try {
      return JSON.stringify(log.url || log.path || log.route || "").slice(0, 100);
    } catch {
      return "N/A";
    }
  }

  return String(value);
}

/** Render URL cell nicely */
function UrlCell({ url }) {
  if (!url || url === "N/A")
    return <span className="text-gray-400">N/A</span>;

  const display = url.length > 80 ? url.slice(0, 77) + "..." : url;
  const isAbsolute = /^https?:\/\//i.test(url);

  return (
    <a
      href={isAbsolute ? url : "#"}
      target={isAbsolute ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="text-blue-400 hover:underline block truncate"
      title={url}
    >
      {display}
    </a>
  );
}

const LogsPage = () => {
  const { selectedApi } = useApi();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { logs, pagination, isLoading } = useApiLogs(selectedApi?.key, {
    page,
    limit: 50,
    status: statusFilter,
  });

  if (!selectedApi) {
    return (
      <div className="p-4 text-gray-300">
        Please select an API
      </div>
    );
  }

  const methodColors = {
    GET: "bg-sky-600",
    POST: "bg-emerald-600",
    PUT: "bg-amber-600",
    DELETE: "bg-red-600",
    PATCH: "bg-violet-600",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">API Logs</h2>
          <p className="text-sm text-gray-400">
            Recent request logs for the selected API
          </p>
        </div>

        <div className="w-80">
          <ApiSelector />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-gray-300">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm"
          >
            <option value="">All</option>
            <option value="200">200 OK</option>
            <option value="400">400</option>
            <option value="401">401</option>
            <option value="404">404</option>
            <option value="500">500</option>
          </select>
        </div>

        <div className="text-sm text-gray-400">
          {isLoading ? "Loading…" : `${logs?.length || 0} logs`}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-sm overflow-hidden">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "45%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>

          <thead className="bg-gray-800/60">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-300 uppercase">
                Method
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-300 uppercase">
                URL
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-300 uppercase">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-300 uppercase">
                Latency
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-300 uppercase">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                  Loading logs…
                </td>
              </tr>
            )}

            {!isLoading && logs?.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                  No logs found.
                </td>
              </tr>
            )}

            {!isLoading &&
              logs?.map((log) => {
                const method = (log.method || "GET").toUpperCase();
                const statusObj = formatStatus(log.statusCode);
                const urlValue = resolveLogUrl(log);

                return (
                  <tr
                    key={log._id}
                    className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                  >
                    {/* Method */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                          methodColors[method] || "bg-gray-600"
                        }`}
                      >
                        {method}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="px-4 py-4">
                      <UrlCell url={urlValue} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        style={{ color: statusObj.color }}
                        className="text-sm"
                      >
                        {statusObj.label}
                      </span>
                    </td>

                    {/* Latency */}
                    <td className="px-4 py-4 text-gray-300">
                      {formatLatency(log.latency)}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-gray-400">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-400 text-sm">
            Page {page} of {pagination.pages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.pages}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
