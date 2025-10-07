import { useState } from "react";
import Landing from "@/components/Landing";
import Composer from "@/components/Composer";
import Refine from "@/components/Refine";
import Preview from "@/components/Preview";
import DeploySuccess from "@/components/DeploySuccess";

type Stage = "landing" | "composer" | "refine" | "preview" | "deploy";

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
  const [prompt, setPrompt] = useState("");

  const handleGenerate = (userPrompt: string) => {
    setPrompt(userPrompt);
    setStage("composer");
  };

  const handleComposerComplete = () => {
    setStage("refine");
  };

  const handleRefineContinue = () => {
    setStage("preview");
  };

  const handleDeploy = () => {
    setStage("deploy");
  };

  return (
    <>
      {stage === "landing" && <Landing onGenerate={handleGenerate} />}
      {stage === "composer" && (
        <Composer prompt={prompt} onComplete={handleComposerComplete} />
      )}
      {stage === "refine" && <Refine onContinue={handleRefineContinue} />}
      {stage === "preview" && <Preview onDeploy={handleDeploy} />}
      {stage === "deploy" && <DeploySuccess />}
    </>
  );
};

export default Index;
