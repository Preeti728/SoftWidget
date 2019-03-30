# Alexa Soft Widget!

Hi! This is an application that help you place orders using **Alexa**. 

# Purpose
This application is developed to help Soft Widget Inc. in selling their SWGen2dx product using Amazon Alexa, on a **echo dot** device.

# Technical Stack
- Alexa Skill
- AWS Lambda
- DynamoDB

# Instructions 
###### You can follow these steps to run the application on your machine:
1. Get your AWS-IAM credentials from [here](https://developer.amazon.com/docs/smapi/manage-credentials-with-ask-cli.html#create-aws-credentials)
2. Set up ask-cli ([official setup guide](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html#video-overview))
3. Run ask-init command and enter your AWS-IAM secret key to link the cli to your Alexa developer account
4. Clone the github repo
	`git clone https://github.com/Preeti728/SoftWidget`
5. Run ask deploy command from the cloned repository - 
	`ask deploy`
	This will deploy the Skill, DatabaseModels and Lambda function. All in one 	command, isn't it cool.
6. Go to Alexa Skill page, login using your account.
7. You should see the newly created skill, open it to go to Skill Console
8. Test the skill by speaking to Alexa, to invoke say - 
> soft widget
