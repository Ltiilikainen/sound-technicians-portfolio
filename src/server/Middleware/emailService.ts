import dotenv from 'dotenv';
import Mailjet from 'node-mailjet';

dotenv.config();

const adminEmail = process.env.MJ_ADMIN_DELIVERY_ADDRESS;

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
    apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret'
});

async function sendFormDataEmail (formData: IFormData) {
    const request = mailjet
        .post('send', {version: 'v3.1'})
        .request({
            'Messages': [
                {
                    'From': {
                        'email': adminEmail,
                        'name': 'Portfolio Automated Notification'
                    },
                    'To':[ {
                        'email': adminEmail,
                        'name': 'Portfolio Admin'
                    },
                    ],
                    TemplateID:5311298,
                    TemplateLanguage: true,
                    Subject: 'Notification: New Inquiry Received',
                    Variables: {
                        name: formData.name,
                        company: formData.company,
                        email: formData.email,
                        phone: formData.phone,
                        purpose: formData.purpose,
                        startDate: formData.startDate?.toLocaleString(),
                        endDate: formData.endDate?.toLocaleString(),
                        body: formData.body
                    }
                },
            ],
        });

    request
        .then(result => {
            console.log(result.body);
        })
        .catch(err => {
            console.log(err.statusCode);
        });
}

export default {sendFormDataEmail};