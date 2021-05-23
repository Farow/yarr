'use strict';

const ReadingTime = (function () {
	function calculate(input) {
		const sentences = input.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 0);
		let totalSentences = sentences.length;
		let totalWords = 0;
		let totalSyllables = 0;

		for (const sentence of sentences) {
			const words = sentence.split(/[^\p{Letter}]/u).filter(s => s.length > 0);
			totalWords += words.length;

			for (const word of words) {
				const wordSyllables = syllables(word);
				totalSyllables += wordSyllables.length;
			}
		}

		if (totalSyllables == 0) {
			return 'n/a';
		}

		/* https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_test */
		const difficulty = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);

		/* In minutes. Default value is somewhat hardcoded and increases based on difficulty of the text. */
		let readingTime = totalSyllables / 500;

		/* Anything below 60 is difficult, increase the time in those cases. */
		if (difficulty < 60) {
			/* Double the reading time at a difficulty of 0. */
			const multiplier = (60 - difficulty) / 100 * 1.66;
			readingTime *= 1 + multiplier;
		}

		readingTime = Math.ceil(readingTime);

		/* Add less than symbol for short feeds. */
		if (readingTime < 6) {
			const plural = readingTime == 1 ? '' : 's';
			return `< ${ readingTime } minute${ plural }`;
		}

		return `${ readingTime } minutes`;
	}

	function calculateHtml(input) {
		const div = document.createElement('div');
		div.innerHTML = input;
		return calculate(div.textContent);
	}

	return {
		calculate: calculate,
		calculateHtml: calculateHtml,
	};
})();
