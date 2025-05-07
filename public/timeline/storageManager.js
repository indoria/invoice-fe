const dataStorageManager = (function() {
    let _config = {
        storageType: 'local',
        key: 'appData',
        url: '',
        headers: {},
        method: 'POST',
        fetchOptions: {}
    };

    let _cache = null;
    let _isInitialized = false;
    const _adapters = {};

    function registerAdapter(type, adapter) {
        if (typeof type !== 'string' || typeof adapter !== 'object' || !adapter.save || !adapter.load || !adapter.update || !adapter.clear) {
            console.error("registerAdapter: Invalid type or adapter object. Adapter must implement save, load, update, and clear methods.");
            return;
        }
        _adapters[type] = adapter;
    }

    function init(config) {
        if (!config || typeof config !== 'object') {
            console.error("dataStorageManager.init: Configuration object is required.");
            return false;
        }

        const validStorageTypes = Object.keys(_adapters);
        if (!validStorageTypes.includes(config.storageType)) {
            console.error(`dataStorageManager.init: Invalid storageType "${config.storageType}". Registered types are: ${validStorageTypes.join(', ')}.`);
            return false;
        }

        if (config.storageType === 'remote' && !config.url) {
            console.error("dataStorageManager.init: 'url' is required for 'remote' storageType.");
            return false;
        }

        _config = { ..._config, ...config };
        _isInitialized = true;
        console.log(`Data storage manager initialized with type: ${_config.storageType}`);
        return true;
    }

    async function saveData(data) {
        if (!_isInitialized) {
            console.error("dataStorageManager.saveData: Manager not initialized. Call init() first.");
            return false;
        }

        _cache = data;

        const adapter = _adapters[_config.storageType];
        if (!adapter) {
             console.error(`dataStorageManager.saveData: No adapter registered for type "${_config.storageType}".`);
             return false;
        }

        try {
            return await adapter.save(_config.key, data, _config);
        } catch (e) {
            console.error(`dataStorageManager.saveData: Error saving data using "${_config.storageType}" adapter:`, e);
            return false;
        }
    }

    async function loadData() {
        if (!_isInitialized) {
            console.error("dataStorageManager.loadData: Manager not initialized. Call init() first.");
            return null;
        }

        if (_cache !== null) {
             console.log("dataStorageManager.loadData: Returning data from cache.");
             return _cache;
        }

        const adapter = _adapters[_config.storageType];
         if (!adapter) {
             console.error(`dataStorageManager.loadData: No adapter registered for type "${_config.storageType}".`);
             return null;
        }

        try {
            const data = await adapter.load(_config.key, _config);
            _cache = data;
            return data;
        } catch (e) {
            console.error(`dataStorageManager.loadData: Error loading data using "${_config.storageType}" adapter:`, e);
            _cache = null;
            return null;
        }
    }

    async function updateData(data) {
         if (!_isInitialized) {
             console.error("dataStorageManager.updateData: Manager not initialized. Call init() first.");
             return false;
         }

         _cache = data;

         const adapter = _adapters[_config.storageType];
          if (!adapter) {
             console.error(`dataStorageManager.updateData: No adapter registered for type "${_config.storageType}".`);
             return false;
         }

         try {
             return await adapter.update(_config.key, data, _config);
         } catch (e) {
             console.error(`dataStorageManager.updateData: Error updating data using "${_config.storageType}" adapter:`, e);
             return false;
         }
    }

    async function clearData() {
         if (!_isInitialized) {
             console.error("dataStorageManager.clearData: Manager not initialized. Call init() first.");
             return false;
         }

         _cache = null;

         const adapter = _adapters[_config.storageType];
          if (!adapter) {
             console.error(`dataStorageManager.clearData: No adapter registered for type "${_config.storageType}".`);
             return false;
         }

         try {
             return await adapter.clear(_config.key, _config);
         } catch (e) {
             console.error(`dataStorageManager.clearData: Error clearing data using "${_config.storageType}" adapter:`, e);
             return false;
         }
    }

    return {
        init: init,
        registerAdapter: registerAdapter,
        saveData: saveData,
        loadData: loadData,
        updateData: updateData,
        clearData: clearData
    };

})();
