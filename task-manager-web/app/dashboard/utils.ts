export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  // initial request
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // if the token is expired (401 or 403)...
  if (res.status === 401 || res.status === 403) {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("Session expired. Please log in again.");
    }

    // Ask the backend for a new Access Token
    const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!refreshRes.ok) {
      throw new Error("Session expired. Please log in again.");
    }

    // Save the new token and retry the ORIGINAL request!
    const data = await refreshRes.json();
    localStorage.setItem("accessToken", data.accessToken);

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
    });
  }

  return res;
};
