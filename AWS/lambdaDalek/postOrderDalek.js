import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  
    console.log(JSON.stringify(event.body))

    const {orderID, price, items, userID} = event;
    
    console.log(sku)
    
    const command = new PutCommand({
        TableName: "sensetwomeOrderdalek",
        Item: {
        orderID,
        items,
        price,
        userID
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