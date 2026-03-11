const forbiddenPatterns = [
    {
        type: "plating_or_base_metal",
        severity: "hard_reject",
        words: [
            "plated",
            "clad",
            "layered",
            "coated",
            "zinc",
            "alloy"
        ]
    },
    {
        type: "replica_copy",
        severity: "hard_reject",
        words: [
            "replica",
            "copy",
            "reproduction",
            "imitation",
            "tribute",
            "fantasy"
        ]
    },
    {
        type: "private_finish_modified_bullion",
        severity: "hard_reject",
        words: [
            "ruthenium",
            "gilded",
            "colorized",
            "coloured",
            "colored",
            "holographic",
            "antiqued",
            "enameled",
            "enamelled",
            "glow"
        ]
    },
    {
        type: "collector_proof_or_graded",
        severity: "coin_non_standard",
        words: [
            "proof",
            "reverse",
            "pf70",
            "pr70",
            "ms70",
            "ngc",
            "pcgs",
            "anacs",
            "dcam",
            "cameo",
            "slab"
        ]
    },
    {
        type: "bulk_or_non_unitary_sale",
        severity: "hard_reject",
        words: [
            "lot",
            "roll",
            "tube",
            "set",
            "monster",
            "coins",
            "x2",
            "x3",
            "x5",
            "x10"
        ]
    },
    {
        type: "packaging_or_marketing_accessories",
        severity: "coin_non_standard",
        words: [
            "coa",
            "certificate",
            "box",
            "case",
            "display",
            "capsule",
            "booklet",
            "folder"
        ]
    },
    {
        type: "non_coin_novelty",
        severity: "hard_reject",
        words: [
            "challenge",
            "souvenir",
            "token",
            "medallion",
            "medal",
            "novelty",
            "prop"
        ]
    },
    {
        type: "special_marks_or_privy",
        severity: "coin_non_standard",
        words: [
            "privy",
            "ram",
            "heart",
            "ufo",
            "grim",
            "armageddon"
        ]
    }
];

const parseCoinTitle = (title) => {
    const normalizedTitle = title.toLowerCase().replace(/[-_/]/g, ' ').replace(/(\d+)oz\b/g, '$1 oz').replace(/\s+/g, ' ').trim();
    const tokens = normalizedTitle.split(' ');

    let coin = null;
    if (tokens.includes('maple') && tokens.includes('leaf')) {
        coin = 'maple leaf';
    }

    let metal = null;
    if (tokens.includes('silver')) {
        metal = 'silver';
    }

    const ozIndex = tokens.indexOf('oz');

    let weight = null;
    if (ozIndex > 0) {
        const weightToken = tokens[ozIndex - 1];
        if (!isNaN(weightToken)) {
            weight = `${weightToken} oz`;
        }
    }

    let year = tokens.find(token => {
        const num = Number(token);
        return num >= 1900 && num <= 2100;
    }) || null;



    const detectedPatterns = forbiddenPatterns.map(pattern => {
        const matchedWords = pattern.words.filter(word => tokens.includes(word));
        return matchedWords.length > 0 ? {
            type: pattern.type,
            severity: pattern.severity,
            matchedWords
        } : null;
    }).filter(Boolean);

    const rejectedPatterns = detectedPatterns.filter(
        pattern => pattern.severity === "hard_reject"
    );

    const nonStandardPatterns = detectedPatterns.filter(
        pattern => pattern.severity === "coin_non_standard"
    );

    const rejectedWords = rejectedPatterns.flatMap(pattern => pattern.matchedWords);
    const nonStandardWords = nonStandardPatterns.flatMap(pattern => pattern.matchedWords);

    let status = "accepted_standard";

    if (rejectedPatterns.length > 0) {
        status = "rejected";
    } else if (nonStandardPatterns.length > 0) {
        status = "accepted_non_standard";
    }

    return {
        rawTitle: title,
        normalizedTitle,
        tokens,
        coin,
        metal,
        weight,
        year,
        status,
        rejected: status === "rejected",
        rejectedPatterns,
        rejectedWords,
        nonStandardPatterns,
        nonStandardWords
    }
}

module.exports = {
    parseCoinTitle
}