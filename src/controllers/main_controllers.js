const mysql = require('mysql');

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