(function() {
    'use strict';

    const ImageUploader = function(container) {
        const fileInput = container.querySelector('.ius-hidden-input');
        const uploadArea = container.querySelector('.ius-upload-area');
        const defaultImage = container.querySelector('.ius-default-image');
        const uploadIndicator = container.querySelector('.ius-upload-indicator');
        const imagePreviewContainer = container.querySelector('.ius-image-preview-container');
        const imagePreview = container.querySelector('.ius-image-preview');
        const removeImageButton = container.querySelector('.ius-remove-image-button');

        let currentFile = null;

        if (!fileInput) {
            console.error('ImageUploader: Missing required file input in container', container);
            return;
        }

        if (!fileInput.id) {
            fileInput.id = 'ius-imageUploadInput-' + Math.random().toString(36).substr(2, 9);
        }
        if (uploadArea) {
             uploadArea.setAttribute('for', fileInput.id);
        }


        const showDefaultState = function() {
            currentFile = null;

            if(imagePreviewContainer) imagePreviewContainer.style.display = 'none';
            if(imagePreview) imagePreview.src = '#';
            if(defaultImage) defaultImage.style.display = 'block';
            if(uploadIndicator) uploadIndicator.style.display = 'flex';
            if(uploadArea) uploadArea.classList.remove('ius-preview-active');
            if(fileInput) fileInput.value = '';
        };

        const showPreviewState = function(file, imageUrl) {
            currentFile = file;

            if(imagePreview) imagePreview.src = imageUrl;
            if(defaultImage) defaultImage.style.display = 'none';
            if(uploadIndicator) uploadIndicator.style.display = 'none';
            if(imagePreviewContainer) imagePreviewContainer.style.display = 'block';
            if(uploadArea) uploadArea.classList.add('ius-preview-active');
        };

        const preventDefaults = function(e) {
            e.preventDefault();
            e.stopPropagation();
        };

        const highlight = function() {
            if (uploadArea && !uploadArea.classList.contains('ius-preview-active')) {
                uploadArea.style.borderColor = '#9ca3af';
                uploadArea.style.backgroundColor = '#f9fafb';
            }
        };

        const unhighlight = function() {
            if (uploadArea && !uploadArea.classList.contains('ius-preview-active')) {
                uploadArea.style.borderColor = '#d1d5db';
                uploadArea.style.backgroundColor = '';
            }
        };

        const handleDrop = function(e) {
             if (uploadArea && uploadArea.classList.contains('ius-preview-active')) {
                preventDefaults(e);
                return;
            }
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0 && fileInput) {
                 const dataTransfer = new DataTransfer();
                 dataTransfer.items.add(files[0]);
                 fileInput.files = dataTransfer.files;

                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        };

        if (fileInput) {
            fileInput.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        showPreviewState(file, e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    showDefaultState();
                }
            });
        }

        if (removeImageButton) {
            removeImageButton.addEventListener('click', function (e) {
                e.stopPropagation();
                showDefaultState();
            });
        }

         if (uploadArea) {
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

             uploadArea.addEventListener('click', function(e) {
                  if (uploadArea.classList.contains('ius-preview-active') && removeImageButton && e.target !== removeImageButton && !removeImageButton.contains(e.target)) {
                      preventDefaults(e);
                  }
             });
         }

        this.getFile = function() {
            return currentFile;
        };

        showDefaultState();
    };

    const singleUploaderInstances = {};

    document.addEventListener('DOMContentLoaded', function() {
        const uploaderContainers = document.querySelectorAll('.ius-image-uploader-container');
        uploaderContainers.forEach(function(container, index) {
            const parent = container.parentElement;
            
            if (parent && parent.id) {
                const uploaderInstance = new ImageUploader(container);
                singleUploaderInstances[parent.id] = uploaderInstance;
                console.log(`ImageUploader: Instance stored for parent ID "${parent.id}"`);

                 if (!container.id) {
                      container.id = 'ius-uploader-container-' + index;
                 }
            } else {
                console.warn('MultiImageUploader: Container found, but its immediate parent is missing or lacks an ID. Cannot store instance by parent ID.', container);
                new MultiImageUploader(container);
            }
        });
    });

    window.getSingleImageUploaderInstance = function(containerId) {
        return singleUploaderInstances[containerId];
    };

})();