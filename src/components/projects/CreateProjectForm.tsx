import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
//import React, { useState } from "react";
//import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
//import { Input } from "@/components/ui/input";
//import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"; // or wherever your Calendar component is
import { cn } from "@/lib/utils"; // utility for conditional classNames


interface CreateProjectFormProps {
  onSave: (project: {
    name: string;
    description: string;
    tags: string[];
    manager: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    teamSize: number;
    image?: File | null;
  }) => void;
  onCancel: () => void;
}

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [manager, setManager] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [teamSize, setTeamSize] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setFileSelected(!!file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      manager,
      dueDate,
      priority,
      teamSize,
      image,
    });
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <Input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Tags */}
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Manager */}
          <Input
            placeholder="Project Manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
          />

         

          {/* Priority */}
          <div className="flex items-center space-x-4">
            <label className="font-medium">Priority:</label>
            {["low", "medium", "high"].map((level) => (
              <label key={level}>
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={priority === level}
                  onChange={() => setPriority(level as "low" | "medium" | "high")}
                />{" "}
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
          {/* Due Date */}
<div className="space-y-2">
  <Label>Due Date *</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !dueDate && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dueDate ? dueDate : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={dueDate ? new Date(dueDate) : undefined}
        onSelect={(date) => setDueDate(date ? date.toISOString().split('T')[0] : "")}
        initialFocus
        className={cn("p-3 pointer-events-auto")}
      />
    </PopoverContent>
  </Popover>
</div>

          {/* Image Upload */}
{/* Image Upload */}
<div>
  <label className="block mb-1 font-medium">Image</label>
  <label
    htmlFor="project-image"
    className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition 
      ${fileSelected ? "bg-blue-50 border-blue-400" : "bg--50 border-gray-300"} 
      hover:bg-blue-100`}
  >
    {/* Cloud Upload SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-12 h-12 mb-2 transition-colors ${fileSelected ? "text-blue-600" : "text-gray-400"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 15a4 4 0 0 1 4-4h1.26A5 5 0 0 1 19 13a3.5 3.5 0 0 1 .5 7H4a3 3 0 0 1-1-5.83"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l-4-4-4 4" />
    </svg>
    <span className={`text-sm mt-1 ${fileSelected ? "text-blue-600" : "text-gray-500"}`}>
      {fileSelected && image ? image.name : "Click to upload image"}
    </span>
    <Input
      id="project-image"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
    />
  </label>
</div>


          {/* Description */}
          <Textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
