import 'dotenv/config';
import { readFileSync } from 'fs';
import { prisma } from '../src/lib/prisma.js';

async function importData() {
  try {
    const data = JSON.parse(readFileSync('nutritiondata.json', 'utf8'));
    const foods = data.dishes;

    for (const food of foods) {
      // Chuẩn hóa dữ liệu: sửa đơn vị, điền khuyết
      const nutritionData = {
        headers: food.nutritionTable.headers,
        rows: food.nutritionTable.rows.map(row => {
          // Sửa Vitamin C từ g sang mg nếu giá trị > 10 (giả sử lỗi g)
          if (row[0] === 'Vitamin C' && row[2] === 'g') {
            if (parseFloat(row[1]) > 10) {
              row[2] = 'mg';
              row[1] = (parseFloat(row[1]) * 1000).toString(); // g -> mg
            } else {
              row[2] = 'mg'; // Thay đổi đơn vị
            }
          }
          // Điền null cho chuỗi rỗng
          if (row[1] === '') {
            row[1] = null;
          }
          return row;
        })
      };

      await prisma.food.create({
        data: {
          name: food.name,
          imageUrl: food.imageUrl,
          notes: food.notes,
          nutritionData: nutritionData
        }
      });
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importData();