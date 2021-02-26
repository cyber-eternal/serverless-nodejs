# boilerplate_serverless_nodejs

Boilerplate for Serverless application architecture using runtime Node.js and AWS services 

```
npm install

npm install -g serverless
```

Local Development

```
serverless offline start

or 

sls offline start

or 

sls offline --port EACH_PORT --stage YOUR_STAGE

```


For eslint test run

```
npm run lint
```

For deploy to AWS

```
aws configure

or 

export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
export AWS_REGION=YOUR_REGION

```
And after 

```
serverless deploy

or 

sls deploy
```

Send GET request to 

URL: localhost:3000/test  

for testing your server
