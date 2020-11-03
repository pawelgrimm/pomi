# API Spec v1

## Contents
 - [/users](#users)
   - [GET /](#get-)
   - [GET /sync](#get-sync)
 - [/sessions](#sessions)
   - [GET /](#get--1)
   - [GET /:id](#get-id)
   - [POST /](#post-)
   - [PATCH /](#patch-)
 - [/projects](#projects)
   - [GET /](#get--2)
   - [GET /:id](#get-id-1)
   - [PATCH /:id](#patch-id)
 - [/tasks](#tasks)
   - [GET /](#get--3)
   - [GET /:id](#get-id-2)
   - [PATCH /:id](#patch-id-1)
    
All endpoints require user authorization. 

## /users
### GET /
Gets user info

#### *Response*

```typescript
{
	displayName: string,
	email: string
}
```

### GET /sync 
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
### GET / 
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

### GET /:id
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

### POST /
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
		edited: boolean,
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

### PATCH /
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
		edited: true
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

## /projects
### GET / 
Gets all projects for user [that were updated since last sync]

#### *Request*

*query params*:

 - `sync_token=*`: last sync time
 - `include_archived=0`: include archived projects. Note: if a sync_token is provided, archived items are always included.

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

### GET /:id
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

### PATCH /:id 
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
### GET / 
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

### GET /:id
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

### PATCH /:id 
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
