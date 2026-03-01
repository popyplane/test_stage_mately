import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Task } from '../api/taskService';

const STATUS_COLORS = {
  todo: '#808080',
  in_progress: '#007AFF',
  done: '#34C759',
};

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  
  const showMobileMenu = () => {
    if (Platform.OS === 'web') return;

    Alert.alert(
      "Modifier le statut",
      "Choisissez le nouveau statut",
      [
        { text: "Todo", onPress: () => onUpdate(task._id, { status: 'todo' }) },
        { text: "In-Progress", onPress: () => onUpdate(task._id, { status: 'in_progress' }) },
        { text: "Done", onPress: () => onUpdate(task._id, { status: 'done' }) },
        { text: "Annuler", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[task.status] }]} />
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        <Text style={styles.date}>{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.pickerWrapper} 
          onPress={showMobileMenu}
          activeOpacity={0.7}
        >
          {/* Visible Styled Badge */}
          <View style={[styles.pickerDisplay, { borderColor: STATUS_COLORS[task.status] + '40' }]}>
            <Text style={[styles.pickerText, { color: STATUS_COLORS[task.status] }]}>
              {task.status.replace('_', ' ')}
            </Text>
            <Text style={[styles.arrow, { color: STATUS_COLORS[task.status] }]}>▾</Text>
          </View>

          {/* Web-only Select: hidden on Mobile to avoid crash */}
          {Platform.OS === 'web' && (
            <select
              value={task.status}
              onChange={(e) => onUpdate(task._id, { status: e.target.value as Task['status'] })}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In-Progress</option>
              <option value="done">Done</option>
            </select>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task._id)}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  date: {
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  pickerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  pickerText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  arrow: {
    fontSize: 10,
    marginTop: -1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.6,
  },
});