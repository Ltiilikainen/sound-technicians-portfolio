import express from 'express';
import dbConnectors from '../Middleware/dbConnectors';
import dbServices from '../Middleware/dbServices';
import { authenticate } from '../Middleware/authorization';

const router = express.Router();

router.get('/', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readWorkExamples()
                .then((data: unknown) => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                        return;
                    }
                })
                .finally(() => dbConnectors.disconnect());
        });
});

router.post('/', authenticate, (req, res) => {
    const body = req.body;
    const occasions = req.body.occasions.toString();
    
    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.addUpload(body.fileType, body.folder, body.file, body.tag)
                .then(result => {
                    console.log(result);
                    const id_string = result._id.toString();
                    dbServices.addWorkExample(id_string, occasions)
                        .then(result => {
                            result.populate('file')
                                .then(result => res.status(201).send(result))
                                .finally(() => dbConnectors.disconnect());
                        })
                        .catch(e => {
                            res.status(500).send('Internal server error: ' + e.message);
                            dbConnectors.disconnect();
                        });
                })
                .catch(e => {
                    res.status(500).send('Internal server error: ' + e.message);
                    dbConnectors.disconnect();
                });
        });
});

router.put('/:id', authenticate, (req, res) => {
    const id = req.params.id;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readWorkExamples({_id: id})
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message));
        })
        .finally(() => dbConnectors.disconnect);
});

router.delete('/:id', authenticate, (req, res) => {
    const id = req.params.id;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readWorkExamples({_id: id})
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message));
        })
        .finally(() => dbConnectors.disconnect);
});

export default router;