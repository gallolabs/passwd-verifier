import { strictEqual } from 'assert'
import verifyPasswd from './index.js'

describe('Auth', () => {
    it('verifyHtpasswdPassword', async () => {
        const passwords = [
            '{SHA}m3eMTmxi2IBKIZgAnySjD/tg8W8=', // sha
            '$2y$05$L/jPI05ltEKrwIjQThJ4keBFKH/aRDpxY9CaaVWYIZcPu0FXdRO6i', //bcrypt
            '$apr1$GZ650zxv$99/Dg0Y6os0zquEMaYoJx1', // default
            '5G1OI2SwmK4v6', // crypt
            'iAmNotHacker27!' // plain
        ]

        const originalPassword = 'iAmNotHacker27!'

        for (const pass of passwords) {
            strictEqual(await verifyPasswd(originalPassword, pass), true)
            strictEqual(await verifyPasswd('iAmHACKER!', pass), false)
        }
    })

})
