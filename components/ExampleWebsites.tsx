import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Coins,
  DollarSign,
  Gamepad,
  Ruler
} from "lucide-react";
import React from "react";

interface ExampleCardProps {
  icon: React.ReactNode;
  title: string;
  url: string;
  showDescription?: boolean;
  description?: string;
}

export function ExampleWebsites({
  showDescription = true,
}: {
  showDescription?: boolean;
}) {
  return (
    <div className="w-full max-w-6xl">
      <h2 className="text-2xl font-semibold text-white mb-8">
        Deployed Websites
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ExampleCard
          icon={<Calculator className="w-6 h-6" />}
          title="Calculator"
          // description="A simple calculator built with HTML, CSS, and JavaScript."
          url="https://ipfs.io/ipfs/QmczJxoJVsYn3mwD361kKfWHce9bDzScAFujoyRT6gd6YQ"
          showDescription={showDescription}
        />
        <ExampleCard
          icon={<Ruler className="w-6 h-6" />}
          title="Unit Converter"
          // description="A basic unit converter for length, weight, and volume."
          url="https://ipfs.io/ipfs/QmTfgFPbvYrbiAdC6HJH2XbATx7bNdXg8PTuLYqvDaAXPR"
          showDescription={showDescription}
        />
        <ExampleCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Currency Convertor"
          // description="A currency converter that fetches real-time exchange rates."
          url="https://ipfs.io/ipfs/QmbEToJbXiEp91sQSvmMuh2JBwu82oSjFX9C2ieJicf3LX"
          showDescription={showDescription}
        />
        <ExampleCard
          icon={<Gamepad className="w-6 h-6" />}
          title="Game"
          // description="A decentralized blog built on IPFS and Ethereum."
          url="https://ipfs.io/ipfs/QmP26UgSt2tuh2LDpNTj1uAJLzxT8SZuCtm9gEScABwS68"
          showDescription={showDescription}
        />
        <ExampleCard
          icon={<Coins className="w-6 h-6" />}
          title=" Wallet Balance"
          // description="A decentralized blog built on IPFS and Ethereum."
          url="https://ipfs.io/ipfs/QmawKH6dZejWKEaSYNXZncuDzMBujwcBobGaM3UcdHh4dN"
          showDescription={showDescription}
        />
      </div>
    </div>
  );
}

function ExampleCard({
  icon,
  title,
  description,
  url,
  showDescription,
}: ExampleCardProps) {
  return (
    <Card className="bg-[#0a0a0a] border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="bg-black text-white border p-3 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
        </div>
        {showDescription && description && (
          <p className="text-gray-400 mb-6 text-center text-sm">
            {description}
          </p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <span className="bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition-colors duration-300">
            View website
          </span>
        </a>
      </CardContent>
    </Card>
  );
}
