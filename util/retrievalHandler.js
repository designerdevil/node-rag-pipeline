import { FaissStore } from "@langchain/community/vectorstores/faiss";
import embeddings from "./embeddings.js";
import webSearch from "./web-search.js";

const retrieverHandler = async (query, fromWeb=false) => {
	const vectorStore = await FaissStore.load(`./embeds`, embeddings);
	const records = await vectorStore.similaritySearch(query);

	const infoFromWeb = fromWeb ? await webSearch(query) : [];
	
	const context = [...records.map((item) => item.pageContent), JSON.stringify(infoFromWeb)];
	return context
}

export default retrieverHandler;