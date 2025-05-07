const storageAdapters = (function() {

    const localStorageAdapter = {
        save: function(key, data) {
            try {
                const jsonData = JSON.stringify(data);
                localStorage.setItem(key, jsonData);
                console.log(`Data saved to local storage with key "${key}".`);
                return true;
            } catch (e) {
                console.error(`Local storage save error for key "${key}":`, e);
                if (e.name === 'QuotaExceededError') {
                    alert('Local storage limit exceeded. Please clear some data.');
                }
                return false;
            }
        },
        load: function(key) {
            try {
                const jsonData = localStorage.getItem(key);
                if (jsonData) {
                    console.log(`Data loaded from local storage with key "${key}".`);
                    return JSON.parse(jsonData);
                } else {
                    console.log(`No data found in local storage for key "${key}".`);
                    return null;
                }
            } catch (e) {
                console.error(`Local storage load error for key "${key}":`, e);
                return null;
            }
        },
        update: function(key, data) {
             return this.save(key, data);
        },
        clear: function(key) {
             try {
                 localStorage.removeItem(key);
                 console.log(`Data removed from local storage with key "${key}".`);
                 return true;
             } catch (e) {
                 console.error(`Local storage clear error for key "${key}":`, e);
                 return false;
             }
        }
    };

    const sessionStorageAdapter = {
        save: function(key, data) {
            try {
                const jsonData = JSON.stringify(data);
                sessionStorage.setItem(key, jsonData);
                 console.log(`Data saved to session storage with key "${key}".`);
                 return true;
            } catch (e) {
                console.error(`Session storage save error for key "${key}":`, e);
                 if (e.name === 'QuotaExceededError') {
                    alert('Session storage limit exceeded. Please clear some data.');
                }
                return false;
            }
        },
        load: function(key) {
            try {
                const jsonData = sessionStorage.getItem(key);
                 if (jsonData) {
                    console.log(`Data loaded from session storage with key "${key}".`);
                    return JSON.parse(jsonData);
                } else {
                    console.log(`No data found in session storage for key "${key}".`);
                    return null;
                }
            } catch (e) {
                console.error(`Session storage load error for key "${key}":`, e);
                return null;
            }
        },
         update: function(key, data) {
             return this.save(key, data);
        },
         clear: function(key) {
             try {
                 sessionStorage.removeItem(key);
                 console.log(`Data removed from session storage with key "${key}".`);
                 return true;
             } catch (e) {
                 console.error(`Session storage clear error for key "${key}":`, e);
                 return false;
             }
        }
    };

    const remoteStorageAdapter = {
        save: async function(key, data, config) {
            if (!config.url) {
                 console.error("Remote adapter save: Remote URL is not configured.");
                 return false;
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
                    return false;
                }

                console.log("Data saved to remote storage.");
                return true;

            } catch (e) {
                console.error("Remote adapter save: Network or fetch error:", e);
                return false;
            }
        },
        load: async function(key, config) {
            if (!config.url) {
                 console.error("Remote adapter load: Remote URL is not configured.");
                 return null;
            }
            try {
                const response = await fetch(config.url, {
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
                    return null;
                }

                const jsonData = await response.text();
                 if (jsonData) {
                     console.log("Data loaded from remote storage.");
                     return JSON.parse(jsonData);
                 } else {
                     console.log("Remote storage returned empty response.");
                     return null;
                 }


            } catch (e) {
                console.error("Remote adapter load: Network or fetch error:", e);
                return null;
            }
        },
         update: async function(key, data, config) {
             return this.save(key, data, config);
         },
         clear: async function(key, config) {
             console.warn("Remote adapter clear: Remote storage clear not implemented.");
             return false;
         }
    };

    return {
        localStorageAdapter: localStorageAdapter,
        sessionStorageAdapter: sessionStorageAdapter,
        remoteStorageAdapter: remoteStorageAdapter
    };

})();
