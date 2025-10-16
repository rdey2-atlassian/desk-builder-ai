import { useState } from "react";
import Landing from "@/components/Landing";
import Composer from "@/components/Composer";
import Refine from "@/components/Refine";
import Preview from "@/components/Preview";
import DeploySuccess from "@/components/DeploySuccess";
import ScreenShareSimulation from "@/components/ScreenShareSimulation";
import CanvasComposer from "@/components/composer/CanvasComposer";
import { BlockInstance } from "@/types/blocks";

type Stage = "landing" | "screen-share" | "canvas" | "composer" | "refine" | "preview" | "deploy";

interface SolutionData {
  name: string;
  description: string;
  blocks: BlockInstance[];
  templateId: string;
}

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    // Use canvas for blank, composer for pre-built templates
    setStage(templateId === "blank" ? "canvas" : "composer");
  };

  const handleScreenShare = () => {
    setStage("screen-share");
  };

  const handleScreenShareComplete = () => {
    setSelectedTemplateId("blank"); // Start with blank after screen share
    setStage("canvas");
  };

  const handleCanvasComplete = (data?: SolutionData) => {
    if (data) {
      setSolutionData(data);
    }
    setStage("refine");
  };

  const handleComposerComplete = (data?: SolutionData) => {
    if (data) {
      setSolutionData(data);
    }
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
      {stage === "landing" && <Landing onTemplateSelect={handleTemplateSelect} onScreenShare={handleScreenShare} />}
      {stage === "screen-share" && <ScreenShareSimulation onComplete={handleScreenShareComplete} />}
      {stage === "canvas" && (
        <CanvasComposer templateId={selectedTemplateId} onComplete={handleCanvasComplete} />
      )}
      {stage === "composer" && (
        <Composer templateId={selectedTemplateId} onComplete={handleComposerComplete} />
      )}
      {stage === "refine" && <Refine solutionData={solutionData} onContinue={handleRefineContinue} />}
      {stage === "preview" && <Preview solutionData={solutionData} onDeploy={handleDeploy} />}
      {stage === "deploy" && <DeploySuccess />}
    </>
  );
};

export default Index;
