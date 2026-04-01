import Aes from 'react-native-aes-crypto';

export const BACKUP_CRYPTO_ITERATIONS = 100000;

export async function encrypt(text: string, password: string) {
  const salt = await Aes.randomKey(16);
  const iv = await Aes.randomKey(16);

  const key = await Aes.pbkdf2(
    password,
    salt,
    BACKUP_CRYPTO_ITERATIONS,
    256,
    'sha256',
  );

  const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');

  return {
    cipher,
    salt,
    iv,
  };
}

export async function decrypt(params: {
  cipher: string;
  salt: string;
  iv: string;
  password: string;
}) {
  const key = await Aes.pbkdf2(
    params.password,
    params.salt,
    BACKUP_CRYPTO_ITERATIONS,
    256,
    'sha256',
  );

  return Aes.decrypt(params.cipher, key, params.iv, 'aes-256-cbc');
}
