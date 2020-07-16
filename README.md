# Offchance Backend Routes  

[User Routes](#user-routes-api-documentation)
1. [Signup User (POST)](#signup-user)
2. [Login User (POST)](#login-user)
3. [Edit User (PATCH)](#edit-user)
4. [Get User by ID (GET)](#get-user-by-id)
5. [Get Users by Query (GET)](#get-users-by-query)  

[Raffle Routes](#raffle-routes-api-documentation)
1. [New Raffle (GET)](#new-raffle)
2. [Get All Raffles (GET)](#get-all-raffles)
3. [Edit Raffle Details (PATCH)](#edit-raffle-details)
4. [Search By Raffle Name (GET)](#search-by-raffle-name)
5. [Search By Raffle ID (GET)](#search-by-raffle-id)
6. [Delete By Raffle ID (DELETE)](#delete-by-raffle-id)


# USER ROUTES API DOCUMENTATION

## Signup User  
Method: POST  
Route: http://localhost:3000/user/signup  

Required params:  
- Name, username, password, email, instaHandle, phoneNumber  

Optional params:  
- Everything else (see userSchema)  

Notes:  
- Email must be unique  
- Username must be unique  

## Login User
Method: POST  
Route: http://localhost:3000/user/login  

Required params:  
- Email, password required  

Notes:  
- May be replaced soon  

## Edit User
Method: PATCH  
Route: http://localhost:3000/user/edit/ {**id**}   

Request body:  
- Everything is optional (see userSchema)  

## Get User by ID  
Method: GET  
Route: http://localhost:3000/user/id/ {**id**}   

Notes:  
- Sends single user object by id  
- If user not found, response is {message: ‘user not found’}  

## Get Users by Query
Method: GET  
Route: http://localhost:3000/user/query?query= {**query**} &dir= {**dir**}&val= {**val**} &limit= {**limit**}  

Parameters:  
- Query (field in question) [ex: isHost, shoeSize]  
- Dir (direction of sort) [asc, desc]  
- Val (value of query)  
- To find all hosts, call query=isHost&val=true  
- Limit (number of results) [5,6,7,8…] 

Notes:  

- Default if not parameters are given returns all users in database  
- Direction default is descending  

# RAFFLE ROUTES API DOCUMENTATION

## New Raffle  
Method: POST
Route: http://localhost:3000/raffle/new  

Required params:  
- name,
- description,
- type,
- startTime,
- amountLiked,
- images,
- sizes  

Optional params:  
- Everything else (see raffleSchema)  

Notes:  
- Approved and Archived are defaulted to false
- Admin will use patch method to approve raffles  


## Get All Raffles
Method: GET  
Route: http://localhost:3000/raffle/all  

Required params: 
- N/A  

Optional params:
- N/A  

Notes:
- Will be modified to suit loading more raffles while scrolling  


## Edit Raffle Details
Method: PATCH  
Route: http://localhost:3000/raffle/edit/ {**id**}  

Required params: 
- ID of raffle to edit
- Whatever data it is to modify  

Optional params:
- N/A  

Notes:
- N/A  

## Search by raffle name
Method: GET
Route: http://localhost:3000/raffle/name/ {**search**}  

Required params: 
- name of raffle to search for 

Optional params:
- N/A  

Notes:
- N/A

## Search by raffle ID
Method: GET
Route: http://localhost:3000/raffle/ {**id**}  

Required params: 
- id of raffle to search for  

Optional params:
- N/A  

Notes:
- N/A  

## Delete by raffle ID
Method: DELETE
Route: http://localhost:3000/raffle/del/ {**id**}  

Required params: 
- id of raffle to delete 

Optional params:
- N/A  

Notes:
- EXCERCISE CAUTION WHEN DELETING DATA.