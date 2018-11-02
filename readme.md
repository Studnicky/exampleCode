#### TASK
You are tasked with writing an algorithm that determines the value of a used car, given several factors.

##### AGE:
Given the number of months of how old the car is, reduce its value one-half (0.5) percent.
After 10 years, it's value cannot be reduced further by age. This is not cumulative.

##### MILES:
For every 1,000 miles on the car, reduce its value by one-fifth of a percent (0.2). Do not consider remaining miles. After 150,000 miles, it's value cannot be reduced further by miles.

##### PREVIOUS OWNER:

If the car has had more than 2 previous owners, reduce its value by twenty-five (25) percent. If the car has had no previous owners, add ten (10) percent of the FINAL car value at the end.

##### COLLISION:
For every reported collision the car has been in, remove two (2) percent of it's value up to five (5) collisions.

###### Reduction Order:
Each factor should be off of the result of the previous value in the order of
1. AGE
2. MILES
3. PREVIOUS OWNER
4. COLLISION

E.g., Start with the current value of the car, then adjust for age, take that result then adjust for miles, then collision, and finally previous owner.

Note that if previous owner, had a positive effect, then it should be applied AFTER step 4. If a negative effect, then BEFORE step 4.

Write a simple Node/Express server that will accept the parameters as JSON, perform the calculation and return the car value as a JSON Object. No authentication or authorization is required.

##### PERSISTENCE:
No data persistence is required.
