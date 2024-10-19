import NestedDemo from "./nested-demo";
import { Button } from "@/components/ui/button";
import { Download, LoaderCircle, RefreshCw, Shapes } from "lucide-react";
import { useState } from "react";
import { useAsync } from "react-use";

export default function StyleGuideDisplay({ designTokens }: { designTokens: any }) {
  const [config, setConfig] = useState<object | null>(null);

  useAsync(async () => {
    setConfig(null);

    const res = await fetch("/api/generate-tailwind-config", {
      method: "POST",
      body: JSON.stringify({ designTokens }),
    });

    setConfig(JSON.parse((await res.json()).output));
  }, [setConfig, designTokens]);

  function downloadConfig() {
    // Convert the config data to a JSON string
    const jsonString = JSON.stringify(config, null, 2); // Pretty-print JSON

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'config.json'; // Name of the downloaded file

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(link.href);
}

  return (
    <div className="flex overflow-hidden">
      <div className="flex shrink-0 flex-col gap-4 border-r p-8">
        <h2 className="text-4xl font-medium">Style Guide</h2>
        <Button variant={"secondary"} className="border shadow">
          <Shapes />
          Design Tokens
        </Button>
        <Button variant={"secondary"} className="border shadow" onClick={() => { downloadConfig() }}>
          <Download />
          Export
        </Button>
        <Button
          variant={"ghost"}
          size="sm"
          onClick={() => {
            setConfig({ ...config });
          }}
        >
          <RefreshCw />
          Reload
        </Button>
      </div>
      {config ? (
        <NestedDemo config={config} />
      ) : (
        <div className="flex w-full items-center justify-center gap-4 p-4">
          <LoaderCircle className="h-10 w-10 animate-spin" />
          <p className="text-2xl font-medium">Generating styles...</p>
        </div>
      )}
    </div>
  );
}
