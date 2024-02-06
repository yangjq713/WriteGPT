<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  minHeight: {
    type: String,
    default: "200px",
  },
});

// const emits = defineEmits(["update:modelValue"]);

const { placeholder, minHeight, modelValue } = toRefs(props);
// const editorContent = ref("");
// const editorComponent = ref();

// watch(modelValue, (val) => {
//   // HTML
//   const isSame = editorComponent.value.getHTML() === val;
//   // JSON
//   // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
//   if (isSame) {
//     return;
//   }
//   editorComponent.value.commands.setContent(val, false);
// });

const editor = useEditor({
  // content: "",
  editorProps: {
    attributes: {
      class: 'h-full'
    }
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "111111"
    })
  ],

  // onUpdate: () => {
  //   // HTML
  //   emits("update:modelValue", editorComponent.value.getHTML());
  //   // JSON
  //   // this.$emit('update:modelValue', this.editor.getJSON())
  // },
});
</script>

<template>
  <editor-content :editor="editor" />
</template>

<style scoped>
/* .editor {
  min-height: var(--minHeight);
}

.ProseMirror>*+* {
  margin-top: 0.75em;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
} */

.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  /* height: 0; */
  pointer-events: none;
}
</style>
