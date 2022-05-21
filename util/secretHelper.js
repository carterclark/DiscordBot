/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const name = 'projects/my-project/secrets/my-secret/versions/5';
// const name = 'projects/my-project/secrets/my-secret/versions/latest';

// Imports the Secret Manager library
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Instantiates a client
const client = new SecretManagerServiceClient();

async function accessSecretVersion(secret) {
  const [version] = await client.accessSecretVersion({
    name: "projects/374953781280/secrets/" + secret + "/versions/latest",
  });

  // Extract the payload as a string.
  const payload = version.payload.data.toString();

  // WARNING: Do not print the secret in a production environment - this
  // snippet is showing how to access the secret material.
  //   console.log(`Payload: ${payload}`);
  return payload;
}

module.exports = { accessSecretVersion };
