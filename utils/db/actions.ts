import { config } from "dotenv";
config();

import { create } from "@web3-storage/w3up-client";
import { desc, eq } from "drizzle-orm";
import { ethers } from "ethers";
import * as Name from "w3name";
import WebpageStorageABI from "../WebpageStorage.json";
import { db } from "./dbConfig";
import { Deployments, Tokens, Users, Webpages } from "./schema";

let web3StorageClient: any;
let contract: ethers.Contract;

export async function initializeClients(userEmail: string) {
  web3StorageClient = await create();

  // Authenticate and select a space using the user's email
  await web3StorageClient.login(userEmail);
  const spaces = await web3StorageClient.spaces();
  if (spaces.length > 0) {
    await web3StorageClient.setCurrentSpace(spaces[0].did());
  } else {
    throw new Error("No spaces available. Please create a space first.");
  }

  const provider = new ethers.providers.JsonRpcProvider(
    "https://pre-rpc.bt.io/"
  );
  const signer = new ethers.Wallet(
    "2f34d72c40a47e574ed54bbd14723d7753e8cf53434a180f67ef2f73187ef811",
    provider
  );
  contract = new ethers.Contract(
    "0x4eEAEB9C96951Fc1BE43f34c42A002B58FB774Ff",
    WebpageStorageABI.abi,
    signer
  );
}

// Remove or comment out this line
// initializeClients().catch(console.error);

export async function getUserTokens(userId: number) {
  try {
    const tokens = await db
      .select()
      .from(Tokens)
      .where(eq(Tokens.userId, userId))
      .execute();
    return tokens[0];
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return null;
  }
}

export async function updateUserTokens(
  userId: number,
  balance: number,
  stakedAmount: number,
  rewardsEarned: number
) {
  try {
    const [updatedTokens] = await db
      .update(Tokens)
      .set({ balance, stakedAmount, rewardsEarned })
      .where(eq(Tokens.userId, userId))
      .returning()
      .execute();
    return updatedTokens;
  } catch (error) {
    console.error("Error updating user tokens:", error);
    return null;
  }
}

export async function createOrUpdateUser(address: string, email: string) {
  try {
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.address, address))
      .execute();

    const now = new Date();

    if (existingUser.length > 0) {
      const [updatedUser] = await db
        .update(Users)
        .set({
          email,
          updatedAt: now,
          lastLogin: now,
        })
        .where(eq(Users.address, address))
        .returning()
        .execute();
      return updatedUser;
    } else {
      const [newUser] = await db
        .insert(Users)
        .values({
          address,
          email,
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
        })
        .returning()
        .execute();

      // Initialize tokens for new user
      await db
        .insert(Tokens)
        .values({
          userId: newUser.id,
          balance: 0,
          stakedAmount: 0,
          rewardsEarned: 0,
        })
        .execute();

      return newUser;
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return null;
  }
}

export async function uploadToWeb3Storage(content: string, filename: string) {
  if (!web3StorageClient) {
    throw new Error("Web3Storage client not initialized");
  }
  const file = new File([content], filename, { type: "text/html" });
  const cid = await web3StorageClient.uploadFile(file);
  return cid.toString();
}

export async function storeWebpageOnChain(domain: string, content: string) {
  if (!contract) {
    throw new Error("Contract not initialized");
  }
  const cid = await uploadToWeb3Storage(content, "index.html");
  const tx = await contract.storeWebpage(domain, cid);
  await tx.wait();
  return { txHash: tx.hash, cid };
}

export async function createWebpage(
  userId: string | any,
  domain: string,
  content: string
) {
  const { txHash, cid } = await storeWebpageOnChain(domain, content);
  const deploymentUrl = `https://${cid}.ipfs.w3s.link/`;

  const [webpage] = await db
    .insert(Webpages)
    .values({
      userId: parseInt(userId),
      domain,
      cid,
    })
    .returning()
    .execute();

  await db
    .insert(Deployments)
    .values({
      userId: parseInt(userId),
      webpageId: webpage.id,
      transactionHash: txHash,
      deploymentUrl,
    })
    .execute();

  return { webpage, txHash, cid, deploymentUrl };
}

export async function getUserWebpages(userId: number | null) {
  if (userId === null) {
    return db
      .select()
      .from(Webpages)
      .leftJoin(Deployments, eq(Webpages.id, Deployments.webpageId))
      .orderBy(desc(Deployments.deployedAt))
      .execute();
  }
  return db
    .select()
    .from(Webpages)
    .where(eq(Webpages.userId, userId))
    .leftJoin(Deployments, eq(Webpages.id, Deployments.webpageId))
    .orderBy(desc(Deployments.deployedAt))
    .execute();
}

export async function getWebpageDeployments(webpageId: number) {
  return db
    .select()
    .from(Deployments)
    .where(eq(Deployments.webpageId, webpageId))
    .orderBy(desc(Deployments.deployedAt))
    .execute();
}

export async function createProposal(userId: number, description: string) {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.id, userId))
    .execute();
  if (user.length === 0) throw new Error("User not found");

  const tx = await contract.createProposal(description);
  await tx.wait();
  return tx.hash;
}

