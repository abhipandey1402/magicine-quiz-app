export function computeScore(answers: string[]) {
    let score = 0;

    for (const a of answers) {
        if (!a) continue; // skip unanswered

        // Randomly add 0 or 1
        score += Math.random() < 0.5 ? 0 : 1;
    }

    return score;
}


export function getRecommendation(score: number) {
    if (score >= 4) return "Advanced Track – build full-stack apps and mobile apps (React + Node + DB)";
    if (score >= 2) return "Intermediate Track – strengthen React, APIs and DB design";
    return "Foundations Track – focus on JavaScript fundamentals and core web concepts";
}
