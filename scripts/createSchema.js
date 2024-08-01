import DescopeClient from '@descope/node-sdk';
import fs from 'fs';

const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;
const descopeClient = DescopeClient({
    projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
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

await createSchema()