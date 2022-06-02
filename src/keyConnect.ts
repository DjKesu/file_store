import { KeyInfo, Client, Identity, PrivateKey, Buckets, Users, UserAuth, createUserAuth } from "@textile/hub";

const keyinfo: KeyInfo = {
    key: "INSECURE API KEY",
};

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

// function to authorize a client
async function authorize(keyinfo: KeyInfo, Identity: Identity){
    const client = await Client.withKeyInfo(keyinfo);
    await client.getToken(Identity);
    console.log(client);
}

// function to create key pair
async function createKeyPair(){
    //Creating a string of the new created identity
    let identity:string = await (PrivateKey.fromRandom()).toString();

    console.log(identity);

    //This is just a way of converting the string back to identity
    const restoredIdentity = await PrivateKey.fromString(identity);

    console.log(restoredIdentity);
    // @TODO: Create a new token
    // const API_Token = await .getToken(restoredIdentity);

    /** Add the string copy to the cache */
    localStorage.setItem("user-private-identity", identity);
    /** Return the random identity */
    return restoredIdentity;
} 

const getIdentity = async (): Promise<PrivateKey> => {
    /** Restore any cached user identity first */
    const cached = localStorage.getItem("user-private-identity");
    if (cached !== null) {
        /** Convert the cached identity string to a PrivateKey and return */
        return PrivateKey.fromString(cached);
    }
    else {
        /** Create a new identity and cache it */
        const identity = await createKeyPair();
        console.log(identity);
        return identity;
    }
};

// function to sign challenges
async function sign(identity: PrivateKey) {
    const challenge = Buffer.from("Sign this string");

    const credentials = identity.sign(challenge);

    return credentials;
}

//function get or create a bucket
const getSetBucket = async (auth: UserAuth, bucketName: string) => {
    const buckets = await Buckets.withUserAuth(auth);
    const { root, threadID } = await buckets.getOrCreate(bucketName);
    const bucketKey = root?.key;
    return { buckets, bucketKey };
}

// function to get list of all user threads
async function getThreads(auth: UserAuth) {
    const api = Users.withUserAuth(auth);
    const list = api.listThreads();
    console.log(list);
    return list;
}

// function to create buckets
const bucketSetup = async (key: KeyInfo, identity: Identity) => {
    // Use the insecure key to set up the buckets client
    const buckets = await Buckets.withKeyInfo(key);
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity);

    const result = await buckets.open("io.textile.dropzone");
    if (!result.root) {
        throw new Error("Failed to open bucket");
    }
    return {
        buckets: buckets,
        bucketKey: result.root.key,
    };
};


const openEncrypted = async (buckets: Buckets) => {
    const isEncrypted = true;
    const result = await buckets.open(
        "io.textile.encrypted",
        undefined,
        isEncrypted
    );
    if (!result.root) {
        throw new Error("Failed to open bucket");
    }
    return {
        buckets: buckets,
        bucketKey: result.root.key,
    };
};

export { authorize, getIdentity, sign, openEncrypted };