import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const TodoList = () => {
  const fetchTodos = () =>
    // at runtime, the queryFn function is called and the promise is resolved,we get an array of Todo[], the data is stored in the cache with the queryKey as the cache key
    axios
      .get<Todo[]>("https://xjsonplaceholder.typicode.com/todos")
      .then((res) => res.data);

  // 1. Auto Retries if the request fails
  // 2. Auto Refetching at a specified interval(can be customized)
  // 3. Caching : First time the data is fetched, it is stored in the cache, so if we navigate to another page and come back, the data is retrieved from the cache
  const { data: todos, error } = useQuery<Todo[], Error>({
    // unique identifier for the query, used as the cache key, so anytime we retrieve a piece of data from the backend, the data is stored in the cache with this key
    queryKey: ["todos"],
    // function that returns the promise of the data we want to fetch
    queryFn: fetchTodos,
  });

  if (error) return <p>{error.message}</p>;

  return (
    <ul className="list-group">
      {todos?.map((todo) => (
        <li key={todo.id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
