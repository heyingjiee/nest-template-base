// AES
import * as CryptoJS from 'crypto-js';

export function aesEncrypt(message: string, secretKey: string) {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
}

export function aesDecrypt(message: string, secretKey: string) {
  const bytes = CryptoJS.AES.decrypt(message, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
