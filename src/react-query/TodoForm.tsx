import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

const TodoForm = () => {
  const queryClient = useQueryClient();
  // first parameter is data get from backend
  // second parameter is error
  // third parameter is data we send to the server
  const addTodo = useMutation<Todo, Error, Todo>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((res) => res.data),
    onSuccess: (savedTodo, newTodo) => {
      console.log(savedTodo);
      // APPROACH: 1. Invalidate the cache
      // we can tell react query that what in our cache is invalid, and it should refetch the all the data from the server, However it is not work in jsonplaceholder because the object we send to the server is not gonna save in the server, so we can't refetch the data from the server

      // invalidate all the query with the key "todos"
      // queryClient.invalidateQueries({
      //   queryKey: ["todos"],
      // });

      // APPROACH: 2. Update the data in the cache
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        savedTodo,
        ...(todos || []),
      ]);

      // Clear input ref
      // ref.current can be null, so we need to check if it is null or not
      if (ref.current) ref.current.value = "";
    },
  });
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      {addTodo.error && (
        <div className="alert alert-danger">{addTodo.error.message}</div>
      )}
      <form
        className="row mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (ref.current && ref.current.value)
            addTodo.mutate({
              id: 0,
              title: ref.current?.value,
              completed: false,
              userId: 1,
            });
        }}
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button className="btn btn-primary" disabled={addTodo.isLoading}>
            {addTodo.isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
