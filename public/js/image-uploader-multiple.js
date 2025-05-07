(function() {
    'use strict';

    const MultiImageUploader = function(container) {
        const fileInput = container.querySelector('.ium-hidden-input');
        const uploadArea = container.querySelector('.ium-upload-area');
        const defaultImage = container.querySelector('.ium-default-image');
        const uploadIndicator = container.querySelector('.ium-upload-indicator');
        const previewGallery = container.querySelector('.ium-preview-gallery');

        let selectedFiles = [];

        if (!fileInput || !uploadArea || !previewGallery) {
            console.error('MultiImageUploader: Missing required elements in container', container);
            return;
        }

        if (!fileInput.id) {
            fileInput.id = 'ium-imageUploadInput-' + Math.random().toString(36).substr(2, 9);
        }
        uploadArea.setAttribute('for', fileInput.id);

        const updateUploadAreaState = function() {
            if (selectedFiles.length > 0) {
                uploadArea.classList.add('ium-has-preview');
            } else {
                uploadArea.classList.remove('ium-has-preview');
            }
        };

        const addImagePreview = function(file) {
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                 console.warn(`File already selected: ${file.name}`);
                 return;
            }

            const reader = new FileReader();
            const previewContainer = document.createElement('div');
            previewContainer.classList.add('ium-image-preview-container');
            previewContainer._file = file;


            const img = document.createElement('img');
            img.classList.add('ium-image-preview');
            img.alt = file.name;


            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('ium-remove-image-button');
            removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>';

            removeButton.addEventListener('click', function (e) {
                e.stopPropagation();
                const fileToRemove = previewContainer._file;
                selectedFiles = selectedFiles.filter(file => file !== fileToRemove);
                previewContainer.remove();
                updateUploadAreaState();
            });

            previewContainer.appendChild(img);
            previewContainer.appendChild(removeButton);
            previewGallery.appendChild(previewContainer);

            reader.onload = function (e) {
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);

            selectedFiles.push(file);

            updateUploadAreaState();
        };

        const processFiles = function(files) {
             for (let i = 0; i < files.length; i++) {
                 addImagePreview(files[i]);
             }
        };


        const preventDefaults = function(e) {
            e.preventDefault();
            e.stopPropagation();
        };

        const highlight = function() {
             uploadArea.style.borderColor = '#9ca3af';
             uploadArea.style.backgroundColor = '#f9fafb';
        };

        const unhighlight = function() {
             uploadArea.style.borderColor = '#d1d5db';
             uploadArea.style.backgroundColor = '';
        };

        const handleDrop = function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            processFiles(files);
        };

        fileInput.addEventListener('change', function (e) {
            const files = e.target.files;
            if (files.length > 0) {
               processFiles(files);
            }
            e.target.value = '';
        });


        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);

        this.getFiles = function() {
            return selectedFiles;
        };

        updateUploadAreaState();
    };

    const uploaderInstances = {};

    document.addEventListener('DOMContentLoaded', function() {
        const uploaderContainers = document.querySelectorAll('.ium-image-uploader-container');

        uploaderContainers.forEach(function(container, index) {
            const parent = container.parentElement;

            if (parent && parent.id) {
                const uploaderInstance = new MultiImageUploader(container);
                uploaderInstances[parent.id] = uploaderInstance;
                console.log(`MultiImageUploader: Instance stored for parent ID "${parent.id}"`);

                 if (!container.id) {
                      container.id = 'ium-uploader-input-container-' + index;
                 }


            } else {
                console.warn('MultiImageUploader: Container found, but its immediate parent is missing or lacks an ID. Cannot store instance by parent ID.', container);
                new MultiImageUploader(container);
            }
        });
    });

    window.getMultipleUploaderInstance = function(parentId) {
        return uploaderInstances[parentId];
    };

})();