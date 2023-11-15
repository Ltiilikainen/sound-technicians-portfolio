import express from 'express';
import ViteExpress from 'vite-express';
import emailService from './Middleware/emailService';
import dbConnectors from './Middleware/dbConnectors';
import work_examples from './Schemas/work_examples';

const app = express();
app.use(express.json());

app.get('/api/work-audio', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => console.log(e))
        .then(() => {
            work_examples.find()
                .populate('file')
                .catch(e => console.log(e.message))
                .then(workAudio => 
                {
                    try{
                        res.send(workAudio);
                        
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                    }
                }
                )
                .finally(() => {
                    dbConnectors.disconnect();
                });
        });
});

app.post('/api/contact', async (req, res) => {
    const formData = req.body.formData;

    try{
        await emailService.sendFormDataEmail(formData);
    } catch (e: unknown) {
        console.log((e as Error).message);
        res.send('Something went wrong');
    }
    
});

ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
);
