import { FaissStore } from "@langchain/community/vectorstores/faiss";
import embeddings from "./embeddings.js";

const retrieverHandler = async (query, fromWeb=false) => {
	const vectorStore = await FaissStore.load(`./embeds`, embeddings);
	const records = await vectorStore.similaritySearch(query);
	
	const context = [...records.map((item) => item.pageContent)];
	return context
}

export default retrieverHandler;