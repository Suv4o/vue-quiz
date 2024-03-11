import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const url = randomDocumentationUrl();
    const loader = new CheerioWebBaseLoader(url, {
        selector: "#app,#__nuxt",
    });
    const [content] = await loader.load();
    const text = `${content.pageContent} \n Source Url: \n ${content.metadata.source}`;

    const modelName = "gpt-4";
    const openAIApiKey = config.openAIApiKey;

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        isVueOrNuxtQuestion:
            "Is this a Vue or Nuxt specific question? If the Source URL includes 'vue', then it's Vue. If it includes 'nuxt', then it's Nuxt. Please respond only with 'Vue' or 'Nuxt'.",
        question: "quiz question",
        fistAnswer: "first quiz answer",
        secondAnswer: "second quiz answer",
        thirdAnswer: "third quiz answer",
        correctAnswer: "correct quiz answer",
    });

    const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(
            "Generate quiz questions along with three answer options from a given text. Only one of these answers is correct. \n{format_instructions}\n{content}"
        ),
        new OpenAI({ temperature: 0, modelName, openAIApiKey }),
        parser,
    ]);

    parser.getFormatInstructions();

    const response = await chain.invoke({
        content: text,
        format_instructions: parser.getFormatInstructions(),
    });

    return response;
});
