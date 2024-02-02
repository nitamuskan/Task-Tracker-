package com.example.restservice;

import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
public class TaskController {

	private final HashMap<Long, Task> tasks = new HashMap<Long, Task>();
	private final AtomicLong counter = new AtomicLong();

	@CrossOrigin(origins = "*")
	@PostMapping("/task/create")
	public Task createTask(@RequestBody CreateTaskForm createTaskForm) {
		long id = counter.incrementAndGet();
		Task newTask = new Task(id, createTaskForm.title, createTaskForm.description, createTaskForm.dueDate, Boolean.FALSE);
		tasks.put(id, newTask);
		return newTask;
	}

	@CrossOrigin(origins = "*")
	@GetMapping("/task/get")
	public Task getTask(@RequestParam(value = "id") Long id) {
		return tasks.get(id);
	}

	@CrossOrigin(origins = "*")
	@PutMapping("/task/update")
	public Task updateTask(@RequestBody Task task) {
		tasks.replace(task.id(), task);
		return task;
	}

	@CrossOrigin(origins = "*")
	@DeleteMapping("/task/delete/{id}")
	public Task deleteTask(@PathVariable long id) {
        return tasks.remove(id);
	}

	@CrossOrigin(origins = "*")
	@GetMapping("/tasks")
	public List<Task> getTasks(
			@RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = "1") Integer pageNumber
	) {
		int to = Math.min(tasks.size(), pageNumber * pageSize);
		return tasks.values().stream().toList().subList((pageNumber-1)*pageSize, to);
	}
}
