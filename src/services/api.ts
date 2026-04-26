const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  get: (path: string, options?: { params?: Record<string, any> }) => {
    const url = new URL(`${API_URL}${path}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return fetch(url.toString()).then((res) => res.json());
  },

  post: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  patch: (path: string, body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  delete: (path: string) =>
    fetch(`${API_URL}${path}`, {
      method: "DELETE",
    }).then((res) => res.json()),
};
