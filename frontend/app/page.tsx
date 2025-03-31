"use client";

import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';

export default function Home() {
  return (
    <div>
      <h1>Task Manager</h1>
      <AddTaskForm />
      <TaskList />
    </div>
  );
}


