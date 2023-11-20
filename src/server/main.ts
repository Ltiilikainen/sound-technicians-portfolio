import express from 'express';
import ViteExpress from 'vite-express';
import emailService from './Middleware/emailService';
import dbConnectors from './Middleware/dbConnectors';
import dbServices from './Middleware/dbServices';

const app = express();
app.use(express.json());

type responseData = {
refs: IReference[],
workedWith: string,
workExamples: IWorkExample[],
bookings: IEvent[]
}

app.get('/api/home', (_, res) => {
    const dataArray: responseData = {refs: [], workedWith: '', workExamples: [], bookings: []};

    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readRefs({sample: true})
                .then(data => {
                    try {
                        dataArray.refs = (data as IReference[]);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .then(() => {
                    dbServices.readUploads({tag: 'worked-with'})
                        .then(data => {
                            try {
                                dataArray.workedWith = (data as IFile[])[0].path;
                            } catch (e: unknown) {
                                console.log((e as Error).message);
                                res.status(500).send('Internal server error');
                            }
                        })
                        .then(() => {
                            dbServices.readWorkExamples({sample: true})
                                .then(data => {
                                    try {
                                        dataArray.workExamples = (data as IWorkExample[]);
                                    } catch (e: unknown) {
                                        console.log((e as Error).message);
                                        res.status(500).send('Internal server error');
                                    }
                                })
                                .then(() => {
                                    dbServices.readBookings()
                                        .then(data => {
                                            try {
                                                dataArray.bookings = (data as IEvent[]);
                                            } catch (e: unknown) {
                                                console.log((e as Error).message);
                                                res.status(500).send('Internal server error');
                                            }
                                        })
                                        .finally(() => {
                                            dbConnectors.disconnect();
                                            res.send(dataArray);
                                        });
                                });
                        });
                });     
        });
});

app.get('/api/references', (_, res) => {
    const queryData: Array<IReference[] | IFile>= [];
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readRefs()
                .then(data => {
                    try {
                        queryData.push((data as IReference[]));
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                });
            dbServices.readUploads({tag: 'worked-with'})
                .then(data => {
                    try {
                        queryData.push((data as IFile[])[0]);
                        res.send(queryData);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .finally(() => dbConnectors.disconnect());
        });
});

app.get('/api/work-audio', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readWorkExamples()
                .then(data => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .finally(() => dbConnectors.disconnect());
        });
});

app.get('/api/bookings', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readBookings()
                .then(data => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .finally(() => dbConnectors.disconnect());
        });
});

app.get('/api/equipment', (_, res) => {
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readEquipment()
                .then(data => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .finally(() => dbConnectors.disconnect());
        });
});

app.get('/api/equipment/:id', (req, res) => {
    const id = req.params.id;
    dbConnectors.connectReader()
        .catch(e => {
            console.log(e.message);
            res.status(500).send('Internal server error');
        })
        .then(() => {
            dbServices.readEquipment({_id: id})
                .then(data => {
                    try {
                        res.send(data);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                    }
                })
                .finally(() => dbConnectors.disconnect());
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
