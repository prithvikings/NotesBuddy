import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addNote,
  deleteNote,
  getNotes,
  initDatabase,
  updateNote,
} from "../../db";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      await loadNotes();
    };

    setup();
  }, []);

  const handleSave = async () => {
    if (editingNote) {
      await updateNote(editingNote.id, title, content);
    } else {
      await addNote(title, content);
    }
    setTitle("");
    setContent("");
    setEditingNote(null);
    setModalVisible(false);
    await loadNotes();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const loadNotes = async () => {
    const allNotes = await getNotes();
    setNotes(allNotes);
  };

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    await loadNotes();
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setModalVisible(true);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteCard} onPress={() => handleEdit(item)}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title || "Untitled"}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButton}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNewNote}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          notes.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create your first note
            </Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#666"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Content"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#1e1e1e",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff4444",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  noteCard: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  deleteButton: {
    fontSize: 28,
    color: "#ff4444",
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  noteContent: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    padding: 12,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "#aaa",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#ff4444",
    padding: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
