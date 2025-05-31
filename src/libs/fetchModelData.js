const fetchModel = async (url, method, body) => {
  try {
    const response = await fetch(`https://9cyzc7-8080.csb.app/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(body),
      withCredentials: true,
      credentials: "include",
    });
    //console.log(`response in fetch model: ${response}`)

    // if (!response.ok) {
    //     //throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    //     return response;
    // }

    //return await response.json();
    return response;
  } catch (error) {
    console.error(`Error fetching model from ${url}:`, error.message);
    throw error;
  }
};

export default fetchModel;
