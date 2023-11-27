import express from 'express';
import dbConnectors from '../Middleware/dbConnectors';
import dbServices from '../Middleware/dbServices';
import { authenticate } from '../Middleware/authorization';

const router = express.Router();

router.get('/', (_, res) => {
    const queryData: Array<IReference[] | IFile>= [];
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readRefs()
                .then(data => {
                    try {
                        queryData.push((data as IReference[]));
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                        return;
                    }
                }) .then(() => {
                    dbServices.readUploads({tag: 'worked-with'})
                        .then((data: unknown) => {
                            try {
                                queryData.push((data as IFile[])[0]);
                                res.send(queryData);
                            } catch (e: unknown) {
                                console.log((e as Error).message);
                                res.status(500).send('Internal server error');
                                return;
                            }
                        })
                        .finally(() => dbConnectors.disconnect());
                });
           
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
            dbServices.readRefs({_id:id})
                .then(data => {
                    res.send(data);
                })
                .catch(e => {
                    console.log(e.message);
                    res.status(500).send('Internal server error');
                    return;
                })
                .finally(() => dbConnectors.disconnect());
        });
});


router.post('/', authenticate, (req, res) => {
    console.log(req.body);
    const data: TReferenceData = {
        name: req.body.refData.name, 
        affiliation: req.body.refData.affiliation, 
        content: req.body.refData.content
    };
    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            if(req.body.image) {
                //this function includes the function to add the file information to its own collection
                dbServices.addRef(data, req.body.image)
                    .then((result) => {
                        res.status(201).send(result);
                    })
                    .catch(e => res.status(500).send('Internal server error: ' + e.message))
                    .finally(() => dbConnectors.disconnect());
            } else {
                dbServices.addRef(data)
                    .then((result) => {
                        res.status(201).send(result);
                    })
                    .catch(e => res.status(500).send('Internal server error: ' + e.message))
                    .finally(() => dbConnectors.disconnect());
            }
        });

});

router.put('/:id', authenticate, (req, res) => {
    const id = req.params.id;

    const data:{
        name?: string, 
        affiliation?: string, 
        content?: string, 
        image?: string} = {};

    if(req.body.name) data.name = req.body.name;
    if(req.body.affiliation) data.affiliation = req.body.affiliation;
    if(req.body.content) data.content = req.body.content;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            if(req.body.image) {
                //this function includes the function to add the file information to its own collection
                //this function will also delete the outdated file from the server
                dbServices.updateRef(id, data, req.body.image)
                    .then((result) => {
                        res.status(201).send(result);
                    })
                    .catch(e => res.status(500).send('Internal server error: ' + e.message))
                    .finally(() => dbConnectors.disconnect());
            } else {
                dbServices.updateRef(id, data)
                    .then((result) => {
                        res.status(201).send(result);
                    })
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
            //this function will also delete any associated file from the server
            dbServices.deleteRef(id)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

export default router;