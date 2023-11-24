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

router.get('/:id', (req, res) => {
    const id = req.params.id;
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readWorkExamples({_id:id})
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
    const data: {file?: string, occasions?: string} = {};

    console.log('This is the req body from the upload function');
    console.log(req.body);

    if(req.body.occasions && req.body.occasions !== '' ) data.occasions = req.body.occasions;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            if(req.body.file) {
                dbServices.addUpload(req.body.file.fileType, req.body.file.folder, req.body.file.file, req.body.file.tag)
                    .then(result => {
                        console.log('This is the result after writing to uploads');
                        console.log(result);
                        data.file = result._id.toString();
                    }).then(() => {
                        console.log(data);
                        dbServices.updateWorkExample(id, data)
                            .then((result) => {res.status(200).send(result);})
                            .catch(e => res.status(500).send('Internal server error: ' + e.message))
                            .finally(() => dbConnectors.disconnect());
                    });
            } else {
                console.log(data);
                dbServices.updateWorkExample(id, data)
                    .then((result) => {res.status(200).send(result);})
                    .catch(e => res.status(500).send('Internal server error: ' + e.message))
                    .finally(() => dbConnectors.disconnect());
            }
        });
});

router.delete('/:id', authenticate, (req, res) => {
    const id = req.params.id;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.deleteWorkExample(id)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

export default router;