import {
    generateSymmetricKey,
    exportSymmetricKey,
    generateAsymmetricKeyPair,
    exportPublicKey,
    exportPrivateKey,
    encryptSymmetric,
    decryptSymmetric,
    encryptAsymmetric,
    decryptAsymmetric,
    importPublicKey,
    importPrivateKey,
    importSymmetricKey,
    deriveKeyFromPassword,
} from "./crypto";

export class SecurityService {
    /**
     * 1. SENDER: Lock a new message.
     * - Generates AES-GCM symmetric key.
     * - Encrypts the plaintext message payload.
     * - Generates a Temporary RSA asymmetric keypair.
     * - Encrypts the AES key using the Temp Public Key.
     * - Encrypts the Temp Private Key using the Sender's Vault Password (so the sender can unlock it later).
     * 
     * Returns:
     * - encryptedBlob (AES encrypted message)
     * - temporaryPublicKey (RSA temp public key, Base64)
     * - temporaryPrivateKeyEncrypted (RSA temp private key encrypted with PBKDF2 Vault Password)
     * - encryptedSymmetricKey (AES key wrapped by Temp Public Key)
     */
    static async lockMessage(plaintext: string, vaultPassword: string) {
        // 1. Symmetric encryption of the message
        const symKey = await generateSymmetricKey();
        const symKeyBase64 = await exportSymmetricKey(symKey);
        const encryptedBlob = await encryptSymmetric(plaintext, symKey);

        // 2. Asymmetric temporary key generation
        const { publicKey: tempPubKey, privateKey: tempPrivKey } = await generateAsymmetricKeyPair();
        const tempPubKeyBase64 = await exportPublicKey(tempPubKey);
        const tempPrivKeyBase64 = await exportPrivateKey(tempPrivKey);

        // 3. Encrypt symmetric key with Temporary Public Key (Lockbox)
        const encryptedSymmetricKey = await encryptAsymmetric(symKeyBase64, tempPubKey);

        // 4. Encrypt Temporary Private Key with Sender's Vault Password
        const { key: vaultDerivedKey, saltHex } = await deriveKeyFromPassword(vaultPassword);
        const encryptedPrivKeyCiphertext = await encryptSymmetric(tempPrivKeyBase64, vaultDerivedKey);
        const temporaryPrivateKeyEncrypted = `${saltHex}:${encryptedPrivKeyCiphertext}`;

        return {
            encryptedBlob,
            temporaryPublicKey: tempPubKeyBase64,
            temporaryPrivateKeyEncrypted,
            encryptedSymmetricKey,
        };
    }

    /**
     * 2. SUCCESSOR: Initialize Permanent Keypair.
     * - Successor enters an Access Password during handshake.
     * - Generates a Permanent RSA asymmetric keypair.
     * - Encrypts the Permanent Private Key using the PBKDF2 Access Password.
     * 
     * Returns:
     * - permanentPublicKey (RSA public key, Base64)
     * - permanentPrivateKeyEncrypted (RSA private key encrypted with PBKDF2 Access Password)
     */
    static async setupSuccessorKeys(accessPassword: string) {
        const { publicKey, privateKey } = await generateAsymmetricKeyPair();
        const pubBase64 = await exportPublicKey(publicKey);
        const privBase64 = await exportPrivateKey(privateKey);

        const { key: passwordDerivedKey, saltHex } = await deriveKeyFromPassword(accessPassword);
        const encryptedPrivKeyCiphertext = await encryptSymmetric(privBase64, passwordDerivedKey);
        const permanentPrivateKeyEncrypted = `${saltHex}:${encryptedPrivKeyCiphertext}`;

        return {
            permanentPublicKey: pubBase64,
            permanentPrivateKeyEncrypted,
        };
    }

    /**
     * 3. SENDER: Complete Handshake.
     * - Sender wants to issue a Lockbox to a successor who just provided their permanentPublicKey.
     * - Unlocks Temp Private Key using Vault Password.
     * - Unwraps Symmetric Key from the temporary encryptedSymmetricKey.
     * - Re-wraps Symmetric Key using the Successor's Permanent Public Key.
     * 
     * Returns:
     * - newEncryptedSymmetricKey (AES key wrapped by Successor's Permanent Public Key)
     */
    static async grantAccessToSuccessor(
        temporaryPrivateKeyEncrypted: string,
        vaultPassword: string,
        encryptedSymmetricKeyFallback: string,
        successorPublicKeyBase64: string
    ) {
        // 1. Decrypt Temp Private Key
        const [saltHex, ciphertext] = temporaryPrivateKeyEncrypted.split(":");
        const { key: vaultDerivedKey } = await deriveKeyFromPassword(vaultPassword, saltHex);
        const tempPrivKeyBase64 = await decryptSymmetric(ciphertext, vaultDerivedKey);
        const tempPrivKey = await importPrivateKey(tempPrivKeyBase64);

        // 2. Unwrap Symmetric Key
        const symKeyBase64 = await decryptAsymmetric(encryptedSymmetricKeyFallback, tempPrivKey);

        // 3. Re-wrap using Successor's Public Key
        const successorPubKey = await importPublicKey(successorPublicKeyBase64);
        const newEncryptedSymmetricKey = await encryptAsymmetric(symKeyBase64, successorPubKey);

        return newEncryptedSymmetricKey;
    }

    /**
     * 4. SUCCESSOR: Handover Phase (Message Released).
     * - Successor enters Access Password -> Unlocks Permanent Private Key.
     * - Successor uses Permanent Private Key -> Unwraps Symmetric Key.
     * - Successor uses Symmetric Key -> Decrypts Message Blob.
     * 
     * Returns:
     * - decryptedPlainText
     */
    static async openMessageAsSuccessor(
        encryptedBlob: string,
        encryptedSymmetricKey: string,
        permanentPrivateKeyEncrypted: string,
        accessPassword: string
    ) {
        // 1. Decrypt Permanent Private Key
        const [saltHex, ciphertext] = permanentPrivateKeyEncrypted.split(":");
        const { key: passwordDerivedKey } = await deriveKeyFromPassword(accessPassword, saltHex);
        const permanentPrivKeyBase64 = await decryptSymmetric(ciphertext, passwordDerivedKey);
        const permanentPrivKey = await importPrivateKey(permanentPrivKeyBase64);

        // 2. Unwrap Symmetric Key
        const symKeyBase64 = await decryptAsymmetric(encryptedSymmetricKey, permanentPrivKey);
        const symKey = await importSymmetricKey(symKeyBase64);

        // 3. Decrypt Message payload
        const plaintext = await decryptSymmetric(encryptedBlob, symKey);
        return plaintext;
    }

    /**
     * SENDER: Open their own locked message for editing.
     */
    static async openMessageAsSender(
        encryptedBlob: string,
        encryptedSymmetricKey: string,
        temporaryPrivateKeyEncrypted: string,
        vaultPassword: string
    ) {
        const [saltHex, ciphertext] = temporaryPrivateKeyEncrypted.split(":");
        const { key: vaultDerivedKey } = await deriveKeyFromPassword(vaultPassword, saltHex);
        const tempPrivKeyBase64 = await decryptSymmetric(ciphertext, vaultDerivedKey);
        const tempPrivKey = await importPrivateKey(tempPrivKeyBase64);

        const symKeyBase64 = await decryptAsymmetric(encryptedSymmetricKey, tempPrivKey);
        const symKey = await importSymmetricKey(symKeyBase64);

        return decryptSymmetric(encryptedBlob, symKey);
    }
}
