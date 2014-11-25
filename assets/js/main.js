// membuat namespace untuk enkapsulasi logic database [optional]
var arjuna      = {};
arjuna.webdb    = {};

arjuna.webdb.open = function () {
    var dbSize = 5 * 1024 * 1024; // 5MB
    // variabel = openDatabase('nama_database', 'versi', 'deskripsi', 'ukuran', 'callback')
    arjuna.webdb.db = openDatabase('basisdata', '1.0', 'contoh basis data menggunakan sqlite', dbSize);
};

arjuna.webdb.onError = function (tx, e) {
    alert('terjadi kesealahan: ' + e.message);
};

arjuna.webdb.onSuccess = function (tx, r) {
    // render data
    // panggil fungsi yang diperlukan
    arjuna.webdb.getAllTodoItems(loadTodoItems);
};

arjuna.webdb.createTable = function () {
    var db = arjuna.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, created_date DATETIME)", []);
    });
};

arjuna.webdb.addTodo = function (todoText) {
    var db = arjuna.webdb.db;
    db.transaction(function (tx) {
        var tanggal = new Date();
        tx.executeSql("INSERT INTO todo(todo, created_date) VALUES(?,?)",
            [todoText, tanggal],
            arjuna.webdb.onSuccess,
            arjuna.webdb.onError);
        console.log(tx);
    });

};

arjuna.webdb.getAllTodoItems = function (renderFunc) {
    var db = arjuna.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM todo", [], renderFunc, arjuna.webdb.onError);
    });
};

arjuna.webdb.deleteTodo = function (id) {
    var db = arjuna.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM todo WHERE ID=?",
            [id],
            arjuna.webdb.onSuccess,
            arjuna.webdb.onError);
    });
};

function loadTodoItems (tx, rs) {
    var rowOutput = "";
    var todoItems = document.getElementById("todoItems");
    for (var i = 0; i < rs.rows.length; i++) {
        rowOutput += renderTodo(rs.rows.item(i));
    }

    todoItems.innerHTML = rowOutput;
}

function renderTodo (row) {
    return "<li>" + row.todo + "[<a href='javascript:void(0);' onclick=\'arjuna.webdb.deleteTodo(" + row.ID +");\'>Delete</a>]</li>";
}

function addTodo () {
    var todo = document.getElementById("todo");
    arjuna.webdb.addTodo(todo.value);
    todo.value = "";
}

function init () {
    arjuna.webdb.open();
    arjuna.webdb.createTable();
    arjuna.webdb.getAllTodoItems();
}