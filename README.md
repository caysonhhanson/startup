# RealTime Fitness - Web Fitness Platform

RealTime Fitness is an all-in-one platform for fitness enthusiasts and beginners alike that combines live workout sessions, personal health tracking, and real-time interaction with fitness coaches. Through the app, users can join live workouts, track their personal progress, get personalized advice, and connect with helpful fitness trainers. All this functionality includes live feedback, performance stats, and recommendations in real time. It's a simpler, more united approach to fitness using the latest web technology to keep you engaged, motivated, and accountable.

## Key Features:
- Real-time workout sessions with live trainer interaction
- Personalized progress tracking and workout recommendations  
- Interactive leaderboard system
- User authentication and profile management
- Responsive design that works across devices

## React Deliverable
➡️ For this deliverable I converted the application to React and implemented component architecture.

- Implemented Vite for bundling, with proper project structure and CSS modules.
- Created React components for Login, Dashboard, LiveSession, Leaderboard, and NavBar with complete functionality.
- Implemented React Router with protected routes and clean URL paths.
- Used useState for component state management and useEffect for WebSocket simulation and data fetching.

Previous deliverables included:

**HTML**
- Four HTML pages: Login, Dashboard, Live Sessions, Leaderboard
- Intuitive navigation structure
- Proper semantic HTML elements
- Integrated logo and branding elements
- Login form and database placeholder elements
- WebSocket message placeholders

**CSS**
- Professional responsive design
- Consistent color scheme and typography
- Mobile-friendly navigation
- Centered and properly sized logo
- Clean component layouts
- Good contrast and spacing

## Service Deliverable
➡️ For this deliverable I added backend services to handle user data and API functionality.

- Created Express server with HTTP endpoints for user authentication, workouts, and leaderboard data.
- Successfully configured Express static middleware to serve the React frontend build.
- Integrated Quotable API to fetch and display motivational quotes on the dashboard.
- Created endpoints for login authentication, workout data storage, leaderboard rankings, and nutrition information.
- Implemented fetch calls in React components to communicate with backend services.

## DB/Login deliverable
For this deliverable I associate the personalized workouts and dashboare with the logged in user. I stored their info in the database.
- MongoDB Atlas database created - done!
- Stores data in MongoDB - done!
- User registration - Creates a new account in the database.
- existing user - Stores info under the same user if the user already exists.
- Use MongoDB to store credentials - Stores both user and their votes.
- Restricts functionality - You cannot vote until you have logged in.


[View the demo](https://startup.cayson5.click)
[View the code](https://github.com/caysonhhanson/startup.git)

[View the demo](https://startup.cayson5.click)
[View the code](https://github.com/caysonhhanson/startup.git)