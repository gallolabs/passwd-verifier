<p align="center">
    <img height="300" src="https://raw.githubusercontent.com/gallolabs/passwd-verifier/main/logo_w300.jpeg">
  <h1 align="center">Password Verifier</h1>
</p>

Validates passwords with support of htpasswd format.

```javascript
    import verifyPasswd from '@gallolabs/passwd-verifier'

    await verifyPasswd('myPasswd', '$2y$05$L/jPI05ltEKrwIjQThJ4keBFKH/aRDpxY9CaaVWYIZcPu0FXdRO6i') // false
    await verifyPasswd('iAmNotHacker27!', '$2y$05$L/jPI05ltEKrwIjQThJ4keBFKH/aRDpxY9CaaVWYIZcPu0FXdRO6i') // true
```

Supports various format (sha, bcrypt, md5, crypt, plain)