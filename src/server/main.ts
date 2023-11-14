import express from 'express';
import ViteExpress from 'vite-express';
import dbConnectors from './Middleware/dbConnectors';
import uploads from './Schemas/uploads';

const app = express();

app.get('/api/work-audio', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => console.log(e))
        .then(() => {
            uploads.find().selectAudio().where({path:  {'$regex': 'work-audio', '$options': 'i'}})
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

ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
);
