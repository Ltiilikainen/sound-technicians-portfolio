import express from 'express';
import ViteExpress from 'vite-express';
import emailService from './Middleware/emailService';
import dbConnectors from './Middleware/dbConnectors';
import work_examples from './Schemas/work_examples';
import main_bookings from './Schemas/main_bookings';
import equipment_parents from './Schemas/equipment_parents';
import equipment_individuals from './Schemas/equipment_individuals';
import bookings from './Schemas/bookings';

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

app.get('/api/bookings', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => console.log(e))
        .then(() => {
            main_bookings.find()
                .populate({path: 'category_id',
                    select: 'category_name -_id'})
                .populate('time_id')
                .populate({path: 'equipment', model: equipment_individuals,
                    populate: {path: 'description', model: equipment_parents}})
                .exec()
                .catch(e => console.log(e.message))
                .then(bookings => 
                {
                    try{
                        res.send(bookings);
                        
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

app.get('/api/equipment', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => console.log(e))
        .then(() => {
            equipment_parents.find()
                .populate('type')
                .exec()
                .catch(e => console.log(e.message))
                .then(equipmentList => 
                {
                    try{
                        res.send(equipmentList);
                        
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

app.get('/api/equipment/:id', (req, res) => {
    const id = req.params.id;
    dbConnectors.connectReader()
        .catch(e => console.log(e))
        .then(() => {
            equipment_parents.find().where('_id').equals(id)
                .populate('type')
                .populate({path: 'individuals', model: equipment_individuals,
                    select: 'bookings', populate: {path: 'bookings', model: bookings}})
                .exec()
                .catch(e => console.log(e.message))
                .then(items => 
                {
                    try {
                        res.send(items);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                    }
                })
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
