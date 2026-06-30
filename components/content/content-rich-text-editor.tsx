"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import LinkExtension from "@tiptap/extension-link"
import Highlight from "@tiptap/extension-highlight"

import { Toggle } from "@/components/ui/toggle"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckListIcon, CodeIcon, LeftToRightListBulletIcon, LeftToRightListNumberIcon, Link02Icon, Loading03Icon, MinusSignIcon, QuoteDownIcon, Redo03Icon, TextBoldIcon, TextIcon, TextItalicIcon, TextStrikethroughIcon, TextUnderlineIcon, Undo03Icon } from "@hugeicons/core-free-icons"
import { getAiSuggestion } from "@/lib/actions/ai"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

const HEADING_OPTIONS = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
]

export function ContentRichTextEditor({ value, onChange, placeholder, minHeight = 100 }: RichTextEditorProps) {
  const [checkingGrammar, setCheckingGrammar] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-2" },
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2 [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li]:items-start [&_ul[data-type=taskList]_li>label]:mr-2 [&_ul[data-type=taskList]_li>label]:mt-1",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  })

  const handleGrammarCheck = useCallback(async () => {
    if (!editor) return
    const text = editor.state.doc.textContent
    if (!text.trim()) {
      toast.error("No text to check")
      return
    }
    setCheckingGrammar(true)
    const { data, error } = await getAiSuggestion("grammar", text.trim())
    if (data) {
      toast.success("Grammar check complete")
      editor.commands.setContent(data.result)
      onChange(data.result)
    } else {
      toast.error(error || "Grammar check failed")
    }
    setCheckingGrammar(false)
  }, [editor, onChange])

  function getActiveHeading(): string {
    if (!editor) return "p"
    for (const opt of HEADING_OPTIONS) {
      if (opt.value === "p") continue
      const level = parseInt(opt.value[1])
      if (editor.isActive("heading", { level })) return opt.value
    }
    return "p"
  }

  function handleHeadingChange(val: string) {
    if (!editor) return
    if (val === "p") {
      editor.chain().focus().setParagraph().run()
    } else {
      const level = parseInt(val[1]) as 1 | 2 | 3 | 4
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  function handleOpenLink() {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    setLinkUrl(previousUrl || "")
    setLinkDialogOpen(true)
  }

  function handleSetLink() {
    if (!editor) return
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run()
    }
    setLinkDialogOpen(false)
    setLinkUrl("")
  }

  function handleUnsetLink() {
    if (!editor) return
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkDialogOpen(false)
  }

  if (!editor) return null

  return (
    <div className="rounded-md border" style={{ minHeight }}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-white dark:bg-zinc-900 px-2 py-1.5">
        <Select value={getActiveHeading()} onValueChange={handleHeadingChange}>
          <SelectTrigger className="h-7 w-[120px] border-0 bg-transparent text-xs shadow-none focus:ring-0 [&>svg]:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HEADING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mx-1 h-4 w-px bg-border" />

        <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
         <HugeiconsIcon icon={TextBoldIcon} />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <HugeiconsIcon icon={TextItalicIcon} />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
       <HugeiconsIcon icon={TextUnderlineIcon} />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <HugeiconsIcon icon={TextStrikethroughIcon} />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("code")} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
     <HugeiconsIcon icon={CodeIcon} />
        </Toggle>

        <div className="mx-1 h-4 w-px bg-border" />

        <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
      <HugeiconsIcon icon={LeftToRightListBulletIcon} />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
 <HugeiconsIcon icon={LeftToRightListNumberIcon} />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive("taskList")} onPressedChange={() => editor.chain().focus().toggleTaskList().run()}>
          <HugeiconsIcon icon={CheckListIcon} />
        </Toggle>

        <div className="mx-1 h-4 w-px bg-border" />

        <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
       <HugeiconsIcon icon={QuoteDownIcon} />
        </Toggle>
        <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
     <HugeiconsIcon icon={MinusSignIcon} />
        </Toggle>

        <div className="mx-1 h-4 w-px bg-border" />

        <Toggle size="sm" pressed={editor.isActive("link")} onPressedChange={handleOpenLink}>
<HugeiconsIcon icon={Link02Icon} />
        </Toggle>

        <div className="ml-auto flex items-center gap-0.5">
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().undo().run()}>
           <HugeiconsIcon icon={Undo03Icon} />
          </Toggle>
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().redo().run()}>
            <HugeiconsIcon icon={Redo03Icon} />
          </Toggle>

          <div className="mx-1 h-4 w-px bg-border" />

          <button
            onClick={handleGrammarCheck}
            disabled={checkingGrammar}
            className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            title="Check grammar & spelling"
          >
            {checkingGrammar ? (
           <HugeiconsIcon icon={Loading03Icon} className="animate-spin"/>
            ) : (
            // <HugeiconsIcon icon={SpellCheckIcon} className="size-4"/>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="size-4">
    <path d="M5.99219 13H14.9922"></path>
    <path d="M15.9922 14.8567L13.3817 7.82442C12.1874 4.60709 11.5902 2.99842 10.5508 3C9.51135 3.00158 8.91872 4.61206 7.73347 7.83302L3.99219 18"></path>
    <path d="M13.9922 19.3929C13.9922 19.3929 15.1922 20.0447 15.7922 21C15.7922 21 17.5922 17.25 19.9922 16"></path>
</svg>
            )}
            <span className="hidden sm:inline">Check</span>
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .ProseMirror li {
          display: list-item;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] li > label {
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] {
          cursor: pointer;
        }
        .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1;
        }
      `}</style>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => { if (e.key === "Enter") handleSetLink() }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={handleUnsetLink}>
              Remove
            </Button>
            <Button size="sm" onClick={handleSetLink}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
