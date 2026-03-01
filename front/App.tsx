import React, { useState, useMemo, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  StatusBar, 
  TextInput, 
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { useTaskPolling } from './src/hooks/useTaskPolling';
import { TaskItem } from './src/components/TaskItem';
import { taskService, Task } from './src/api/taskService';

type ViewType = 'list' | 'board';

export default function App() {
  const { tasks, loading, error, clearAll, addTask, updateTask, removeTask } = useTaskPolling();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const { width: windowWidth } = useWindowDimensions();

  // Responsive logic
  const isLargeScreen = windowWidth > 768;
  const columnWidth = isLargeScreen ? (windowWidth - 60) / 3 : windowWidth * 0.85;

  const handleSimulate = async () => {
    try {
      await taskService.triggerSimulation();
    } catch (err) {
      alert('Error starting simulation');
    }
  };

  const handleCreate = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      await addTask(newTaskTitle);
      setNewTaskTitle('');
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleClear = async () => {
    try {
      await clearAll();
    } catch (err) {
      alert('Error clearing tasks');
    }
  };

  const groupedTasks = useMemo(() => {
    return {
      todo: tasks.filter(t => t.status === 'todo'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      done: tasks.filter(t => t.status === 'done'),
    };
  }, [tasks]);

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting to Mately...</Text>
      </View>
    );
  }

  const renderBoardSection = (title: string, statusTasks: Task[], color: string) => (
    <View style={[styles.boardColumn, { width: columnWidth }]}>
      <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: color + '15' }]}>
          <Text style={[styles.badgeText, { color }]}>{statusTasks.length}</Text>
        </View>
      </View>
      <ScrollView 
        style={styles.columnScrollView}
        contentContainerStyle={styles.columnContent}
        showsVerticalScrollIndicator={false}
      >
        {statusTasks.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>No tasks</Text>
          </View>
        ) : (
          statusTasks.map(item => (
            <TaskItem 
              key={item._id}
              task={item} 
              onUpdate={updateTask} 
              onDelete={removeTask}
            />
          ))
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mately Tasks</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleCreate}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.viewSwitcher}>
          <TouchableOpacity 
            style={[styles.switchButton, currentView === 'list' && styles.activeSwitch]} 
            onPress={() => setCurrentView('list')}
          >
            <Text style={[styles.switchText, currentView === 'list' && styles.activeSwitchText]}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.switchButton, currentView === 'board' && styles.activeSwitch]} 
            onPress={() => setCurrentView('board')}
          >
            <Text style={[styles.switchText, currentView === 'board' && styles.activeSwitchText]}>Board</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.simulateBtn]} onPress={handleSimulate}>
            <Text style={[styles.actionBtnText, styles.simulateBtnText]}>Simulate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={handleClear}>
            <Text style={[styles.actionBtnText, styles.clearBtnText]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {currentView === 'list' ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskItem 
              task={item} 
              onUpdate={updateTask} 
              onDelete={removeTask}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Your task list is empty.</Text>
            </View>
          }
        />
      ) : (
        <ScrollView 
          horizontal={!isLargeScreen}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.boardHorizontalContent,
            isLargeScreen && styles.boardLargeScreenContent
          ]}
          snapToInterval={!isLargeScreen ? columnWidth + 20 : undefined}
          decelerationRate="fast"
        >
          {renderBoardSection('Todo', groupedTasks.todo, '#808080')}
          {renderBoardSection('In Progress', groupedTasks.in_progress, '#007AFF')}
          {renderBoardSection('Done', groupedTasks.done, '#34C759')}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    padding: 3,
    marginBottom: 12,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSwitch: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  switchText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C757D',
  },
  activeSwitchText: {
    color: '#212529',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  simulateBtn: {
    backgroundColor: '#007AFF10',
  },
  clearBtn: {
    backgroundColor: '#FF3B3010',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  simulateBtnText: {
    color: '#007AFF',
  },
  clearBtnText: {
    color: '#FF3B30',
  },
  listContent: {
    paddingVertical: 10,
  },
  boardHorizontalContent: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  boardLargeScreenContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  boardColumn: {
    marginHorizontal: 10,
    backgroundColor: '#F1F3F5',
    borderRadius: 14,
    paddingTop: 12,
    maxHeight: '100%',
  },
  columnScrollView: {
    flex: 1,
  },
  columnContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  emptySection: {
    padding: 20,
    alignItems: 'center',
  },
  emptySectionText: {
    color: '#ADB5BD',
    fontSize: 12,
    fontStyle: 'italic',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  emptyText: {
    marginTop: 50,
    fontSize: 15,
    color: '#ADB5BD',
  },
  errorBanner: {
    backgroundColor: '#FF3B30',
    padding: 10,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontWeight: '600',
  },
});