# Integrating VoicePM with Wix

This guide explains how to integrate VoicePM into your Wix website charlestobin.com.

## Step 1: Deploy the Backend

First, you'll need to host the backend on a cloud platform. Here are some options:

### Option A: Deploy on Render.com (Recommended)

1. Sign up for a free account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     ```
     OPENAI_API_KEY=your_key_here
     ANTHROPIC_API_KEY=your_key_here
     CORS_ORIGINS=["https://www.charlestobin.com"]
     ```

### Option B: Deploy on Heroku

1. Install Heroku CLI
2. Create a new Heroku app:
   ```bash
   heroku create voicepm-backend
   ```
3. Set environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set ANTHROPIC_API_KEY=your_key_here
   heroku config:set CORS_ORIGINS='["https://www.charlestobin.com"]'
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

## Step 2: Create a Hidden Page on Wix

1. Log in to your Wix dashboard
2. Go to Site Pages
3. Click "+ Add Page"
4. Choose "Blank Page"
5. Name it (e.g., "VoicePM")
6. In page settings, set "Hide page from menu" to ON
7. Note down the page URL (e.g., https://www.charlestobin.com/voicepm)

## Step 3: Add Custom HTML iFrame

1. In the Wix Editor, add an HTML iFrame element to your hidden page
2. Click "Enter Code"
3. Host the `voicepm-embed.html` file:
   - Option 1: Upload to your Wix site's static files
   - Option 2: Host on GitHub Pages
   - Option 3: Host on Netlify
4. Update the API_URL in voicepm-embed.html to point to your hosted backend
5. Paste this code in the iFrame:
   ```html
   <iframe 
     id="voicepm-frame"
     src="YOUR_HOSTED_EMBED_URL"
     style="width: 100%; border: none;"
     scrolling="no"
     onload="adjustIframeHeight(this)"
   ></iframe>
   ```

## Step 4: Add Required JavaScript

Add this code to your page's settings → "Custom Code" → "Page Header":

```javascript
<script>
window.addEventListener('message', function(event) {
    // Verify origin for security
    if (event.origin !== 'YOUR_EMBED_ORIGIN') return;
    
    if (event.data.type === 'setHeight') {
        const iframe = document.getElementById('voicepm-frame');
        if (iframe) {
            iframe.style.height = event.data.height + 'px';
        }
    }
});

function adjustIframeHeight(iframe) {
    iframe.style.height = '800px'; // Initial height
}
</script>
```

## Step 5: Style Integration

1. In the Wix Editor, adjust the iFrame container's width and padding
2. The embed will automatically inherit your site's background color
3. You can customize the VoicePM theme by modifying CSS variables in voicepm-embed.html

## Step 6: Link to the Hidden Page

You can link to your VoicePM page from anywhere on your site:

1. Create a button or menu item
2. Set its link to your hidden page URL
3. Optional: Add access restrictions using Wix's Member Permissions

## Security Considerations

1. Update CORS_ORIGINS in your backend to only allow requests from charlestobin.com
2. Consider adding Wix authentication to protect the page
3. Monitor API usage to stay within limits
4. Regularly rotate API keys

## Troubleshooting

1. If the iframe doesn't resize properly:
   - Check browser console for errors
   - Verify message event origins
   - Try setting a fixed height

2. If uploads fail:
   - Verify backend URL is correct
   - Check CORS settings
   - Verify API keys are valid

3. If styling looks wrong:
   - Check iframe container width
   - Verify CSS is loading
   - Test in different browsers

## Support

For any issues:
1. Check browser console for errors
2. Verify all API keys are valid
3. Ensure backend is running
4. Check CORS settings match your domain

## Updates

When updating VoicePM:
1. Deploy new backend version
2. Update the embed HTML file
3. Clear browser cache
4. Test thoroughly in Wix preview mode
