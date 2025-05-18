import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/components/UserContext";
import { JobStatus } from "@prisma/client";
import { BaseModal } from "@/components/BaseModal";

type CreateJobModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreated: () => void;
};

export function CreateJobModal({ open, onOpenChange, onJobCreated }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { tofilUser } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tofilUser?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a job",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status: 'PENDING_REVIEW' as JobStatus,
          ownerId: tofilUser.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create job');

      toast({
        title: "Success",
        description: "Job created successfully",
      });
      onJobCreated();
      onOpenChange(false);
      setTitle("");
      setDescription("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Job"
      description="Fill in the details below to create a new job."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter job description"
            required
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="bg-secondary hover:bg-secondary/80"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </DialogFooter>
      </form>
    </BaseModal>
  );
} 