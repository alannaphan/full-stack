import admin from "firebase-admin";
import serviceAccount from './credentials/service-account.json' assert { type: 'json' };
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
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
    doctor: Doctor!
  }

  type Doctor {
    id: ID!
    name: String
    patients: [Patient]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "patients" query returns an array of zero or more Patients (defined above).
  
  type Query {
    patients: [Patient]
    doctors: [Doctor]
  }
`;
// const books = [
//   {
//     title: 'The Awakening',
//     author: 'Kate Chopin',
//   },
//   {
//     title: 'City of Glass',
//     author: 'Paul Auster',
//   },
// ];
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        patients: async () => {
            const db = admin.firestore();
            const patients = await db.collection('patients').get();
            const patientsList = patients.docs.map((patient) => patient.data());
            return patientsList;
        },
        doctors: async () => {
            const db = admin.firestore();
            const doctors = await db.collection('doctors').get();
            const doctorsList = doctors.docs.map((doctor) => doctor.data());
            return doctorsList;
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
