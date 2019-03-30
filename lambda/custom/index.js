/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const dbProduct = require('./helpers/dbProduct');
const dbOrder = require('./helpers/dbOrder');
const GENERAL_REPROMPT = "What would you like to do?";
const maxQuantity = 5;
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Softwidget, Inc. What would you like to do next? You can say Tell me about Soft Widget,Tell me about Soft Widget CIO, Tell me about Soft Widget CEO,tell about SWGen two dx,Place an order,cancel order or order status';
    const repromptText = 'What would you like to do? You can say HELP to get available options';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const AddProductIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AddProductIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const productName = slots.ProductName.value;
    const productCategory = slots.ProductCategory.value;
    return dbProduct.addProduct(productName, productCategory, userID)
      .then((data) => {
        const speechText = `You have added a product ${productName}. You can say add to add another one or remove to remove a product`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while saving product", err);
        const speechText = "we cannot save your product right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};


const GetProductDetailIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetProductDetailIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const productName = slots.ProductName.value;

    return dbProduct.getProductDetail(userID, productName)
      .then((data) => {
        var speechText = "Here are the details for "
        if (data.length == 0) {
          speechText = "We could not find that product"
        } else {
          data.map(product => {
            speechText += product.productName;
            speechText += ". ";
            speechText += product.description;
            speechText += ". ";
            speechText += "It costs " + product.price + " dollars. ";
            speechText += "You can find it under " + product.category + " category. ";
            speechText += "We currently have " + product.quantity + " pieces of this product. ";
          });
        }
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log(err);
        const speechText = "Some error occcured in fetching that product. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
}

const GetProductsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetProductsIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    return dbProduct.getProducts(userID)
      .then((data) => {
        var speechText = "We have the following products - "
        if (data.length == 0) {
          speechText = "You do not have any favourite product yet, add product by saving add product "
        } else {
          speechText += data.map(e => e.productName).join(", ")
        }
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        const speechText = "we cannot get your product right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

/* SoftWidget Start */
//  GetSoftWidgetIntent
const GetSoftWidgetIntentHandler = {
      canHandle(handlerInput) {
          return handlerInput.requestEnvelope.request.type === 'IntentRequest'
              && handlerInput.requestEnvelope.request.intent.name === 'GetSoftWidgetIntent';
      },
      async handle(handlerInput) {
          const { responseBuilder } = handlerInput;
          const speechText = "Softwidget, Inc., is an American multinational company established in 2017 based in Dallas, Texas, that focuses in e-commerce, cloud computing, and artificial intelligence with a total of 23000 employess world wide. Softwidget is the second largest e-commerce marketplace and cloud computing platform in the world as measured by revenue and market capitalization with a technology spend of 20 million and with revenue 50 billion."
          return responseBuilder
              .speak(speechText)
              .reprompt(GENERAL_REPROMPT)
              .getResponse();
      }
  };

// Get Product Info 
const GetProductInfoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetProductInfoIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const speechText = " The SWGen2dx (conveniently the product SKU) is a revolutionary house-hold product everyone wants. It features a sleek casing with intuitive features. Features include: Rock-solid audio engagement Silver-bullet touch response system.  Long lasting rechargeable battery "
    return responseBuilder
      .speak(speechText)
      .reprompt(GENERAL_REPROMPT)
      .getResponse();
  }
};

// SoftWidget CIO 
const GetSoftWidgetCIOIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetSoftWidgetCIOIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const speechText = "Name: Sean Connery. Title: CIO. Persona: Sean is a demolition expert and master of espionage from the CIA. He jumped at the opportunity to work with Sally at SoftWidget as her CIO. Sean is in charge of revolutionizing SoftWidget platforms and maintaining IT operations."
    return responseBuilder
      .speak(speechText)
      .reprompt(GENERAL_REPROMPT)
      .getResponse();
  }
};

// SoftWidget CIO 
const GetSoftWidgetCEOIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetSoftWidgetCEOIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const speechText = "Name: Sally Fields. Title: CEO. Persona: Sally started SoftWidget in 2017 and has quickly grown the company through the savvy use of consumer marketing which has caused SoftWidget to go viral. She has a strong background in product development and process engineering. Her vision for SoftWidget is to be a globally recognized widget provider direct to consumer."
    return responseBuilder
      .speak(speechText)
      .reprompt(GENERAL_REPROMPT)
      .getResponse();
  }
};

