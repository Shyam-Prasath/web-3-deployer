import { useState } from "react";

export default function UserAccess() {
  const [web3deployerAddress, setweb3deployerAddress] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);

  const handleFetch = async () => {
    setIsFetching(true);
    // Simulate fetching process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFetchedContent(
      `<h1>Fetched content from ${web3deployerAddress}</h1><p>This is a sample content.</p>`
    );
    setIsFetching(false);
  };

  return <section className="mb-12"></section>;
}
