"use client";
import { AIWebsiteGenerator } from "@/components/AIWebsiteGenerator";
import DeploymentVisual from "@/components/DeploymentVisual";
import { ExampleWebsites } from "@/components/ExampleWebsites";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  createWebpageWithName,
  getUserIdByEmail,
  getUserWebpages,
  getWebpageContent,
  initializeClients,
  updateWebpageContent,
} from "@/utils/db/actions";
import { usePrivy } from "@privy-io/react-auth";
import {
  Activity,
  Clock,
  Cpu,
  GitBranch,
  Globe,
  Layout,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
type Webpage = {
  webpages: {
    id: number;
    domain: string;
    cid: string;
    name: string | null;
  };
  deployments: {
    id: number;
    deploymentUrl: string;
    deployedAt: Date | null;
    transactionHash: string;
  } | null;
};


const truncateUrl = (url: string, maxLength: number = 30) => {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  const start = url.substring(0, maxLength / 2 - 2);
  const end = url.substring(url.length - maxLength / 2 + 2);
  return `${start}...${end}`;
};

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

export default function Dashboard() {
  const [sites, setSites] = useState([
    {
      id: 1,
      name: "My First Site",
      url: "https://web3deployer.io/abc123",
      chain: "Ethereum",
      status: "Active",
      traffic: 1500,
      uptime: 99.9,
      lastDeployed: "2023-03-15 14:30",
    },
    {
      id: 2,
      name: "Blog",
      url: "https://web3deployer.io/def456",
      chain: "Polygon",
      status: "Active",
      traffic: 3000,
      uptime: 100,
      lastDeployed: "2023-03-14 09:15",
    },
    {
      id: 3,
      name: "DApp Frontend",
      url: "https://web3deployer.io/ghi789",
      chain: "Solana",
      status: "Maintenance",
      traffic: 500,
      uptime: 98.5,
      lastDeployed: "2023-03-13 18:45",
    },
  ]);

  const handleRename = (id: number, newName: string) => {
    setSites(
      sites.map((site) => (site.id === id ? { ...site, name: newName } : site))
    );
  };

  const dummyTokenEconomy = {
    balance: 1000,
    staked: 500,
    rewards: 50,
    transactions: [
      { id: 1, type: "Stake", amount: 100, date: "2023-03-15 08:30" },
      { id: 2, type: "Reward", amount: 10, date: "2023-03-14 00:00" },
      { id: 3, type: "Unstake", amount: -50, date: "2023-03-13 14:45" },
    ],
  };
  const IPFS_API = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const PINATA_API_KEY = process.env.PINATA_API_KEY ;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [ipfsError, setIpfsError] = useState("");
  const [code, setCode] = useState(``);
  const [githubUrl, setGithubUrl] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [livePreview, setLivePreview] = useState(code);
  const [activeTab, setActiveTab] = useState("Sites");
  const [domain, setDomain] = useState("");
  const [content, setContent] = useState("");
  const [deploymentError, setDeploymentError] = useState("");
  const { user, authenticated } = usePrivy();
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [w3name, setW3name] = useState<string | null>(null);
  const [userWebpages, setUserWebpages] = useState<Webpage[]>([]);
  const [selectedWebpage, setSelectedWebpage] = useState<Webpage | null>(null);
  const router = useRouter();

  const [visitorData, setVisitorData] = useLocalStorage("visitorData", {
    desktop: 0,
    mobile: 0,
    lastUpdated: null as string | null,
    dailyData: [] as { date: string; desktop: number; mobile: number }[],
  });

  const [activeChart, setActiveChart] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const [aiDeploymentStatus, setAiDeploymentStatus] = useState({
    isDeploying: false,
    deployedUrl: "",
    ipfsUrl: "",
    error: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (visitorData.lastUpdated !== today) {
      setVisitorData((prev) => {
        const newDesktop = prev.desktop + Math.floor(Math.random() * 2) + 3;
        const newMobile = prev.mobile + Math.floor(Math.random() * 2) + 4;
        const newDailyData = [
          ...(prev.dailyData || []).slice(-89), // Use empty array if dailyData is undefined
          {
            date: today,
            desktop: newDesktop - prev.desktop,
            mobile: newMobile - prev.mobile,
          },
        ];
        return {
          desktop: newDesktop,
          mobile: newMobile,
          lastUpdated: today,
          dailyData: newDailyData,
        };
      });
    }
  }, [visitorData, setVisitorData]);

  const chartData = useMemo(() => {
    if (userWebpages.length === 0) {
      // If no websites, return an array of 90 days with 0 values
      return Array.from({ length: 90 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        desktop: 0,
        mobile: 0,
      }));
    }
    return visitorData.dailyData && visitorData.dailyData.length > 0
      ? visitorData.dailyData
      : [
          {
            date: new Date().toISOString().split("T")[0],
            desktop: 0,
            mobile: 0,
          },
        ];
  }, [visitorData.dailyData, userWebpages.length]);

  const total = useMemo(
    () => ({
      desktop: userWebpages.length === 0 ? 0 : visitorData.desktop || 0,
      mobile: userWebpages.length === 0 ? 0 : visitorData.mobile || 0,
    }),
    [visitorData.desktop, visitorData.mobile, userWebpages.length]
  );

  console.log(userId);

  useEffect(() => {
    // Update live preview when code changes
    setLivePreview(code);
  }, [code]);

  useEffect(() => {
    async function init() {
      if (authenticated && user?.email?.address) {
        try {
          console.log(user);

          await initializeClients(user.email.address);
          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to initialize clients:", error);
          setDeploymentError("");
        }
      }
    }

    init();
  }, [authenticated, user]);

  useEffect(() => {
    async function fetchUserId() {
      if (authenticated && user?.email?.address) {
        const fetchedUserId = await getUserIdByEmail(user?.email?.address);
        console.log(fetchUserId);
        console.log(user.email.address);
        setUserId(fetchedUserId);
      }
    }

    fetchUserId();
  }, [authenticated, user]);

  console.log(userId);
  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentError("");
    try {
      if (!isInitialized) {
        throw new Error("Clients not initialized");
      }
      if (userId === null) {
        throw new Error("User not authenticated or ID not found");
      }

      const { webpage, txHash, cid, deploymentUrl, name, w3nameUrl } =
        await createWebpageWithName(userId, domain, content);

      setDeployedUrl(w3nameUrl || deploymentUrl);
      setW3name(name);
      console.log(
        `Deployed successfully. Transaction hash: ${txHash}, CID: ${cid}, URL: ${
          w3nameUrl || deploymentUrl
        }, W3name: ${name}`
      );

      // Refresh the user's webpages
      const updatedWebpages = await getUserWebpages(userId);
      setUserWebpages(updatedWebpages as Webpage[]);
    } catch (error) {
      console.error("Deployment failed:", error);
      setDeploymentError("Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleUpdate = async () => {
    setIsDeploying(true);
    setDeploymentError("");
    try {
      if (!isInitialized || userId === null || !selectedWebpage) {
        throw new Error(
          "Cannot update: missing initialization, user ID, or selected webpage"
        );
      }

      const { txHash, cid, deploymentUrl, w3nameUrl } =
        await updateWebpageContent(
          userId,
          selectedWebpage.webpages.id,
          content
        );

      setDeployedUrl(w3nameUrl || deploymentUrl);
      console.log(
        `Updated successfully. Transaction hash: ${txHash}, CID: ${cid}, URL: ${
          w3nameUrl || deploymentUrl
        }`
      );
      setLivePreview(content);

      // Update the selected webpage in the state
      setSelectedWebpage((prev) => {
        if (!prev) return null;
        return {
          webpages: {
            ...prev.webpages,
            cid,
          },
          deployments: {
            id: prev.deployments?.id ?? 0,
            deploymentUrl,
            transactionHash: txHash,
            deployedAt: new Date(),
          },
        };
      });

      // Refresh the user's webpages
      const updatedWebpages = await getUserWebpages(userId);
      setUserWebpages(updatedWebpages as Webpage[]);
    } catch (error: any) {
      console.error("Update failed:", error);
      setDeploymentError(`Update failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    async function fetchUserWebpages() {
      if (userId) {
        const webpages = await getUserWebpages(userId);
        console.log("=======web pages", webpages);
        setUserWebpages(webpages as Webpage[]);
      }
    }
    fetchUserWebpages();
  }, [userId]);

  const handleEdit = async (webpage: Webpage) => {
    setSelectedWebpage(webpage);
    setDomain(webpage.webpages.domain);
    const webpageContent = await getWebpageContent(webpage.webpages.id);
    setContent(webpageContent);
    setW3name(webpage.webpages.name);
    setActiveTab("Deploy");
  };

  const handleUrlClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAIWebsiteDeploy = async (domain: string, content: string) => {
    setAiDeploymentStatus({
      isDeploying: true,
      deployedUrl: "",
      ipfsUrl: "",
      error: "",
    });
    setDeploymentError("");
    console.log(userId);

    try {
      if (!isInitialized || userId === null) {
        throw new Error("Cannot deploy: missing initialization or user ID");
      }

      const { webpage, txHash, cid, deploymentUrl, name, w3nameUrl } =
        await createWebpageWithName(userId, domain, content);

      const ipfsUrl = `https://dweb.link/ipfs/${cid}`;
      const finalDeployedUrl = w3nameUrl || deploymentUrl;

      setAiDeploymentStatus({
        isDeploying: false,
        deployedUrl: finalDeployedUrl,
        ipfsUrl: ipfsUrl,
        error: "",
      });

      setDeployedUrl(finalDeployedUrl);
      setW3name(name);
      console.log(
        `Deployed AI-generated website successfully. Transaction hash: ${txHash}, CID: ${cid}, URL: ${finalDeployedUrl}, W3name: ${name}`
      );

      // Refresh the user's webpages
      const updatedWebpages = await getUserWebpages(userId);
      setUserWebpages(updatedWebpages as Webpage[]);
    } catch (error: any) {
      console.error("AI website deployment failed:", error);
      setAiDeploymentStatus({
        isDeploying: false,
        deployedUrl: "",
        ipfsUrl: "",
        error: `AI website deployment failed: ${error.message}`,
      });
      setDeploymentError(`AI website deployment failed: ${error.message}`);
    }
  };

  const sidebarItems = [
    { name: "Sites", icon: Layout },
    { name: "Deploy", icon: Rocket },
    { name: "Manage Websites", icon: GitBranch },
    { name: "AI Website", icon: Cpu },
    { name: "Deployed Websites", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeItem={activeTab}
          setActiveItem={setActiveTab}
        />
        <div className="flex-1 p-10 ml-64">
          <h1 className="text-4xl font-bold mb-8 text-white">
            Welcome to Your Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Websites
                </CardTitle>
                <Globe className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {userWebpages.length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Latest Deployment
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {userWebpages.length > 0
                    ? new Date(
                        Math.max(
                          ...userWebpages
                            .filter((w) => w.deployments?.deployedAt)
                            .map((w) => w.deployments!.deployedAt!.getTime())
                        )
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Deployments
                </CardTitle>
                <Activity className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {userWebpages.filter((w) => w.deployments).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {activeTab === "Sites" && (
            <>
              <Card className="bg-[#0a0a0a] border-[#18181b] mb-8">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="text-2xl text-white">
                      Website Traffic Overview
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Visitor trends across desktop and mobile platforms over
                      the past quarter
                    </CardDescription>
                  </div>
                  <div className="flex">
                    {["desktop", "mobile"].map((key) => {
                      const chart = key as keyof typeof chartConfig;
                      return (
                        <button
                          key={chart}
                          data-active={activeChart === chart}
                          className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/20 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                          onClick={() => setActiveChart(chart)}
                        >
                          <span className="text-sm text-white">
                            {chartConfig[chart].label}
                          </span>
                          <span className="text-5xl font-bold text-white">
                            {total[chart].toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full bg-[#0a0a0a]"
                  >
                    <BarChart
                      data={chartData}
                      margin={{ left: 0, right: 0, top: 0, bottom: 20 }}
                    >
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tick={{ fill: "#666" }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="bg-[#1a1a1a] text-white border-none rounded-md shadow-lg"
                            nameKey={activeChart}
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              );
                            }}
                          />
                        }
                      />
                      <Bar
                        dataKey={activeChart}
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                  {userWebpages.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      It may take up to 24 hours to update the count.
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please note: It may take up to 48 hours to load and display
                    all data.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userWebpages.map((webpage) => (
                  <Card
                    key={webpage.webpages.id}
                    className="bg-[#0a0a0a] border-[#18181b]"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-white">
                        <span className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          {webpage.webpages.domain}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className="mb-2 text-sm text-blue-400 cursor-pointer hover:underline overflow-hidden text-ellipsis"
                        onClick={() =>
                          handleUrlClick(
                            webpage.webpages.name
                              ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
                              : webpage.deployments?.deploymentUrl || ""
                          )
                        }
                        title={
                          webpage.webpages.name
                            ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
                            : webpage.deployments?.deploymentUrl
                        }
                      >
                        {truncateUrl(
                          webpage.webpages.name
                            ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
                            : webpage.deployments?.deploymentUrl || ""
                        )}
                      </p>
                      <p className="mb-2 text-sm text-gray-500">
                        Deployed:{" "}
                        {webpage.deployments?.deployedAt?.toLocaleString()}
                      </p>
                      <p className="mb-2 text-sm overflow-hidden text-ellipsis text-gray-500">
                        TX: {webpage.deployments?.transactionHash.slice(0, 10)}
                        ...
                      </p>
                      <Button
                        onClick={() => handleEdit(webpage)}
                        className="w-full bg-secondary hover:bg-gray-700 text-white"
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === "Deploy" && (
            <>
              <Card className="bg-[#0a0a0a] border-[#18181b]">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    {selectedWebpage ? "Edit Website" : "Deploy a New Website"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="domain" className="text-lg text-gray-400">
                        Domain
                      </Label>
                      <Input
                        id="domain"
                        placeholder="Enter your domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="mt-1 bg-[#0a0a0a] text-white border-gray-700"
                        disabled={!!selectedWebpage}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="content"
                        className="text-lg text-gray-400"
                      >
                        Content
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Enter your HTML content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 min-h-[200px] font-mono text-sm bg-[#0a0a0a] text-white border-gray-700"
                      />
                    </div>
                    
                    {/* 🆕 Upload to IPFS button with validation */}
          <Button
            onClick={async () => {
              if (!domain.trim() || !content.trim()) {
                setIpfsError("Please fill both Domain and Content before uploading.");
                setIpfsUrl(""); // Clear previous URL if any
                return;
              }
              try {
                setIpfsError(""); // Clear error if valid
                const blob = new Blob([content], { type: 'text/html' });
                const formData = new FormData();
                formData.append('file', blob, 'website.html');

                const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                  method: 'POST',
                  headers: {
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                  },
                  body: formData,
                });

                const data = await res.json();
                if (data?.IpfsHash) {
                  setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);
                }
              } catch (error) {
                console.error('IPFS upload failed:', error);
                setIpfsError("IPFS Upload Failed. Try again.");
              }
            }}
            size="lg"
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            Upload to IPFS
          </Button>

          {/* Display error if any */}
          {ipfsError && (
            <p className="text-red-400 mt-2">{ipfsError}</p>
          )}

          {/* Display link if uploaded */}
          {ipfsUrl && (
              <p className="text-white font-bold break-words">
                IPFS Link:{" "}
                <a
                  href={ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-green-400"
                >
                  {ipfsUrl}
                </a>
              </p>
            )}
          {/* End of new addition */}
                    {deploymentError && (
                      <p className="text-red-400 mt-2">{deploymentError}</p>
                    )}
                    {deployedUrl && (
                      <DeploymentVisual deployedUrl={deployedUrl} />
                    )}
                  </div>
                </CardContent>
              </Card>

              {content && (
                <Card className="mt-4 bg-[#0a0a0a] border-[#18181b]">
                  <CardHeader>
                    <CardTitle className="text-white">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-[#18181b] p-4 rounded-lg">
                      <iframe
                        srcDoc={content}
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "none",
                        }}
                        title="Website Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeTab === "Manage Websites" && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                Manage Your Websites
              </h2>
              <p className="mt-2 mb-6 text-gray-400">
                Note: This section allows manual management of your websites.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userWebpages.map((webpage) => (
                  <Card
                    key={webpage.webpages.id}
                    className="bg-[#0a0a0a] border-[#18181b]"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-white">
                        <span className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          {webpage.webpages.domain}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className="mb-2 text-sm text-blue-400 cursor-pointer hover:underline overflow-hidden text-ellipsis"
                        onClick={() =>
                          handleUrlClick(
                            webpage.webpages.name
                              ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
                              : webpage.deployments?.deploymentUrl || ""
                          )
                        }
                        title={
                          webpage.webpages.name
                            ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
                            : webpage.deployments?.deploymentUrl
                        }
                      >
                        {truncateUrl(
                          webpage.webpages.name
                            ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
                            : webpage.deployments?.deploymentUrl || ""
                        )}
                      </p>
                      <p className="mb-2 text-sm text-gray-500">
                        Deployed:{" "}
                        {webpage.deployments?.deployedAt?.toLocaleString()}
                      </p>
                      <p className="mb-2 text-sm overflow-hidden text-ellipsis text-gray-500">
                        TX: {webpage.deployments?.transactionHash.slice(0, 10)}
                        ...
                      </p>
                      <Button
                        onClick={() => handleEdit(webpage)}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {activeTab === "AI Website" && (
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  AI Website Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIWebsiteGenerator
                  onDeploy={handleAIWebsiteDeploy}
                  isDeploying={aiDeploymentStatus.isDeploying}
                />
                {aiDeploymentStatus.isDeploying && (
                  <p className="mt-4 text-blue-400">
                    Deploying AI-generated website...
                  </p>
                )}
                
                {aiDeploymentStatus.error && (
                  <p className="mt-4 text-red-400">
                    {aiDeploymentStatus.error}
                  </p>
                )}
                {aiDeploymentStatus.deployedUrl && (
                  <div className="mt-4">
                    <p className="text-green-400">
                      AI-generated website deployed successfully!
                    </p>
                    <p className="text-white">
                      Deployed URL:{" "}
                      <a
                        href={aiDeploymentStatus.deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {aiDeploymentStatus.deployedUrl}
                      </a>
                    </p>
                    <p className="text-white break-words">
                      IPFS URL:{" "}
                      <a
                        href={aiDeploymentStatus.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {aiDeploymentStatus.ipfsUrl}
                      </a>
                    </p>
                    
                    <DeploymentVisual
                      deployedUrl={aiDeploymentStatus.deployedUrl}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {deploymentError && (
            <p className="text-red-400 mt-2">{deploymentError}</p>
          )}

          {activeTab === "Search Engine" && <SearchEngine />}

          {activeTab === "Deployed Websites" && <ExampleWebsites />}

          {activeTab === "Smart Contracts" && (
            <Card className="bg-[#0a0a0a] border-[#18181b]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Smart Contract Deployment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-400">Coming soon</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-12">
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="bg-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white text-white border-gray-700"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
