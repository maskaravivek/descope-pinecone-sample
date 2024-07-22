# Pinecone sample app

In this example, we'll build a full-stack application that uses Retrieval Augmented Generation (RAG) powered by [Pinecone](https://pinecone.io) to deliver accurate and contextually relevant responses in a chatbot.

## Running the app

### Install dependencies

To run the app, first install the NPM dependencies using `yarn`

```
yarn install
```

### Set environment variables

Copy `.env.example` to `.env` and fill in the values for the environment variables. The app needs the following environment variables to run:

- `OPENAI_API_KEY`: Replace it with your [OpenAI API key](https://platform.openai.com/api-keys)
- `PINECONE_API_KEY`: Replace it with your [Pinecone API key](https://docs.pinecone.io/guides/get-started/quickstart#2-get-your-api-key)


Use the Pinecone dashboard to [create a new serverless index](https://docs.pinecone.io/guides/indexes/create-an-index) and enter its details in the `.env` file

- `PINECONE_CLOUD`: Replace it with the URL of your [Pinecone index](https://docs.pinecone.io/guides/indexes/understanding-indexes#serverless-indexes).
- `PINECONE_INDEX`: Replace it with the name of the index that you created. 
- `PINECONE_REGION`: Replace it with region you chose while creating the index.

### Run the app

Finally, run the app using the following command:

```
yarn dev
```