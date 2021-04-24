# Ecommerce App Backend

#### Frontend Repository : [react-frontend-ecommerce](https://github.com/rishank-shah/react-frontend-ecommerce)

### Requirements for running project 
- [Node.js](https://nodejs.org/en/)
- [Cloudinary account](https://cloudinary.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) or [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register)
- [Firebase account](https://firebase.google.com/)

### Steps for running project
```bash
git clone https://github.com/rishank-shah/node-backend-ecommerce
cd node-backend-ecommerce
cp .env.example .env
```
##### Fill the .env file with correct credentials.

##### Firebase config
```bash
cd node-backend-ecommerce/config
cp firebase-service-account-key.example.json firebase-service-account-key.json
```
###### Fill ```firebase-service-account-key.json``` with the necessary credentials

##### Installing dependencies
```bash
npm i
```

##### Running server in DEV mode
```bash
npm run dev
```

#### If there are no errors API will be running on [localhost:8000](http://localhost:8000) (default)