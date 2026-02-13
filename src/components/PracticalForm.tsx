import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Practical } from "@/types";

interface PracticalFormProps {
  initialData?: Practical;
  onSubmit: (data: Partial<Practical>) => void;
  onCancel: () => void;
}

export function PracticalForm({
  initialData,
  onSubmit,
  onCancel,
}: PracticalFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [language, setLanguage] = useState(initialData?.language || "python");
  const [code, setCode] = useState(initialData?.code || "");
  const [questions, setQuestions] = useState(initialData?.theory || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !code.trim()) {
      alert("Title and Code are required");
      return;
    }

    onSubmit({
      title,
      language,
      code,
      theory: questions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">

      {/* Title */}
      <div>
        <label className="text-sm font-medium">Practical Title</label>
        <Input
          placeholder="Enter practical title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Language */}
      <div>
        <label className="text-sm font-medium">Language</label>
        <select
          className="w-full border rounded-lg p-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
          <option value="angular">Angular</option>
        </select>
      </div>

      {/* Code */}
      <div>
        <label className="text-sm font-medium">Main Program</label>
        <Textarea
          placeholder="Paste your code here"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono min-h-[160px]"
          required
        />
      </div>

      {/* Output note */}
      <p className="text-xs text-muted-foreground">
        Upload output images after saving.
      </p>

      {/* Questions */}
      <div>
        <label className="text-sm font-medium">
          Practical Related Questions
        </label>
        <Textarea
          placeholder="Write important viva questions & answers"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit">Save Practical</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

    </form>
  );
}
