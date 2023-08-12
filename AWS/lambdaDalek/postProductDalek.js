import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

    const {sku, description, image_url, inventory_count, name, price} = JSON.stringify(event.body)
    const command = new PutCommand({
        TableName: "sensetwomedalek",
        Item: {
        sku,
        description,
        image_url,
        inventory_count,
        name,
        price
        },
  });

  const response = await docClient.send(command);
  console.log(response);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Replace with the desired allowed origin
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS", // Adjust based on the allowed HTTP methods
    },
    body: JSON.stringify(response),
  };
};