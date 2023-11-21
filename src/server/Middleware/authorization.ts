import * as fs from 'fs';
import * as jose from 'jose';
import argon2 from 'argon2';

const verifyPass = async (password:string, hash:string) => {
    const ver = await argon2.verify(hash, password);
    return ver;
};

const genToken = async (username: string) => {
    const payload = {
        username: username
    };

    const alg = 'RS256';

    const pkcs8 = fs.readFileSync('./src/server/private.key', 'utf-8');
    const pub_key = fs.readFileSync('./src/server/private.key', 'utf-8');

    const priv_key = await jose.importPKCS8(pkcs8, alg) ;

    try {
        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({alg})
            .setIssuer('portfolio-site')
            .setAudience('portfolio-user')
            .setExpirationTime('48h')
            .sign(priv_key);

        return {user: username, token: token, pub_key: pub_key};
    } catch (err) {
        return false;
    }
};


export {verifyPass, genToken};
