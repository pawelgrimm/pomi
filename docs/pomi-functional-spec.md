---
<img src="./assets/pomi-icon.png" width="100px"/>

# Pomi
Functional Specification

Version 0.1

Pawel Grimm </br>
Last Updated: September 2, 2020

---
# Overview
Pomi is a web application that allows users to track and log their time using the Pomodoro technique (see [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique
)). The main goals are as follows:

1.	Provide an intuitive and easy-to-use interface
2.	Integrate with [Todoist API](https://developer.todoist.com/sync/v8/) to link timer sessions with tasks 
3.	Allow reports to be generated based on time tracking data
4. Allow users to estimate how long tasks will take and compare to actual time taken

**This spec is not, by any stretch of the imagination, complete.** All of the wording will need to be revised several times before it is finalized. The graphics and layout of the screens is shown here merely to illustrate the underlying functionality. The actual look and feel will be developed over time with the input of graphics designers and iterative user feedback.

# Features

- Web client
- Desktop notifications
- Logging an estimated time for a task
- Completing tasks
- Tracking session and break overflow

# Scenarios
### Scenario 1: Sarah
Sarah is a busy support engineer that wears many different hats. She is responsible for 3 customers, manages 6 engineers, and leads a workgroup. She wants to make sure she is spending her time effectively. She uses the Pomodoro technique to pace herself and write down how she spent each session. However, she doesn't have a great way to get a bird's eye view of how her time is being spent over the course of weeks or months. Pomi will allow her to analyze his time and spend it more effecively.

### Scenario 2: Lucas
Lucas is a junior software developer that struggles to spend his time productively. He works on what he wants to instead of what he has to and is really bad at estimating how long things will take. Like, really bad. Pomi will help him choose tasks from a Todoist project, estimate how long he thinks something will take him, and track how long each task actually took to complete. Over time, this will allow him to complete more work and provide better time estimates.

# Non Goals
This version will not support the following features:

 - Splitting a session between multiple tasks
 - Prompting user to take a long session
 - Todoist integration (associate session with task)
 - Mobile notifications
 - Changing alarm tone
 - Offline mode

# Flowchart

![](assets/pomi-state-diagram.png)

*Figure 1. Pomi State Diagram*

# Screen-by-Screen Specification

## Main Screens

<img src="./assets/mockups/New Session.png" width="200px" />

*Figure 2. New Session*

<img src="./assets/mockups/Configured Session.png" width="200px" />

*Figure 3. Timer In Progress*

## Menu

<img src="./assets/mockups/Menu.png" width="200px" />

*Figure 4. Menu*

## Settings

<img src="./assets/mockups/Settings/Timer.png" width="200px" />

*Figure 5. Timer Settings*

<img src="./assets/mockups/Settings/Accounts.png" width="200px" />

*Figure 6. Account Settings (Linked)*

<img src="./assets/mockups/Confirmation Modal.png" width="200px" />

*Figure 7. Confirmation Modal when unlinking account*

<img src="./assets/mockups/Settings/Accounts-1.png" width="200px" />

*Figure 8. Account Settings (Unlinked)*

