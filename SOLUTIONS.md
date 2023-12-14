# Reminder

Keep in mind that I did not work with React Native before, so I will research how to do things a few times.

# 1. Run the app

- I searched for the environment setup on the React Native website.
- It said that I need Node, the React Native command line interface, a JDK, and Android Studio.
- I already had Android Studio and a JDK installed.
- I downloaded Node from nodejs.org.
- The recommended JDK was 17, my version was lower. So I updated to 17.
- Then I just worked through the remaining points in the guide.
- After that I created a virtual device in Android Studio and started it.
- I opened a terminal and used "npm start".
- In the Android Studio terminal I used "npm run android".

# 2. Load users from the backend

- I took a look at the provided JSON files for the users and the todos.
- I decided that in case of missing user data, the rest of the todo should be shown as before.
- After looking into the code, I identified four steps that I had to do:
  1. Add a userName field to the ToDo type.
  2. Fetch the users.
  3. Map the userIds of the todos to the userNames.
  4. Show the userNames if they are present.
- I wasn't sure if I could simply make two queries at the same time, so I took a look at the documentation of react-query.
- Then I implemented my solution and tested it.

# 3. Redesign the ToDo Card

- I exported the icons from the Figma board.
- I was not sure how to add the background of the card, so I did some research.
- I encountered the challenge that the card did overflow the screen to the right.
- It took quite some time to find a solution for this and I'm still not sure if this problem could have been caused by the emulator.
- After that, I noticed that the padding of the sectionContainer caused the cards to be slightly shifted to the right.
- I tried to fix that with "alignItems: 'center'", but it just moved all the cards to the left of the screen.
- I will not invest further time into this. This is something that I would ask a colleague.
- After that I added the user icon.
- Then I added the information whether the ToDo has been completed.

# 4. Filters

- My thought process here was that I need some state management and selection element to alter the state.
- So first of all I researched how to implement the state management.
- I decided to use an enum as state for 3 different filter modes: all, completed, uncompleted.
- After that, I identified three more things I had to do:
  1. Filtering the todos depending on the current filter mode.
  2. Adding a UI to change between filter modes.
  3. Changing the filter modes.
- I wanted to iterate over the filter mode enum to create the UI. This way new filter modes could be added more easily.
- So I researched how to do that. It seems that it is more complicated than I anticipated.
- Therefore, I will not do that. Maybe enums were not the right choice in the first place.
- Then I implemented my solution and tested it.

# 5. Refactor, improve, enhance

- I removed some code style inconsistencies that were already in the original repository during my first look at the code.
- I think the most important aspect of this task is what I would do.
- Therefore I will just list my ideas here and not implement them:
  1. I did not use Props for the UserNameLabel (App.tsx:94) and CompleteIndicator (App.tsx:107). I would research the best practice and implement resulting changes.
  2. First of all I would extract some components into separate files.
  3. I would create a new file for the section element (starting App.tsx:31).
  4. I would generalize the filter component in a way, that it would only need labels for the buttons and onClick handlers.
  5. I would create a new file for the ToDos, that would contain all the code directly related to the ToDos.
  6. Normally I would also separate the querying and the logic for the ToDos from the UI components. Since this is my first experience with React Native, I'm not sure what's the best practice.
- Maybe there are some other things, but those listed above seemed to me as the most important ones.
- In addition I could have used a code formatter to make sure everything is consistent.
