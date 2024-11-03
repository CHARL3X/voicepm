import wixWindow from 'wix-window';

$w.onReady(function () {
    // Make sure the page is using a full-width layout
    wixWindow.getBoundingRect()
        .then(rect => {
            // Initialize our component with production backend URL
            const voxifyElement = document.createElement('voxify-component');
            
            // Set the backend URL based on environment
            const isDevelopment = window.location.hostname === 'localhost' || 
                                window.location.hostname === '127.0.0.1';
            const backendUrl = isDevelopment ? 
                'http://localhost:8000' : 
                'https://voicepm-backend.onrender.com';
            
            // Set the backend URL as an attribute
            voxifyElement.setAttribute('backend-url', backendUrl);
            
            // Add it to the page
            document.querySelector('#PAGES_CONTAINER').appendChild(voxifyElement);
            
            // Style the container for full width
            document.querySelector('#PAGES_CONTAINER').style.maxWidth = '100%';
            document.querySelector('#PAGES_CONTAINER').style.padding = '0';
            document.querySelector('#SITE_PAGES').style.maxWidth = '100%';
        });
});
