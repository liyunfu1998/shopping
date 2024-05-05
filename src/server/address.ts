import { db } from "./db";
// import fs from "fs";
// import path from "path";
// import { db } from "./db";
// export const initialize = async () => {
//   const filePath = path.join(__dirname, "province.json");
//   const res = fs.readFile(filePath, "utf-8", async (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("aaa", JSON.parse(data));
//     const res = JSON.parse(data);

//     res.forEach(async (item) => {
//       const provinceCode = item.code;
//       await db.province.create({
//         data: {
//           code: item.code,
//           name: item.name,
//         },
//       });
//       item.cityList.forEach(async (city) => {
//         const cityCode = city.code;
//         await db.city.create({
//           data: {
//             code: city.code,
//             name: city.name,
//             provinceCode: provinceCode,
//           },
//         });
//         city.areaList.forEach(async (area) => {
//           await db.area.create({
//             data: {
//               code: area.code,
//               name: area.name,
//               cityCode: cityCode,
//             },
//           });
//         });
//       });
//     });
//   });
// };

const getAll = async () => {
  const res = await db.province.findMany({
    include: {
      cities: {
        include: {
          areas: true,
        },
      },
    },
  });
  return res;
};

const getCount = async (userId: string) => {
  const res = await db.address.count({
    where: {
      userId: userId,
    },
  });
  return res;
};

const getListByUserId = async (userId: string) => {
  const res = await db.address.findMany({
    where: {
      userId: userId,
    },
  });
  return res;
};
export const addressRepo = {
  getAll,
  getCount,
  getListByUserId,
};
