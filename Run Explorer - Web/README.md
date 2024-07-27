# Run Explorer 
## App to track all running data in a single Map
Check the action at [Run Explorer](https://runexplorer.smass-solutions.in/)

## Work Ladder
### 25 July 2024
- [x] Store member data on registration
- [X] store all run data 
- [X] disqualify runs without map
- [X] read all from strava & store new runs alone on firebase during login
- [ ] create 'on doc add' function to calculate achivements
- [ ] modify UI - Use Snazzy as inspiration [SnazzyMaps](https://snazzymaps.com/style/24088/map-without-labels)
- [ ] firebase functions to lazyly calculate achivements
- [ ] Explore people page


## Future tasks
- URD - Unique run distance score
- Run streaks
- leader board
- follow friends

## Login Workflow
Home page ( google login index.html) 
            |
            V
Check Login Status(google.js)  <--------------------|                    
            |                                       |
        ---------> No -->  Wait for login           |
        |                       |                   ^
        V                       V                   |
       Yes                      |                  No
        |                       |                   ^
        V                       V                   |
      Strava Login Page(Strava.html) --> check google Auth (strava_login.js)
                                                    |
                                                    V
                                                   Yes
                                                    |
                                                    V
                                    Check for access token in Cookies --> No --> Get refresh token from Firestore ----------|
                                                    |                                       |                               |
                                                    V                                       V                               V
                                                   Yes                                     Got                   Not available / error occured
                                                    |                                       |                               |
                                                    V                                       V                               V
                                                 Map.html   <------------------- Generate new access token             Wait Strava Login
                                                    |                                       ^                               |
                                                    |                                       |                               V
                                                    V                                       |                             Success
                                                                                            |                                |
                                                                                            |                                V 
                                                                                            |                Call back url (auth_response.html)
                                                                                            |                                |
                                                                                            |                                V
                                                                                            |                       get code from url parameter
                                                                                            |                                |
                                                                                            |                                V
                                                                                            |                        generate refresh token
                                                                                            |--------- ---------------& store in firestore
