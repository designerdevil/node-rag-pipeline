// In progress

import search from 'duck-duck-scrape';

const searchWebResults = async (query) => {
	const searchInternet = await search(query, {
		safeSearch: SafeSearchType.STRICT
	});

	const searchResult = searchInternet.results[0]
	return searchResult;
};

export default searchWebResults;