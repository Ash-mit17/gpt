const express = require('express')
const app = express()
const bodyParser = require('body-parser')


require('dotenv').config();

app.set('view engine', 'ejs');

const { Configuration, OpenAIApi } = require('openai');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const configuration = new Configuration({
  apiKey: process.env.Key,
});
const openai = new OpenAIApi(configuration);


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
})

var gptmsg;

app.post("/form", async (req, res) => {
  var name = req.body.namefield;
  var age = req.body.agefield;
  var gender = req.body.gender;
  var height = req.body.heightfield;
  var weight = req.body.weightfield;
  var medicalcodn = req.body.wpforms.fields[4];
  var workouttype = req.body.wpforms.fields[0];
  var fitnessgoal = req.body.wpforms.fields[1];
  var fitnessexperiance = req.body.wpforms.fields[2];
  var dietpreference = req.body.wpforms.fields[3];
  var supplimentype = req.body.wpforms.fields[7];
  var state = req.body.wpforms.fields[5];
  var country = req.body.wpforms.fields[6];
  var message = `Design a full diet plan for a person easily accessible to their location.

  Their Details - 
  Age - ${age}
  Gender - ${gender}
  Height (in cm) - ${height}
  Weight (in kg) - ${weight}
  Fitness Goal - ${fitnessgoal}
  Fitness Experience - ${fitnessexperiance} 
  Gym/Home Workout - ${workouttype} 
  Dietary Preference - ${dietpreference}
  Do You Want to use Supplements in Your Diet? - ${supplimentype} 
  Medical Conditions/Allergies (if any) - ${medicalcodn}
  State - ${state}
  Country - ${country}
  
  The plan should be without any extra text`;
  var message1 = `Workout Plan
   Monday/Wednesday/Friday:
  - Warm-up: 5 minutes of brisk walking or jogging in place
  - Squats: 3 sets of 12 reps
  - Push-ups: 3 sets of 10 reps
  - Lunges: 3 sets of 12 reps (each leg)
  - Standing calf raises: 3 sets of 15 reps
  - Plank: 3 sets of 30 seconds
  - Cool-down: 5 minutes of stretching
  
  Nutrition Plan:
  
  Breakfast:
  - Skim milk (1 cup)
  - Oatmeal (1/2 cup) with berries or chopped nuts
  - Egg omelet (1 egg) with veggies like spinach, mushrooms or peppers
  
  Snack:
  - Greek yogurt (1/2 cup) with berries or honey
  
  Lunch:
  - Grilled chicken breast (3-4 ounces) with mixed vegetables like broccoli, carrots, and peppers
  - Salad with mixed greens, tomatoes, cucumbers, and vinaigrette dressing (1 tablespoon)
  
  Snack:
  - Apple slices with almond butter (1-2 tablespoons)
  
  Dinner:
  - Grilled fish (3-4 ounces) with grilled or roasted vegetables like zucchini, eggplant or asparagus
  - Brown rice (1/2 cup) or quinoa (1/4 cup)
  
  Notes:
  - Drink at least 8 glasses of water each day.
  - Avoid sugary drinks and processed foods.
  - Aim for 3 meals and 2 snacks per day.
  - Consult with a doctor or nutritionist if necessary.`

  await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[
            {role: "user", content:`${message}`},
        ]
      })
    .then(response=>{
      gptmsg=response.data.choices[0].message.content;
      console.log(gptmsg);
    })
    .catch((error)=>{console.log(error)})
    // await gptmsg.replace("diet","nutrition");
    // await gptmsg.replace("Diet","Nutrition");
    // console.log(dietpreference);
    res.render("landing",{
      returnmsg:gptmsg,
    })

})

// app.get("/land", (req, res) => {
//   res.render("landing",{
//     returnmsg:"hi"
//   });
// })


app.listen(3000, (req, res) => {
  console.log("Server live on port 3000");
})