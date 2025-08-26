import { ethers } from "ethers";
import WebpageStorageABI from "../artifacts/contracts/WebpageStorage.sol/WebpageStorage.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

export async function getContract() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, WebpageStorageABI.abi, signer);
  }
  throw new Error("Please install MetaMask!");
}

export async function storeWebpage(domain: string, cid: string) {
  const contract = await getContract();
  const transaction = await contract.storeWebpage(domain, cid);
  await transaction.wait();
  return transaction.hash;
}

export async function getWebpage(domain: string) {
  const contract = await getContract();
  const [cid, owner, timestamp] = await contract.getWebpage(domain);
  return { cid, owner, timestamp: new Date(timestamp.toNumber() * 1000) };
}

export async function getUserWebpages(address: string) {
  const contract = await getContract();
  return await contract.getUserWebpages(address);
}

export async function createProposal(description: string) {
  const contract = await getContract();
  const transaction = await contract.createProposal(description);
  await transaction.wait();
  return transaction.hash;
}

export async function vote(proposalId: number, support: boolean) {
  const contract = await getContract();
  const transaction = await contract.vote(proposalId, support);
  await transaction.wait();
  return transaction.hash;
}

export async function executeProposal(proposalId: number) {
  const contract = await getContract();
  const transaction = await contract.executeProposal(proposalId);
  await transaction.wait();
  return transaction.hash;
}

// ... existing code ...
