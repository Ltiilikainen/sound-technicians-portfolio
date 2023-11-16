import express from 'express';
import ViteExpress from 'vite-express';
import emailService from './Middleware/emailService';
import dbConnectors from './Middleware/dbConnectors';
import work_examples from './Schemas/work_examples';
import main_bookings from './Schemas/main_bookings';
import equipment_parents from './Schemas/equipment_parents';
import equipment_children from './Schemas/equipment_children';

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
                .populate({path: 'equipment'})
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
            equipment_children.find()
                //.populate({path: 'equipment_type'})
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
            equipment_children.find().where('parent_id').equals(id)
                .populate('parent_id')
                .populate('bookings')
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
