import express from 'express';
import dbConnectors from '../Middleware/dbConnectors';
import dbServices from '../Middleware/dbServices';
import { authenticate } from '../Middleware/authorization';
import equipment_types from '../Schemas/site-content/equipment_types';

const router = express.Router();

router.get('/', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            console.log('connected to equipment');
            dbServices.readEquipment()
                .then((data: unknown) => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                        return;
                    }
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => {dbConnectors.disconnect();
                    console.log('disconnected from equipment');});
        });
});

router.get('/model/:id', (req, res) => {
    const id = req.params.id;
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readEquipment({_id: id})
                .then((data: unknown) => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

router.get('/types', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        }) 
        .then(() => {
            equipment_types.find()
                .then((data: unknown) => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
}); 

router.post('/', authenticate, (req, res) => {
    console.log(req.body.data);
    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            if(!req.body.file) {
                dbServices.addEquipment(req.body.data)
                    .then((result) => {
                        res.status(201).send(result);
                    })
                    .catch(e => res.status(500).send('Internal server error: ' + e.message))
                    .finally(() => dbConnectors.disconnect());
            } else {
                dbServices.addEquipment(req.body.data, req.body.file)
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

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readEquipment({_id: id})
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

router.delete('/:id', authenticate, (req, res) => {
    const id = req.params.id;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readEquipment({_id: id})
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

router.put('/bookings/:id', authenticate, (req, res) => {
    const id = req.params.id;

    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readEquipment({_id: id})
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

export default router;