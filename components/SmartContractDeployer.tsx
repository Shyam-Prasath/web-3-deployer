import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const networks = [
  { value: "https://rpc.bt.io", label: "BTTC Testnet" },
  { value: "https://rpc.bt.io", label: "BTTC Mainnet" },
  { value: "https://rpc.sepolia.org", label: "Sepolia Testnet" },
  {
    value: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    label: "Ethereum Mainnet",
  },
  {
    value: "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    label: "Ethereum Goerli Testnet",
  },
];

const SmartContractDeployer: React.FC = () => {
  const [contractCode, setContractCode] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [deployedAddress, setDeployedAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed and connected
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          setWalletConnected(accounts.length > 0);
        })
        .catch(console.error);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const validateSolidityCode = (code: string): boolean => {
    // Basic validation - check for contract keyword and closing brace
    return code.includes("contract") && code.includes("}");
  };

  const estimateGas = async () => {
    if (!validateSolidityCode(contractCode)) {
      setError("Invalid Solidity code. Please check your contract.");
      return;
    }

    try {
      const response = await fetch("/api/deployContract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: contractCode,
          network: selectedNetwork,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEstimatedGas(data.estimatedGas);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Failed to estimate gas:", error);
      setError("Failed to estimate gas. Please check your contract code.");
    }
  };

  const handleDeploy = async () => {
    if (!walletConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!validateSolidityCode(contractCode)) {
      setError("Invalid Solidity code. Please check your contract.");
      return;
    }

    setIsDeploying(true);
    setError("");
    setDeployedAddress("");

    try {
      const response = await fetch("/api/deployContract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: contractCode,
          network: selectedNetwork,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDeployedAddress(data.address);
        toast.success("Contract deployed successfully!");
      } else {
        setError(data.error);
        toast.error("Contract deployment failed.");
      }
    } catch (err) {
      console.error("Deployment failed:", err);
      setError("Deployment failed. Please check your contract and try again.");
      toast.error("Contract deployment failed.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-4">
      {!walletConnected && (
        <Button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          Connect Wallet
        </Button>
      )}
      <div>
        <Label htmlFor="contract-code" className="text-lg text-gray-400">
          Smart Contract Code
        </Label>
        <Textarea
          id="contract-code"
          placeholder="Paste your Solidity contract code here"
          value={contractCode}
          onChange={(e) => setContractCode(e.target.value)}
          className="mt-1 min-h-[200px] font-mono text-sm bg-gray-800 text-white border-gray-700"
        />
      </div>
      <div>
        <Label htmlFor="network" className="text-lg text-gray-400">
          Network
        </Label>
        <Select
          name="network"
          value={selectedNetwork}
          onValueChange={setSelectedNetwork}
        >
          <SelectTrigger className="mt-1 bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            {networks.map((network) => (
              <SelectItem key={network.value} value={network.value}>
                {network.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={estimateGas}
        disabled={!walletConnected || !contractCode || !selectedNetwork}
        className="bg-green-600 hover:bg-green-500 text-white mr-2"
      >
        Estimate Gas
      </Button>
      <Button
        onClick={handleDeploy}
        disabled={
          isDeploying || !walletConnected || !contractCode || !selectedNetwork
        }
        className="bg-blue-600 hover:bg-blue-500 text-white"
      >
        {isDeploying ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Deploying...
          </>
        ) : (
          "Deploy Contract"
        )}
      </Button>
      {estimatedGas && (
        <p className="text-gray-400 mt-2">Estimated Gas: {estimatedGas}</p>
      )}
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {deployedAddress && (
        <div className="mt-4">
          <Label className="text-lg text-gray-400">
            Deployed Contract Address:
          </Label>
          <Input
            value={deployedAddress}
            readOnly
            className="mt-1 bg-gray-800 text-white border-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default SmartContractDeployer;
