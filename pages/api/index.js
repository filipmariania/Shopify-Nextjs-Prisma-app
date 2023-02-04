// If you have the recommended extension installed, create a new page and type `createapi` to generate api endpoint boilerplate

//TEMP

import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: true,
      });
      const activeWebhooks = await client.query({
        data: `{
      webhookSubscriptions(first: 25) {
        edges {
          node {
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
        }
      }
    }`,
      });
      return res.status(200).send(activeWebhooks);
    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ text: "Bad request" });
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(handler);
