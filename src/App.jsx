import { useEffect, useState } from "react";
import { TodoProvider } from "./contexts";
import { TodoForm, TodoItem } from "./components";
import NavBar from "./components/NavBar";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("asc");

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));

    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSort = (todos) => {
    return [...todos].sort((a, b) =>
      sort === "asc"
        ? a.todo.localeCompare(b.todo)
        : b.todo.localeCompare(a.todo)
    );
  };

  const handleFilter = (todos) => {
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "active":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  };

  const visibleTodos = handleSort(handleFilter(todos));

  return (
    <>
    <NavBar />
      <TodoProvider
        value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
      >
        <div className="min-h-screen py-8">
          <div
            className="w-full bg-[#3b66a6] max-w-2xl mx-auto shadow-md rounded-lg px-4
          py-3 text-white"
          >
            <h1 className="text-2xl font-bold text-center mb-8 mt-2">
              TODO List
            </h1>
            <div className="mb-4">
              <TodoForm />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-3 my-6 mx-auto w-[600px]">
            <div className="flex justify-self-center font-semibold">
              <div className="mx-auto">
                <button
                  onClick={() => setFilter("all")}
                  className={`p-2 px-3 mr-2 rounded ${
                    filter === "all"
                      ? "bg-green-600 text-black"
                      : "bg-slate-400"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`p-2 mr-2 rounded ${
                    filter === "active"
                      ? "bg-[#ccbed7] text-black"
                      : "bg-slate-400"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`p-2 rounded ${
                    filter === "completed"
                      ? "bg-[#c6e9a7] text-black"
                      : "bg-slate-400"
                  }`}
                >
                  Completed
                </button>
              </div>
              <div className="mb-4">
                <button
                  onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
                  className="bg-blue-400 text-black p-2 rounded"
                >
                  Sort {sort === "asc" ? "Descending" : "Ascending"}
                </button>
              </div>
            </div>
            {visibleTodos.map((todo) => (
              <div key={todo.id} className="w-full">
                <TodoItem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </TodoProvider>
    </>
  );
}

export default App;
