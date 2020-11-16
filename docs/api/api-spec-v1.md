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
   - [GET /:id](#get-id-1)
   - [PATCH /:id](#patch-id)
 - [/tasks](#tasks)
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
	email: string,
	defaultProject: string
}
```

### GET /sync 
Gets all [sessions,] task, and projects for user [that were updated since last sync]

#### *Request*

*query params*:

 - [`sync_token`]: sync token from last sync. Defaults to `"*"` to get all sessions and a new sync token


#### *Response*

```typescript
{
	syncToken: string,
	sessions?: [{
		taskId: string,
		startTimestamp: Date,
		duration: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean
		lastUpdated: Date
  }],
	tasks?: [{
		id: string,
		title?: string,
		projectId: string,
		isCompleted: boolean,
		lastUpdated: Date
	}],
	projects?: [{
		id: string,
		title?: string,
		isArchived: boolean,
		lastUpdated: Date
	}]
}
```

## /sessions
### GET / 
Gets all sessions for user [with a startTimestamp within the provided range]

#### *Request*

*query params*:

 - [`start`]: select sessions with startTimestamp >= start
 - [`end`]: select sessions with startTimestamp < end

#### *Response*

```typescript
{
	sessions: [{
		taskId: string,
		startTimestamp: Date,
		duration: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean,
		lastUpdated: Date
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
		duration: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean,
		lastUpdated: Date
	},
}
```

### POST /
Creates a new session. Creates a projects and/or task as needed (if title is provided instead of id).

*Note: It would be cool if active/incomplete project/task titles were searched first before creating a new record #40*

#### *Request*

```typescript
{
	task?: { 
		id: string, 
		isCompleted?: boolean
		projectId?: string
	},
	project?: {
		title: string
	}
	session: {
		startTimestamp: Date,
		duration: number,
		note?: string
		type: "session" | "break" | "long-break",
		retroAdded?: boolean
	}
}

```

#### *Response*

```typescript
{
	session: {
		id: string
		taskId: string,
		startTimestamp: Date,
		duration: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean,
		lastUpdated: Date
	},
  // Only if new task is created
	task?: {
		id: string,
		title?: string,
		projectId: string,
		isCompleted: boolean,
		lastUpdated: Date
	},
	// Only if new project is created
	project?: {
		id: string,
		title?: string,
		isArchived: boolean,
		lastUpdated: Date
	}
}
```

### PATCH /
Used primarily by edit session workflow. Creates a projects and/or task as needed (if title is provided instead of id).

#### *Request*

```typescript
{
	task?: { 
		id: string, 
		isCompleted?: boolean
		projectId?: string
	},
	project?: {
		title: string
	}
	session: {
		startTimestamp: Date,
		duration: number,
		note?: string
		type: "session" | "break" | "long-break",
		retroAdded?: boolean
	}
}

```

#### *Response*

```typescript
{
	session: {
		id: string
		taskId: string,
		startTimestamp: Date,
		duration: Date,
		note?: string,
		type: "session" | "break" | "long-break",
		edited: boolean,
		retroAdded: boolean,
		lastUpdated: Date
	},
  // Only if new task is created
	task?: {
		id: string,
		title?: string,
		projectId: string,
		isCompleted: boolean,
		lastUpdated: Date
	},
	// Only if new project is created
	project?: {
		id: string,
		title?: string,
		isArchived: boolean,
		lastUpdated: Date
	}
}
```

## /projects

### GET /:id
Gets the project with the provided id

#### *Response*

```typescript
{
	project: {
		id: string,
		title?: string,
		isArchived: boolean,
		lastUpdated: Date
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
		isArchived: boolean,
		lastUpdated: Date
	}	
}
```

## /tasks

### GET /:id
Gets the task with the provided id

#### *Response*

```typescript
{
	task: {
		id: string,
		projectId: string,
		title?: string,
		isCompleted: boolean,
		lastUpdated: Date
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
		isCompleted: boolean,
		lastUpdated: Date
	}
}
```
