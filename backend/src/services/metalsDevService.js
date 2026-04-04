import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fetchMock = async () => {
    const filePath = join(__dirname, '../mock/metalsDevSpot.json');
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
};

const fetchLive = async () => {
    const apiKey = process.env.METALS_DEV_API_KEY;
    const url = `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz&metals=gold,silver&change=true`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`metals.dev error: ${response.status}`);
    }
    return response.json();
};

export const fetchMetalsData = async () => {
    if (process.env.USE_MOCK_SPOT === 'true') {
        return fetchMock();
    }
    return fetchLive();
};
