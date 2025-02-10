package com.mbs.utils;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionDecryption {

    // Define a fixed complex secret key (must be exactly 16 bytes for AES-128)
    private static final String FIXED_KEY = "a9vB2@d3F!kLpQ9z"; // 16-character complex key

    // Method to get a SecretKeySpec from the fixed key
    public static SecretKey getFixedSecretKey() {
        return new SecretKeySpec(FIXED_KEY.getBytes(), "AES");
    }

    // Method to encrypt a message
    public static String encrypt(String plainText, SecretKey secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes); // Encode bytes to Base64
    }

    // Method to decrypt a message
    public static String decrypt(String encryptedText, SecretKey secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);
        return new String(decryptedBytes);
    }

}
