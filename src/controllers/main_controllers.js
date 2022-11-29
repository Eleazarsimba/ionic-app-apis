const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const crypto = require("crypto");

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ionicshop'
});

// open the MySQL connection
connection.connect(function(error){
  if (error) {
    res.status(500).send({ message: error.message });
  }
  // console.log("Successfully connected to the database.");
});

//register new user
exports.makeSale = (req, res, next) => {
  // const id = crypto.randomBytes(4).toString("hex");
  // const uniqNo = (`#TS`+id);
  // const datecreated = new Date().toLocaleDateString();

  var date = new Date();
  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  var formattedDate = year + "/" + month + "/" + day;

  const {
    receiptNo,
    amount,
    cashierName,
    paymentM
  } = req.body; 
  //   // insert sale
      connection.query('INSERT INTO saleinfo SET receiptNo=?, cashierName=?, dateCreated=?, amount=?, paymentM=?',[receiptNo, cashierName, formattedDate, amount, paymentM],function(err, results){
        try{  
          if (err) {
              res.status(500).send({ message: err.message });
            } else {
              res.send('Sale inserted');
            } 
        }catch (err) {
          res.status(500).send({ message: err.message });
        } 
          
      });
};

//register new user
exports.regUser = (req, res, next) => {  
  const {
    email,
    username,
    password
  } = req.body;   

  const salt = bcrypt.genSaltSync(10);

   // data for all users table
   var alldata={
    email: email,
    username: username,
    password: bcrypt.hashSync(password, salt)
};
    // insert user
    //  check if user already exist
    connection.query('SELECT * FROM users WHERE email = ? ',  [email]
    ,function(err,rows){
    // if error in getting th list
    if(err) {
      return res.send("Error in getting "+email);
    }
    // if no user exist
    if (!rows.length)
    {
      // insert user
             connection.query('INSERT INTO users SET ?',alldata,function(err, results){
              res.send('User recorded');
        });
    }
    else
    {
        return res.send(email+" is already registered");
    }
    });
};

//login user
exports.loginUser = (req, res, next) => {  
  var email = req.body.email;
  var sql = "SELECT * FROM users WHERE email= ?"
  var filter = [email, true];
  connection.query(sql, filter, function(error,rows, fields){
          if(error) {
            return res.send("Error in signing the user");
          }
          else { 
            if(rows.length > 0) { 
            bcrypt.compare(req.body.password, rows[0].password, function(error, result) {
              if(result) {
                const token = jwt.sign({email: email}, "supersecret", {expiresIn: 60 * 60 * 24});  //expires in 24 hour
                return res.send({
                  user: rows[0],
                  token: token, 
                  message: "Login Successful" });
              }
              else {
                return res.status(400).send({ error: "Invalid details" });
              }
            });
        } else {
            return res.status(400).send({ error: "Email does not exist or account not activated" });
        } 
        }
    });
};

//register new user
exports.registerall = (req, res, next) => {
  // const nDate = new Date().toLocaleString('en-US', {
  //   timeZone: 'Africa/Nairobi'
  //   });
  
  const {
    receiptNo,
    quantity,
    itemName,
    costRate
  } = req.body;   
    // insert sale
      connection.query('INSERT INTO allsales SET receiptNo=?, itemName=?, quantity=?, costRate=?',[receiptNo, itemName, quantity, costRate],function(err, results){
        try{  
          if (err) {
              res.status(500).send({ message: err.message });
            } else {
              res.send('Sale recorded');
            } 
        }catch (err) {
          res.status(500).send({ message: err.message });
        } 
          
      });
};

//get all products
exports.allProducts = (req, res, next) => {
    try {
      let sql = "SELECT * FROM productslist";
      connection.query(sql, function(err, data, fields) {
        if (err) {
          res.status(500).send({ message: err.message });
        }
        res.json({
          status: 200,
          data
        })
      })
    } catch (err) {
      res.status(500).send({ message: err.message });
    } 
}

//get receipts
exports.receipts = (req, res, next) => {
  try {
    // let sql = "SELECT dateCreated, group_concat(receiptNo) as `GROUP_RECEIPTS` FROM saleinfo GROUP BY dateCreated ORDER BY dateCreated DESC";
    let sql = "SELECT * FROM saleinfo ORDER BY dateCreated DESC, time DESC LIMIT 25";
    connection.query(sql, function(err, data, fields) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.json({
        status: 200,
        data
      })
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  } 
}

//get sale by receipt no
exports.eachreceipt = (req, res) => {
  try {
    const receiptid = req.params.receiptNo;
    connection.query('SELECT * FROM allsales where `receiptNo`=?', receiptid, (err, data, fields) => {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.json({
        status: 200,
        data,
        message: "Receipts retrieved successfully"
      })
    })
  }catch (err) {
    res.status(500).send({ message: err.message });
  } 
}