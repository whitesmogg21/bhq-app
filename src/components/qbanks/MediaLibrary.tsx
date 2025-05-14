import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Edit2, Search, Filter, Check } from "lucide-react";
import { QBank } from "@/types/quiz";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paginationUtil } from "@/utils/paginationUtil";

interface MediaLibraryProps {
  qbanks: QBank[];
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
  tags: string[];
  data: string; // Base64 data URL
}

const MediaLibrary = ({ qbanks }: MediaLibraryProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [newName, setNewName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showTagFilterModal, setShowTagFilterModal] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const ROWS_PER_PAGE = 5;

  useEffect(() => {
    const savedMedia = localStorage.getItem('mediaLibrary');
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    }
  }, []);

  useEffect(() => {
    const extractedMedia = new Map<string, Set<string>>();

    qbanks.forEach(qbank => {
      qbank.questions.forEach(question => {
        const matches = question.question.match(/\/([^\/]+\.(?:png|jpg|jpeg|gif))/g);
        if (matches) {
          matches.forEach(match => {
            const imageName = match.slice(1);
            if (!extractedMedia.has(imageName)) {
              extractedMedia.set(imageName, new Set());
            }
            question.tags.forEach(tag => {
              extractedMedia.get(imageName)?.add(tag);
            });
          });
        }
      });
    });

    setMediaItems(prev => {
      const updated = prev.map(item => {
        const tags = extractedMedia.get(item.name);
        return {
          ...item,
          tags: tags ? Array.from(tags) : item.tags
        };
      });
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });
  }, [qbanks]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newMediaItems = await Promise.all(files.map(async (file) => {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      return {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        url: URL.createObjectURL(file),
        data: dataUrl,
        tags: []
      };
    }));

    setMediaItems(prev => {
      const updated = [...prev, ...newMediaItems];
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Success",
      description: `${files.length} files uploaded successfully`
    });
  };

  const handleDelete = (id: string) => {
    setMediaItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Success",
      description: "Media deleted successfully"
    });
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setNewName(item.name);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setMediaItems(prev => {
      const updated = prev.map(item =>
        item.id === editingItem.id
          ? { ...item, name: newName }
          : item
      );
      localStorage.setItem('mediaLibrary', JSON.stringify(updated));
      return updated;
    });

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setNewName("");

    toast({
      title: "Success",
      description: "Media name updated successfully"
    });
  };

  const allTags = Array.from(new Set(
    mediaItems.flatMap(item => item.tags)
  )).sort();

  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  const handleTagFilterToggle = (tag: string) => {
    setSelectedFilterTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredMedia = mediaItems.filter(item =>
    (selectedFilterTags.length === 0 || item.tags.some(tag => selectedFilterTags.includes(tag))) &&
    (searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const paginatedMedia = paginationUtil(filteredMedia, ROWS_PER_PAGE) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div className="flex gap-4">
          <div className="relative flex gap-2">
            <Input
              placeholder="Search by name or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Button
              variant="outline"
              onClick={() => setShowTagFilterModal(true)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter by Tags
              {selectedFilterTags.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {selectedFilterTags.length}
                </span>
              )}
            </Button>
          </div>
          <Button asChild>
            <label>
              <Plus className="w-4 h-4 mr-2" />
              Upload Media
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      <Dialog open={showTagFilterModal} onOpenChange={setShowTagFilterModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter by Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search tags..."
              value={tagSearchQuery}
              onChange={(e) => setTagSearchQuery(e.target.value)}
            />
            <div className="max-h-[60vh] overflow-y-auto space-y-2">
              {filteredTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedFilterTags.includes(tag) ? "default" : "outline"}
                  className="mr-2 mb-2"
                  onClick={() => handleTagFilterToggle(tag)}
                >
                  {tag}
                  {selectedFilterTags.includes(tag) && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMedia[pageNumber-1]?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.data}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination  Start*/}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageNumber(prev => prev > 1 ? prev - 1 : 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>

        {/* Details  Start*/}
        <div className="flex p-2">
          <p><strong>{pageNumber}</strong> out of <strong>{paginatedMedia.length}</strong></p>
        </div>
        {/* Details End  */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageNumber(prev => prev < paginatedMedia.length ? prev + 1 : prev)}
          disabled={pageNumber === paginatedMedia.length}
        >
          Next
        </Button>
      </div>
      {/* Pagination  Ends*/}


      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibrary;
