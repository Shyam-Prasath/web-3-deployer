import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, GitBranch, RefreshCw } from "lucide-react";
import * as Name from "w3name";
import { uploadToWeb3Storage } from "@/utils/db/actions";

interface CICDManagerProps {
  userId: any;
  initialDomain: string;
  initialContent: string;
  initialW3name?: string;
}

export default function CICDManager({
  userId,
  initialDomain,
  initialContent,
  initialW3name,
}: CICDManagerProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [content, setContent] = useState(initialContent);
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState<Name.Name | null>(null);
  const [currentRevision, setCurrentRevision] = useState<Name.Revision | null>(
    null
  );

  useEffect(() => {
    async function loadOrCreateName() {
      try {
        if (initialW3name) {
          // If we have an initial w3name, use it
          const storedKey = localStorage.getItem(`w3name_${userId}_${domain}`);
          if (storedKey) {
            const loadedName = await Name.from(
              new Uint8Array(JSON.parse(storedKey))
            );
            setName(loadedName);
            const revision = await Name.resolve(loadedName);
            setCurrentRevision(revision);
          } else {
            console.error("W3name exists but key not found in local storage");
          }
        } else {
          // If no initial w3name, create a new one
          const newName = await Name.create();
          setName(newName);
          localStorage.setItem(
            `w3name_${userId}_${domain}`,
            JSON.stringify(Array.from(newName.key.bytes))
          );
        }
      } catch (error) {
        console.error("Error loading or creating w3name:", error);
      }
    }
    loadOrCreateName();
  }, [userId, domain, initialW3name]);

  const handleUpdate = async () => {
    if (!name || !content) return;

    setIsUpdating(true);
    try {
      const cid = await uploadToWeb3Storage(content, "index.html");
      const value = `/ipfs/${cid}`;
      let revision;
      if (currentRevision) {
        revision = await Name.increment(currentRevision, value);
      } else {
        revision = await Name.v0(name, value);
      }
      await Name.publish(revision, name.key);
      setCurrentRevision(revision);
      console.log("Website updated successfully");
    } catch (error) {
      console.error("Error updating website:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitBranch className="mr-2 h-6 w-6" />
          CI/CD Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="domain">Domain</Label>
            <Input id="domain" value={domain} disabled />
          </div>
          <div>
            <Label htmlFor="content">Website Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono"
            />
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Website
              </>
            )}
          </Button>
          {currentRevision && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="text-sm">
                Current IPNS: <code>{name?.toString()}</code>
              </p>
              <p className="text-sm">
                Current Value: <code>{currentRevision.value}</code>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
