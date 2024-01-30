# Patient File Manager 
This is a project assignment completed for Sentry Health by Alanna Phan. 

The tech stack requirements for this project were all completely brand new to me but although it was challenging, it was also very fun and rewarding to learn! 

I was able to complete the backend server using Apollo Server, GraphQL, Express, and Firebase. I could not finish the frontend in time but I hope to continue working on this project on my own and fully flesh everything out! 

## Start by installing the dependencies:
### frontend
```
cd frontend
.
npm install
.
yarn install
```
### backend
```
cd backend
.
npm install
.
yarn install
```
## Backend Setup
This is a lot of steps involved because of Firebase but bare with me while I try to explain! 
1. We need to set up a Firebase Console for you
You can use this to follow along: https://firebase.google.com/docs/admin/setup !
Visit this link: [Firebase console](https://console.firebase.google.com/) to set up a new console. Sign up and create a new project.

2. Once you have your project created, click on the settings gear:
``` Project settings > Service Accounts > Generate a new Private Key```

3. Save the JSON file that you get from generating a key. Make sure to name the file 
``` service-account.json``` 
and save it directly into the backend folder (fullstack/backend). It should automatically be hidden by the .gitignore.

Now the index.ts file will automatically have your Firebase credentials!

You can now run the Apollo Server by entering the following command in the backend folder:
``` npm start ```

Once it runs, you can access the **Apollo Server GraphQL Playground** via http://localhost:4000/ and play with the queries and mutations!

The next steps are very tedious but if you'd like to play with the data, you'll need to create a **Firestore database** on Firebase. 

On the main page of your project from [Firebase console](https://console.firebase.google.com/), click on:
``` Build > Firestore Database > Create Database > set your location > Start in test mode```
**and *voila!* Database created.**

All the credentials are the same so you don't need to worry about adding more. However, now you're going to need to manually seed the mock data into the database. 
1. Click "**+ Start collection**"
2. Label the Collection ID as **"patients"**
3. You are forced to create a document within the collection, give it the ID **"12345"**
4. Add the fields **"id", "dob" and "name"** to the document, they must all be **String type**. You can be as creative as you want for the input.  Please see the image below for an example of what you should see.

![Firestore Database](https://github.com/alannaphan/patient-file-manager/blob/feature/frontend-setup/docs/firestore.png?raw=true)

Now that we have some patient data in our database, we can get to the fun part! 
We'll be using **mutations** to add files to our newly created patient! 

1. Let's head back to the **Apollo Server Playground** at [http://localhost:4000/](http://localhost:4000/)

2. Make sure you have the **explorer** tab selected on the left toolbar. 

3. From the left panel, under **Root Types**, click the (+) beside **mutation.** You should see it populate text under the middle panel, **Operation.**

4. Click the (+) beside **addFile(...)**. It will populate more text with arguments. 

5. In the bottom middle panel under **Variables**, you are prompted to fill in the arguments. Replace all the nulls with *String text* and make sure **patientId** is the same as your patient's. 
**See the example below:**
```
{
"filename":  "john_lab.pdf",
"gsRef":  "you_can_type_anything_here_for_now",
"patientId":  "12345"
}
```
6. In the left panel under **Fields**, click the (+) for **id, gsRef, and filename** to see these fields return.

7. **Finally,** click the blue **Mutation** play button and watch the magic in the right response panel!

Now you've successfully added a file to your patient in the database! Go ahead and check it out in your **Firestore Database**, it will show up as a File collection. 

You can go ahead and create comments for the file using the **addComment(...)** mutation now, just make sure to copy your **newly created file's ID**, you will need it as an argument for the mutation.

After that's done, you can use the **Query** type to query patient data, which has files and comments nested within it. You would only need to provide the **patient ID** as a parameter for some of the queries.
![Example of Query Results](https://github.com/alannaphan/patient-file-manager/blob/feature/frontend-setup/docs/apollo.png?raw=true)

That's it for the backend for now! I planned to use **Firebase Storage** for uploading the actual patient files, but I wanted to implement the upload through the frontend client.

## Frontend Setup
Much simpler than the backend setup I promise!

Make sure your backend server is still running on [http://localhost:4000/](http://localhost:4000/)

In another terminal, make sure you're in the frontend folder and run the following command:
```
npm run dev
```
Now everything should be up and running on http://localhost:3000/ !

You'll be able to see your own patient information and file info populated on the main page. That is about as far as I got, but look forward to more implementations in the future! 

### See below for screenshots and more information on my planning!
![Landing page with patient information, pulled from database](https://github.com/alannaphan/patient-file-manager/blob/feature/frontend-setup/docs/patient_list.png?raw=true)

![Add File Page, unfinished](https://github.com/alannaphan/patient-file-manager/blob/feature/frontend-setup/docs/add_file.png?raw=true)

![Detailed File Page, unfinished](https://github.com/alannaphan/patient-file-manager/blob/feature/frontend-setup/docs/file_page.png?raw=true)
### Thank you for reading and checking out my project!

# Original Project README instructions below

## Quick Start

Please fork this repository and then email the final github repository url to dhaval@sentryhealth.ca when the assignment is completed.

Feel free to interpret the instructions in any way you want. They are intentionally left open to allow for freedom in how the assignment is completed. Looking forward to seeing what creative solutions are submitted.

## Patient File Manager Assignment:

As a clinic assistant, I aim to facilitate the efficient management of patient files, allowing doctors to seamlessly reference files and associated comments during appointments.

## Tech Stack:

1. **Backend:**
   - GraphQL API utilizing Apollo Server on an Express server.
   - Integration with Google Firebase.

2. **Client:**
   - VueJS.
   - Nuxt

## Supplementary documentation:

1. https://firebase.google.com/docs/admin/setup
2. https://www.apollographql.com/docs/apollo-server/getting-started/
3. https://expressjs.com/en/starter/hello-world.html
4. https://vuejs.org/guide/quick-start
5. https://nuxt.com/docs/getting-started/installation


## Required Features:

### File Upload:
1. **Assistant Functionality:**
   - Enable assistants to upload files on behalf of patients.

### Comment Management:
1. **Assistant Capability:**
   - Allow assistants to create, read, or delete comments on patient files.
   - Allow assistants to view comments in chronological order.
2. **Doctor Capability:**
   - Enable doctors to perform similar actions on patient files' comments.

### Patient Management:
1. **Unique Identification:**
   - Should be able to uniquely determine the patient of a file.

## Optional Requirements:

### Authentication/Authorization:
1. **Access Control:**
   - Consider implementing authentication and authorization mechanisms to regulate access and enhance data security.

### Auditing:
1. **User Tracking:**
   - Provide the ability to track users who have viewed patient files.

### Automated Testing:
1. **Reliability Assurance:**
   - Implement automated testing procedures to guarantee the reliability and correctness of file management and comment features.

### Differentiating Features:
1. **Innovative Functionality:**
   - Introduce any additional features that you believe would distinguish our Patient File Manager.

*Note: The optional features aim to enhance security, traceability, and reliability in the system, while the call for differentiating features encourages creativity and innovation.*
