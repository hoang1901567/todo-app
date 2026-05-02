import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Rất quan trọng: Bắt buộc phải có dòng này khi dùng Render PostgreSQL
  }
});

// Test kết nối
pool.connect((err, client, release) => {
  if (err) {
    console.error('Lỗi kết nối PostgreSQL:', err.stack);
  } else {
    console.log('Đã kết nối thành công với PostgreSQL!');
  }
});

export default pool;