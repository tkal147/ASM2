const express = require('express')
const app = express()

const { ObjectId, MongoClient, Int32 } = require('mongodb')
const url = "mongodb+srv://user:dfjkhgjigh1@cluster0.gwoz5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs')

app.get('/', async (req, res) => {
    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0803DB");
    const allStudents = await dbo.collection("students").find({}).toArray();
    res.render('index', { data: allStudents })
})
app.post('/insert', async (req, res) => {
    const nameInput = req.body.txtName;
    const Price = req.body.Price;
    const linkImg = req.body.link;
    const newStudent = { name: nameInput, price: Price, img: linkImg };
    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0803DB");
    var errorr = {};
    var isEr = false;
    const allStudents = await dbo.collection("students").find({}).toArray();
    if (nameInput.length < 5) {

        errorr.nameInput = 'Name must be more than 5 chracters';
        isEr = true;
    }
    if (isNaN(Price)) {

        errorr.price = 'Price input must be number';
        isEr = true;
    }
    if (linkImg == "") {

        errorr.linkImg = 'Link Img can not be null';
        isEr = true;
    }
    if (isEr) {
        res.render('index', { error: errorr, data: allStudents }  )
    }
    else {

        const newS = await dbo.collection("students").insertOne(newStudent);
        console.log("Gia tri id moi duoc insert la: ", newS.insertedId.toHexString());
        res.redirect('/');
        //chuyen huong den file Index
    }
    


})
app.get('/delete', async (req, res) => {
    const idInput = req.query.id;
    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0803DB");
    await dbo.collection("students").deleteOne({ _id: ObjectId(idInput) })
    res.redirect('/');
})
app.post('/search', async (req, res) => {
    const searchInput = req.body.txtSearch;
    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0803DB");
    const allStudents = await dbo.collection("students").find({ name: searchInput }).toArray();
    res.render('index', { data: allStudents })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT);