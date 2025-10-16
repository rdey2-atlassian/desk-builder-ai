import { useState } from "react";
import Landing from "@/components/Landing";
import Composer from "@/components/Composer";
import Refine from "@/components/Refine";
import Preview from "@/components/Preview";
import DeploySuccess from "@/components/DeploySuccess";
import ScreenShareSimulation from "@/components/ScreenShareSimulation";

type Stage = "landing" | "screen-share" | "composer" | "refine" | "preview" | "deploy";

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStage("composer");
  };

  const handleScreenShare = () => {
    setStage("screen-share");
  };

  const handleScreenShareComplete = () => {
    setSelectedTemplateId("blank"); // Start with blank after screen share
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
      {stage === "landing" && <Landing onTemplateSelect={handleTemplateSelect} onScreenShare={handleScreenShare} />}
      {stage === "screen-share" && <ScreenShareSimulation onComplete={handleScreenShareComplete} />}
      {stage === "composer" && (
        <Composer templateId={selectedTemplateId} onComplete={handleComposerComplete} />
      )}
      {stage === "refine" && <Refine onContinue={handleRefineContinue} />}
      {stage === "preview" && <Preview onDeploy={handleDeploy} />}
      {stage === "deploy" && <DeploySuccess />}
    </>
  );
};

export default Index;
