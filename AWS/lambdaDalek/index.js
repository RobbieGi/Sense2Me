import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

///cognito aws package

export const handler = async(event) => {
    // TODO implement

    const client = new DynamoDBClient({region:"eu-west-1"})
    const dbDocClient = DynamoDBDocumentClient.from(client)

    const getParams = {TableName: "sensetwomedalek", Key: {sku: "AnxietyFidgetBracelet_2023-07-03"}}

    const data = await dbDocClient.send(new GetCommand(getParams))

    const response = {
        statusCode: 200,
        body: JSON.stringify(data),
    };
    return response;
};