const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
  });

console.log(db.select('*').from('users')
    .then(data=>{
        console.log(data);
    }
));


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users:[        
    {
        id:'123',
        name:'John',
        email:'john@gmail.com',
        password:'hello',
        entries:0,
        joined: new Date()
    },
    {
        id:'124',
        name:'Drake',
        email:'drake@gmail.com',
        password:'yeah',
        entries:0,
        joined: new Date()
    }
]
}

app.get('/',(req,res)=>{
    res.send(database.users);
})
 
app.post('/signin',(req,res)=>{
    bcrypt.compare("mylove",'$2a$10$915BmlJJWFORK6Mw.NLMbeoOD.0hvFyRRe0olJik2Hl1SJ/0qkwRW',function(err,res){
        console.log('first guess', res)
    });

    bcrypt.compare("apple",'$2a$10$915BmlJJWFORK6Mw.NLMbeoOD.0hvFyRRe0olJik2Hl1SJ/0qkwRW',function(err,res){
        console.log('first guess', res)
    });

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register',(req,res)=>{
    const { email, name, password} = req.body;
    db('users').insert({
        email: email,
        name:name,
        joined: new Date()
    }).then(console.log)
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res)=>{
    const { id } = req.params;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('not found')
    }
})


app.put('/image',(req,res)=>{
    const { id } = req.body;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('not found')
    }
})

app.listen(3000, ()=>{
    console.log('app is running');
})