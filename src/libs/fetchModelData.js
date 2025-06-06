const fetchModel = async (url, method, body) => {
  try {
    const response = await fetch(`https://m47ys6-8080.csb.app/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(body),
      withCredentials: true,
      credentials: "include",
    });

    return response;
  } catch (error) {
    console.error(`Error fetching model from ${url}:`, error.message);
    throw error;
  }
};

export default fetchModel;
