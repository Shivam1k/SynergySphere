import React from "react";
import { CreateProjectForm } from "../components/projects/CreateProjectForm";

interface CreateProjectPageProps {
  onProjectCreated: (data: any) => void;
  onCancel: () => void;
}

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({
  onProjectCreated,
  onCancel,
}) => {
  const handleSave = (project: {
    name: string;
    description: string;
    dueDate: string;
    teamSize: number;
  }) => {
    const newProject = {
      id: Date.now().toString(),
      ...project,
      status: "active",
      color: "#4F46E5", // Default color
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
    };
    onProjectCreated(newProject);
  };

  return (
    <div className="p-4">
      <CreateProjectForm onSave={handleSave} onCancel={onCancel} />
    </div>
  );
};
