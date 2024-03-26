const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001; // Đã thay đổi cổng thành 3001
const cors = require('cors');
const db = mysql.createConnection({
  host: '127.0.0.1', // Đã thay đổi host thành 10.0.2.16
  user: 'root',
  password: '',
  database: 'nienluan',
  port: 3306,
});

db.connect();

// Định nghĩa API endpoint để lấy dữ liệu từ bảng 'registrations'
app.get('/api/registrations', (req, res) => {
  db.query('SELECT * FROM registrations', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Trả về kết quả truy vấn
    res.json(results);
  });
});

app.use(cors());

// Khởi động server
app.listen(port, '0.0.0.0', () => { // Đã thêm địa chỉ IP vào hàm listen
  console.log(`Server is running on ${port}`);
});
