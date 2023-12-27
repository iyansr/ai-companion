import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone({
      apiKey: String(process.env.PINECONE_API_KEY),
      environment: String(process.env.PINECONE_ENV),
    });
  }

  public async vectorSearch(recentChatHistory: string, companionFileName: string) {
    const pinecone = <Pinecone>this.vectorDBClient;

    const pineconeIndex = pinecone.Index(String(process.env.PINECONE_INDEX));

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: String(process.env.OPENAI_API_KEY) }),
      { pineconeIndex }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
      .catch((err) => {
        console.log("Failed to get vector search: ", err);
      });

    return similarDocs;
  }

  public static async getInstance() {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }

    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey) {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    console.log({ resultBefore: result });
    result = result.slice(-30).reverse();
    console.log({ resultAfter: result });
    const recentChats = result.reverse().join("\n");
    console.log({ recentChats });

    return recentChats;
  }

  public async seedChatHistory(seedContent: String, delimiter: string = "\n", companionKey: CompanionKey) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
