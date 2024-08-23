import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Result "mo:base/Result";

actor TaskManager {
  // Task type definition
  type Task = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  // Stable variables for persistence
  stable var taskIdCounter : Nat = 0;
  stable var tasks : [Task] = [];

  // Add a new task
  public func addTask(text : Text) : async Result.Result<Nat, Text> {
    if (text == "") {
      return #err("Task text cannot be empty");
    };
    let newTask : Task = {
      id = taskIdCounter;
      text = text;
      completed = false;
    };
    tasks := Array.append(tasks, [newTask]);
    taskIdCounter += 1;
    #ok(newTask.id)
  };

  // Get all tasks
  public query func getTasks() : async [Task] {
    tasks
  };

  // Update task status
  public func updateTaskStatus(id : Nat, completed : Bool) : async Result.Result<(), Text> {
    let taskIndex = Array.indexOf<Task>({ id = id; text = ""; completed = false }, tasks, func(a, b) { a.id == b.id });
    switch (taskIndex) {
      case null {
        #err("Task not found")
      };
      case (?index) {
        let updatedTask = {
          id = tasks[index].id;
          text = tasks[index].text;
          completed = completed;
        };
        tasks := Array.tabulate<Task>(tasks.size(), func (i) {
          if (i == index) { updatedTask } else { tasks[i] }
        });
        #ok()
      };
    }
  };

  // Delete a task
  public func deleteTask(id : Nat) : async Result.Result<(), Text> {
    let updatedTasks = Array.filter<Task>(tasks, func(task) { task.id != id });
    if (updatedTasks.size() == tasks.size()) {
      #err("Task not found")
    } else {
      tasks := updatedTasks;
      #ok()
    }
  };
}
