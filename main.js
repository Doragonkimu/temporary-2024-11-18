// const getTodos = () => {
//   const storedTodos = localStorage.getItem('todos');
//   return storedTodos ? JSON.parse(storedTodos) : [];
// };

// [...document.getElementsByClassName('delete-btn')]
//   .forEach(node => node.addEventListener('click', () => console.log(confirm('このTODOを削除してもよろしいですか？'))));


//   submit.addEventListener('click', () => {
//     const uncompleteLIST = document.getElementById("uncompleted-todo-list");
//     uncompleteLIST.innerHTML = '';

//     const todo_card = document.createElement("div");
//   });



//   document.querySelector('#todo-form')
//   .addEventListener('submit',(e))=>{

//   }





// localStorage からTODOリストを取得
const getTodos = () => {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

// localStorage にTODOリストを保存
const saveTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

// TODOを削除する処理
const deleteTodo = (todoCard) => {
  const todoId = todoCard.dataset.id; // 削除するTODOのIDを取得
  const todos = getTodos(); // 現在のTODOリストを取得
  const updatedTodos = todos.filter(todo => todo.id !== todoId); // 削除したTODOを除外した新しいリストを作成

  saveTodos(updatedTodos); // 更新したTODOリストをlocalStorageに保存
  todoCard.remove(); // DOMからTODOを削除
};

// チェックボックスの状態が変わったときの処理
const toggleTodoCompletion = (todoCard, todoId) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === todoId) {
      todo.completed = !todo.completed; // 完了状態を反転させる
    }
    return todo;
  });

  saveTodos(updatedTodos); // 更新したTODOリストをlocalStorageに保存
  renderTodos(); // TODOリストを再描画
};

// 削除ボタンがクリックされたときのイベントリスナーを設定
[...document.getElementsByClassName('delete-btn')]
  .forEach(node => node.addEventListener('click', (event) => {
    const todoCard = event.target.closest('.todo-card'); // 削除対象のTODOカードを取得
    const confirmDelete = confirm('このTODOを削除してもよろしいですか？'); // 確認ダイアログ

    if (confirmDelete) {
      deleteTodo(todoCard); // 削除処理を実行
    }
  }));

// localStorage からTODOリストをレンダリングする処理
const renderTodos = () => {
  const todos = getTodos();
  const uncompletedTodoList = document.getElementById('uncompleted-todo-list');
  const completedTodoList = document.getElementById('completed-todo-list');
  
  // 現在のリストをクリア
  uncompletedTodoList.innerHTML = '';
  completedTodoList.innerHTML = '';

  todos.forEach(todo => {
    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-card');
    todoCard.dataset.id = todo.id;
    
    todoCard.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} />
      <span class="todo-text" contenteditable="true">${todo.text}</span>
      <button class="delete-btn">削除</button>
    `;
    
    // チェックボックスの状態が変わったときのイベントリスナー
    const checkbox = todoCard.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      toggleTodoCompletion(todoCard, todo.id);
    });

    // 削除ボタンのイベントリスナーを追加
    const deleteBtn = todoCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (event) => {
      const confirmDelete = confirm('このTODOを削除してもよろしいですか？');
      if (confirmDelete) {
        deleteTodo(todoCard);
      }
    });

    // TODOが完了しているかどうかで表示するリストを分ける
    if (todo.completed) {
      completedTodoList.appendChild(todoCard);
    } else {
      uncompletedTodoList.appendChild(todoCard);
    }
  });
};

// ページ読み込み時にTODOリストを表示
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
});

// 新しいTODOを追加する処理
const addTodo = (text) => {
  const todoId = crypto.randomUUID(); // 新しいTODOの一意なIDを生成
  const todos = getTodos();
  
  const newTodo = {
    id: todoId,
    text: text,
    completed: false // 新しいTODOは未完了として追加
  };

  todos.push(newTodo); // 新しいTODOをリストに追加
  saveTodos(todos); // 更新したTODOリストをlocalStorageに保存
  renderTodos(); // TODOリストを再描画
};

// TODO追加フォームの処理
const todoForm = document.getElementById('todo-form');
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const todoInput = document.getElementById('todo-input');
  const todoText = todoInput.value.trim();
  if (todoText) {
    addTodo(todoText); // 新しいTODOを追加
    todoInput.value = ''; // 入力フィールドをクリア
  }
});

