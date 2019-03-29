var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
const tableName = "orders";

var dbOrder = function () { };
var docClient = new AWS.DynamoDB.DocumentClient();

dbOrder.prototype.addOrder = (number, quantity, address, userID, deliveryDate) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: {
                'userId': userID,
                'number': number,
                'status': 'received',
                'quantity' : quantity,
                'address': address,
                'deliveryDate': deliveryDate
            }
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to insert into orders =>", JSON.stringify(err))
                return reject("Unable to insert");
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbOrder.prototype.getOrder = (number, userID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#userID = :user_id and #number = :number",
            ExpressionAttributeNames: {
                "#userID": "userId",
                "#number": "number"
            },
            ExpressionAttributeValues: {
                ":user_id": userID,
                ":number": number
            }
        }
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item order. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            } 
            console.log("GetItem order succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
            
        })
    });
}


module.exports = new dbOrder();