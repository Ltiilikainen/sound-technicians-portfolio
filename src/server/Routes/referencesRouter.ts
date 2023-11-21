import express from 'express';
import dbConnectors from '../Middleware/dbConnectors';
import dbServices from '../Middleware/dbServices';

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

export default router;