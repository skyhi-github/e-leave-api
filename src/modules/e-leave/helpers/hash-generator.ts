export function generateRandomString(length: number = 7): string {
    const chars = '2B3X0AC1EDYZ98765';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
