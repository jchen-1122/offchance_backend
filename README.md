# offchance_backend

USER ROUTES API DOCUMENTATION

1. Signup User (POST)

Route: http://localhost:3000/user/signup
Request body:
Required params:
Name, username, password, email, instaHandle, phoneNumber
Optional params:
Everything else (see userSchema)
Notes:
Email must be unique
Username must be unique

2. Login User (POST)

Route: http://localhost:3000/user/login
Request body:
Email, password required
Notes:
May be replaced soon

3. Edit User (PATCH)

Route: http://localhost:3000/user/edit/<id>
Request body:
Everything is optional (see userSchema)

4. Get User by ID (GET)

Route: http://localhost:3000/user/id/<id>
Notes:
Sends single user object by id
If user not found, response is {message: ‘user not found’}

5. Get User(s) by Query (GET)

Route: http://localhost:3000/user/query?query=<query>&dir<dir>&val=<val>&limit=<limit>
Parameters:
Query (field in question) [ex: isHost, shoeSize]
Dir (direction of sort) [asc, desc]
Val (value of query) 
To find all hosts, call query=isHost&val=true
Limit (number of results) [5,6,7,8…]
Notes:
Default if not parameters are given returns all users in database
Direction default is descending
