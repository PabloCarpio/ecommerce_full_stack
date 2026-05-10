'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Development', slug: 'development', parentId: null, children: [{ id: '1a', name: 'Web Development', slug: 'web-development', parentId: '1' }] },
    { id: '2', name: 'Design', slug: 'design', parentId: null, children: [{ id: '2a', name: 'UI Design', slug: 'ui-design', parentId: '2' }] },
    { id: '3', name: 'Business', slug: 'business', parentId: null },
    { id: '4', name: 'Marketing', slug: 'marketing', parentId: null },
  ]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '1': true, '2': true });
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const startEdit = (cat: Category) => {
    setEditing(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: editName } : c)),
    );
    setEditing(null);
    toast({ title: 'Category updated' });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Category deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground mt-1">{categories.length} top-level categories</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">Children</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  expanded={expanded}
                  editing={editing}
                  editName={editName}
                  setEditName={setEditName}
                  toggleExpand={toggleExpand}
                  startEdit={startEdit}
                  saveEdit={saveEdit}
                  deleteCategory={deleteCategory}
                  depth={0}
                />
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryRow({
  category,
  expanded,
  editing,
  editName,
  setEditName,
  toggleExpand,
  startEdit,
  saveEdit,
  deleteCategory,
  depth,
}: {
  category: Category;
  expanded: Record<string, boolean>;
  editing: string | null;
  editName: string;
  setEditName: (v: string) => void;
  toggleExpand: (id: string) => void;
  startEdit: (cat: Category) => void;
  saveEdit: (id: string) => void;
  deleteCategory: (id: string) => void;
  depth: number;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expanded[category.id];

  return (
    <>
      <tr className="border-b last:border-0 hover:bg-muted/50">
        <td className="p-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
            {hasChildren ? (
              <button onClick={() => toggleExpand(category.id)} className="shrink-0">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            {editing === category.id ? (
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-48" />
            ) : (
              <span className="font-medium">{category.name}</span>
            )}
          </div>
        </td>
        <td className="p-4 text-sm text-muted-foreground">{category.slug}</td>
        <td className="p-4 text-sm">{category.children?.length ?? 0}</td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {editing === category.id ? (
              <Button size="sm" onClick={() => saveEdit(category.id)}>Save</Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => startEdit(category)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      {hasChildren && isExpanded &&
        category.children!.map((child) => (
          <CategoryRow
            key={child.id}
            category={child}
            expanded={expanded}
            editing={editing}
            editName={editName}
            setEditName={setEditName}
            toggleExpand={toggleExpand}
            startEdit={startEdit}
            saveEdit={saveEdit}
            deleteCategory={deleteCategory}
            depth={depth + 1}
          />
        ))}
    </>
  );
}
