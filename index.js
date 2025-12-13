const express = require('express');
const axios = require('axios');
const path = require('path');

// Environment variables
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

console.log('Starting application...');
console.log('Webhook URL configured:', !!WEBHOOK_URL);

const app = express();

// Function to send data to webhook
async function sendToWebhook(data) {
    if (!WEBHOOK_URL) {
        console.log('No webhook URL configured, skipping webhook');
        return;
    }
    
    try {
        await axios.post(WEBHOOK_URL, {
            content: `**SOURCE CODE ACCESS ATTEMPT DETECTED**`,
            embeds: [{
                title: 'Resource Access Alert',
                fields: [
                    {
                        name: 'IP Address',
                        value: `\`${data.ip}\``,
                        inline: true
                    },
                    {
                        name: 'User Agent',
                        value: `\`${data.userAgent}\``,
                        inline: true
                    },
                    {
                        name: 'Timestamp',
                        value: `\`${data.timestamp}\``,
                        inline: true
                    },
                    {
                        name: 'Requested Resource',
                        value: `\`${data.resource}\``,
                        inline: false
                    }
                ],
                color: 0xff0000,
                timestamp: new Date().toISOString()
            }]
        });
        console.log('Webhook sent successfully');
    } catch (error) {
        console.error('Error sending webhook:', error.message);
    }
}

// Middleware to log sensitive resource access
const resourceLogger = (req, res, next) => {
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    const timestamp = new Date().toISOString();
    
    // Define sensitive resources
    const sensitiveResources = ['.js', '.css'];
    
    const isSensitive = sensitiveResources.some(resource => 
        req.path.includes(resource)
    );
    
    if (isSensitive) {
        const logData = {
            ip: ipAddress,
            userAgent: userAgent,
            timestamp: timestamp,
            resource: req.path
        };
        
        console.log(`SENSITIVE ACCESS: ${req.path} | IP: ${ipAddress}`);
        sendToWebhook(logData);
    }
    
    next();
};

// Apply middleware
app.use(resourceLogger);

// Serve static files
app.use(express.static('public'));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```__
