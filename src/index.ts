import safeCompare from 'safe-compare'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import md5 from 'apache-md5'
// @ts-ignore
import crypt from 'apache-crypt'

export type hashType = 'SHA1' | 'BCRYPT' | 'MD5' | 'CRYPT' | 'PLAIN'/* | 'SHA256' | 'SHA512'*/

export interface Opts {
    cryptAsPlain?: boolean
    noPlain?: boolean
}

export async function verifyPasswd(inputPassword: string, expectedPasswordOrHash: string, opts: Opts = {}): Promise<boolean> {
    const compiled = compile(expectedPasswordOrHash, opts)

    if (!compiled) {
        return false
    }

    return compiled.verify(inputPassword)
}

export function detectHashType(passwordOrHash: string, opts: Opts = {}): hashType | undefined {
    const compiled = compile(passwordOrHash, opts)

    return compiled && compiled.hashType
}

export function compile(passwordOrHash: string, opts: Opts = {}): {hashType: hashType, verify: (input: string) => Promise<boolean>} | undefined {
    if (passwordOrHash.substr(0, 5) === '{SHA}') {
        return {
            hashType: 'SHA1',
            async verify(input: string): Promise<boolean> {
                return safeCompare(hash('sha1', input), passwordOrHash.substr(5))
            }
        }
    }

    if (passwordOrHash.substr(0, 6) === '$sha1$') {
        return {
            hashType: 'SHA1',
            async verify(input: string): Promise<boolean> {
                return safeCompare(hash('sha1', input), passwordOrHash.substr(6))
            }
        }
    }

    // if (passwordOrHash.substr(0, 3) === '$5$') {
    //     return {
    //         hashType: 'SHA256',
    //         async verify(input: string): Promise<boolean> {
    //             return safeCompare(hash('sha256', input), passwordOrHash.substr(3))
    //         }
    //     }
    // }

    // if (passwordOrHash.substr(0, 3) === '$6$') {
    //     return {
    //         hashType: 'SHA512',
    //         async verify(input: string): Promise<boolean> {
    //             return safeCompare(hash('sha512', input), passwordOrHash.substr(3))
    //         }
    //     }
    // }

    if (passwordOrHash.substr(0, 4) === '$2y$' || passwordOrHash.substr(0, 4) === '$2a$') {
        return {
            hashType: 'BCRYPT',
            async verify(input: string): Promise<boolean> {
                return bcrypt.compare(input, passwordOrHash)
            }
        }
    }

    if (passwordOrHash.substr(0, 6) === '$apr1$' || passwordOrHash.substr(0, 3) === '$1$') {
        return {
            hashType: 'MD5',
            async verify(input: string): Promise<boolean> {
                // @ts-ignore
                return safeCompare(md5(input, passwordOrHash), passwordOrHash)
            }
        }
    }

    if (/^[a-zA-Z0-9\/]{13}$/.test(passwordOrHash) && !opts.cryptAsPlain) {
        return {
            hashType: 'CRYPT',
            async verify(input: string): Promise<boolean> {
                // @ts-ignore
                return safeCompare(crypt(input, passwordOrHash), passwordOrHash)
            }
        }
    }

    return opts.noPlain ? undefined : {
        hashType: 'PLAIN',
        async verify(input: string): Promise<boolean> {
            // @ts-ignore
            return safeCompare(input, passwordOrHash)
        }
    }
}

function hash(algo: string, content: string): string {
    const c = crypto.createHash(algo)
    c.update(content)
    return c.digest('base64')
}
