import admin from "firebase-admin";
import serviceAccount from "../service-account.json" assert { type: "json" };
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// Initialize Firebase with Firebase Admin SDK credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # Patient object
  type Patient {
    id: ID!
    name: String
    dob: String
    files: [File]
  }

  # File object
  type File {
    id: ID
    filename: String
    gsRef: String
    comments: [Comment]
    patientID: String
  }

  # Comment object
  type Comment {
    id: ID
    text: String
    author: String
    date: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "patients" query returns an array of zero or more Patients (defined above).
  
  type Query {
    # list all patients
    patients: [Patient]

    # get a single patient by ID
    patient(id: ID!): Patient

    # get all files for a patient
    filesByPatient(id: ID!): [File]
  }
  
# The "Mutation" type is special: it lists all of the available mutations that
# clients can execute, along with the return type for each. In this
# case, the "addFile" mutation returns a Patient (defined above).

type Mutation {
    # add a file to a patient
    addFile(filename: String!, gsRef: String!, patientID: String!): File

    # add a comment to a file
    addComment(text: String!, author: String!, date: String!, fileID: String!, patientID: String!): Comment

    # delete a comment from a file
    deleteComment(commentID: String!, fileID: String!, patientID: String!): Comment
}
`;
// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
    Mutation: {
        addFile: async (_, { filename, gsRef, patientID }) => {
            try {
                const filesCollectionRef = admin
                    .firestore()
                    .collection("patients")
                    .doc(patientID)
                    .collection("files");
                const newFileRef = await filesCollectionRef.add({
                    filename,
                    gsRef,
                    patientID,
                });
                const newFileId = newFileRef.id;
                await newFileRef.update({ id: newFileId });
                return newFileRef.get().then((file) => file.data());
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        },
        addComment: async (_, { text, author, date, fileID, patientID }) => {
            try {
                const commentCollectionRef = admin
                    .firestore()
                    .collection("patients")
                    .doc(patientID)
                    .collection("files")
                    .doc(fileID)
                    .collection("comments");
                const newCommentRef = await commentCollectionRef.add({
                    text,
                    author,
                    date,
                });
                const newCommentId = newCommentRef.id;
                await newCommentRef.update({ id: newCommentId });
                return newCommentRef.get().then((comment) => comment.data());
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        },
        deleteComment: async (_, { commentID, fileID, patientID }) => {
            try {
                const commentRef = admin
                    .firestore()
                    .collection("patients")
                    .doc(patientID)
                    .collection("files")
                    .doc(fileID)
                    .collection("comments")
                    .doc(commentID);
                await commentRef.delete();
                return console.log("Deleted comment!");
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        },
    },
    Query: {
        patients: async () => {
            const patients = await admin.firestore().collection("patients").get();
            const patientsList = patients.docs.map((patient) => patient.data());
            return patientsList;
        },
        patient: async (_, { id }) => {
            const patient = await admin
                .firestore()
                .collection("patients")
                .doc(id)
                .get();
            return patient.data();
        },
        filesByPatient: async (_, { id }) => {
            const files = await admin
                .firestore()
                .collection("patients")
                .doc(id)
                .collection("files")
                .get();
            const filesList = files.docs.map((file) => file.data());
            return filesList;
        },
    },
    Patient: {
        files: async (patient) => {
            try {
                const filesSnapshot = await admin
                    .firestore()
                    .collection("patients")
                    .doc(`${patient.id}`)
                    .collection("files")
                    .get();
                return filesSnapshot.docs.map((file) => file.data());
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        },
    },
    File: {
        comments: async (file) => {
            try {
                const commentsSnapshot = await admin
                    .firestore()
                    .collection("patients")
                    .doc(`${file.patientID}`)
                    .collection("files")
                    .doc(`${file.id}`)
                    .collection("comments")
                    .get();
                return commentsSnapshot.docs.map((comment) => comment.data());
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        },
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
