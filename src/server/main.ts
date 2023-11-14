import express from 'express';
import ViteExpress from 'vite-express';
import dbConnectors from './Middleware/dbConnectors';
import uploads from './Schemas/uploads';

const app = express();

app.get('/api/work-audio', (_, res) => {
    dbConnectors.connectReader();
    const workAudio = uploads.findAudio.where({$includes: {path: 'work-audio'}});
    res.send(workAudio);
});

ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
);
