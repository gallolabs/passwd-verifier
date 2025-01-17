import { strictEqual } from 'assert'
import {verifyPasswd} from './index.js'

describe('Auth', () => {
    it('verifyHtpasswdPassword', async () => {
        const passwords = [
            '{SHA}m3eMTmxi2IBKIZgAnySjD/tg8W8=', // sha
            '$2y$05$L/jPI05ltEKrwIjQThJ4keBFKH/aRDpxY9CaaVWYIZcPu0FXdRO6i', //bcrypt
            '$apr1$GZ650zxv$99/Dg0Y6os0zquEMaYoJx1', // default
            '5G1OI2SwmK4v6', // crypt
            'iAmNotHacker27!', // plain
            //'$5$xgLpl4Gf$2Ar9sFsBBbCrFEHgU98zGiAvYcSdqPqXq22YOI9j3t/', // sha256
            //'$6$kEq2iAv5$eHLzlmPFCdbePZuXE/19TGanz9WfPHhi00I7QIkA9W4OYv4qOKbsXEM4KLfE6pGvTmibc6i2uc11ckGycATWt1' // 'sha512'
        ]

        const originalPassword = 'iAmNotHacker27!'

        for (const pass of passwords) {
            strictEqual(await verifyPasswd(originalPassword, pass), true, pass)
            strictEqual(await verifyPasswd('iAmHACKER!', pass), false, pass)
        }
    })

})
