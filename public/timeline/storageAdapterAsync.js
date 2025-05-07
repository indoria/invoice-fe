const storageAdaptersAsync = (function() {

    const localStorageAdapter = {
        save: function(key, data) {
            return new Promise((resolve, reject) => {
                try {
                    const jsonData = JSON.stringify(data);
                    localStorage.setItem(key, jsonData);
                    console.log(`Data saved to local storage with key "${key}".`);
                    resolve(true);
                } catch (e) {
                    console.error(`Local storage save error for key "${key}":`, e);
                    if (e.name === 'QuotaExceededError') {
                        alert('Local storage limit exceeded. Please clear some data.');
                    }
                    reject(e);
                }
            });
        },
        load: function(key) {
             return new Promise((resolve, reject) => {
                try {
                    const jsonData = localStorage.getItem(key);
                    if (jsonData) {
                        console.log(`Data loaded from local storage with key "${key}".`);
                        resolve(JSON.parse(jsonData));
                    } else {
                        console.log(`No data found in local storage for key "${key}".`);
                        resolve(null);
                    }
                } catch (e) {
                    console.error(`Local storage load error for key "${key}":`, e);
                    reject(e);
                }
             });
        },
        update: function(key, data) {
             return this.save(key, data);
        },
        clear: function(key) {
             return new Promise((resolve, reject) => {
                 try {
                     localStorage.removeItem(key);
                     console.log(`Data removed from local storage with key "${key}".`);
                     resolve(true);
                 } catch (e) {
                     console.error(`Local storage clear error for key "${key}":`, e);
                     reject(e);
                 }
             });
        }
    };

    const sessionStorageAdapter = {
        save: function(key, data) {
            return new Promise((resolve, reject) => {
                 try {
                    const jsonData = JSON.stringify(data);
                    sessionStorage.setItem(key, jsonData);
                     console.log(`Data saved to session storage with key "${key}".`);
                     resolve(true);
                } catch (e) {
                    console.error(`Session storage save error for key "${key}":`, e);
                     if (e.name === 'QuotaExceededError') {
                        alert('Session storage limit exceeded. Please clear some data.');
                    }
                    reject(e);
                }
            });
        },
        load: function(key) {
            return new Promise((resolve, reject) => {
                try {
                    const jsonData = sessionStorage.getItem(key);
                     if (jsonData) {
                        console.log(`Data loaded from session storage with key "${key}".`);
                        resolve(JSON.parse(jsonData));
                    } else {
                        console.log(`No data found in session storage for key "${key}".`);
                        resolve(null);
                    }
                } catch (e) {
                    console.error(`Session storage load error for key "${key}":`, e);
                    reject(e);
                }
            });
        },
         update: function(key, data) {
             return this.save(key, data);
        },
         clear: function(key) {
             return new Promise((resolve, reject) => {
                 try {
                     sessionStorage.removeItem(key);
                     console.log(`Data removed from session storage with key "${key}".`);
                     resolve(true);
                 } catch (e) {
                     console.error(`Session storage clear error for key "${key}":`, e);
                     reject(e);
                 }
             });
        }
    };

    const remoteStorageAdapter = {
        save: async function(key, data, config) {
            if (!config || !config.url) {
                 console.error("Remote adapter save: Remote URL is not configured.");
                 return false; // Or throw an error
            }
            try {
                const jsonData = JSON.stringify(data);
                const response = await fetch(config.url, {
                    method: config.method || 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...config.headers
                    },
                    body: jsonData,
                    ...config.fetchOptions
                });

                if (!response.ok) {
                    console.error(`Remote adapter save: HTTP error! status: ${response.status}`);
                    return false; // Or throw an error
                }

                console.log("Data saved to remote storage.");
                return true;

            } catch (e) {
                console.error("Remote adapter save: Network or fetch error:", e);
                return false; // Or throw an error
            }
        },
        load: async function(key, config) {
            if (!config || !config.url) {
                 console.error("Remote adapter load: Remote URL is not configured.");
                 return null; // Or throw an error
            }
            // Construct the URL potentially including the key if needed for GET
            // This depends on how the remote API is structured. Assuming the URL
            // provided in config might need the key appended or included as a parameter.
            // For simplicity, let's assume the config.url is the full endpoint for now.
            // If keys are used in the URL, you'd modify config.url here:
            // const fetchUrl = `${config.url}/${encodeURIComponent(key)}`; or `${config.url}?key=${encodeURIComponent(key)}`;
             const fetchUrl = config.url; // Using the provided config.url directly

            try {
                const response = await fetch(fetchUrl, {
                    method: 'GET',
                     headers: config.headers,
                     ...config.fetchOptions
                });

                if (!response.ok) {
                     if (response.status === 404) {
                         console.log("Remote adapter load: Remote data not found (404).");
                         return null;
                     }
                    console.error(`Remote adapter load: HTTP error! status: ${response.status}`);
                    return null; // Or throw an error
                }

                const textData = await response.text(); // Fetch as text first
                 if (textData) {
                     try {
                          const jsonData = JSON.parse(textData); // Parse manually
                           console.log("Data loaded from remote storage.");
                           return jsonData;
                     } catch (parseError) {
                         console.error("Remote adapter load: Failed to parse JSON response:", parseError);
                         return null; // Or throw parseError
                     }
                 } else {
                     console.log("Remote storage returned empty response.");
                     return null;
                 }


            } catch (e) {
                console.error("Remote adapter load: Network or fetch error:", e);
                return null; // Or throw an error
            }
        },
         update: async function(key, data, config) {
             return this.save(key, data, config);
         },
         clear: async function(key, config) {
             // Remote adapter clear functionality is often specific.
             // This is a placeholder. You might implement a DELETE request
             // or a specific clear endpoint call based on your remote API.
             console.warn(`Remote adapter clear: Clear operation for key "${key}" not fully implemented.`);
             // Example: You might need to send a DELETE request
             /*
             if (!config || !config.url) {
                  console.error("Remote adapter clear: Remote URL is not configured.");
                  return false;
             }
             try {
                 const deleteUrl = `${config.url}/${encodeURIComponent(key)}`; // Example URL structure
                 const response = await fetch(deleteUrl, {
                     method: 'DELETE',
                     headers: config.headers,
                     ...config.fetchOptions
                 });
                 if (!response.ok) {
                      console.error(`Remote adapter clear: HTTP error! status: ${response.status}`);
                     return false;
                 }
                 console.log(`Data cleared from remote storage with key "${key}".`);
                 return true;
             } catch (e) {
                 console.error("Remote adapter clear: Network or fetch error:", e);
                 return false;
             }
             */
             return false; // Default to false if not implemented
         }
    };

    return {
        localStorageAdapter: localStorageAdapter,
        sessionStorageAdapter: sessionStorageAdapter,
        remoteStorageAdapter: remoteStorageAdapter
    };

})();