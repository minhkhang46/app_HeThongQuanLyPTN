const express = require('express');
const bodyparser = require('body-parser');
const mysql = require ('mysql');
const cors = require('cors');

const app = express(); //tao dt moi
app.use(bodyparser.json()); //su dung json de chuyen du lieu
app.use(cors()); //su dung thu vien cors





//ket noi
const db = mysql.createConnection({
    host: '127.0.0.1', // Đã thay đổi host thành 10.0.2.16
    user: 'root',
    password: '',
    database: 'nienluan',
    port: 3306,
});
db.connect();


app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public', 'images', imageName);
  res.sendFile(imagePath);
});



//select
app.get('/data_labs', (req, res)  =>{
    var sql = "select * from registrations ";
    db.query(sql, (err, kq)=>{
      if (err) throw err
      // console.log(kq);
      res.send(kq); //tra kq ve cho react 
    })
});

app.get('/requeststatus', (req, res)  =>{
  var sql = "select * from update_labs ";
  db.query(sql, (err, kq)=>{
    if (err) throw err
    // console.log(kq);
    res.send(kq); //tra kq ve cho react 
  })
});


const moment = require('moment-timezone'); // Import thư viện moment-timezone

app.get('/data_calendar', (req, res) => {
  const sql = "SELECT * FROM registrations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Chuyển đổi từ múi giờ UTC sang múi giờ địa phương trước khi trả về dữ liệu
    const resultsWithLocalTime = results.map(row => {
      const localTime = moment.utc(row.date).tz('Asia/Ho_Chi_Minh').format(); // Chuyển đổi từ UTC sang múi giờ địa phương (ở đây là 'Asia/Ho_Chi_Minh')
      return {...row, date: localTime};
    });
    // Trả về dữ liệu với status code 200 OK
    res.status(200).json(resultsWithLocalTime);
  });
});

app.get('/data_res', (req, res) => {
  const { lab_name, registration_time, date } = req.query;
  const sql = "SELECT * FROM registrations WHERE lab_name = ? AND registration_time = ? AND date = ?";
  db.query(sql, [lab_name, registration_time, date], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Trả về dữ liệu với status code 200 OK
    res.status(200).json(results);
  });
});


//insert
app.post('/data', (req, res)=>{
  console.log(req.body);
  var data = {ID_User: req.body.ID_User, full_name: req.body.full_name, email: req.body.email, lab_name: req.body.lab_name,
              quantity: req.body.quantity, registration_time: req.body.registration_time, date: req.body.date};
  var sql = 'insert into registrations set ?';
  db.query(sql, data, (err, kq)=>{
    if(err) throw err;
    // console.log (kq);
    //gui ket qua cho react
    res.send({
        status:" them thanh cong",
        no: null,
        ID_User: req.body.ID_User, 
        full_name: req.body.full_name, 
        email: req.body.email, 
        lab_name: req.body.lab_name,
        quantity: req.body.quantity, 
        registration_time: req.body.registration_time, 
        date: req.body.date
    });
  });
});

app.post('/request', (req, res)=>{
  console.log(req.body);
  var data = {idUser: req.body.idUser, idPTN: req.body.idPTN, quantity: req.body.quantity, update_time: req.body.update_time,
              date: req.body.date};
  var sql = 'insert into update_labs set ?';
  db.query(sql, data, (err, kq)=>{
    if(err) throw err;
    // console.log (kq);
    //gui ket qua cho react
    res.send({
   
        idUser: req.body.id_User, 
        idPTN: req.body.idPTN, 
        quantity: req.body.quantity, 
        update_time: req.body.update_time,
        date: req.body.date, 
       
    });
  });
});

app.get('/labs', (req, res) => {
  var sql = "SELECT idPTN, TenPTN FROM labs";
  db.query(sql, (err, results) => {
      if (err) throw err;
      // console.log(results);
      res.send(results);
  });
});

app.get('/labs_img', (req, res) => {
  var sql = "SELECT image FROM labs";
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error retrieving lab images:', err);
          res.status(500).json({ error: 'Error retrieving lab images' });
          return;
      }
      // Gửi dữ liệu hình ảnh từ cơ sở dữ liệu như phản hồi
      res.json(results);
  });
});



app.get('/times', (req, res) => {
  var sql = "SELECT ThoiGianKT, ThoiGianBd FROM times";
  db.query(sql, (err, results) => {
      if (err) throw err;
      // console.log(results);
      res.send(results);
  });
});


// qr
app.post('/qrdata', (req, res) => {
  const qrData = req.body.qrdata; // Lấy dữ liệu từ trường qrdata của phần thân yêu cầu

  // Thêm dữ liệu vào cột "qr_data" của bảng "qr"
  db.query('INSERT INTO qrs (qr_data) VALUES (?)', [qrData], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Internal server error');
    } else {
      console.log('Data inserted successfully');
      res.send('Data received and inserted successfully!');
    }
  });
});

app.get('/qrdata', (req, res) => {
  // Truy vấn cơ sở dữ liệu để lấy dữ liệu QR code từ bảng qr
  db.query('SELECT * FROM qrs', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal server error');
      return;
    }
    // Trả về kết quả dưới dạng JSON
    res.json(results);
  });
});


app.get('/notifications', (req, res) => {
  var sql = "SELECT * FROM update_labs ";
  db.query(sql, (err, results) => {
    if (err) throw err;

    res.send(results);
  });
});

//lay thong tin ng dùng
const jwt = require('jsonwebtoken');


app.get('/users', (req, res) => {
  // Kiểm tra xem phiên có thông tin người dùng không
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Lấy thông tin người dùng từ phiên
  const { macv } = req.session.user;

  // Thực hiện truy vấn SQL để lấy thông tin người dùng
  var sql = "SELECT macv, name, email FROM users WHERE macv = ?";
  db.query(sql, [macv], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Trả về thông tin người dùng
    res.json(results);
  });
});







const session = require('express-session');

// Sử dụng middleware phiên
app.use(session({
  secret: 'secret_key', // Chuỗi bí mật để ký và mã hóa phiên
  resave: false, // Không lưu lại phiên nếu không có sự thay đổi
  saveUninitialized: false // Không lưu lại phiên cho các phiên chưa được khởi tạo
}));



app.post('/users', (req, res) => {
  const { macv, password } = req.body;

  const sql = "SELECT * FROM users WHERE macv = ? AND password = ?";
  db.query(sql, [macv, password], (err, results) => {
    if (err) {
      console.error('Lỗi khi thực hiện truy vấn:', err);
      res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xác thực đăng nhập.' });
      return;
    }

    if (results.length > 0) {
      const userRole = results[0].role;
      const user = {
        macv: results[0].macv,
        name: results[0].name,
        email: results[0].email,
        role: userRole
      };

      // Lưu thông tin người dùng vào phiên
      req.session.user = user;
      console.log(req.session.user);

      if (userRole === 'Sinh Viên') {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } else {
      res.status(401).json({ success: false });
    }
  });
});

app.get('/profile', (req, res) => {
  if (req.session.user) {
    
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Không có thông tin người dùng.' });
  }
});





//chay ung dung
app.listen(3000, '192.168.56.1', ()=>{
  console.log("Server dang chay o cong 3000")
});
