import DescopeClient from '@descope/node-sdk';
import fs from 'fs';

const managementKey = "K2jXxMeRCvn5JYah0ToyyS5eJPLCYcz0pkUfUWt9NfgTWv6EJHLtUtY3vDI22woGalxkcTL"
const descopeClient = DescopeClient({
    projectId: 'P2jWckKUbwgC4qyurDSiKZwGa7Cq',
    managementKey: managementKey
});

async function createSchema() {
    try {
        //  baseUrl="<URL>" // When initializing the Descope clientyou can also configure the baseUrl ex: https://auth.company.com  - this is useful when you utilize CNAME within your Descope project.

        const file = fs.readFileSync("schema.json", 'utf8'); // Read the file
        const schema = JSON.parse(file); // Parse the file into a schema object
        const upgrade = false; // Don't delete existing parts of the schema that are not specified in the inputted yaml file

        const response = await descopeClient.management.authz.saveSchema(schema, upgrade);

        console.log("Schema saved successfully: " + JSON.stringify(response));
    } catch (error) {
        // handle the error
        console.log("failed to initialize: " + error)
    }
}

async function checkRelationsForUser(userId) {
    try {
        const relations = await descopeClient.management.authz.targetsRelations([userId]);
        console.log("Relations for user: " + JSON.stringify(relations));
    }
    catch (error) {
        console.log("failed to get relations: " + error)
    }
}

await checkRelationsForUser("U2jXDRKI4ALDyPsNYts8HKTl2QeM")