export async function voteOnProposal(
  userId: number,
  proposalId: number,
  support: boolean
) {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.id, userId))
    .execute();
  if (user.length === 0) throw new Error("User not found");

  const tx = await contract.vote(proposalId, support);
  await tx.wait();
  return tx.hash;
}

export async function executeProposal(proposalId: number) {
  const tx = await contract.executeProposal(proposalId);
  await tx.wait();
  return tx.hash;
}

// Add this new function
export async function getUserIdByEmail(email: any): Promise<number | null> {
  try {
    const user = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1)
      .execute();

    return user.length > 0 ? user[0].id : null;
  } catch (error) {
    console.error("Error fetching user ID by email:", error);
    return null;
  }
}

// Add these new functions at the end of the file

async function createAndSaveName(userId: number): Promise<string> {
  const name = await Name.create();
  const nameString = name.toString();

  // Save the key to localStorage
  localStorage.setItem(
    `w3name_${userId}_${nameString}`,
    JSON.stringify(Array.from(name.key.bytes))
  );

  return nameString;
}

async function updateNameContent(
  userId: number,
  nameString: string,
  newContent: string
): Promise<void> {
  // Load the key from localStorage
  const keyBytes = JSON.parse(
    localStorage.getItem(`w3name_${userId}_${nameString}`) || "[]"
  );
  const name = await Name.from(new Uint8Array(keyBytes));

  // Upload the new content to IPFS
  const cid = await uploadToWeb3Storage(newContent, "index.html");
  const value = `/ipfs/${cid}`;

  // Resolve the current revision
  let revision;
  try {
    revision = await Name.resolve(name);
  } catch (error) {
    // If there's no existing revision, create the initial one
    revision = await Name.v0(name, value);
  }

  // Create a new revision
  const nextRevision = await Name.increment(revision, value);

  // Publish the new revision
  await Name.publish(nextRevision, name.key);
}

async function resolveNameToCID(nameString: string): Promise<string> {
  const name = Name.parse(nameString);
  const revision = await Name.resolve(name);
  return revision.value.replace("/ipfs/", "");
}

export async function createWebpageWithName(
  userId: string | any,
  domain: string,
  content: string
) {
  const { webpage, txHash, cid, deploymentUrl } = await createWebpage(
    userId,
    domain,
    content
  );

  // Create a new name for this webpage
  const nameString = await createAndSaveName(parseInt(userId));

  // Update the webpage record with the name
  await db
    .update(Webpages)
    .set({ name: nameString })
    .where(eq(Webpages.id, webpage.id))
    .execute();

  // Publish the initial content to the name
  await updateNameContent(parseInt(userId), nameString, content);

  // Resolve the name to get the latest CID
  const resolvedCID = await resolveNameToCID(nameString);

  // Create the w3name URL using a public IPFS gateway
  const w3nameUrl = `https://${resolvedCID}.ipfs.dweb.link`;

  return { webpage, txHash, cid, deploymentUrl, name: nameString, w3nameUrl };
}

export async function updateWebpageContent(
  userId: number,
  webpageId: number,
  newContent: string
) {
  // Fetch the webpage
  const [webpage] = await db
    .select()
    .from(Webpages)
    .where(eq(Webpages.id, webpageId))
    .execute();

  if (!webpage) {
    throw new Error("Webpage not found");
  }

  // Update the content on IPFS and the blockchain
  const { txHash, cid } = await storeWebpageOnChain(webpage.domain, newContent);
  const deploymentUrl = `https://${cid}.ipfs.w3s.link/`;

  // Update the existing webpage record
  await db
    .update(Webpages)
    .set({ cid })
    .where(eq(Webpages.id, webpageId))
    .execute();

  // Update the existing deployment record or create a new one if it doesn't exist
  const [existingDeployment] = await db
    .select()
    .from(Deployments)
    .where(eq(Deployments.webpageId, webpageId))
    .execute();

  if (existingDeployment) {
    await db
      .update(Deployments)
      .set({
        transactionHash: txHash,
        deploymentUrl,
        deployedAt: new Date(),
      })
      .where(eq(Deployments.id, existingDeployment.id))
      .execute();
  } else {
    await db
      .insert(Deployments)
      .values({
        userId,
        webpageId,
        transactionHash: txHash,
        deploymentUrl,
      })
      .execute();
  }

  // Update the name content if a name exists
  if (webpage.name) {
    await updateNameContent(userId, webpage.name, newContent);
    const resolvedCID = await resolveNameToCID(webpage.name);
    const w3nameUrl = `https://${resolvedCID}.ipfs.dweb.link`;
    return { txHash, cid, deploymentUrl, w3nameUrl };
  }

  return { txHash, cid, deploymentUrl };
}

export async function getWebpageContent(webpageId: number): Promise<string> {
  const webpage = await db
    .select()
    .from(Webpages)
    .where(eq(Webpages.id, webpageId))
    .leftJoin(Deployments, eq(Webpages.id, Deployments.webpageId))
    .orderBy(desc(Deployments.deployedAt))
    .limit(1)
    .execute();

  if (webpage.length === 0) {
    throw new Error("Webpage not found");
  }

  const cid = webpage[0].webpages.cid;
  const response = await fetch(`https://${cid}.ipfs.w3s.link/`);
  const content = await response.text();

  return content;
}
