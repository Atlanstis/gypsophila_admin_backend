import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

// 生成 RSA 密钥对
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048, // 2048 位密钥
  publicKeyEncoding: {
    type: 'spki', // 用于公钥的 "SubjectPublicKeyInfo"
    format: 'pem', // 输出格式为 PEM
  },
  privateKeyEncoding: {
    type: 'pkcs8', // 用于私钥的 "PrivateKeyInfo"
    format: 'pem', // 输出格式为 PEM
  },
});

function getPemPath(filename: string) {
  return join(process.cwd(), `pem/${filename}.pem`);
}

// 将密钥保存到文件
writeFileSync(getPemPath('public_key'), publicKey);
writeFileSync(getPemPath('private_key'), privateKey);

console.log('PEM 格式的公钥和私钥已生成！');
