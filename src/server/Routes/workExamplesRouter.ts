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
    const fileData: TFileData ={ 
        fileType: req.body.fileType,
        folder: req.body.folder,
        file: req.body.file,
        tag: req.body.tag
    };
    const occasions = req.body.occasions.toString();
    
    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            //this function includes the function to add the file information to its own collection
            dbServices.addWorkExample(fileData, occasions)
                .then(result => res.status(201).send(result))
                .catch(e => {
                    res.status(500).send('Internal server error: ' + e.message);
                })
                .finally(() =>dbConnectors.disconnect());
        });
});

router.put('/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const data: {file?: string, occasions?: string} = {};

    if(req.body.occasions && req.body.occasions !== '' ) data.occasions = req.body.occasions;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            if(req.body.file) {
                //this function includes the function to add the file information to its own collection
                //this function will also delete the outdated file from the server
                dbServices.updateWorkExample(id, data, req.body.file)
                    .then((result) => {res.status(200).send(result);})
                    .catch(e => res.status(500).send('Internal server error: ' + e.message))
                    .finally(() => dbConnectors.disconnect());
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
            //this function will also delete the associated file from the server
            dbServices.deleteWorkExample(id)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

export default router;