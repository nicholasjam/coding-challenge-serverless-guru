import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as StartIcon,
  Check as CompleteIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';

import { useTask } from '../context/TaskContext';
import taskService from '../services/taskService';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { updateTask, deleteTask } = useTask();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const taskData = await taskService.getTask(id);
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      setError(error.userMessage || 'Failed to load task');
      enqueueSnackbar('Failed to load task', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      const updatedTask = await taskService.updateTaskStatus(id, newStatus);
      setTask(updatedTask);
      updateTask(updatedTask);
      enqueueSnackbar(`Task marked as ${newStatus}`, { variant: 'success' });
    } catch (error) {
      console.error('Error updating task status:', error);
      enqueueSnackbar('Failed to update task status', { variant: 'error' });
    } finally {
      setActionLoading(false);
      setMenuAnchor(null);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await taskService.deleteTask(id);
      deleteTask(id);
      setDeleteDialog(false);
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      enqueueSnackbar('Failed to delete task', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      return format(parseISO(dateString), 'MMMM dd, yyyy \'at\' h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getQuickActions = () => {
    if (!task) return [];

    const actions = [];
    
    if (task.status === 'pending') {
      actions.push({
        label: 'Start Task',
        icon: <StartIcon />,
        action: () => handleStatusChange('in-progress'),
        color: 'info',
      });
    }
    
    if (task.status === 'in-progress') {
      actions.push({
        label: 'Mark Complete',
        icon: <CompleteIcon />,
        action: () => handleStatusChange('completed'),
        color: 'success',
      });
      actions.push({
        label: 'Pause Task',
        icon: <PauseIcon />,
        action: () => handleStatusChange('pending'),
        color: 'warning',
      });
    }
    
    if (task.status === 'completed') {
      actions.push({
        label: 'Reopen Task',
        icon: <StartIcon />,
        action: () => handleStatusChange('in-progress'),
        color: 'info',
      });
    }

    return actions;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tasks')}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Task not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tasks')}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton
          onClick={() => navigate('/tasks')}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Task Details
        </Typography>
        <IconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          disabled={actionLoading}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Main Task Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {/* Title */}
              <Typography variant="h5" component="h2" gutterBottom>
                {task.title}
              </Typography>

              {/* Status and Priority */}
              <Box display="flex" gap={1} mb={3}>
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                />
                <Chip
                  label={`${task.priority} priority`}
                  color={getPriorityColor(task.priority)}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Description */}
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {task.description || 'No description provided'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Dates */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(task.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(task.updatedAt)}
                  </Typography>
                </Grid>
                {task.dueDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(task.dueDate)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>

            <CardActions>
              <Button
                startIcon={<EditIcon />}
                onClick={() => navigate(`/tasks/${task.id}/edit`)}
                disabled={actionLoading}
              >
                Edit
              </Button>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog(true)}
                disabled={actionLoading}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {getQuickActions().map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    color={action.color}
                    startIcon={action.icon}
                    onClick={action.action}
                    disabled={actionLoading}
                    fullWidth
                  >
                    {action.label}
                  </Button>
                ))}
                {getQuickActions().length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No quick actions available for this task status.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Task Statistics */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Info
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Task ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {task.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    User ID
                  </Typography>
                  <Typography variant="body2">
                    {task.userId}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => navigate(`/tasks/${task.id}/edit`)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialog(true)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteTask}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetail;
