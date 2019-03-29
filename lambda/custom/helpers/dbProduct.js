var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
const tableName = "products";

var dbProduct = function () { };
var docClient = new AWS.DynamoDB.DocumentClient();

dbProduct.prototype.addProduct = (product, category, userID) => {
    // , description, price
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: {
              'productName' : product,
              'userId': userID,
              'category': category
            }
            // 'description': description,
            //   'price': price
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert");
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbProduct.prototype.getProducts = (userID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#userID = :user_id",
            ExpressionAttributeNames: {
                "#userID": "userId"
            },
            ExpressionAttributeValues: {
                ":user_id": userID
            }
        }
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            } 
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
            
        })
    });
}

dbProduct.prototype.getProductDetail = (userID, productName) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#userID = :user_id and #productName = :productName",
            ExpressionAttributeNames: {
                "#userID": "userId",
                "#productName": "productName"
            },
            ExpressionAttributeValues: {
                ":user_id": userID,
                ":productName": productName
            }
        }
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            } 
            console.log("GetItem by Name succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
            
        })
    });
}


module.exports = new dbProduct();