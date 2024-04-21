# Accessing via Web (Preferred)
- Navigate to [symptom tracker](https://symptom-tracker-five.vercel.app/) (https://symptom-tracker-five.vercel.app/)
- log in by clicking on the login link on top right
  - click on sign in with google
    - This sign in will work with 1 of the following people:
      1. Giselle (me)
      2. Ross (TA)
      3. Andrew (person I used as a test user that I know. Also had this person follow the user manual, so might see a dummy commit from him)

## Easy Grading
**Note: Clicking either of these buttons will delete ALL foods and symptoms**
- To make grading easier I added 2 button on the footer
  - Add Previous 2 days:
    - Adds Hamburger as a food eaten yesterday and 2 days ago 
    - Adds Thirst as a symptom experienced yesterday and 2 days ago
  - Add previous 6 days:
    - Adds thirst as a symptom starting 7 days ago

## Adding Symptoms
NOTE:  ANSWER SURVEY FIRST THEN ADD FOOD
- Once logged in you will see a survey
- check the symptoms that you are experiencing.
  - you can submit the survey with all symptoms unchecked.
    - this means you are not experiencing any symptoms
- If you checked 1 or more symptoms, you can see the symptoms in the symptom table
- If this is your 7th day with a symptom you will see a banner suggesting you speak to a doctor about type 2 diabetes
  - If you click on `Add Previous 6 Days`, add any symptom for today, you will see this banner
- If this is your 3rd time experiencing symptoms when eating a particular food you will see a banner suggesting you substitute
  - If you click on `Add Previous 2 Days` and add any symptom and `Hamburger` as a food you will see this banner

**Note: This is a daily survey, so you will see the same survey each day**

## Adding food
- In addition to the survey, you will see a food log
- click `Add Food`
- Type in a food item
- click `Post Food` in the modal where you typed in your food item
- You should see the item you just added in the food section
- If this is your 3rd time eating a particular food and you have experienced symptoms all three times you will see a banner suggesting you substitute

## Viewing the data (optional)
You can view the data added in this production environment by using prisma studio.
- Follow instructions for running the application below (minus `npm start`)
- Follow instructions for database viewer

# Running project locally
## Version Requirements
To avoid any problems running the application the following is recommended:
- Node version 18.18.2
- npx version 10.2.3
  - after installing node you can install npx using `npm install -g npx`
  - npx is used if you want to run prisma studio

## The application
- `git clone https://github.com/giggi1226/symptom-tracker.git`
- at the root of the project add a `.env` file
- copy the variables from documentation/config.md into the `.env`
- run `npm install`
- run `prisma generate`
- run `npm start`

## The database viewer
- in a second terminal cd into the project and run `npx prisma studio`
  - this allows you to view and manipulate data for the application
  - The main tables are: Food, Symptom, and FoodSymptom
- In Food or Symptom you can add a record by clicking `Add Record`

