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


module.exports = new dbProduct();