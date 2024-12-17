import {
  privateDecrypt,
  publicEncrypt,
  createDecipheriv,
  randomBytes,
  createCipheriv,
  constants,
} from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

const privateKey = readFileSync(
  join(process.cwd(), `pem/private_key.pem`),
  'utf8',
);

const publicKey = readFileSync(
  join(process.cwd(), `pem/public_key.pem`),
  'utf8',
);

// 使用AES加密数据
function encryptWithAES(data: string) {
  const key = randomBytes(16);
  const iv = randomBytes(16);

  const cipher = createCipheriv('aes-128-cbc', key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');

  // 返回加密数据、AES密钥和IV
  return {
    data: encryptedData,
    key: key,
    iv: iv,
  };
}

// 使用AES解密数据
function decryptWithAES(encryptedData: string, key: Buffer, iv: Buffer) {
  const decipher = createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 使用 RSA-OAEP 加密 AES 密钥
function encryptKeyWithRSA(aesKey: Buffer) {
  const encryptedKey = publicEncrypt(
    {
      key: publicKey, // 从文件中读取的公钥
      padding: constants.RSA_PKCS1_OAEP_PADDING, // 使用 OAEP 填充
      oaepHash: 'sha256', // 可以根据需要指定哈希算法
    },
    aesKey, // AES 密钥 Buffer 对象
  );
  // 返回 Base64 编码的加密密钥
  return encryptedKey.toString('base64');
}

// 使用RSA解密AES密钥
function decryptKeyWithRSA(encryptedKey: string) {
  const decryptedKey = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING, // 确保使用 OAEP 填充
      oaepHash: 'sha256', // 可以根据需要指定哈希算法
    },
    Buffer.from(encryptedKey, 'base64'),
  );

  return decryptedKey;
}

// 混合加密：AES加密数据，RSA加密AES密钥
export function hybridEncrypt(data: string) {
  const aesResult = encryptWithAES(data);
  const encryptedKey = encryptKeyWithRSA(aesResult.key); // RSA加密AES密钥
  return {
    data: aesResult.data,
    encryptedKey: encryptedKey,
    iv: aesResult.iv.toString('base64'), // 初始向量也需要传输
  };
}

// 混合解密：RSA解密AES密钥，AES解密数据
export function hybridDecrypt(
  encryptedData: string,
  encryptedKey: string,
  iv: string,
) {
  const decryptedKey = decryptKeyWithRSA(encryptedKey); // RSA解密AES密钥
  const decryptedData = decryptWithAES(
    encryptedData,
    decryptedKey,
    Buffer.from(iv, 'base64'),
  );
  return decryptedData;
}
