/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const dbHelper = require('./helpers/dbHelper');
const dbProduct = require('./helpers/dbProduct');
const GENERAL_REPROMPT = "What would you like to do?";
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

const InProgressAddMovieIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AddMovieIntent' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  }
}

const AddMovieIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AddMovieIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const movieName = slots.MovieName.value;
    return dbHelper.addMovie(movieName, userID)
      .then((data) => {
        const speechText = `You have added movie ${movieName}. You can say add to add another one or remove to remove movie`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while saving movie", err);
        const speechText = "we cannot save your movie right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};

const InProgressAddProductIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AddProductIntent' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  }
}

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

const GetMoviesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetMoviesIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    return dbHelper.getMovies(userID)
      .then((data) => {
        var speechText = "Your movies are "
        if (data.length == 0) {
          speechText = "You do not have any favourite movie yet, add movie by saving add moviename "
        } else {
          speechText += data.map(e => e.movieTitle).join(", ")
        }
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        const speechText = "we cannot get your movie right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  }
};

const InProgressRemoveMovieIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'RemoveMovieIntent' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  }
};

const RemoveMovieIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RemoveMovieIntent';
  }, 
  handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const userID = handlerInput.requestEnvelope.context.System.user.userId; 
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const movieName = slots.MovieName.value;
    return dbHelper.removeMovie(movieName, userID)
      .then((data) => {
        const speechText = `You have removed movie with name ${movieName}, you can add another one by saying add`
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        const speechText = `You do not have movie with name ${movieName}, you can add it by saying add`
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
  }
};

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
          const speechText = "Softwidget, Inc., is an American multinational company established in 2017 based in Dallas, Texas, that focuses in e-commerce, cloud computing, and artificial intelligence with a total of 23000 employess world wide. Sofwidget is the second largest e-commerce marketplace and cloud computing platform in the world as measured by revenue and market capitalization with a technology spend of 20 millib and with revenue 50 billion."
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
    const speechText = "your SWGen2dx Order has been placed "
    return responseBuilder
      .speak(speechText)
      .reprompt(GENERAL_REPROMPT)
      .getResponse();
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
    const speechText = "Your SWGen2dx Order has been Canceled"
    return responseBuilder
      .speak(speechText)
      .reprompt(GENERAL_REPROMPT)
      .getResponse();
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
    const speechText = "your SWGen2dx is on it's way. it will arrive on April 7th 2019"
    return responseBuilder
      .speak(speechText)
      .reprompt(GENERAL_REPROMPT)
      .getResponse();
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
    InProgressAddMovieIntentHandler,
    AddMovieIntentHandler,
    AddProductIntentHandler,
    GetMoviesIntentHandler,
    InProgressRemoveMovieIntentHandler,
    RemoveMovieIntentHandler,
    GetSoftWidgetIntentHandler,
    GetProductInfoIntentHandler,
    GetSoftWidgetCIOIntentHandler,
    GetSoftWidgetCEOIntentHandler,
    PostSoftWidgetOrderIntentHandler,
    PutSoftWidgetOrderCancelIntentHandler,
    PutSoftWidgetOrderStatusIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
