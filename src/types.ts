export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
  categoryId: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
