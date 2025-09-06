import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: any) => void;
}

const teamMembers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
  { id: '4', name: 'David Wilson', email: 'david@example.com' },
];

export const TaskCreateModal = ({ open, onOpenChange, onCreateTask }: TaskCreateModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    project: '',
    tags: '',
    priority: 'medium',
    status: 'todo',
    dueDate: undefined as Date | undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [image, setImage] = useState<File | null>(null);
  const fileSelected = !!image;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.assignee || !formData.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assignedMember = teamMembers.find(m => m.id === formData.assignee);
      
      const newTask = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: {
          name: assignedMember?.name || 'Unknown',
          email: assignedMember?.email || ''
        },
        dueDate: formData.dueDate?.toISOString().split('T')[0] || '',
        createdAt: new Date().toISOString()
      };

      onCreateTask(newTask);
      setIsLoading(false);
      
      toast({
        title: "Task Created!",
        description: `"${formData.title}" has been assigned to ${assignedMember?.name}.`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        assignee: '',
        project: '',
        tags: '',
        priority: 'medium',
        status: 'todo',
        dueDate: undefined as Date | undefined
      });

      onOpenChange(false);
    }, 800);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      assignee: '',
      project: '',
      tags: '',
      priority: 'medium',
      status: 'todo',
      dueDate: undefined as Date | undefined
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="auto h-[100vh] overflow-y-auto sm:max-w-[550px] bg-slate-900 text-white rounded-lg p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-3">
        Project &gt; {formData.project || "Project Name"} &gt; New Task
      </div>
  
      <DialogHeader>
        <DialogTitle className="text-orange-500">Task Create/Edit View</DialogTitle>
        <DialogDescription className="text-gray-300">
          Add a new task to your project. Fill in the details below.
        </DialogDescription>
      </DialogHeader>
  
      <div className="grid gap-4 py-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="title">Name *</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={isLoading}
          />
        </div>
  
        {/* Assignee & Project */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Assignee *</Label>
            <Select 
              value={formData.assignee} 
              onValueChange={(value) => handleInputChange('assignee', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee">
                  {formData.assignee && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{teamMembers.find(m => m.id === formData.assignee)?.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          <div className="space-y-2">
            <Label>Project *</Label>
            <Input
              value={formData.project}
              placeholder="Project Name"
              onChange={(e) => handleInputChange('project', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
  
        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <Input
            placeholder="Add tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
          />
        </div>
  
        {/* Status & Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleInputChange('status', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <div className="space-y-2">
            <Label>Deadline *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleInputChange('dueDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
  
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
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Describe the task in detail"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>
  
      <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>Discard</Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="bg-green-600 hover:opacity-90">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  );
};