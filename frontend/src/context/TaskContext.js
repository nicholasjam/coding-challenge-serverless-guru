import React, { createContext, useContext, useReducer } from 'react';

// Action types
const TASK_ACTIONS = {
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
  },
};

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case TASK_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case TASK_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case TASK_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const TaskContext = createContext();

// Context provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Action creators
  const actions = {
    setTasks: (tasks) => {
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: tasks });
    },

    addTask: (task) => {
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: task });
    },

    updateTask: (task) => {
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: task });
    },

    deleteTask: (taskId) => {
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
    },

    setLoading: (loading) => {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: error });
    },

    setFilters: (filters) => {
      dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: filters });
    },

    clearError: () => {
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
    },
  };

  // Computed values
  const computedValues = {
    // Get filtered tasks based on current filters
    filteredTasks: state.tasks.filter(task => {
      const matchesStatus = !state.filters.status || task.status === state.filters.status;
      const matchesPriority = !state.filters.priority || task.priority === state.filters.priority;
      const matchesSearch = !state.filters.search || 
        task.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(state.filters.search.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    }),

    // Get task counts by status
    taskCounts: {
      total: state.tasks.length,
      pending: state.tasks.filter(task => task.status === 'pending').length,
      inProgress: state.tasks.filter(task => task.status === 'in-progress').length,
      completed: state.tasks.filter(task => task.status === 'completed').length,
      cancelled: state.tasks.filter(task => task.status === 'cancelled').length,
    },

    // Get task counts by priority
    priorityCounts: {
      low: state.tasks.filter(task => task.priority === 'low').length,
      medium: state.tasks.filter(task => task.priority === 'medium').length,
      high: state.tasks.filter(task => task.priority === 'high').length,
      urgent: state.tasks.filter(task => task.priority === 'urgent').length,
    },
  };

  const value = {
    ...state,
    ...actions,
    ...computedValues,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTask = () => {
  const context = useContext(TaskContext);
  
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  
  return context;
};

export default TaskContext;
