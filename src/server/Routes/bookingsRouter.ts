import express from 'express';
import dbConnectors from '../Middleware/dbConnectors';
import dbServices from '../Middleware/dbServices';
import { authenticate } from '../Middleware/authorization';
import bookings_categories from '../Schemas/site-content/bookings_categories';
import bookings from '../Schemas/site-content/bookings';

const router = express.Router();

router.get('/', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            dbServices.readBookings()
                .then((data: unknown) => {
                    res.send(data);
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
        });
});

router.get('/categories', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            console.log('connected to categories');
            bookings_categories.find()
                .then((data: unknown) => {
                    res.send(data);
                })
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => {dbConnectors.disconnect();
                    console.log('disconnected from categories');});
        });
});

router.get('/datelist', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
            return;
        })
        .then(() => {
            bookings.find()
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
    dbConnectors.connectWriter('site-content')
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readBookings()
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message))
                .finally(() => dbConnectors.disconnect());
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
            dbServices.readBookings({_id: id})
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
        })
        .then(() => {
            dbServices.readBookings({_id: id})
                .then(() => {})
                .catch(e => res.status(500).send('Internal server error: ' + e.message));
        })
        .finally(() => dbConnectors.disconnect());
});

export default router;