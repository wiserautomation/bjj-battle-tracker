
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { JournalEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface JournalEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: Partial<JournalEntry>) => void;
  existingEntry?: JournalEntry; // For editing existing entries
}

const JournalEntryDialog = ({ open, onOpenChange, onSubmit, existingEntry }: JournalEntryDialogProps) => {
  const { currentUser } = useApp();
  const [title, setTitle] = useState(existingEntry?.title || "");
  const [content, setContent] = useState(existingEntry?.content || "");
  const [trainingType, setTrainingType] = useState<"gi" | "no-gi">(existingEntry?.trainingType || "gi");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(existingEntry?.tags || []);
  const [submissionsAchieved, setSubmissionsAchieved] = useState(existingEntry?.submissions.achieved.count || 0);
  const [submissionsReceived, setSubmissionsReceived] = useState(existingEntry?.submissions.received.count || 0);
  const [isPrivate, setIsPrivate] = useState(existingEntry?.private ?? true);
  
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim().toLowerCase())) {
      setTags([...tags, tag.trim().toLowerCase()]);
      setTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }
    
    const newEntry: Partial<JournalEntry> = {
      id: existingEntry?.id || `journal-${Date.now()}`,
      athleteId: currentUser?.id || "",
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      tags,
      trainingType,
      submissions: {
        achieved: {
          count: submissionsAchieved,
          types: []
        },
        received: {
          count: submissionsReceived,
          types: []
        }
      },
      private: isPrivate
    };
    
    onSubmit(newEntry);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{existingEntry ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
            <DialogDescription>
              Record your training insights, techniques, and progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Morning Gi Training"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Notes</Label>
              <Textarea
                id="content"
                placeholder="Describe what you learned today, techniques practiced, etc."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Training Type</Label>
              <Select value={trainingType} onValueChange={(value: "gi" | "no-gi") => setTrainingType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select training type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gi">Gi</SelectItem>
                  <SelectItem value="no-gi">No-Gi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tag"
                  placeholder="Add a tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {t}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(t)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="submissions-achieved">Submissions Achieved</Label>
                <Input
                  id="submissions-achieved"
                  type="number"
                  min="0"
                  value={submissionsAchieved}
                  onChange={(e) => setSubmissionsAchieved(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="submissions-received">Submissions Received</Label>
                <Input
                  id="submissions-received"
                  type="number"
                  min="0"
                  value={submissionsReceived}
                  onChange={(e) => setSubmissionsReceived(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="private">Make this entry private</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{existingEntry ? "Save Changes" : "Create Entry"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryDialog;
