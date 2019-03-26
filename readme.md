# Alexa Soft Widget!

Hi! This is an application that help you place orders using **Alexa**. 


# Technical Stack
- Alexa Skill
- AWS Lambda
- DynamoDB

> This technical stack is still under revision
	
# Workflow
```mermaid
graph LR
A[User] -- Ask --> C((Alexa Skill))
C -- Tell --> A
C -- API Request --> E{AWS Lambda}
E -- API Response --> C
E -- API Request --> F(DynamoDB)
F -- API Response --> E

```