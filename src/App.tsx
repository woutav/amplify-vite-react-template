import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  // function setToDone(id: string) {
  //   client.models.Todo.update({ id, isDone: true });
  // }

  function toggleIsDone(id: string) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      client.models.Todo.update({ id, isDone: !todo.isDone });
    }
  }
  
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s' todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
            <li key={todo.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "right" }}>
            <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>{todo.content}</span>
            <button onClick={() => toggleIsDone(todo.id)}>
              {todo.isDone ? "Mark as Undone" : "Mark as Done"}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
            </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
