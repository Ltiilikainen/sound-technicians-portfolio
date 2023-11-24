import multer from 'multer';
import path from 'path';

//create multer instance
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, _file, callback: (error: Error | null, destination: string) => void ) => {
            callback(null, './src/files/' + req.params.path);
        },
        filename: (req, file, callback: (error: Error | null, destination: string) => void) => {
            const folder = req.params.path;
            const fileType = path.extname(file.originalname);
            const filename = path.parse(file.originalname).name + '-' + Date.now() + fileType;

            req.body.fileType = fileType;
            req.body.folder = folder;
            req.body.file = filename;

            if(folder === 'work-audio' && !checkFiletype(fileType, ['.mp3', '.wav', '.ogg'])) return callback(new Error('Invalid file type'), folder);
            if(folder === 'work-video' && !checkFiletype(fileType, ['.mp4', '.mpeg', '.avi'])) return callback(new Error('Invalid file type'), folder);
            if(folder === 'img' && !checkFiletype(fileType, ['.jpg', '.jpeg', '.png', '.gif', '.svg'])) return callback(new Error('Invalid file type'), folder);

            callback(null, filename );
        }
    }),
    limits: {fileSize: 1000000}
});

const audio = upload.single('work-audio');
const video = upload.single('work-video');
const img = upload.single('img');


function checkFiletype(filetype: string, checklist: string[]) {
    if (checklist.indexOf(filetype) < 0) return false;
    else return true;
}

export default {audio, video, img, checkFiletype};