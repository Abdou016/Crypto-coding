document.addEventListener('DOMContentLoaded', function() {
    const algorithmSelect = document.getElementById('algorithm');
    const keyInput = document.getElementById('keyInput');
    const hashAlgorithmSelect = document.getElementById('hashAlgorithm');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const hashBtn = document.getElementById('hashBtn');
    const inputText = document.getElementById('inputText');
    const resultDiv = document.getElementById('result');
    
    algorithmSelect.addEventListener('change', function() {
        if (this.value === 'hash') {
            hashAlgorithmSelect.style.display = 'block';
            hashBtn.style.display = 'block';
            encryptBtn.style.display = 'none';
            decryptBtn.style.display = 'none';
        } else {
            hashAlgorithmSelect.style.display = 'none';
            hashBtn.style.display = 'none';
            encryptBtn.style.display = 'block';
            decryptBtn.style.display = 'block';
        }
    });
    
    
    encryptBtn.addEventListener('click', function() {
        const text = inputText.value;
        const algorithm = algorithmSelect.value;
        const key = keyInput.value;
        
        try {
            let result;
            switch(algorithm) {
                case 'caesar':
                    result = caesarCipher(text, parseInt(key), true);
                    break;
                case 'vigenere':
                    result = vigenereCipher(text, key, true);
                    break;
                case 'playfair':
                    result = playfairCipher(text, key, true);
                    break;
                case 'railfence':
                    result = railFenceCipher(text, parseInt(key), true);
                    break;
                case 'rc4':
                    result = rc4Cipher(text, key, true);
                    break;
                case 'aes':
                    result = aesCipher(text, key, true);
                    break;
                case 'des':
                    result = desCipher(text, key, true);
                    break;
                case 'rsa':
                    result = rsaCipher(text, key, true);
                    break;
                default:
                    result = "Encryption algorithm not implemented yet";
            }
            resultDiv.textContent = result;
        } catch (e) {
            resultDiv.textContent = "Error: " + e.message;
        }
    });
    
    decryptBtn.addEventListener('click', function() {
        const text = inputText.value;
        const algorithm = algorithmSelect.value;
        const key = keyInput.value;
        
        try {
            let result;
            switch(algorithm) {
                case 'caesar':
                    result = caesarCipher(text, parseInt(key), false);
                    break;
                case 'vigenere':
                    result = vigenereCipher(text, key, false);
                    break;
                case 'playfair':
                    result = playfairCipher(text, key, false);
                    break;
                case 'railfence':
                    result = railFenceCipher(text, parseInt(key), false);
                    break;
                case 'rc4':
                    result = rc4Cipher(text, key, false);
                    break;
                case 'aes':
                    result = aesCipher(text, key, false);
                    break;
                case 'des':
                    result = desCipher(text, key, false);
                    break;
                case 'rsa':
                    result = rsaCipher(text, key, false);
                    break;
                default:
                    result = "Decryption algorithm not implemented yet";
            }
            resultDiv.textContent = result;
        } catch (e) {
            resultDiv.textContent = "Error: " + e.message;
        }
    });
    
    hashBtn.addEventListener('click', function() {
        const text = inputText.value;
        const algorithm = hashAlgorithmSelect.value;
        
        try {
            let result;
            switch(algorithm) {
                case 'md5':
                    result = md5Hash(text);
                    break;
                case 'sha1':
                    result = sha1Hash(text);
                    break;
                case 'sha256':
                    result = sha256Hash(text);
                    break;
                default:
                    result = "Hash algorithm not implemented yet";
            }
            resultDiv.textContent = result;
        } catch (e) {
            resultDiv.textContent = "Error: " + e.message;
        }
    });
    

    function caesarCipher(text, shift, encrypt) {
        if (!shift && shift !== 0) throw new Error("Shift value required");
        shift = encrypt ? shift : -shift;
        return text.replace(/[a-z]/gi, function(char) {
            const code = char.charCodeAt(0);
            let base = code >= 97 ? 97 : 65;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        });
    }
    
    function vigenereCipher(text, key, encrypt) {
        if (!key) throw new Error("Key required");
        key = key.toUpperCase();
        let keyIndex = 0;
        return text.replace(/[a-z]/gi, function(char) {
            const code = char.charCodeAt(0);
            let base = code >= 97 ? 97 : 65;
            const keyChar = key[keyIndex % key.length];
            const keyShift = keyChar.charCodeAt(0) - 65;
            keyIndex++;
            const shift = encrypt ? keyShift : -keyShift;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        });
    }
    
    function playfairCipher(text, key, encrypt) {
        if (!key) throw new Error("Key required");
        
        return "Playfair cipher not yet implemented";
    }
    
    function railFenceCipher(text, rails, encrypt) {
        if (!rails) throw new Error("Number of rails required");
        if (encrypt) {
            const fence = [];
            for (let i = 0; i < rails; i++) fence.push([]);
            let rail = 0;
            let direction = 1;
            
            for (let char of text) {
                fence[rail].push(char);
                rail += direction;
                if (rail === rails - 1 || rail === 0) direction = -direction;
            }
            
            return fence.flat().join('');
        } else {
            
            return "Rail fence decryption not yet implemented";
        }
    }
    

    function rc4Cipher(text, key, encrypt) {
        
        if (!key) throw new Error("Key required");
        
        // Key-scheduling algorithm
        let S = [];
        for (let i = 0; i < 256; i++) S[i] = i;
        
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
            [S[i], S[j]] = [S[j], S[i]]; // Swap
        }
        
        
        let i = 0;
        j = 0;
        let result = '';
        
        for (let n = 0; n < text.length; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            [S[i], S[j]] = [S[j], S[i]];
            const K = S[(S[i] + S[j]) % 256];
            result += String.fromCharCode(text.charCodeAt(n) ^ K);
        }
        
        return result;
    }
    
    async function aesCipher(text, key, encrypt) {
        if (!key) throw new Error("Key required");
        // Note: In a real implementation, you would use the Web Crypto API
        return "AES cipher requires Web Crypto API (not implemented in this demo)";
    }
    
    async function desCipher(text, key, encrypt) {
        if (!key) throw new Error("Key required");
        // Note: In a real implementation, you would use the Web Crypto API
        return "DES cipher requires Web Crypto API (not implemented in this demo)";
    }
    
    // Asymmetric Ciphers
    function rsaCipher(text, key, encrypt) {
        // Simplified demonstration - real RSA requires much more complex implementation
        return "RSA requires proper key generation and large number support (not implemented in this demo)";
    }
    
    // Hash Functions
    async function md5Hash(text) {
        // Note: In a real implementation, you would use a library or Web Crypto API
        return "MD5 requires a proper hashing library (not implemented in this demo)";
    }
    
    async function sha1Hash(text) {
        // Note: In a real implementation, you would use a library or Web Crypto API
        return "SHA-1 requires a proper hashing library (not implemented in this demo)";
    }
    
    async function sha256Hash(text) {
        // Note: In a real implementation, you would use a library or Web Crypto API
        return "SHA-256 requires a proper hashing library (not implemented in this demo)";
    }
});