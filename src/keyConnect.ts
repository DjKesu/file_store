import { KeyInfo, Client, Identity } from "@textile/hub";

const keyinfo: KeyInfo = {
    key: "INSECURE API KEY",
};

async function authorize(keyinfo: KeyInfo, Identity: Identity){
    const client = await Client.withKeyInfo(keyinfo);
    await client.getToken(Identity);
    console.log(client);
}