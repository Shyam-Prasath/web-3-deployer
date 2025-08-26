"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Cpu,
  Globe,
  Network
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="container text-white mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-white">Documentation</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Getting Started
              </h2>
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#create-account"
                        className="text-white hover:underline"
                      >
                        Create an account
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#deploy-website"
                        className="text-white hover:underline"
                      >
                        Deploy your first website
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#manage-deployments"
                        className="text-white hover:underline"
                      >
                        Manage your deployments
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Features
              </h2>
              <Card className="bg-[#1a1a1a] text-white border-gray-800">
                <CardContent className="p-4">
                  <ul className="space-y-4 text-white">
                    <li className="flex items-start">
                      <Globe className="w-6 h-6 text-white mr-2 mt-1" />
                      <div>
                        <h3 className="font-semibold">
                          Decentralize Deployment
                        </h3>
                        <p className="text-sm text-gray-400">
                          Deploy and access your website forever for free on the
                          blockchain.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <Cpu className="w-6 h-6 text-white mr-2 mt-1" />
                      <div>
                        <h3 className="font-semibold">AI Website Generator</h3>
                        <p className="text-sm text-gray-400">
                          Generate a website using AI and deploy it directly to
                          the blockchain.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BarChart className="w-6 h-6 text-white mr-2 mt-1" />
                      <div>
                        <h3 className="font-semibold">
                          Analytics & Monitoring
                        </h3>
                        <p className="text-sm text-gray-400">
                          Real-time analytics dashboard and uptime monitoring
                          for your decentralized websites.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Network className="w-6 h-6 text-white mr-2 mt-1" />
                      <div>
                        <h3 className="font-semibold">Decentralized CDN</h3>
                        <p className="text-sm text-gray-400">
                          Utilize our decentralized content delivery network for
                          faster and more reliable access.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="create-account">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Create an Account
              </h2>
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-4">
                  <p className="text-white">
                    To get started with web3deployer, you'll need to create an account.
                    Use the 'Login' button in the navbar to connect with your
                    Web3 wallet for a seamless blockchain experience.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="deploy-website">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Deploy Your First Website
              </h2>
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-4">
                  <p className="mb-4 text-white">
                    Once you've connected your wallet, you can deploy your first
                    website by following these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-white">
                    <li>Navigate to the Dashboard</li>
                    <li>Click on the "Deploy" tab</li>
                    <li>Enter your domain and website content</li>
                    <li>
                      Click "Deploy to web3deployer" and confirm the transaction in
                      your wallet
                    </li>
                    <li>Wait for the deployment to complete</li>
                    <li>Access your website using the provided IPFS link</li>
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section id="manage-deployments">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Manage Your Deployments
              </h2>
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-4">
                  <p className="mb-4 text-white">
                    web3deployer provides tools to manage your website deployments:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white">
                    <li>View all your deployed websites in the Dashboard</li>
                    <li>Edit and update existing websites</li>
                    <li>Monitor deployment status and IPFS links</li>
                    <li>Use the CI/CD manager for automated updates</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