// Place Order 
const PostSoftWidgetOrderIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PostSoftWidgetOrderIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const quantity = slots.Quantity.value;
    const address = slots.Address.value;
    const number = Math.floor(Math.random() * 10000).toString();
    const deliveryDate = new Date(2019, 03, Math.random()*10 + 1).toDateString();
    // Check for quantity
    if( quantity > maxQuantity) {
      return responseBuilder
      .speak(`You can only order upto ${maxQuantity} units`)
      .getResponse();
    }
    return dbOrder.addOrder(number, quantity, address, userID, deliveryDate)
      .then((data) => {
        const speechText = `your SWGen2dx Order has been placed. The order number is ${number}`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while saving product", err);
        const speechText = "we cannot save your product right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
};

// Cancel  order 
const PutSoftWidgetOrderCancelIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PostSoftWidgetOrderCancelIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const number = slots.Number.value;
    let speechText = ``;
    return dbOrder.cancelOrder(number, userID)
      .then((data) => {
        speechText = `Your SWGen2dx Order ${number} has been cancelled`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while cancelling order", err);
        const speechText = "we cannot cancel your order right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
};

// Order Status 
const PutSoftWidgetOrderStatusIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PutSoftWidgetOrderStatusIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const number = slots.Number.value;
    let speechText = `your SWGen2dx is on it's way.`;
    return dbOrder.getOrder(number, userID)
      .then((data) => {
        data.map(order => {
          if(order.status != 'cancelled') {
            speechText += " You have ordered " + order.quantity + " pieces.";
            speechText += " The order status is " + order.status;
            speechText += " . It will arrive on "+ order.deliveryDate;
          }
          else{
            speechText = "Sorry, this order has been cancelled."
          }
        });
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while getting order", err);
        const speechText = "we cannot track your order right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
};


// Order List
const GetSoftWidgetOrderListIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetSoftWidgetOrderListIntent';
  },
  async handle(handlerInput) {
    // var orderList = [];
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    let speechText = `Please check your order list: \n`;
    return dbOrder.getAllOrders(userID)
      .then((data) => {
        data.map(order => {
          if(order != null) {
            speechText += " Order number "
            speechText += order.number;
            speechText += `. You ordered ${order.quantity} pieces for ${order.address}`;
            speechText += `. The order status is ${order.status}`;
            if(order.status != "cancelled"){
              speechText += ` . It will arrive on ${order.deliveryDate}`;
            }
          }
          else{
            speechText = "You have not placed any orders."
          }
        });
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while getting order", err);
        const speechText = "we cannot track your order right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
};

// Modify existing order 
const PutSoftWidgetOrderModifyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PutSoftWidgerOrderModifyIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const number = slots.Number.value;
    const address = slots.Address.value;
    const quantity = slots.Quantity.value;
    // Check for quantity
    if( quantity > maxQuantity) {
      return responseBuilder
      .speak(`You can only order upto ${maxQuantity} units`)
      .getResponse();
    }
    let speechText = ``;
    return dbOrder.modifyOrder(number, address, quantity, userID)
      .then((data) => {
        speechText = `Your SWGen2dx Order ${number} has been updated. `;
        speechText += ` New address is ${data['Attributes']['address']} with quantity ${data['Attributes']['quantity']}`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while modifying order", err);
        const speechText = "we cannot modify your order right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
};

/* END SoftWidget */

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};




const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AddProductIntentHandler,
    GetProductsIntentHandler,
    GetProductDetailIntentHandler,
    GetSoftWidgetIntentHandler,
    GetSoftWidgetOrderListIntentHandler,
    GetProductInfoIntentHandler,
    GetSoftWidgetCIOIntentHandler,
    GetSoftWidgetCEOIntentHandler,
    PostSoftWidgetOrderIntentHandler,
    PutSoftWidgetOrderCancelIntentHandler,
    PutSoftWidgetOrderModifyIntentHandler,
    PutSoftWidgetOrderStatusIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
