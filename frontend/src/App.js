import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';

import Layout from './components/Layout/Layout';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Routes>
            {/* Default route - redirect to tasks */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            
            {/* Task management routes */}
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/new" element={<CreateTask />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Container>
    </Layout>
  );
}

export default App;
