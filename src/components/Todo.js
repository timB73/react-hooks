import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = props => {
    const [todoName, setTodoName] = useState('');
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        axios
            .get('https://react-hooks-95d0d.firebaseio.com/todos.json')
            .then(result => {
                console.log(result);
                const todoData = result.data;
                const todos = [];
                for (const key in todoData) {
                    todos.push({ id: key, name: todoData[key].name });
                }
                setTodoList(todos);
            });

        return () => {
            console.log('Cleanup');
        };
    }, []);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    const inputChangeHandler = event => {
        setTodoName(event.target.value);
    };

    const todoAddHandler = async () => {
        try {
            const res = await axios.post(
                'https://react-hooks-95d0d.firebaseio.com/todos.json',
                { name: todoName }
            );

            console.log(res);
            const todoItem = { id: res.data.name, name: todoName };
            setTodoList(prevList => prevList.concat(todoItem));
        } catch (err) {
            console.log(err);
        }
        setTodoName('');
    };

    return (
        <React.Fragment>
            <input
                type="text"
                placeholder="Todo"
                onChange={inputChangeHandler}
                value={todoName}
            />
            <button type="button" onClick={todoAddHandler}>
                Add
            </button>
            <ul>
                {todoList.map(todo => (
                    <li key={todo.id}>{todo.name}</li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default Todo;
