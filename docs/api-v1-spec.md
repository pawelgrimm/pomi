# API Spec v1

- [/users](#-users)
  * [(auth) GET /](#-auth--get--)
    + [*Response*](#-response-)
  * [(auth) GET /sync](#-auth--get--sync)
    + [*Request*](#-request-)
    + [*Response*](#-response--1)
- [/sessions](#-sessions)
  * [(auth) GET /](#-auth--get---1)
    + [*Request*](#-request--1)
    + [*Response*](#-response--2)
  * [(auth) GET /:id](#-auth--get---id)
    + [*Response*](#-response--3)
  * [(auth) POST /](#-auth--post--)
    + [*Request*](#-request--2)
    + [*Response*](#-response--4)
  * [(auth) PATCH /](#-auth--patch--)
    + [*Request*](#-request--3)
    + [*Response*](#-response--5)
- [/projects/](#-projects-)
  * [(auth) GET /](#-auth--get---2)
    + [*Request*](#-request--4)
    + [*Response*](#-response--6)
  * [(auth) GET /:id](#-auth--get---id-1)
    + [*Response*](#-response--7)
  * [(auth) PATCH /:id](#-auth--patch---id)
    + [*Request*](#-request--5)
    + [*Response*](#-response--8)
- [/tasks](#-tasks)
  * [(auth) GET /](#-auth--get---3)
    + [*Request*](#-request--6)
    + [*Response*](#-response--9)
  * [(auth) GET /:id](#-auth--get---id-2)
    + [*Response*](#-response--10)
  * [(auth) PATCH /:id](#-auth--patch---id-1)
    + [*Request*](#-request--7)
    + [*Response*](#-response--11)

## /users
### (auth) GET /
Gets user info

#### *Response*

```typescript
{
	displayName: string,
	email: string
}
```

### (auth) GET /sync 
Gets all [sessions,] task, and projects for user [that were updated since last sync]

#### *Request*

*query params*:

 - `sync_token=*`: last sync time
 - `include="tasks,projects"`: which models to include (comma seperated)

#### *Response*

```typescript
{
	sync: string,
	sessions?: [{
		taskId: string,
		startTimestamp: Date,
		endTimestamp: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean
  }],
	tasks?: [{
		id: string,
		title?: string,
		projectId: string,
		isCompleted: boolean
	}],
	projects?: [{
		id: string,
		title?: string,
		isArchived: boolean
	}]
}
```

## /sessions
### (auth) GET / 
Gets all sessions for user [that were updated since last sync]

#### *Request*

*query params*:

 - `sync_token=*`: last sync token
 - `start=today`: filter by start_timestamp
 - `end=today`: filter by start_timestamp

#### *Response*

```typescript
{
	sync_token: string,
	sessions: [{
		taskId: string,
		startTimestamp: Date,
		endTimestamp: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean
	}],
}
```

### (auth) GET /:id
Gets session with given id.

#### *Response*

```typescript
{
	session: {
		taskId: string,
		startTimestamp: Date,
		endTimestamp: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean
	},
}
```

### (auth) POST /
Creates a new sessions. Creates a projects and/or task as needed (if title is provided instead of id).

Note: It would be cool if active/incomplete project/task titles were searched first before creating a new record #40 

#### *Request*

```typescript
{
	~
	task: { 
		id: string, 
		isCompleted?: boolean
	} 
	~
	-OR- 
	~
	task: { 
		title?: string, 
		~
		project: { id: string} ,
		-OR- 
		project: { title: string},
		~
		isCompleted?: boolean
	},
	-AND-
	startTimestamp: Date,
	endTimestamp: Date,
	note?: string
	type: "session" | "break" | "long-break",
	retroAdded?: boolean
	~
}

```

#### *Response*

```typescript
{
	session: {
		id: string
		taskId: string,
		startTimestamp: Date,
		endTimestamp: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: false
		retroAdded: boolean
	},
  // Only if new task is created
	task?: {
		id: string,
		title?: string,
		projectId: string,
		isCompleted: boolean
	},
	// Only if new project is created
	project?: {
		id: string,
		title?: string,
		isArchived: boolean
	}
}
```

### (auth) PATCH /
Used primarily by edit session workflow. Creates a projects and/or task as needed (if title is provided instead of id).

#### *Request*

```typescript
{
	~
	task: { 
		id: string, 
		isCompleted?: boolean
	} 
	~
	-OR- 
	~
	task: { 
		title?: string, 
		~
		project: { id: string} ,
		-OR- 
		project: { title: string},
		~
		isCompleted?: boolean
	},
	-AND-
	// if provided, endTimestamp also required
	startTimestamp: Date, 
	// if provided, endTimestamp also required
	endTimestamp: Date, 	
	note?: string,
	type: "session" | "break" | "long-break",
	retroAdded?: boolean
	~
}

```

#### *Response*

```typescript
{
	session: {
		id: string
		taskId: string,
		startTimestamp: Date,
		endTimestamp: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		isEdited: true
		retroAdded: boolean
	},
	// Only if new task is created
	task?: {
		id: string,
		title?: string,
		project: { id: string },
		isCompleted: boolean
	},
	// Only if new project is created
	project?: {
		id: string,
		title?: string,
		archived: boolean
	}	
}
```

## /projects/
### (auth) GET / 
Gets all projects for user [that were updated since last sync]

#### *Request*

*query params*:

 - `sync_token=*`: last sync time
 - `include_archived=0`: include archived projects

#### *Response*

```typescript
{
	projects: [{
		id: string,
		title?: string,
		isArchived: boolean
	}]
}
```

### (auth) GET /:id
Gets the project with the provided id

#### *Response*

```typescript
{
	project: {
		id: string,
		title?: string,
		isArchived: boolean
	}
}
```

### (auth) PATCH /:id 
Update a project

**Sub-routes**

 - /un_archive { isArchived: false }
 - /archive { isArchived: true }
   
#### *Request*

```typescript
{
	title?: string,
	isArchived?: boolean
}
```

#### *Response*

```typescript
{
	project: {
		id: string,
		title?: string,
		isArchived: boolean
	}	
}
```

## /tasks
### (auth) GET / 
Gets all tasks for user [that were updated since last sync]

#### *Request*

*query params*:

 - `sync_token=*`: last sync time
 - `include_completed=0`: include completed projects

#### *Response*

```typescript
{
	tasks: [{
		id: string,
		projectId: string,
		title?: string,
		isCompleted: boolean
	}]
}
```

### (auth) GET /:id
Gets the task with the provided id

#### *Response*

```typescript
{
	task: {
		id: string,
		projectId: string,
		title?: string,
		isCompleted: boolean
	}
}
```

### (auth) PATCH /:id 
Update a project

**Sub-routes**

 - /un_complete { isCompleted: false }
 - /complete { isCompleted: true }
   
#### *Request*

```typescript
{
	projectId?: string,
	title?: string,
	isCompleted: boolean
}
```

#### *Response*

```typescript
{
	task: {
		id: string,
		projectId: string,
		title?: string,
		isCompleted: boolean
	}
}
```
