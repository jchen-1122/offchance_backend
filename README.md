# offchance_backend
[link](##-1.-Signup-User-(POST))

[link2](##-5.-search-by-raffle-id-(get))

[link3](#-4.-Get-User-by-ID-(GET))


USER ROUTES API DOCUMENTATION

## 1. Signup User (POST)

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

# 4. Get User by ID (GET)

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


RAFFLE ROUTES DOCUMENTATION

1. New Raffle (POST)

Route: http://localhost:3000/raffle/new
Request body:
Required params:
        name,
        description,
        type,
        startTime,
        amountLiked,
        images,
        sizes
Optional params:
        Everything else (see raffleSchema)
Notes:
        Approved and Archived are defaulted to false
        Admin will use patch method to approve raffles


2. Get all raffles (GET)

Route: http://localhost:3000/raffle/all
Required params: 
        N/A
Optional params:
        N/A
Notes:
        Will be modified to suit loading more raffles while scrolling


3. Edit raffle details (PATCH)

Route: http://localhost:3000/raffle/edit/<id>
Required params: 
        ID of raffle to edit
        Whatever data it is to modify
Optional params:
        N/A
Notes:
        N/A

## 4. Search by raffle name (GET)

Route: http://localhost:3000/raffle/name/<search>
Required params: 
        name of raffle to search for
Optional params:
        N/A
Notes:
        N/A

5. Search by raffle ID (GET)

Route: http://localhost:3000/raffle/<id>
Required params: 
        id of raffle to search for
Optional params:
        N/A
Notes:
        N/A

6. Delete by raffle ID (DELETE)

Route: http://localhost:3000/raffle/del/<id>
Required params: 
        id of raffle to delete
Optional params:
        N/A
Notes:
        EXCERCISE CAUTION WHEN DELETING DATA.