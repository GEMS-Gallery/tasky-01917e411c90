import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

type Task = {
  id: bigint;
  text: string;
  completed: boolean;
};

type FormData = {
  taskText: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
      setError('Unable to fetch tasks. Please try again later.');
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const result = await backend.addTask(data.taskText);
      if ('ok' in result) {
        reset();
        await fetchTasks();
      } else {
        setError(result.err);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Unable to add task. Please try again.');
    }
    setLoading(false);
  };

  const handleToggleTask = async (id: bigint, completed: boolean) => {
    setLoading(true);
    try {
      const result = await backend.updateTaskStatus(id, !completed);
      if ('ok' in result) {
        await fetchTasks();
      } else {
        setError(result.err);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Unable to update task. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: bigint) => {
    setLoading(true);
    try {
      const result = await backend.deleteTask(id);
      if ('ok' in result) {
        await fetchTasks();
      } else {
        setError(result.err);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Unable to delete task. Please try again.');
    }
    setLoading(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Task Manager
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 2 }}>
        <TextField
          {...register('taskText', { required: true })}
          label="New Task"
          variant="outlined"
          fullWidth
          sx={{ mr: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="warning"
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
          disabled={loading}
        >
          Add Task
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem key={Number(task.id)} dense>
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id, task.completed)}
                disabled={loading}
              />
              <ListItemText
                primary={task.text}
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
