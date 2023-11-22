import express from 'express';
import ViteExpress from 'vite-express';

import referencesRouter from './Routes/referencesRouter';
import workExamplesRouter from './Routes/workExamplesRouter';
import bookingsRouter from './Routes/bookingsRouter';
import equipmentRouter from './Routes/equipmentRouter';

import emailService from './Middleware/emailService';
import dbConnectors from './Middleware/dbConnectors';
import dbServices from './Middleware/dbServices';
import { genToken, verifyPass } from './Middleware/authorization';

const app = express();
app.use(express.json());

app.use('/api/references', referencesRouter);
app.use('/api/work-examples', workExamplesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/equipment', equipmentRouter);

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
            return;
        })
        .then(() => {
            dbServices.readRefs({sample: true})
                .then(data => {
                    try {
                        dataArray.refs = (data as IReference[]);
                    } catch (e: unknown) {
                        console.log((e as Error).message);
                        res.status(500).send('Internal server error');
                        return;
                    }
                })
                .then(() => {
                    dbServices.readUploads({tag: 'worked-with'})
                        .then((data: unknown) => {
                            try {
                                dataArray.workedWith = (data as IFile[])[0].path;
                            } catch (e: unknown) {
                                console.log((e as Error).message);
                                res.status(500).send('Internal server error');
                                return;
                            }
                        })
                        .then(() => {
                            dbServices.readWorkExamples({sample: true})
                                .then((data: unknown) => {
                                    try {
                                        dataArray.workExamples = (data as IWorkExample[]);
                                    } catch (e: unknown) {
                                        console.log((e as Error).message);
                                        res.status(500).send('Internal server error');
                                        return;
                                    }
                                })
                                .then(() => {
                                    dbServices.readBookings()
                                        .then((data: unknown) => {
                                            try {
                                                dataArray.bookings = (data as IEvent[]);
                                            } catch (e: unknown) {
                                                console.log((e as Error).message);
                                                res.status(500).send('Internal server error');
                                                return;
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

app.post('/api/contact', async (req, res) => {
    const formData = req.body.formData;

    try{
        await emailService.sendFormDataEmail(formData);
    } catch (e: unknown) {
        console.log((e as Error).message);
        res.send('Something went wrong');
    }
    
});

type UserData = {
    username: string,
    email:  string,
    password: string
};

app.post('/api/login', (req, res) => {
    const loginInfo = {username: req.body.username, password: req.body.password};

    dbConnectors.connectWriter('user')
        .catch(e => {
            console.log(e.message);
            return;
        })
        .then(() => {
            dbServices.readUser({username: loginInfo.username})
                .then(data => {
                    if(!data[0] || !data[0].username || !data[0].password) res.send({verification: false});
                    else {
                        verifyPass(loginInfo.password, (data as UserData[])[0].password)
                            .then(verification => {
                                if(!verification) res.send({verification: verification});
                                else{ 
                                    genToken(loginInfo.username)
                                        .then(tokenRes => res.send({verification: verification, info: tokenRes}));
                                }
                            });
                    }
                })
                .catch(e => {
                    console.log(e.message);
                    return;})
                .finally(() => {
                    dbConnectors.disconnect();
                });
        });
});

ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
);
