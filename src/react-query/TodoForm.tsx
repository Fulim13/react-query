import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

interface AddTodoContext {
  previousTodos: Todo[];
}

const TodoForm = () => {
  const queryClient = useQueryClient();
  // first parameter is data get from backend
  // second parameter is error
  // third parameter is data we send to the server
  const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todosx", todo)
        .then((res) => res.data),
    // this function is called before our mutation get executed
    // variable in react query refer to the data we send to the server
    onMutate: (newTodo: Todo) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
      console.log(newTodo);
      // APPROACH: 1. Invalidate the cache
      // we can tell react query that what in our cache is invalid, and it should refetch the all the data from the server, However it is not work in jsonplaceholder because the object we send to the server is not gonna save in the server, so we can't refetch the data from the server

      // invalidate all the query with the key "todos"
      // queryClient.invalidateQueries({
      //   queryKey: ["todos"],
      // });

      // APPROACH: 2. Update the data in the cache
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        newTodo,
        ...(todos || []),
      ]);

      // Clear input ref
      // ref.current can be null, so we need to check if it is null or not
      if (ref.current) ref.current.value = "";

      return { previousTodos };
    },
    // savedTodo is the data we get from the server
    // newTodo is the data we send to the server
    // Why setQueryData needto have <Todo[]> type?
    // so that the updated  function todos is not gonna be any, but it is gonna be Todo[]
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },

    // Context is the object that we create to pass data in between our callbackd, here we need a context object that inlcude the previous todos before we update the cache
    onError: (error, newTodo, context) => {
      if (!context) return;

      queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos);
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
