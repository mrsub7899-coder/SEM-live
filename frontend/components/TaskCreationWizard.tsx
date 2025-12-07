import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { ProgressBar } from "./ui/ProgressBar";

interface TaskData {
  title: string;
  description: string;
  bounty: number;
  category: string;
  attachments: File[];
}

const steps = ["Details", "Bounty", "Attachments", "Review"];

export const TaskCreationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [task, setTask] = useState<TaskData>({
    title: "",
    description: "",
    bounty: 0,
    category: "",
    attachments: [],
  });

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    // TODO: wire up backend API call (NestJS/Prisma)
    console.log("Submitting task:", task);
  };

  return (
    <div className="wizard-container p-6 rounded shadow bg-white">
      <ProgressBar current={currentStep + 1} total={steps.length} />

      {currentStep === 0 && (
        <div>
          <Input
            label="Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <Input
            label="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <Select
            label="Category"
            options={["Design", "Development", "Testing"]}
            value={task.category}
            onChange={(val) => setTask({ ...task, category: val })}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div>
          <Input
            type="number"
            label="Bounty (credits)"
            value={task.bounty}
            onChange={(e) =>
              setTask({ ...task, bounty: parseInt(e.target.value, 10) })
            }
          />
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <Input
            type="file"
            label="Attachments"
            multiple
            onChange={(e) =>
              setTask({
                ...task,
                attachments: Array.from(e.target.files || []),
              })
            }
          />
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h3 className="font-bold">Review Task</h3>
          <pre>{JSON.stringify(task, null, 2)}</pre>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <Button onClick={prev} disabled={currentStep === 0}>
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </div>
    </div>
  );
};
