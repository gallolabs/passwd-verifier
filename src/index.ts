import safeCompare from 'safe-compare'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import md5 from 'apache-md5'
// @ts-ignore
import crypt from 'apache-crypt'

export default async function verifyPasswd(inputPassword: string, expectedPasswordOrHash: string): Promise<boolean> {
    if (expectedPasswordOrHash.substr(0, 5) === '{SHA}') {
        const c = crypto.createHash('sha1');
        c.update(inputPassword);
        return safeCompare(c.digest('base64'), expectedPasswordOrHash.substr(5))
    }

    if (expectedPasswordOrHash.substr(0, 4) === '$2y$' || expectedPasswordOrHash.substr(0, 4) === '$2a$') {
        return bcrypt.compare(inputPassword, expectedPasswordOrHash)
    }

    if (expectedPasswordOrHash.substr(0, 6) === '$apr1$' || expectedPasswordOrHash.substr(0, 3) === '$1$') {
        // @ts-ignore
        return safeCompare(md5(inputPassword, expectedPasswordOrHash), expectedPasswordOrHash)
    }

    if (/^[a-zA-Z0-9]{13}$/.test(expectedPasswordOrHash)) {
        return safeCompare(crypt(inputPassword, expectedPasswordOrHash), expectedPasswordOrHash)
    }

    return safeCompare(inputPassword, expectedPasswordOrHash)
}
