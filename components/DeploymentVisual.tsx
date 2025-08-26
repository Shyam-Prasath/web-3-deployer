import React, { useState } from "react";
import IPFSContentRenderer from "../app/components/IPFSContentRenderer";
import { Button } from "@/components/ui/button";
import { Check, Copy, Code, Eye } from "lucide-react";

interface DeploymentVisualProps {
  deployedUrl: string;
}

export default function DeploymentVisual({
  deployedUrl,
}: DeploymentVisualProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showIPFSContent, setShowIPFSContent] = useState(false);

  const handleCopyzUrl = () => {
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(deployedUrl);
      const text = await response.text();
      setContent(text);
    } catch (error) {
      console.error("Failed to fetch content:", error);
      setContent("Error fetching content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPreview = async () => {
    if (!content) await fetchContent();
    setShowPreview(true);
    setShowSourceCode(false);
  };

  const handleViewSourceCode = async () => {
    if (!content) await fetchContent();
    setShowSourceCode(true);
    setShowPreview(false);
  };

  return (
    <div className="deployment-visual text-white">
      <h2 className="text-2xl font-semibold mb-4">Deployment Status</h2>
      <div className="flex items-center justify-center mb-4">
        <p className="text-muted-foreground mr-2">
          Your content has been deployed successfully!
        </p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={handleCopyzUrl}
        >
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy URL"}
        </Button>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          onClick={handleViewPreview}
          variant={showPreview ? "default" : "outline"}
        >
          <Eye className="h-4 w-4 mr-2" /> View Preview
        </Button>
        <Button
          onClick={handleViewSourceCode}
          variant={showSourceCode ? "default" : "outline"}
        >
          <Code className="h-4 w-4 mr-2" /> View Source Code
        </Button>
      </div>
      <p>
        IPFS URL:{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowIPFSContent(!showIPFSContent);
          }}
        >
          {deployedUrl}
        </a>
      </p>
      {showIPFSContent && (
        <div className="ipfs-content-preview">
          <h3>IPFS Content Preview:</h3>
          <IPFSContentRenderer ipfsUrl={deployedUrl} />
        </div>
      )}
      {isLoading && <p>Loading content...</p>}
      {!isLoading && showPreview && (
        <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-white text-black p-4">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
      {!isLoading && showSourceCode && (
        <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
          <pre className="text-left p-4 overflow-auto h-full">
            <code>{content}</code>
          </pre>
        </div>
      )}
      <div className="mt-4 p-4 text-white bg-black text-left">
        <h3 className="font-semibold">Deployed URL:</h3>
        <p>{deployedUrl}</p>
      </div>
    </div>
  );
}
