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
    filename: String
    gsRef: String
    comments: [Comment]
  }

  # Comment object
  type Comment {
    id: ID!
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
    getFilesForPatient(id: ID!): [File]
  }
`;
// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
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
        getFilesForPatient: async (_, { id }) => {
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
                console.log(error);
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
