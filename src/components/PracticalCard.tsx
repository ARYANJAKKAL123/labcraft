import {
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Download,
  Image as ImageIcon,
  Code
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Practical } from "@/types";

interface PracticalCardProps {
  practical: Practical;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  canEdit: boolean;
}

export function PracticalCard({
  practical,
  onView,
  onEdit,
  onDelete,
  onExport,
  canEdit,
}: PracticalCardProps) {
  return (
    <Card
      className="group relative overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onView}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {/* Left content */}
          <div className="flex gap-4 items-center flex-1">
            {/* Number Badge */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600 text-white font-bold">
              {practical.number}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-lg line-clamp-1">
                {practical.title}
              </h3>

              {practical.aim && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {practical.aim}
                </p>
              )}
            </div>
          </div>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </DropdownMenuItem>

              {canEdit && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          {/* Language badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
              <Code className="h-3 w-3" />
              {practical.language}
            </div>

            {/* Images count */}
               {practical.output_images?.length}

                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <ImageIcon className="h-3 w-3" />
                {practical.output_images?.length}

              </div>
            
          </div>

          <span className="text-xs text-muted-foreground">
            {new Date(practical.updated_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
