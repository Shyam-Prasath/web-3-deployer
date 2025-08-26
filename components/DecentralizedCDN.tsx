import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CID, create } from "@web3-storage/w3up-client";
import { Download, Loader2, RefreshCw, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

type Node = {
  id: string;
  url: string;
  isActive: boolean;
  latency: number;
};

export function DecentralizedCDN() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>("");
  const [retrieveHash, setRetrieveHash] = useState<string>("");
  const [retrievedUrl, setRetrievedUrl] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function initializeClient() {
      const newClient = await create();
      await newClient.login(
        `${process.env.NEXT_PUBLIC_W3UP_EMAIL}@example.com` as `${string}@${string}`
      );
      const space = await newClient.createSpace("my-app-space");
      await newClient.setCurrentSpace(space.did());
      setClient(newClient);
    }
    initializeClient();
    refreshNodes();
    const interval = setInterval(() => {
      updateNodeStatus();
    }, 3000); // Update node status every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleShare = async () => {
    if (!file || !client) return;
    setIsSharing(true);
    try {
      const cid = await client.uploadFile(file);
      setFileHash(cid.toString());
      await pinToNodes(cid);
    } catch (error) {
      console.error("Error sharing file:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRetrieve = async () => {
    if (!retrieveHash || !client) return;
    setIsRetrieving(true);
    try {
      const cid = CID.parse(retrieveHash);
      const nearestNode = await findNearestNode(cid);
      const url = `${nearestNode}/ipfs/${retrieveHash}`;
      setRetrievedUrl(url);
    } catch (error) {
      console.error("Error retrieving file:", error);
    } finally {
      setIsRetrieving(false);
    }
  };

  const pinToNodes = async (cid: CID) => {
    // Simulate pinning to multiple nodes
  };

  const findNearestNode = async (cid: CID): Promise<string> => {
    // Simulate finding the nearest node
    return nodes[Math.floor(Math.random() * nodes.length)]?.url || IPFS_GATEWAY;
  };

  const refreshNodes = async () => {
    setIsRefreshing(true);
    try {
      // Simulating fetching real IPFS nodes
      const fetchedNodes: Node[] = [
        {
          id: "QmQzWuL7Ci8gDiYA2QEHbRpvNpvgFzhyYEVGvjLm9VUJdS",
          url: "https://ipfs.infura.io",
          isActive: true,
          latency: 50,
        },
        {
          id: "QmXa1vhcZZCWP6TGxCBZRDkbVVVMFnsLGZx6iGGZYfZcWA",
          url: "https://gateway.pinata.cloud",
          isActive: true,
          latency: 75,
        },
        {
          id: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          url: "https://cloudflare-ipfs.com",
          isActive: true,
          latency: 30,
        },
        {
          id: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
          url: "https://ipfs.fleek.co",
          isActive: false,
          latency: 0,
        },
        {
          id: "QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9",
          url: "https://ipfs.eternum.io",
          isActive: true,
          latency: 60,
        },
      ];
      setNodes(fetchedNodes);
    } catch (error) {
      console.error("Error refreshing nodes:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateNodeStatus = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        isActive: Math.random() > 0.2, // 80% chance of being active
        latency: node.isActive ? Math.floor(Math.random() * 100) + 10 : 0,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0a0a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Share File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label
              htmlFor="file-upload"
              className="text-sm font-medium text-gray-400"
            >
              Select a file to share
            </Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="mt-1 bg-[#0a0a0a] text-white border-gray-700"
            />
          </div>
          <Button
            onClick={handleShare}
            disabled={!file || isSharing || !client}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Share File
              </>
            )}
          </Button>
          {fileHash && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-400">
                File CID:
              </Label>
              <p className="mt-1 text-white break-all">{fileHash}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0a0a0a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Retrieve File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label
              htmlFor="retrieve-hash"
              className="text-sm font-medium text-gray-400"
            >
              Enter file CID to retrieve
            </Label>
            <Input
              id="retrieve-hash"
              value={retrieveHash}
              onChange={(e) => setRetrieveHash(e.target.value)}
              placeholder="Enter file CID"
              className="mt-1 bg-[#0a0a0a] text-white border-gray-700"
            />
          </div>
          <Button
            onClick={handleRetrieve}
            disabled={!retrieveHash || isRetrieving || !client}
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            {isRetrieving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Retrieving...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Retrieve File
              </>
            )}
          </Button>
          {retrievedUrl && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-400">
                Retrieved File URL:
              </Label>
              <p className="mt-1 text-white break-all">
                <a
                  href={retrievedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {retrievedUrl}
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0a0a0a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            IPFS Network Nodes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={refreshNodes}
            disabled={isRefreshing}
            className="bg-yellow-600 hover:bg-yellow-500 text-white"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Refresh Nodes
              </>
            )}
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Node ID</TableHead>
                <TableHead className="text-white">Gateway URL</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium text-white">
                    {node.id.slice(0, 10)}...
                  </TableCell>
                  <TableCell className="text-gray-300">{node.url}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        node.isActive
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {node.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {node.isActive ? `${node.latency} ms` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
