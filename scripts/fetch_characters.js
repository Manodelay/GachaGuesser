const fs = require('fs');
const path = require('path');

// URLs
const HSR_CHAR_URL = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json';
const HSR_ICON_BASE = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/';
const GENSHIN_REPO_API = 'https://api.github.com/repos/MadeBaruna/paimon-moe/contents/static/images/characters';
const GENSHIN_IMG_BASE = 'https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/characters/';

async function fetchHSRCharacters() {
    try {
        const response = await fetch(HSR_CHAR_URL);
        const data = await response.json();
        const characters = [];

        for (const [id, char] of Object.entries(data)) {
            if (char.name && char.icon && !char.name.includes('{')) {
                characters.push({
                    id: `hsr_${id}`,
                    name: char.name,
                    imageUrl: `${HSR_ICON_BASE}${char.icon}`,
                    origin: 'Honkai: Star Rail'
                });
            }
        }
        return characters;
    } catch (error) {
        console.error('Error fetching HSR characters:', error);
        return [];
    }
}

function formatName(filename) {
    // remove extension
    const namePart = filename.replace(/\.[^/.]+$/, "");
    // replace _ and - with space
    const withSpaces = namePart.replace(/[_-]/g, ' ');
    // capitalize words
    return withSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

async function fetchGenshinCharacters() {
    try {
        const response = await fetch(GENSHIN_REPO_API);
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }
        const files = await response.json();
        const characters = [];

        for (const file of files) {
            if (file.name.endsWith('.png')) {
                // Exclude traveler elements if they are separate images like 'traveler_anemo.png'
                // Actually, let's keep them or maybe just 'Traveler'?
                // Paimon.moe has 'traveler_anemo.png', 'traveler_geo.png' etc.
                // Let's include them as variations or just 'Traveler (Anemo)'

                const name = formatName(file.name);
                characters.push({
                    id: `gi_${file.name}`, // Use filename as ID to ensure uniqueness
                    name: name,
                    imageUrl: `${GENSHIN_IMG_BASE}${file.name}`,
                    origin: 'Genshin Impact'
                });
            }
        }
        return characters;
    } catch (error) {
        console.error('Error fetching Genshin characters:', error);
        return [];
    }
}

async function main() {
    console.log('Fetching HSR characters...');
    const hsrChars = await fetchHSRCharacters();
    console.log(`Found ${hsrChars.length} HSR characters.`);

    console.log('Fetching Genshin characters...');
    const genshinChars = await fetchGenshinCharacters();
    console.log(`Found ${genshinChars.length} Genshin characters.`);

    const allCharacters = [...hsrChars, ...genshinChars];

    const fileContent = `export const characters = ${JSON.stringify(allCharacters, null, 2)};`;

    const outputPath = path.join(__dirname, '../src/characters.js');
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Updated characters.js with ${allCharacters.length} characters.`);
}

main();
