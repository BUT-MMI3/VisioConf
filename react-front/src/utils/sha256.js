const sha256 = async (text) => {
    // Encode le texte en un Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Utilise l'API SubtleCrypto pour générer le hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertit le buffer en une chaîne hexadécimale
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default sha256;