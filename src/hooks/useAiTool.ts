import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateAi } from "@/lib/ai.functions";

export function useAiTool() {
  const run = useServerFn(generateAi);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (system: string, prompt: string) => {
    setLoading(true);
    setOutput("");
    try {
      const result = await run({ data: { system, prompt } });
      setOutput(result.text);
      return result.text;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { output, setOutput, loading, generate };
}
